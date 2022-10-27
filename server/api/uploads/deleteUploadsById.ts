import { Request, Response } from "express";
import userModel from "../../model/User";
import { getErrorResponse, getSuccessResponse } from "../../utils";
import { getUserSessionFromRequest } from "../user/constants";
import getUserByEmail from "../user/getUserInfoByEmail";
import { UploadObject } from "./types";
import { removeDirectory, removeSingleFile } from "./utils";

const deleteUploadsById = async ({
  request,
  response,
  deleteDirectories = false,
}: {
  request: Request;
  response: Response;
  deleteDirectories?: boolean;
}) => {
  const { id } = request.query;

  try {
    // Extract user auth info from token.
    const { email } = getUserSessionFromRequest(request);

    // Get user info (includes uploads data as well)
    const user = await getUserByEmail(email as string);

    const uploads = user.uploaded;
    const idToDelete = id as string;

    const updatedUploadsArray: Array<UploadObject> = deleteDirectories
      ? removeDirectory(uploads, idToDelete)
      : removeSingleFile(uploads, idToDelete);

    await userModel.updateOne(
      {
        email,
      },
      {
        $set: {
          uploaded: updatedUploadsArray,
        },
      }
    );

    response.status(200).send(
      getSuccessResponse({
        data: { id },
        message: "Successfully deleted this folder/file",
      })
    );
  } catch (error) {
    console.error("Internal Server Error ", error);
    response
      .status(500)
      .send(
        getErrorResponse(
          "Something's not right. That's on us. Please try again."
        )
      );
  }
};
export default deleteUploadsById;
