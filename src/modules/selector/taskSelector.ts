import { createSelector } from "@reduxjs/toolkit";
import _ from "lodash";
import { insertTask } from "../../lib/taskView/ops";
import { RootState } from "../reducers";
import { tasksAdaptor } from "../slice/taskSlice";

const selector = tasksAdaptor.getSelectors<RootState>((s) => s.tasks);

const tasksByListId = createSelector(selector.selectAll, (s) =>
  _.groupBy(s, (t) => t.listId)
);

const tasksViewByListId = createSelector(selector.selectAll, (s) =>
  _.mapValues(
    _.groupBy(s, (t) => t.listId),
    (ts) =>
      insertTask(
        ts.map((t) => ({ ...t, children: [] })),
        []
      )
  )
);

export const tasksSelector = {
  tasksByListId,
  tasksViewByListId,
};
