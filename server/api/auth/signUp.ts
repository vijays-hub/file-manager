import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "./types";
import userModel from "../../model/User";
import { APIResponse } from "../../types";
import { GENERIC_ERROR } from "../../constants";
import { getSuccessResponse } from "../../utils";

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
      if (err) return response.status(401).send(GENERIC_ERROR);

      if (hash) {
        await userModel.create({
          email,
          password: hash,
          username,
        });
        response.status(200).send(
          getSuccessResponse({
            data: { email, password, username } as User,
            message:
              "Signed Up Successfully. You can use these credentials to Login!",
          })
        );
      }
    });
  } catch (error) {
    console.error(`Failed to sign up the user with email ${email} `, error);
    response.status(401).json(GENERIC_ERROR);
  }
};

export { signUp };
