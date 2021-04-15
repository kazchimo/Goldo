import { createSelector } from "@reduxjs/toolkit";
import { selectSelf } from "../selectors";

const theme = createSelector(selectSelf, (s) => s.theme);

export const themeSelector = {
  theme,
};
