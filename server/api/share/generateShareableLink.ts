import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { getErrorResponse, getSuccessResponse } from "../../utils";
import {
  getSingleFileRecursively,
  getUploadObjectRecursively,
} from "../uploads/utils";
import { getUserSessionFromRequest } from "../user/constants";
import getUserByEmail from "../user/getUserInfoByEmail";
import { PublicLink } from "./types";
import publicLinkModel from "../../model/PublicLinks";

const generateShareableHash = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  const { id } = request.query;
  try {
    // Extract user auth info from token.
    const { email } = getUserSessionFromRequest(request);

    // Get sender user info (includes uploads data as well)
    const user = await getUserByEmail(email as string);

    // Get both folder and file for the id given and generate link for the either one.
    const folder = getUploadObjectRecursively(user.uploaded, id as string);
    const file = getSingleFileRecursively(user.uploaded, id as string);

    if (file === null && folder === null)
      return response
        .status(404)
        .send(
          getErrorResponse(
            `Couldn't find any resource associated with this id.`
          )
        );

    let fileToShare = file !== null ? file : folder;

    const publicLinkInfo: PublicLink = {
      hash: "",
      file: fileToShare,
      sharedBy: {
        email,
        name: user.username,
      },
      createdAt: new Date().getTime(),
    };

    // Generate a secure hash for the file to be accessed publicly.
    bcrypt.hash(fileToShare.fileName, 10, async (error, hash) => {
      if (error) {
        console.log("Error while generating hash for the file");
        return response
          .status(500)
          .send(
            getErrorResponse(
              `Something's not right! That's on us. Please try again later.`
            )
          );
      }

      await publicLinkModel.create({
        ...publicLinkInfo,
        hash: hash.substring(5),
      });

      return response.status(200).send(
        getSuccessResponse({
          data: { hash },
          message: "Successfully generate a shareable hash",
        })
      );
    });
  } catch (error) {
    console.error("Internal server error while generating public link", error);
    return response
      .status(500)
      .send(
        getErrorResponse(
          `Something's not right! That's on us. Please try again later.`
        )
      );
  }
};

export { generateShareableHash };
