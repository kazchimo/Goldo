import {
  all,
  call,
  delay,
  put,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";
import { Action } from "typescript-fsa";
import { db } from "../db/db";
import { getTaskLists, GResponse, TaskLists } from "../lib/gapi";
import { actions, Auth } from "./reducers";

function* loadGapi() {
  let clientFinish = false;
  let authFinish = false;

  gapi.load("client", () => {
    clientFinish = true;
  });
  gapi.load("auth", () => {
    authFinish = true;
  });

  while (!clientFinish || !authFinish) {
    yield delay(100);
  }

  yield put(actions.successLoadGapi());
}

function* fetchTaskLists() {
  const res: GResponse<TaskLists> = yield call(getTaskLists);

  yield put(actions.successFetchTaskLists(res.result.items));
}

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

  yield put(
    actions.setAuth({
      login: !!login,
      accessToken: accessToken!,
      expiresAt: Number(expiresAt!),
    })
  );
}

function* syncAuth({
  payload: { login, accessToken, expiresAt },
}: Action<Auth>) {
  yield call(db.setItem, "login", login ? "true" : "false");
  yield call(db.setItem, "expiresAt", expiresAt.toString());
  yield call(db.setItem, "accessToken", accessToken);
}

function* successLogin({ payload }: Action<GoogleApiOAuth2TokenObject>) {
  const expiresAt =
    Math.floor(new Date().getTime() / 1000) + Number(payload.expires_in);
  yield put(
    actions.setAuth({
      login: true,
      expiresAt: expiresAt,
      accessToken: payload.access_token,
    })
  );
}

function* allSagas() {
  yield all([
    takeLatest(actions.loadGapi, loadGapi),
    takeLatest(actions.fetchTaskLists, fetchTaskLists),
    takeLatest(actions.restoreLogin, restoreAuth),
    takeEvery(actions.setAuth, syncAuth),
    takeLatest(actions.successLogin, successLogin),
  ]);
}

export { allSagas };
