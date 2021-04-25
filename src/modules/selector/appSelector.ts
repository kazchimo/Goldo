import { createSelector } from "@reduxjs/toolkit";
import { selectSelf } from "../selectors";

const selector = createSelector(selectSelf, (s) => s.app);

const openTasks = createSelector(selector, (s) => s.openTasks);

export const appSelector = {
  openTasks,
  finishInitialLoading: createSelector(
    selector,
    ({ fetchTaskListsCount, fetchTasksCount }) =>
      fetchTaskListsCount &&
      fetchTasksCount &&
      fetchTaskListsCount === fetchTasksCount
  ),
};
