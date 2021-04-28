import { createSelector } from "@reduxjs/toolkit";
import { selectSelf } from "../selectors";

const selector = createSelector(selectSelf, (s) => s.loading);

const loading = createSelector(selector, (s) => s.loadingTaskCount > 0);

export const loadingSelectors = {
  loading,
};
