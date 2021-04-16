import { createSlice } from "@reduxjs/toolkit";
import { Lens } from "monocle-ts";
import { taskListActions } from "./taskListSlice";
import { tasksActions } from "./taskSlice";

type State = {
  fetchTaskListsCount?: number;
  fetchTasksCount?: number;
};

const initialState: State = {};

const fetchTaskListsCountLens = Lens.fromPath<State>()(["fetchTaskListsCount"]);

const fetchTasksCountLens = Lens.fromPath<State>()(["fetchTasksCount"]);

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {},
  extraReducers: {
    [tasksActions.addTasks.type]: (s) =>
      fetchTasksCountLens.modify((s) => (s || 0) + 1)(s),
    [taskListActions.successFetchTaskLists.type]: (s, a) =>
      fetchTaskListsCountLens.modify((s) => (s || 0) + a.payload.length)(s),
  },
});

export const appActions = slice.actions;

export const appReducer = slice.reducer;
