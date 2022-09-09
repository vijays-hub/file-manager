import { createSlice } from "@reduxjs/toolkit";
import reducers from "./reducers";
import { AuthSlice } from "./types";

export const initialState: AuthSlice = {
  authUser: null,
  userProfile: null,
};

export const AUTH_SLICE_NAME = "auth";

const slice = createSlice({
  name: AUTH_SLICE_NAME,
  initialState,
  reducers: reducers,
});

export const { setAuthFailed, setAuthInfo, setUserProfile } = slice.actions;

export const initAuthAction = () => ({
  type: "INIT_AUTH",
});

export const fetchUserProfileAction = ({ email }: { email: string }) => ({
  type: "FETCH_USER_PROFILE",
  email,
});

export default slice.reducer;
