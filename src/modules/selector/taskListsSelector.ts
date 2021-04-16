import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../reducers";
import { taskListAdapter } from "../slice/taskListSlice";

const selector = taskListAdapter.getSelectors<RootState>((s) => s.taskLists);

const taskLists = createSelector(selector.selectAll, (s) => s);

export const taskListsSelector = {
  taskLists,
};
