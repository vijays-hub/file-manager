import express, { Request, Response } from "express";
import { authGateway } from "../../middleware/authGateway";
import { deleteSharedPublicLink } from "./deleteSharedPublicLink";
import { fetchSharedResources } from "./fetchSharedResources";
import { generateShareableHash } from "./generateShareableLink";
import { getPublicSharedFile } from "./getPublicSharedFile";
import { getRecipientsOfAssets } from "./getRecipientsOfAssets";
import { revokeAccessToFile } from "./removeAccessToFile";
import { removeSharedFolder } from "./removeSharedFolder";
import { retrievePublicLinksOfUser } from "./retrievePublicLinksOfUser";
import { shareViaEmail } from "./shareViaEmail";

const router = express.Router();

router.post("/", authGateway, (request: Request, response: Response) =>
  shareViaEmail({ request, response })
);

router.get(
  "/generate-shareable-hash",
  authGateway,
  (request: Request, response: Response) =>
    generateShareableHash({ request, response })
);

// Public links can be retrieved by anyone. So no auth.
router.get("/serve-public-link", (request: Request, response: Response) =>
  getPublicSharedFile({ request, response })
);

// This resource gets all the public links generated by the user.
router.get(
  "/public-links",
  authGateway,
  (request: Request, response: Response) =>
    retrievePublicLinksOfUser({ request, response })
);

// This resource fetches all the files shared by other users.
router.get(
  "/shared-with-me",
  authGateway,
  (request: Request, response: Response) =>
    fetchSharedResources({ request, response })
);

// This resource fetches all the recipients of a particular file/folder shared by the user to manage the share access.
router.get("/recipients", authGateway, (request: Request, response: Response) =>
  getRecipientsOfAssets({ request, response })
);

// This resource removes the access for a particular file
router.delete(
  "/revoke-access",
  authGateway,
  (request: Request, response: Response) =>
    revokeAccessToFile({ request, response })
);

// This resource deletes the shared folder shared by other users.
router.delete(
  "/truncate-shared-folder",
  authGateway,
  (request: Request, response: Response) =>
    removeSharedFolder({ request, response })
);

// This resource deletes the public link generated by user.
router.delete(
  "/public-link",
  authGateway,
  (request: Request, response: Response) =>
    deleteSharedPublicLink({ request, response })
);

export default router;
