import { AuthInfo, User } from "app/pages/Authentication/types";
import { call, put, takeLatest } from "redux-saga/effects";
import { getAuthenticity, getUserByEmail } from "services/api/user";
import { APIResponse } from "types";
import { getAccessToken, removeAccessToken } from "utils";
import { setAuthFailed, setAuthInfo, setUserProfile } from "./slice";

function* initAuth() {
  console.log("AUTH INIT...");
  if (getAccessToken() === "") {
    yield put(setAuthFailed());
    return;
  }

  let authenticUser = false;
  let userInfo: AuthInfo = { email: "", accessToken: getAccessToken() };
  yield call(async () => {
    try {
      const {
        data: { data },
      }: { data: APIResponse } = await getAuthenticity();
      userInfo = data;
      authenticUser = true;
    } catch (error) {
      authenticUser = false;
    }
  });

  if (!authenticUser) {
    yield put(setAuthFailed());
    removeAccessToken();
    return (window.location.href = "/login");
  }

  yield put(setAuthInfo(userInfo as AuthInfo));
}

function* fetchUserProfile(action: { type: string; email: string }) {
  const { email } = action;
  let userProfile: User | null = null;
  yield call(async () => {
    try {
      const {
        data: { data },
      }: { data: APIResponse } = await getUserByEmail(email);
      userProfile = data;
    } catch (error) {
      console.error(error);
    }
  });
  if (!userProfile) return;
  yield put(setUserProfile(userProfile));
}

function* doLogout() {
  yield put(setAuthFailed());
}

export default function* authSaga() {
  yield takeLatest("INIT_AUTH", initAuth);
  yield takeLatest("FETCH_USER_PROFILE", fetchUserProfile);
  yield takeLatest("LOGOUR_USER", doLogout);
}
