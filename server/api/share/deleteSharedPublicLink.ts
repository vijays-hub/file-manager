import { Request, Response } from "express";
import publicLinkModel from "../../model/PublicLinks";
import { getErrorResponse, getSuccessResponse } from "../../utils";
import { getUserSessionFromRequest } from "../user/constants";

const deleteSharedPublicLink = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  const { hash } = request.query;
  try {
    // Extract user auth info from token.
    const { email } = getUserSessionFromRequest(request);

    const SHARE_LINK_CHECK = [
      {
        hash,
      },
      {
        "sharedBy.email": email,
      },
    ];

    const sharedLink = await publicLinkModel.findOne({
      $and: SHARE_LINK_CHECK,
    });

    if (!sharedLink || sharedLink === null)
      return response
        .status(404)
        .send(getErrorResponse(`Coudn't find this link.`));

    await publicLinkModel.deleteOne({
      $and: SHARE_LINK_CHECK,
    });

    return response.status(200).send(
      getSuccessResponse({
        data: { hash },
        message: "Deleted this link successfully.",
      })
    );
  } catch (error) {
    console.error("Internal server error while deleting public link", error);
    return response
      .status(500)
      .send(
        getErrorResponse(
          `Something's not right! That's on us. Please try again later.`
        )
      );
  }
};

export { deleteSharedPublicLink };
