import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "store";
import { initialState } from "./slice";

const authSlice = (state: RootState) => state.auth || initialState;

export const selectAuthUser = createSelector(
  [authSlice],
  (state) => state.authUser
);
export const selectUserProfile = createSelector(
  [authSlice],
  (state) => state.userProfile
);
