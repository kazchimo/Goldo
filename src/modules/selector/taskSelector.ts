import { createSelector } from "@reduxjs/toolkit";
import { differenceInCalendarDays, parseISO } from "date-fns";
import _ from "lodash";
import { hasDue } from "../../lib/gapi";
import { insertTask } from "../../lib/taskView/ops";
import { RootState } from "../reducers";
import { selectSelf } from "../selectors";
import { tasksAdaptor } from "../slice/taskSlice";

const selector = tasksAdaptor.getSelectors<RootState>((s) => s.tasks);

const tasksByListId = createSelector(selector.selectAll, (s) =>
  _.groupBy(s, (t) => t.listId)
);

const tasksViewByListId = createSelector(selector.selectAll, (s) =>
  _.mapValues(
    _.groupBy(s, (t) => t.listId),
    (ts) =>
      _.sortBy(
        insertTask(
          ts.map((t) => ({ ...t, children: [] })),
          []
        ),
        (t) => Number(t.position)
      )
  )
);

const todayTaskViewByListId = createSelector(tasksByListId, (s) => {
  const now = new Date();

  return _.omitBy(
    _.mapValues(s, (ts) =>
      ts.filter(
        (t) => hasDue(t) && differenceInCalendarDays(parseISO(t.due), now) === 0
      )
    ),
    (vs) => vs.length === 0
  );
});

const overdueTaskViewsByListId = createSelector(tasksByListId, (s) => {
  const now = new Date();

  return _.omitBy(
    _.mapValues(s, (ts) =>
      ts.filter(
        (t) => hasDue(t) && differenceInCalendarDays(parseISO(t.due), now) < 0
      )
    ),
    (vs) => vs.length === 0
  );
});

const dueTasksByDate = createSelector(selector.selectAll, (tasks) =>
  _.mapValues(
    _.groupBy(tasks.filter(hasDue), (t) => parseISO(t.due).toDateString()),
    (tasks) => _.sortBy(tasks, (task) => task.listId)
  )
);

export const tasksSelector = {
  taskEntities: createSelector(selectSelf, selector.selectEntities),
  tasks: createSelector(selectSelf, selector.selectAll),
  tasksByListId,
  tasksViewByListId,
  todayTaskViewByListId,
  overdueTaskViewsByListId,
  dueTasksByDate,
};
