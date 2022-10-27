import { Request, Response } from "express";
import { getErrorResponse, getSuccessResponse } from "../../utils";
import { getSharedAssetsRecursively } from "../uploads/utils";
import { getUserSessionFromRequest } from "../user/constants";
import getUserByEmail from "../user/getUserInfoByEmail";
import { SharedFileObject } from "./types";

const fetchSharedResources = async ({
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

    //   Trying to get all the resources.
    if (!id)
      return response.status(200).send(
        getSuccessResponse({
          data: {
            files: user.sharedWithMe as Array<SharedFileObject>,
          },
        })
      );

    // Trying to access files inside a shared folder.
    const folderObject = await getSharedAssetsRecursively(
      user.sharedWithMe,
      id as string
    );

    if (folderObject === null)
      return response
        .status(404)
        .send(
          getErrorResponse(
            "We couldn't find any assets associated with this folder"
          )
        );

    return response.status(200).send(
      getSuccessResponse({
        data: [folderObject],
        message: "Fetched the assets of this folder.",
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

export { fetchSharedResources };
