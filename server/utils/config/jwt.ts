import jwt from "jsonwebtoken";
import { AccessTokenPayload } from "../../types";

const TOKEN_EXPIRE_DURATION = 6 * 60 * 60; //6 hrs in secs.
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const generateAccessToken = (payload: AccessTokenPayload) =>
  jwt.sign({ payload }, ACCESS_TOKEN_SECRET, {
    expiresIn: TOKEN_EXPIRE_DURATION,
  });

const verifyAccessToken = async (token: string): Promise<number> => {
  let statusCode = 200;
  await jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      statusCode = 403;
    }
    if (!user) statusCode = 401;
  });
  return statusCode;
};

export { generateAccessToken, verifyAccessToken };
