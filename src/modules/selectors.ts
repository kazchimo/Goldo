import { createSelector } from "@reduxjs/toolkit";
import { State } from "./reducers";

const selectSelf = (s: State) => s;

const clientLoaded = createSelector(selectSelf, (s) => s.gapiLoaded);

const taskLists = createSelector(selectSelf, (s) => s.taskLists);

const selectors = {
  clientLoaded,
  taskLists,
};

export { selectors };
