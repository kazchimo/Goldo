import { createSelector } from "@reduxjs/toolkit";
import { selectSelf } from "../selectors";

const tasks = createSelector(selectSelf, (s) => s.tasks);

const tasksByListId = createSelector(tasks, (s) => s.tasksByListId);

export const tasksSelector = {
  tasksByListId,
};
