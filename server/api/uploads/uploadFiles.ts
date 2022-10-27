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
  getUploadObjectRecursively,
  getUpdatedUploadsArray,
} from "./utils";

const uploadFiles = async ({
  request,
  response,
}: {
  request: any;
  response: Response;
}) => {
  const { filesToUpload } = request.files || {};
  const { id } = request.query;

  // Extract user auth info from token.
  const { email } = getUserSessionFromRequest(request);

  // Get user info (includes uploads data as well)
  const user = await getUserByEmail(email as string);

  const filesToBeUploaded = Array.isArray(filesToUpload)
    ? filesToUpload
    : [filesToUpload]; // Here filesToUpload will be a single Object.

  filesToBeUploaded.forEach((file) => {
    let uploadedObj: UploadObject = {
      id: generateUniqueId(),
      type: file.mimetype, // Ex: "image/jpeg"
      size: file.size, // in bytes
      fileName: file.name,
      filePath: "",
      createdAt: new Date().getTime(),
    };

    let filePath = "";
    const ASSETS_PATH = `assets/files/${email}`;

    //   Root Path
    if (!id) {
      filePath = `${ASSETS_PATH}/${new Date().getTime()}-${file.name}`;
      uploadedObj.filePath = filePath;

      if (!fileSystem.existsSync(ASSETS_PATH)) {
        createNewDirectory(ASSETS_PATH);
      }

      fileSystem.writeFile(filePath, file.data, async function (err) {
        if (err)
          return response
            .status(500)
            .send(
              getErrorResponse(
                "Something's not right. That's on us. Please try again."
              )
            );

        await userModel.updateOne(
          { email },
          {
            $push: {
              uploaded: uploadedObj,
            },
          }
        );
      });
    } else {
      // Trying to upload to a folder

      let uploadObject = getUploadObjectRecursively(user.uploaded, id);
      uploadedObj.filePath = `${uploadObject.folderPath}/${file.name}`;
      let updatedArray = getUpdatedUploadsArray(user.uploaded, id, uploadedObj);

      fileSystem.writeFile(
        uploadedObj.filePath,
        file.data,
        async function (err) {
          if (err)
            return response
              .status(500)
              .send(
                getErrorResponse(
                  "Something's not right. That's on us. Please try again."
                )
              );

          await userModel.updateOne(
            { email },
            {
              $set: {
                uploaded: updatedArray,
              },
            }
          );
        }
      );
    }
  });

  response.status(200).send(
    getSuccessResponse({
      data: null,
      message: "OK",
    })
  );
};

export default uploadFiles;
