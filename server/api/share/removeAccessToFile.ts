import { Request, Response } from "express";
import userModel from "../../model/User";
import { getErrorResponse, getSuccessResponse } from "../../utils";
import { getUserSessionFromRequest } from "../user/constants";
import { SharedFileObject } from "./types";

const revokeAccessToFile = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  const { id } = request.query;

  // Extract user auth info from token.
  const { email: senderEmail } = getUserSessionFromRequest(request);

  const RECIEPIENT_FIND_CONDITIONS = [
    {
      "sharedWithMe.id": id,
      "sharedWithMe.sharedBy.email": senderEmail,
    },
  ];

  try {
    const reciepient = await userModel.findOne({
      $and: RECIEPIENT_FIND_CONDITIONS,
    });

    (reciepient.sharedWithMe as Array<SharedFileObject>).forEach(
      (sharedFile, index) => {
        if (sharedFile.id === id) {
          reciepient.sharedWithMe.splice(index, 1);
        }
      }
    );

    await userModel.findOneAndUpdate(
      {
        $and: RECIEPIENT_FIND_CONDITIONS,
      },
      {
        $set: {
          sharedWithMe: reciepient.sharedWithMe,
        },
      }
    );

    return response.status(200).send(
      getSuccessResponse({
        data: {
          id,
        },
        message: `Successfully Revoked access to this file for the selected user.`,
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

export { revokeAccessToFile };
