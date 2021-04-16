import { combineReducers } from "@reduxjs/toolkit";
import { appReducer } from "./slice/appSlice";
import { authReducer } from "./slice/authSlice";
import { gapiReducers } from "./slice/gapiSlice";
import { loadingReducers } from "./slice/loadingSlice";
import { snackbarReducer } from "./slice/snackBarSlice";
import { taskListReducer } from "./slice/taskListSlice";
import { tasksReducer } from "./slice/taskSlice";
import { themeReducer } from "./slice/themeSlice";

const reducer = combineReducers({
  tasks: tasksReducer,
  auth: authReducer,
  taskLists: taskListReducer,
  gapi: gapiReducers,
  snackbar: snackbarReducer,
  loading: loadingReducers,
  app: appReducer,
  theme: themeReducer,
});

export type RootState = ReturnType<typeof reducer>;

export { reducer };
