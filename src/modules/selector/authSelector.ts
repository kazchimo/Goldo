import { createSelector } from "@reduxjs/toolkit";
import { selectSelf } from "../selectors";

const auth = createSelector(selectSelf, (s) => s.auth);

const login = createSelector(auth, (s) => s.login);

const expiresAt = createSelector(auth, (s) => s.expiresAt);

export const authSelector = {
  auth,
  login,
  expiresAt,
};
