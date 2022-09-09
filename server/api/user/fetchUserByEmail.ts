import { Request, Response } from "express";
import { getErrorResponse, getSuccessResponse } from "../../utils";
import getUserByEmail from "./getUserInfoByEmail";

const fetchUserByEmail = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  const { email } = request.query;
  const user = await getUserByEmail(email as string);

  if (!user)
    return response
      .status(404)
      .send(getErrorResponse("There's no user associated with this email."));

  response.status(200).send(
    getSuccessResponse({
      data: { email: user.email, username: user.username }, // TODO: Add more as needed. Don't send the Password!
      message: "Fetched user info successfully!",
    })
  );
};
export { fetchUserByEmail };
