import { Request, Response } from "express";
import fileSystem from "fs";
import userModel from "../../model/User";
import {
  generateUniqueId,
  getErrorResponse,
  getSuccessResponse,
} from "../../utils";
import { getUserSessionFromRequest } from "../user/constants";
import getUserByEmail from "../user/getUserInfoByEmail";
import { UploadObject } from "./types";
import {
  createNewDirectory,
  getUpdatedUploadsArray,
  getUploadObjectRecursively,
} from "./utils";

const createFolder = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  // id -> parent folder id. Will be null for root.
  const { id, folderName } = request.query as {
    id: string;
    folderName: string;
  };

  // Extract user auth info from token.
  const { email } = getUserSessionFromRequest(request);

  const ASSETS_PATH = `assets/files/${email}`;

  // Get user info (includes uploads data as well)
  const user = await getUserByEmail(email as string);

  let uploadedObj: UploadObject = {
    id: generateUniqueId(),
    type: "folder",
    folderName,
    files: [],
    folderPath: "",
    createdAt: new Date().getTime(),
  };

  let folderPath = "";
  let updatedArray = [];

  if (!id) {
    folderPath = `${ASSETS_PATH}/${folderName}`;
    uploadedObj.folderPath = folderPath;

    if (!fileSystem.existsSync(ASSETS_PATH)) {
      createNewDirectory(ASSETS_PATH);
    }
  } else {
    let folderObj = getUploadObjectRecursively(user.uploaded, id);
    if (!folderObj || folderObj === null)
      return response
        .status(500)
        .send(
          getErrorResponse(
            `Something's not right. That's on us. Please try again later.`
          )
        );

    uploadedObj.folderPath = `${folderObj.folderPath}/${folderName}`;
    updatedArray = getUpdatedUploadsArray(user.uploaded, id, uploadedObj);
  }

  if (fileSystem.existsSync(uploadedObj.folderPath))
    return response
      .status(403)
      .send(
        getErrorResponse(`Folder with the name ${folderName} already exists.`)
      );

  createNewDirectory(uploadedObj.folderPath);

  if (!id) {
    await userModel.updateOne(
      { email },
      {
        $push: {
          uploaded: uploadedObj,
        },
      }
    );
  } else {
    await userModel.updateOne(
      { email },
      {
        $set: {
          uploaded: updatedArray,
        },
      }
    );
  }

  return response.status(201).send(
    getSuccessResponse({
      data: null,
      message: `Folder created with the name ${folderName}`,
    })
  );
};

export default createFolder;
