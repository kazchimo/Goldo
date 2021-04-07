import { delay, put, takeLatest } from "redux-saga/effects";
import { gapiActions } from "../slice/gapiSlice";

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

export const gapiSaga = [takeLatest(gapiActions.loadGapi, loadGapi)];
