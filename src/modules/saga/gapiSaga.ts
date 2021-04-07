import { call, delay, put, takeLatest } from "redux-saga/effects";
import { gapiActions } from "../slice/gapiSlice";

function* initGapi() {
  let auth2Finish = false;

  gapi.load("client:auth2", () => {
    auth2Finish = true;
  });

  while (!auth2Finish) {
    yield delay(100);
  }

  const CLIENT_ID = process.env["REACT_APP_CLIENT_ID"];
  const SCOPE = "https://www.googleapis.com/auth/tasks";
  yield call(gapi.client.init, {
    clientId: CLIENT_ID,
    scope: SCOPE,
    discoveryDocs: [
      "https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest",
    ],
    apiKey: process.env["REACT_APP_API_KEY"],
  });

  yield put(gapiActions.successInitGapi());
}

export const gapiSaga = [takeLatest(gapiActions.initGapi, initGapi)];
