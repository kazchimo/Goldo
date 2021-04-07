import { createSelector } from "@reduxjs/toolkit";
import { selectSelf } from "../selectors";

const gapi = createSelector(selectSelf, (s) => s.gapi);

const gapiLoaded = createSelector(gapi, (s) => s.gapiLoaded);

export const gapiSelector = {
  gapi,
  gapiLoaded,
};
