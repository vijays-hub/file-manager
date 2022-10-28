import { Request, Response } from "express";
import publicLinkModel from "../../model/PublicLinks";
import { getErrorResponse, getSuccessResponse } from "../../utils";

const getPublicSharedFile = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  const { hash } = request.query;

  try {
    const publicFile = await publicLinkModel.findOne({ hash });

    if (!publicFile || publicFile === null)
      return response
        .status(404)
        .send(getErrorResponse(`Link is invalid, deleted or expired.`));

    return response.status(200).send(
      getSuccessResponse({
        data: {
          file: publicFile,
        },
        message: "Retrieved file successfully",
      })
    );
  } catch (error) {
    console.error("Internal server error while processing public link", error);
    return response
      .status(500)
      .send(
        getErrorResponse(
          `Something's not right! That's on us. Please try again later.`
        )
      );
  }
};

export { getPublicSharedFile };
