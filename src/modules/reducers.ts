import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskList } from "../lib/gapi";

export type State = {
  clientLoaded: boolean;
  taskLists: TaskList[];
};

const initialState: State = {
  clientLoaded: false,
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

const loadGapiClient = createAction("loadGapiClient");
const fetchTaskLists = createAction("fetchTaskLists");

const actions = { ...slice.actions, loadGapiClient, fetchTaskLists };
const reducer = slice.reducer;

export { actions, reducer };
