import { AuthInfo, User } from "app/pages/Authentication/types";

type AuthSlice = {
  authUser: AuthInfo | null;
  userProfile: User | null;
};

export type { AuthSlice };
