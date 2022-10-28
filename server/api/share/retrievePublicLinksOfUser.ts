import { Request, Response } from "express";
import publicLinkModel from "../../model/PublicLinks";
import { getErrorResponse, getSuccessResponse } from "../../utils";
import { getUserSessionFromRequest } from "../user/constants";

const retrievePublicLinksOfUser = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  try {
    // Extract user auth info from token.
    const { email } = getUserSessionFromRequest(request);

    const allPublicLinks = await publicLinkModel.find({
      "sharedBy.email": email,
    });

    return response.status(200).send(
      getSuccessResponse({
        data: { sharedLinks: allPublicLinks },
        message: "Successfully retrieved public links shared by you.",
      })
    );
  } catch (error) {
    console.error("Internal server error while retrieving public links", error);
    return response
      .status(500)
      .send(
        getErrorResponse(
          `Something's not right! That's on us. Please try again later.`
        )
      );
  }
};

export { retrievePublicLinksOfUser };
