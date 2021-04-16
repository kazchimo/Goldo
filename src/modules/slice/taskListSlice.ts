import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskList } from "../../lib/gapi";

const initialState: TaskList[] = [];

const taskListSlice = createSlice({
  name: "taskList",
  initialState,
  reducers: {
    successFetchTaskLists: (s, a: PayloadAction<TaskList[]>) => a.payload,
    deleteTaskList: (s, a: PayloadAction<string>) =>
      s.filter((t) => t.id !== a.payload),
    updateList: (s, a: PayloadAction<TaskList>) => [
      ...s.filter((t) => t.id !== a.payload.id),
      a.payload,
    ],
  },
});

const fetchTaskLists = createAction("fetchTaskLists");

export const taskListActions = {
  ...taskListSlice.actions,
  fetchTaskLists,
};

export const taskListReducer = taskListSlice.reducer;
