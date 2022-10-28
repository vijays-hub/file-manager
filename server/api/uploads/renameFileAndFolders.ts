import { Request, Response } from "express";
import fileSystem from "fs";
import userModel from "../../model/User";
import { getErrorResponse, getSuccessResponse } from "../../utils";
import { getUserSessionFromRequest } from "../user/constants";
import getUserByEmail from "../user/getUserInfoByEmail";
import { RENAME_ACTIONS } from "./enum";
import { RenameData, UploadObject } from "./types";
import { renameDirectory } from "./utils";

const getLatestResourcePath = ({
  chunks,
  existingName,
  latestName,
}: {
  chunks: string[];
  existingName: string;
  latestName: string;
}): string => {
  let latestDirectoryPath = "";

  // Loop through the chunks and rename the resource if found.
  chunks.forEach((chunk, index) => {
    if (chunk === existingName) chunk = latestName; // replace the old name with the latest one.

    latestDirectoryPath += chunk;

    if (index < chunks.length - 1) latestDirectoryPath += "/"; // append '/' at the end excluding final index.
  });

  return latestDirectoryPath;
};

const renameFile = ({
  uploads = [],
  id,
  latestName,
}: RenameData): Array<UploadObject> => {
  uploads.forEach((file) => {
    if (file.type !== "folder") {
      if (file.id === id) {
        const existingFileName = file.fileName;
        const fileNameChunks = file.filePath.split("/");

        const latestFilePath = getLatestResourcePath({
          chunks: fileNameChunks,
          existingName: existingFileName,
          latestName,
        });

        // Rename the directory with latest path.
        renameDirectory(file.filePath, latestFilePath);

        // Update the current array values.
        (file.fileName = latestName), (file.filePath = latestFilePath);

        return;
      }
    } else {
      // It's Folder
      if (file.files.length > 0)
        renameFile({
          uploads: file.files,
          id,
          latestName,
        });
    }
  });

  return uploads;
};

const renameFolder = ({
  uploads = [],
  id,
  latestName,
}: RenameData): Array<UploadObject> => {
  uploads.forEach((file) => {
    if (file.type === "folder") {
      if (file.id === id) {
        const existingFolderName = file.folderName;
        const folderNameChunks = file.folderPath.split("/");

        const latestDirectoryPath = getLatestResourcePath({
          chunks: folderNameChunks,
          existingName: existingFolderName,
          latestName,
        });

        // Rename the directory with latest path.
        renameDirectory(file.folderPath, latestDirectoryPath);

        // Update the current array values.
        (file.folderName = latestName), (file.folderPath = latestDirectoryPath);

        return;
      }

      if (file.files.length > 0) {
        renameFolder({
          uploads: file.files,
          id,
          latestName,
        });
      }
    }
  });

  return uploads;
};

const renameResources = async ({
  request,
  response,
  action,
}: {
  request: Request;
  response: Response;
  action: RENAME_ACTIONS;
}) => {
  const { id, name } = request.body;

  try {
    // Extract user auth info from token.
    const { email } = getUserSessionFromRequest(request);

    // Get user info (includes uploads data as well)
    const user = await getUserByEmail(email as string);

    const renameData = {
      uploads: user.uploaded,
      id,
      latestName: name,
    } as RenameData;

    const updatedArray =
      action === RENAME_ACTIONS.FILE
        ? renameFile(renameData)
        : renameFolder(renameData);

    await userModel.updateOne(
      { email },
      {
        $set: {
          uploaded: updatedArray,
        },
      }
    );

    response.status(200).send(
      getSuccessResponse({
        data: { uploads: updatedArray },
        message: "Successfully renamed this file/folder",
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
export { renameResources };
