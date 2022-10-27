import { Request, Response } from "express";
import userModel from "../../model/User";
import {
  generateUniqueId,
  getErrorResponse,
  getSuccessResponse,
} from "../../utils";
import { UploadObject } from "../uploads/types";
import {
  getSingleFileRecursively,
  getUploadObjectRecursively,
} from "../uploads/utils";
import { getUserSessionFromRequest } from "../user/constants";
import getUserByEmail from "../user/getUserInfoByEmail";
import { SharedFileObject } from "./types";

const shareViaEmail = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  const { email: recipientEmail, id, type } = request.body;
  try {
    // Get reciepient user info.
    const recipientUser = await getUserByEmail(recipientEmail as string);

    if (recipientUser === null)
      return response
        .status(404)
        .send(
          getErrorResponse(
            `We couldn't find any account associated with the email ${recipientEmail}`
          )
        );

    // Extract user auth info from token.
    const { email: senderEmail } = getUserSessionFromRequest(request);

    // Get sender user info (includes uploads data as well)
    const sendingUser = await getUserByEmail(senderEmail as string);

    let fileToShare: UploadObject = null;
    if (type === "folder")
      fileToShare = await getUploadObjectRecursively(
        sendingUser.uploaded,
        id as string
      );
    else
      fileToShare = await getSingleFileRecursively(
        sendingUser.uploaded,
        id as string
      );

    if (fileToShare === null)
      return response
        .status(404)
        .send(
          getErrorResponse(
            `We couldn't find any file associated with the id ${id}`
          )
        );

    const sharedFileObject: SharedFileObject = {
      id: generateUniqueId(),
      file: fileToShare,
      sharedBy: {
        email: senderEmail,
        name: sendingUser.username,
      },
      createdAt: new Date().getTime(),
    };
    await userModel.findOneAndUpdate(
      {
        email: recipientEmail,
      },
      {
        $push: {
          sharedWithMe: sharedFileObject,
        },
      }
    );

    return response.status(200).send(
      getSuccessResponse({
        data: { sharedFileObject },
        message:
          "Successfully shared the assets with the email karthik@gmail.com",
      })
    );
  } catch (error) {
    console.error("Internal server error ", error);
    return response
      .status(500)
      .send(
        getErrorResponse(
          `Something's not right! That's on us. Please try again later.`
        )
      );
  }
};

export { shareViaEmail };
