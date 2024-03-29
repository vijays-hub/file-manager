import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import userModel from "../../model/User";
import { User } from "./types";
import { GENERIC_ERROR } from "../../constants";
import { getErrorResponse, getSuccessResponse } from "../../utils";
import { generateAccessToken } from "../../utils/config/jwt";
import getUserByEmail from "../user/getUserInfoByEmail";

const signIn = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  const { email, password }: User = request.body;

  try {
    const _dbUser = await getUserByEmail(email);

    if (_dbUser === null)
      return response
        .status(403)
        .send(
          getErrorResponse(
            "There's no account associated with this Email. Please create an account with the same"
          )
        );

    // User found. Compare the passwords.
    bcrypt.compare(password, _dbUser.password, (error, result) => {
      if (error) return response.status(500).send(GENERIC_ERROR);

      if (!result)
        return response
          .status(401)
          .send(
            getErrorResponse(
              "Password entered is incorrect. Please enter a valid password."
            )
          );

      const accessToken = generateAccessToken({ email });

      return response.status(200).send(
        getSuccessResponse({
          data: {
            email,
            accessToken,
          },
          message: "Logged in successfully.",
        })
      );
    });
  } catch (error) {
    console.error(`Failed to login the user with email ${email} `, error);
    response.status(500).json(GENERIC_ERROR);
  }
};

export { signIn };
