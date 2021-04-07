import { createSelector } from "@reduxjs/toolkit";
import { selectSelf } from "../selectors";

const auth = createSelector(selectSelf, (s) => s.auth);

const login = createSelector(auth, (s) => s.login);

export const authSelector = {
  auth,
  login,
};
