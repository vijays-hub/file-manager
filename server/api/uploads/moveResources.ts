import { Request, Response } from "express";
import fileSystem from "fs";
import userModel from "../../model/User";
import { getErrorResponse, getSuccessResponse } from "../../utils";
import { getUserSessionFromRequest } from "../user/constants";
import getUserByEmail from "../user/getUserInfoByEmail";
import { UploadObject } from "./types";
import { getUploadObjectRecursively } from "./utils";

// Recursive function to move the folder.
const moveFolderToParent = (
  uploads: Array<UploadObject> = [],
  id: string,
  folderToBeMoved: UploadObject,
  parentFolder: UploadObject
) => {
  uploads.forEach((file, index) => {
    if (file.type === "folder") {
      if (file.id === id) {
        const latestPath = `${parentFolder.folderPath}/${folderToBeMoved.folderName}`;

        fileSystem.rename(file.folderPath, latestPath, () => {
          console.log("Moved folder successfully ", folderToBeMoved.folderName);
        });

        uploads.splice(index, 1);
        return;
      }

      if (file.files.length > 0) {
        moveFolderToParent(file.files, id, folderToBeMoved, parentFolder);
      }
    }
  });

  return uploads;
};

// Recursive function that pushes moved folder to parent files.
const updateParentDirectoryPostMove = (
  uploads: Array<UploadObject> = [],
  id: string,
  folderToBeMoved: UploadObject
) => {
  uploads.forEach((file) => {
    if (file.type === "folder") {
      if (file.id === id) {
        folderToBeMoved.folderPath = `${file.folderPath}/${folderToBeMoved.folderName}`;
        file.files.push(folderToBeMoved);
        return;
      }

      if (file.files.length > 0) {
        updateParentDirectoryPostMove(file.files, id, folderToBeMoved);
      }
    }
  });
  return uploads;
};

const moveFolder = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  const { id, parentFolderID } = request.body;

  try {
    // Extract user auth info from token.
    const { email } = getUserSessionFromRequest(request);

    // Get user info (includes uploads data as well)
    const user = await getUserByEmail(email as string);

    let updatedArray = user.uploaded;

    const folderToBeMoved = await getUploadObjectRecursively(user.uploaded, id);
    const parentFolder = await getUploadObjectRecursively(
      user.uploaded,
      parentFolderID
    );

    // Move Folder inside `assets` folder.
    updatedArray = await moveFolderToParent(
      user.uploaded,
      id,
      folderToBeMoved,
      parentFolder
    );

    // Update parent folder array where the folder is been moved.
    updatedArray = await updateParentDirectoryPostMove(
      updatedArray,
      parentFolderID,
      folderToBeMoved
    );

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
        message: "Moved folder successfuly.",
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

export { moveFolder };
