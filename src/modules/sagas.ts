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
  GResponse,
  TaskLists,
} from "../lib/gapi";
import { actions, Auth } from "./reducers";
import { selectors } from "./selectors";

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
      actions.setAuth({
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
  yield call(db.setItem, "expiresAt", expiresAt.toString());
  yield call(db.setItem, "accessToken", accessToken);
}

function* successLogin({ payload }: Action<GoogleApiOAuth2TokenObject>) {
  console.log(payload);
  yield put(
    actions.setAuth({
      login: true,
      expiresAt: calcExpiresAt(payload.expires_in),
      accessToken: payload.access_token,
    })
  );
}

function* refreshToken() {
  while (true) {
    const expiresAt: ReturnType<typeof selectors.expiresAt> = yield select(
      selectors.expiresAt
    );

    let token: GoogleApiOAuth2TokenObject | undefined;

    if (expiresAt && expiresAt - new Date().getTime() / 1000 < 60 * 10) {
      authorize((t) => {
        token = t;
      });

      while (true) {
        if (token) {
          yield put(
            actions.setAuth({
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
    takeLatest(actions.loadGapi, loadGapi),
    takeLatest(actions.fetchTaskLists, fetchTaskLists),
    takeLatest(actions.restoreLogin, restoreAuth),
    takeEvery(actions.setAuth, syncAuth),
    takeLatest(actions.successLogin, successLogin),
    fork(refreshToken),
  ]);
}

export { allSagas };
