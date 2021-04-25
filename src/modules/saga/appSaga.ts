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

function* saveDefaultListId(a: Action<string | undefined>) {
  if (a.payload) {
    localStorage.setItem("defaultListId", a.payload);
  }
}

function* restoreDefaultListId() {
  const id = localStorage.getItem("defaultListId");

  if (id) {
    yield put(appActions.setDefaultListId(id));
  }
}

export const appSaga = [
  fork(restoreSidebarState),
  fork(restoreDefaultListId),
  takeEvery(appActions.openSidebar, saveSidebarState),
  takeEvery(appActions.closeSidebar, saveSidebarState),
  takeEvery(appActions.setDefaultListId, saveDefaultListId),
];
