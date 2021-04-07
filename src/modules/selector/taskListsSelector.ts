import { createSelector } from "@reduxjs/toolkit";
import { selectSelf } from "../selectors";

const taskLists = createSelector(selectSelf, (s) => s.taskLists);

export const taskListsSelector = {
  taskLists,
};
