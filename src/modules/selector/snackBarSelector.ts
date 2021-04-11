import { createSelector } from "@reduxjs/toolkit";
import { selectSelf } from "../selectors";

const selector = createSelector(selectSelf, (s) => s.snackbar);

export const snackbarSelectors = {
  notifications: selector,
};
