import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { Action } from "typescript-fsa";
import { themeActions } from "../slice/themeSlice";

function* saveTheme(action: Action<void>) {
  if (action.type === themeActions.toDarkTheme.type) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

function* restoreTheme() {
  const theme: string | null = localStorage.getItem("theme");

  if (theme === "dark") {
    yield put(themeActions.toDarkTheme());
  } else {
    yield put(themeActions.toLightTheme());
  }
}

export const themeSaga = [
  takeEvery(themeActions.toDarkTheme, saveTheme),
  takeEvery(themeActions.toLightTheme, saveTheme),
  takeLatest(themeActions.restoreTheme, restoreTheme),
];
