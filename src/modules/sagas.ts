import { all, call, delay, put, takeLatest } from "redux-saga/effects";
import { getTaskLists, TaskLists } from "../lib/gapi";
import { actions } from "./reducers";

function* loadGapiClient() {
  let finish = false;
  gapi.load("client", () => {
    finish = true;
  });

  while (!finish) {
    yield delay(500);
  }

  yield put(actions.successLoadClient());
}

function* fetchTaskLists() {
  const res: TaskLists = yield call(getTaskLists);

  yield put(actions.successFetchTaskLists(res.items));
}

function* allSagas() {
  yield all([
    takeLatest(actions.loadGapiClient, loadGapiClient),
    takeLatest(actions.fetchTaskLists, fetchTaskLists),
  ]);
}

export { allSagas };
