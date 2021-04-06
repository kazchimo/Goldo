import { createSelector } from "@reduxjs/toolkit";
import { State } from "./reducers";

const selectSelf = (s: State) => s;

const gapiLoaded = createSelector(selectSelf, (s) => s.gapiLoaded);

const taskLists = createSelector(selectSelf, (s) => s.taskLists);

const login = createSelector(selectSelf, (s) => s.auth?.login);

const selectors = {
  gapiLoaded,
  taskLists,
  login,
};

export { selectors };
