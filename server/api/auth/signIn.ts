import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import userModel from "../../model/User";
import { User } from "./types";
import { GENERIC_ERROR } from "../../constants";
import { getErrorResponse, getSuccessResponse } from "../../utils";
import { generateAccessToken } from "../../utils/config/jwt";

const signIn = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  const { email, password }: User = request.body;

  try {
    const _dbUser = await userModel.findOne({ email });

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
      if (error) return response.status(401).send(GENERIC_ERROR);

      if (!result)
        return response
          .status(401)
          .send(
            getErrorResponse(
              "Password entered is incorrect. Please enter a valid password."
            )
          );

      const acccessToken = generateAccessToken({ email });

      return response.status(200).send(
        getSuccessResponse({
          data: {
            email,
            password,
            acccessToken,
          },
          message: "Logged in successfully.",
        })
      );
    });
  } catch (error) {
    console.error(`Failed to login the user with email ${email} `, error);
    response.status(401).json(GENERIC_ERROR);
  }
};

export { signIn };
