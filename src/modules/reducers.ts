import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskList } from "../lib/gapi";

export type Auth = {
  login: boolean;
  accessToken: string;
  expiresAt: number;
};

export type State = {
  gapiLoaded: boolean;
  taskLists: TaskList[];
  auth?: Auth;
};

const initialState: State = {
  gapiLoaded: false,
  taskLists: [],
};

const slice = createSlice({
  name: "appSlice",
  reducers: {
    successLoadGapi: (s) => ({ ...s, gapiLoaded: true }),
    setAuth: (s, a: PayloadAction<Auth>) => ({ ...s, auth: a.payload }),
    successFetchTaskLists: (s, a: PayloadAction<TaskList[]>) => ({
      ...s,
      taskLists: a.payload,
    }),
  },
  initialState,
});

const loadGapi = createAction("loadGapi");
const fetchTaskLists = createAction("fetchTaskLists");
const restoreLogin = createAction("restoreLogin");
const successLogin = createAction<GoogleApiOAuth2TokenObject>("successLogin");

const actions = {
  ...slice.actions,
  loadGapi,
  fetchTaskLists,
  restoreLogin,
  successLogin,
};
const reducer = slice.reducer;

export { actions, reducer };
