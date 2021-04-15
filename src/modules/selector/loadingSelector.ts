import { createSelector } from "@reduxjs/toolkit";
import { selectSelf } from "../selectors";

const selector = createSelector(selectSelf, (s) => s.loading);

export const loadingSelectors = {
  loading: selector,
};
