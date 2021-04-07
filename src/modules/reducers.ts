import { combineReducers } from "@reduxjs/toolkit";
import { authReducer } from "./slice/authSlice";
import { gapiReducers } from "./slice/gapiSlice";
import { taskListReducer } from "./slice/taskListSlice";
import { tasksReducer } from "./slice/taskSlice";

const reducer = combineReducers({
  tasks: tasksReducer,
  auth: authReducer,
  taskLists: taskListReducer,
  gapi: gapiReducers,
});

export type RootState = ReturnType<typeof reducer>;

export { reducer };
