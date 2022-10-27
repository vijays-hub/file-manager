import { Request, Response } from "express";
import userModel from "../../model/User";
import { getErrorResponse, getSuccessResponse } from "../../utils";
import { getUserSessionFromRequest } from "../user/constants";
import { Recipient, SharedFileObject } from "./types";

const getRecipientsOfAssets = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  const { id } = request.query;

  try {
    // Extract user auth info from token.
    const { email: senderEmail } = getUserSessionFromRequest(request);

    const recipients = await userModel.find({
      $and: [
        {
          "sharedWithMe.file.id": id,
          "sharedWithMe.sharedBy.email": senderEmail,
        },
      ],
    });

    const formattedRecipients: Array<Recipient> = [];

    recipients.forEach((user) => {
      let shareObjectInfo: {
        id: string;
        sharedAt: number;
      } | null = null;

      (user.sharedWithMe as Array<SharedFileObject>).forEach((sharedFile) => {
        if (sharedFile.file.id === id) {
          shareObjectInfo = {
            id: sharedFile.id,
            sharedAt: sharedFile.createdAt,
          };
        }
      });

      formattedRecipients.push({
        email: user.email,
        name: user.username,
        sharedObjectInfo: shareObjectInfo,
      });
    });

    response.status(200).send(
      getSuccessResponse({
        data: {
          recipients: formattedRecipients,
        },
        message: `Fetched all the recipients for the file with id ${id}`,
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

export { getRecipientsOfAssets };
