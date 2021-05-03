import { fork, put, takeEvery, delay, takeLatest } from "redux-saga/effects";
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

function* enqueueUpdateSearchWord(a: Action<string>) {
  if (a.payload !== "") {
    yield delay(1000);
  }
  yield put(appActions.updateSearchWord(a.payload));
}

export const appSaga = [
  fork(restoreSidebarState),
  fork(restoreDefaultListId),
  takeLatest(appActions.enqueueUpdateSearchWord, enqueueUpdateSearchWord),
  takeEvery(appActions.openSidebar, saveSidebarState),
  takeEvery(appActions.closeSidebar, saveSidebarState),
  takeEvery(appActions.setDefaultListId, saveDefaultListId),
];
