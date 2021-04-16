import {
  createAction,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { TaskList } from "../../lib/gapi";

export const taskListAdapter = createEntityAdapter<TaskList>({
  selectId: (l) => l.id,
  sortComparer: (a, b) => a.id.localeCompare(b.id),
});

const initialState = taskListAdapter.getInitialState();

const taskListSlice = createSlice({
  name: "taskList",
  initialState,
  reducers: {
    successFetchTaskLists: taskListAdapter.addMany,
    deleteTaskList: taskListAdapter.removeOne,
    updateList: (s, a: PayloadAction<TaskList>) =>
      taskListAdapter.updateOne(s, { id: a.payload.id, changes: a.payload }),
  },
});

const fetchTaskLists = createAction("fetchTaskLists");

export const taskListActions = {
  ...taskListSlice.actions,
  fetchTaskLists,
};

export const taskListReducer = taskListSlice.reducer;
