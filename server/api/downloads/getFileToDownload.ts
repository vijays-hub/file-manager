import { Request, Response } from "express";
import fileSystem from "fs";
import { getErrorResponse, getSuccessResponse } from "../../utils";
import {
  getSharedAssetsRecursively,
  getSingleFileRecursively,
} from "../uploads/utils";
import { getUserSessionFromRequest } from "../user/constants";
import getUserByEmail from "../user/getUserInfoByEmail";

const retriveFileToDownload = async ({
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

    // Get the file uploaded by user.
    const uploadedFile = await getSingleFileRecursively(
      user.uploaded,
      id as string
    );

    const sharedFile = await getSharedAssetsRecursively(
      user.sharedWithMe,
      id as string
    );

    console.log({ uploadedFile, sharedFile });

    if (uploadedFile === null && sharedFile === null)
      return response
        .status(404)
        .send(getErrorResponse(`We couldn't find any downloadable resource.`));

    const fileToDownload = uploadedFile !== null ? uploadedFile : sharedFile;

    fileSystem.readFile(fileToDownload.filePath, (error, data) => {
      if (error) {
        return response
          .status(500)
          .send(
            getErrorResponse(
              `Something's not right! That's on us. Please try again later.`
            )
          );
      }

      return response.status(200).send(
        getSuccessResponse({
          data: {
            fileBufferArray: data,
            fileType: fileToDownload.type,
            fileName: fileToDownload.fileName,
          },
        })
      );
    });
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

export { retriveFileToDownload };
