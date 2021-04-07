import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Auth = {
  login: boolean;
};

const initialState: Auth = { login: false };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (s, a: PayloadAction<Auth>) => a.payload,
    successLogin: (s) => ({ ...s, login: true }),
  },
});

const signIn = createAction("signIn");

export const authReducer = authSlice.reducer;

export const authActions = {
  ...authSlice.actions,
  signIn,
};
