import { all, call, delay, put, takeLatest } from "redux-saga/effects";
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

  yield put(actions.successFetchTaskLists(res.result.items));
}

function* allSagas() {
  yield all([
    takeLatest(actions.loadGapiClient, loadGapi),
    takeLatest(actions.fetchTaskLists, fetchTaskLists),
  ]);
}

export { allSagas };
