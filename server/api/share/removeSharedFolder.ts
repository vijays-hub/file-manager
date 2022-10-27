import { Request, Response } from "express";
import userModel from "../../model/User";
import { getErrorResponse, getSuccessResponse } from "../../utils";
import { getUserSessionFromRequest } from "../user/constants";
import getUserByEmail from "../user/getUserInfoByEmail";

const truncateSharedFolderById = (sharedFiles = [], id) => {
  sharedFiles.forEach((sharedFile, index) => {
    const file =
      typeof sharedFile.file === "undefined" ? sharedFile : sharedFile.file;

    if (file.type === "folder") {
      if (file.id === id) return sharedFiles.splice(index, 1);

      if (file.files.length > 0) truncateSharedFolderById(file.files, id);
    }

    // It's not a folder.
    sharedFiles.splice(index, 1);
  });

  return sharedFiles;
};

const removeSharedFolder = async ({
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

    // Get sender user info.
    const user = await getUserByEmail(email as string);

    const updatedSharedFiles = truncateSharedFolderById(user.sharedWithMe, id);

    console.log({ updatedSharedFiles });

    await userModel.updateOne(
      {
        email,
      },
      {
        $set: {
          sharedWithMe: updatedSharedFiles,
        },
      }
    );

    return response.status(200).send(
      getSuccessResponse({
        data: { id },
        message: "Deleted selected file from Shared resources",
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

export { removeSharedFolder };
