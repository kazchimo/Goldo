import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskList } from "../lib/gapi";

export type State = {
  gapiLoaded: boolean;
  login?: boolean;
  taskLists: TaskList[];
};

const initialState: State = {
  gapiLoaded: false,
  login: undefined,
  taskLists: [],
};

const slice = createSlice({
  name: "appSlice",
  reducers: {
    successLoadGapi: (s) => ({ ...s, gapiLoaded: true }),
    setLogin: (s, a: PayloadAction<boolean>) => ({ ...s, login: a.payload }),
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

const actions = { ...slice.actions, loadGapi, fetchTaskLists, restoreLogin };
const reducer = slice.reducer;

export { actions, reducer };
