import {
  call,
  delay,
  fork,
  put,
  select,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";
import { Action } from "typescript-fsa";
import { db } from "../../db/db";
import { authorize, calcExpiresAt } from "../../lib/gapi";
import { authSelector } from "../selector/authSelector";
import { Auth, authActions } from "../slice/authSlice";

function* restoreAuth() {
  const login: ReturnType<typeof db.getItem> = yield call(db.getItem, "login");
  const accessToken: ReturnType<typeof db.getItem> = yield call(
    db.getItem,
    "accessToken"
  );
  const expiresAt: ReturnType<typeof db.getItem> = yield call(
    db.getItem,
    "expiresAt"
  );

  if (login !== null && accessToken && expiresAt) {
    yield put(
      authActions.setAuth({
        login: !!login,
        accessToken: accessToken,
        expiresAt: Number(expiresAt),
      })
    );
  }
}

function* syncAuth({
  payload: { login, accessToken, expiresAt },
}: Action<Auth>) {
  yield call(db.setItem, "login", login ? "true" : "false");
  if (expiresAt) {
    yield call(db.setItem, "expiresAt", expiresAt.toString());
  }
  if (accessToken) {
    yield call(db.setItem, "accessToken", accessToken);
  }
}

function* successLogin({ payload }: Action<GoogleApiOAuth2TokenObject>) {
  console.log(payload);
  yield put(
    authActions.setAuth({
      login: true,
      expiresAt: calcExpiresAt(payload.expires_in),
      accessToken: payload.access_token,
    })
  );
}

function* refreshToken() {
  while (true) {
    const expiresAt: Auth["expiresAt"] = yield select(authSelector.expiresAt);

    let token: GoogleApiOAuth2TokenObject | undefined;

    if (expiresAt && expiresAt - new Date().getTime() / 1000 < 60 * 10) {
      authorize((t) => {
        token = t;
      });

      while (true) {
        if (token) {
          yield put(
            authActions.setAuth({
              login: true,
              expiresAt: calcExpiresAt(token.expires_in),
              accessToken: token.access_token,
            })
          );
        }
      }
    }

    yield delay(60000);
  }
}

export const authSaga = [
  takeLatest(authActions.restoreLogin, restoreAuth),
  takeEvery(authActions.setAuth, syncAuth),
  takeLatest(authActions.successLogin, successLogin),
  fork(refreshToken),
];
