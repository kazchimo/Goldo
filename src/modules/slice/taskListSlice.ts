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
    successCreateTaskList: (s, a: PayloadAction<TaskList>) =>
      taskListAdapter.addOne(s, a.payload),
  },
});

const fetchTaskLists = createAction("fetchTaskLists");
const createTaskList = createAction<string>("createTaskList");

export const taskListActions = {
  ...taskListSlice.actions,
  fetchTaskLists,
  createTaskList,
};

export const taskListReducer = taskListSlice.reducer;
