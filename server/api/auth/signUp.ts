import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "./types";
import userModel from "../../model/User";
import { APIResponse } from "../../types";
import { GENERIC_ERROR } from "../../constants";
import { getErrorResponse, getSuccessResponse } from "../../utils";

const SALT_ROUNDS = 10;

const signUp = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  const { email, password, username }: User = request.body;

  try {
    bcrypt.hash(password, SALT_ROUNDS, async (err, hash) => {
      if (err) return response.status(500).send(GENERIC_ERROR);

      if (hash) {
        userModel
          .create({
            email,
            password: hash,
            username,
          })
          .then((user) =>
            response.status(200).send(
              getSuccessResponse({
                data: { email, username } as User,
                message:
                  "Signed Up Successfully. You can use these credentials to Login!",
              })
            )
          )
          .catch((err) => {
            // 11000 -> MongoServerError code for duplicate records. For sign-up only EMAIL is the duplicate.
            if (err.code === 11000)
              return response
                .status(409)
                .json(
                  getErrorResponse(
                    "An account exists with this Email. Please use a different email instead."
                  )
                );
            // Return a generic response if something else is wrong.
            response.status(500).json(GENERIC_ERROR);
          });
      }
    });
  } catch (error) {
    console.error(`Failed to sign up the user with email ${email} `, error);
    response.status(500).json(GENERIC_ERROR);
  }
};

export { signUp };
