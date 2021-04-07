import {
  all,
  call,
  delay,
  put,
  takeEvery,
  takeLatest,
  select,
  fork,
} from "redux-saga/effects";
import { Action } from "typescript-fsa";
import { db } from "../db/db";
import {
  authorize,
  calcExpiresAt,
  getTaskLists,
  getTasks,
  GResponse,
  TaskLists,
  Tasks,
} from "../lib/gapi";
import { authSelector } from "./selector/authSelector";
import { Auth, authActions } from "./slice/authSlice";
import { gapiActions } from "./slice/gapiSlice";
import { taskListActions } from "./slice/taskListSlice";
import { tasksActions } from "./slice/taskSlice";

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

  yield put(gapiActions.successLoadGapi());
}

function* fetchTaskLists() {
  const res: GResponse<TaskLists> = yield call(getTaskLists);

  yield put(taskListActions.successFetchTaskLists(res.result.items));
}

function* fetchTasks(p: Action<string>) {
  const res: GResponse<Tasks> = yield call(getTasks, p.payload);
  console.log(res);
  yield put(tasksActions.addMany(res.result.items));
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

function* allSagas() {
  yield all([
    takeLatest(gapiActions.loadGapi, loadGapi),
    takeLatest(taskListActions.fetchTaskLists, fetchTaskLists),
    takeLatest(authActions.restoreLogin, restoreAuth),
    takeEvery(authActions.setAuth, syncAuth),
    takeEvery(tasksActions.fetchTasks, fetchTasks),
    takeLatest(authActions.successLogin, successLogin),
    fork(refreshToken),
  ]);
}

export { allSagas };
