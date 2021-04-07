import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Auth = {
  login: boolean;
  accessToken?: string;
  expiresAt?: number;
};

const initialState: Auth = { login: false };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (s, a: PayloadAction<Auth>) => a.payload,
  },
});

const restoreLogin = createAction("restoreLogin");
const successLogin = createAction<GoogleApiOAuth2TokenObject>("successLogin");

export const authReducer = authSlice.reducer;

export const authActions = { ...authSlice.actions, restoreLogin, successLogin };
