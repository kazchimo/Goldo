import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskList } from "../lib/gapi";

export type State = {
  gapiLoaded: boolean;
  taskLists: TaskList[];
};

const initialState: State = {
  gapiLoaded: false,
  taskLists: [],
};

const slice = createSlice({
  name: "appSlice",
  reducers: {
    successLoadClient: (s) => ({ ...s, clientLoaded: true }),
    successFetchTaskLists: (s, a: PayloadAction<TaskList[]>) => ({
      ...s,
      taskLists: a.payload,
    }),
  },
  initialState,
});

const loadGapi = createAction("loadGapi");
const fetchTaskLists = createAction("fetchTaskLists");

const actions = { ...slice.actions, loadGapiClient: loadGapi, fetchTaskLists };
const reducer = slice.reducer;

export { actions, reducer };
