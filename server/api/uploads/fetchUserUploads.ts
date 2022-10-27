import { Request, Response } from "express";
import { getErrorResponse, getSuccessResponse } from "../../utils";
import { getUserSessionFromRequest } from "../user/constants";
import getUserByEmail from "../user/getUserInfoByEmail";
import { UploadObject } from "./types";
import { getUploadObjectRecursively } from "./utils";

const fetchUserUploads = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  const { id } = request.query;

  // Extract user auth info from token.
  const { email } = getUserSessionFromRequest(request);

  // Get user info (includes uploads data as well)
  const user = await getUserByEmail(email as string);

  let uploadedFiles: Array<UploadObject> = null;

  let folderName = "";
  let createdAt = 0;

  if (!id) uploadedFiles = user.uploaded;
  else {
    let uploadObject = getUploadObjectRecursively(user.uploaded, id as string);

    if (uploadObject === null)
      response
        .status(404)
        .send(
          getErrorResponse(
            `We couldn't find any folders/files with this ID -> ${id}`
          )
        );

    uploadedFiles = uploadObject.files;
    folderName = uploadObject.folderName;
    createdAt = uploadObject.createdAt;

    if (uploadedFiles === null)
      response
        .status(404)
        .send(
          getErrorResponse(
            `We couldn't find any folders/files with this ID -> ${id}`
          )
        );

    response.status(200).send(
      getSuccessResponse({
        data: { id, uploadedFiles, folderName, createdAt },
        message: "Fetched all folders/files",
      })
    );
  }
};
export { fetchUserUploads };
