import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../reducers";
import { selectSelf } from "../selectors";
import { taskAdapter } from "../slice/taskSlice";

const tasks = createSelector(selectSelf, (s) => s.tasks);

export const taskEntitySelector = taskAdapter.getSelectors<RootState>(tasks);

const tasksByListId = createSelector(tasks, (s) => s.tasksByListId);

export const tasksSelector = {
  tasksByListId,
};
