import { PayloadAction } from "@reduxjs/toolkit";
import { AuthInfo, User } from "app/pages/Authentication/types";
import { AuthSlice } from "./types";

const reducers = {
  setAuthFailed: (state: AuthSlice) => {
    state.authUser = null;
  },
  setAuthInfo: (state: AuthSlice, action: PayloadAction<AuthInfo | null>) => {
    const { email, accessToken } = action.payload as AuthInfo;
    state.authUser = { email, accessToken };
  },
  setUserProfile: (state: AuthSlice, action: PayloadAction<User | null>) => {
    state.userProfile = action.payload;
  },
};

export default reducers;
