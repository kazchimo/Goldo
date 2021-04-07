import {
  createAction,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { Task } from "../../lib/gapi";

const taskAdapter = createEntityAdapter<Task>({
  selectId: (t) => t.id,
});

const taskSlice = createSlice({
  name: "tasks",
  initialState: taskAdapter.getInitialState(),
  reducers: {
    addMany: taskAdapter.addMany,
  },
});

const fetchTasks = createAction<string>("fetchTasks");

const tasksActions = { ...taskSlice.actions, fetchTasks };

const tasksReducer = taskSlice.reducer;

export { tasksActions, tasksReducer };
