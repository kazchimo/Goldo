import { createSelector } from "@reduxjs/toolkit";
import { selectSelf } from "../selectors";

const selector = createSelector(selectSelf, (s) => s.app);

export const appSelector = {
  finishInitialLoading: createSelector(
    selector,
    ({ fetchTaskListsCount, fetchTasksCount }) =>
      fetchTaskListsCount &&
      fetchTasksCount &&
      fetchTaskListsCount === fetchTasksCount
  ),
};
