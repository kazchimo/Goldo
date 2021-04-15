import { createSelector } from "@reduxjs/toolkit";
import { selectSelf } from "../selectors";

const selector = createSelector(selectSelf, (s) => s.taskBoardPage);

export const taskBoardPageSelector = {
  finishInitialLoading: createSelector(
    selector,
    ({ fetchTaskListsCount, fetchTasksCount }) =>
      fetchTaskListsCount &&
      fetchTasksCount &&
      fetchTaskListsCount === fetchTasksCount
  ),
};
