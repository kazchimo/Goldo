import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskList } from "../../lib/gapi";

const initialState: TaskList[] = [];

const taskListSlice = createSlice({
  name: "taskList",
  initialState,
  reducers: {
    successFetchTaskLists: (s, a: PayloadAction<TaskList[]>) => a.payload,
  },
});

const fetchTaskLists = createAction("fetchTaskLists");

export const taskListActions = { ...taskListSlice.actions, fetchTaskLists };

export const taskListReducer = taskListSlice.reducer;
