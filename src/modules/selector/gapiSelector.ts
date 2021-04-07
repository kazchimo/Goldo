import { createSelector } from "@reduxjs/toolkit";
import { selectSelf } from "../selectors";

const gapi = createSelector(selectSelf, (s) => s.gapi);

const gapiIsInit = createSelector(gapi, (s) => s.gapiIsInit);

export const gapiSelector = {
  gapi,
  gapiIsInit,
};
