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
import { actions } from "./reducers";

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
  console.log(res);

  yield put(actions.successFetchTaskLists(res.result.items));
}

function* restoreLogin() {
  const login: ReturnType<typeof db.getItem> = yield call(db.getItem, "login");

  yield put(actions.setLogin(!!login));
}

function* syncLoginState(login: Action<boolean>) {
  yield call(db.setItem, "login", login.payload ? "true" : "false");
}

function* successLogin({ payload }: Action<GoogleApiOAuth2TokenObject>) {
  console.log(payload);
  yield call(db.setItem, "authToken", payload.access_token);
  const expiresAt = (
    Math.floor(new Date().getTime() / 1000) + Number(payload.expires_in)
  ).toString();
  yield call(db.setItem, "expiresAt", expiresAt);
  yield put(actions.setLogin(true));
}

function* allSagas() {
  yield all([
    takeLatest(actions.loadGapi, loadGapi),
    takeLatest(actions.fetchTaskLists, fetchTaskLists),
    takeLatest(actions.restoreLogin, restoreLogin),
    takeEvery(actions.setLogin, syncLoginState),
    takeLatest(actions.successLogin, successLogin),
  ]);
}

export { allSagas };
