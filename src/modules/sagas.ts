import { all, call, delay, put, takeLatest } from "redux-saga/effects";
import { getTaskLists, GResponse, TaskLists } from "../lib/gapi";
import { actions } from "./reducers";

function* loadGapiClient() {
  let finish = false;
  gapi.load("client", () => {
    finish = true;
  });

  while (!finish) {
    yield delay(100);
  }

  yield put(actions.successLoadClient());
}

function* fetchTaskLists() {
  const res: GResponse<TaskLists> = yield call(getTaskLists);

  yield put(actions.successFetchTaskLists(res.result.items));
}

function* allSagas() {
  yield all([
    takeLatest(actions.loadGapiClient, loadGapiClient),
    takeLatest(actions.fetchTaskLists, fetchTaskLists),
  ]);
}

export { allSagas };
