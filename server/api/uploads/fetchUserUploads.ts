import { Request, Response } from "express";
import { getSuccessResponse } from "../../utils";

const fetchUserUploads = ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  response.status(200).send(
    getSuccessResponse({
      data: { folders: [] },
      message: "Fetched all folders",
    })
  );
};
export { fetchUserUploads };
