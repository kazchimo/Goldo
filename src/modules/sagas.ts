import { all, delay, put, takeLatest } from "redux-saga/effects";
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

function* allSagas() {
  yield all([takeLatest(actions.loadGapiClient, loadGapiClient)]);
}

export { allSagas };
