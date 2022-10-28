import { Request, Response } from "express";
import { getErrorResponse, getSuccessResponse } from "../../utils";
import { getUserSessionFromRequest } from "../user/constants";
import getUserByEmail from "../user/getUserInfoByEmail";
import { getFoldersRecursively } from "./utils";

const retrieveAllFolders = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  try {
    // Extract user auth info from token.
    const { email } = getUserSessionFromRequest(request);

    // Get user info (includes uploads data as well)
    const user = await getUserByEmail(email as string);

    const foldersCollection = getFoldersRecursively(user.uploaded);

    const formattedFolders = foldersCollection.map((folder) => ({
      id: folder.id,
      folderName: folder.folderName,
      //   TODO: Add more fields on demand.
    }));

    response.status(200).send(
      getSuccessResponse({
        data: { folders: formattedFolders },
        message: "Retrieved folder collection successfully.",
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

export { retrieveAllFolders };
