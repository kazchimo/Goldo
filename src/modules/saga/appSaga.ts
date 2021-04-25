import { fork, put, takeEvery } from "redux-saga/effects";
import { Action } from "typescript-fsa";
import { appActions } from "../slice/appSlice";

function* saveSidebarState(a: Action<unknown>) {
  if (a.type === appActions.openSidebar.type) {
    localStorage.setItem("sidebarOpen", "true");
  } else {
    localStorage.setItem("sidebarOpen", "false");
  }
}

function* restoreSidebarState() {
  const state = localStorage.getItem("sidebarOpen");

  if (state === "true") {
    yield put(appActions.openSidebar());
  } else {
    yield put(appActions.closeSidebar());
  }
}

export const appSaga = [
  fork(restoreSidebarState),
  takeEvery(appActions.openSidebar, saveSidebarState),
  takeEvery(appActions.closeSidebar, saveSidebarState),
];
