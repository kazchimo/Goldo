import { call, put, takeLatest } from "redux-saga/effects";
import { authActions } from "../slice/authSlice";

function* signIn() {
  const login = gapi.auth2.getAuthInstance().isSignedIn.get();

  try {
    if (!login) {
      yield call(gapi.auth2.getAuthInstance().signIn);
    }
    yield put(authActions.successLogin());
  } catch (e) {}
}

export const authSaga = [takeLatest(authActions.signIn, signIn)];
