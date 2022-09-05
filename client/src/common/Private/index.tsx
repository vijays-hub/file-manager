import { Navigate } from "react-router-dom";
import { getAccessToken } from "utils";

const AUTHENTICATION_PATH = "/login";

export default function ProtectedRoute({ outlet }: { outlet: JSX.Element }) {
  if (!getAccessToken())
    return <Navigate to={{ pathname: AUTHENTICATION_PATH }} />;

  return outlet;
}
