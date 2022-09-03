import express, { Request, Response } from "express";

import { signIn } from "./signIn";
import { signUp } from "./signUp";

const router = express.Router();

router.post("/register", (request: Request, response: Response) =>
  signUp({ request, response })
);

router.post("/login", (request: Request, response: Response) =>
  signIn({ request, response })
);

export default router;
