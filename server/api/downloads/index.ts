import express, { Request, Response } from "express";
import { authGateway } from "../../middleware/authGateway";
import { retriveFileToDownload } from "./getFileToDownload";

const router = express.Router();

router.get("/file-by-id", authGateway, (request: Request, response: Response) =>
  retriveFileToDownload({ request, response })
);

export default router;
