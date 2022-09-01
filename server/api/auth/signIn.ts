import { Request, Response } from "express";

const signIn = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  console.log({ body: request.body });
  const EMAIL = "karthik@gmail.com";
  const PASSWORD = "pvr@1234";
  const { email, password }: { email: string; password: string } = request.body;

  if (email !== EMAIL)
    return response
      .status(401)
      .send({ message: "This email doesn't exist. Try creating an account" });

  if (password !== PASSWORD)
    return response
      .status(401)
      .send({ message: "Your password is incorrect. Please try again." });

  console.log({ email, password, PASSWORD });
  response.status(200).send({
    message: "Login successful!",
  });
};

export { signIn };
