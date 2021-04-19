import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../reducers";
import { selectSelf } from "../selectors";
import { taskListAdapter } from "../slice/taskListSlice";

const selector = taskListAdapter.getSelectors<RootState>((s) => s.taskLists);

const taskLists = createSelector(selector.selectAll, (s) => s);

export const taskListsSelector = {
  taskListEntities: createSelector(selectSelf, selector.selectEntities),
  taskLists,
};
