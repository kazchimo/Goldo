import { List, ListSubheader, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";
import React, { useMemo, VFC } from "react";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { appSelector } from "../../modules/selector/appSelector";
import { taskListsSelector } from "../../modules/selector/taskListsSelector";
import { tasksSelector } from "../../modules/selector/taskSelector";
import { TaskListItem } from "../molecules/TaskListItem";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    maxHeight: 400,
    overflow: "auto",
    width: 400,
  },
  subHeader: {
    backgroundColor: theme.palette.background.paper,
  },
}));

export const SearchResult: VFC = () => {
  const classes = useStyles();
  const { searchWord, tasksByListId, taskLists } = useSelectors(
    { ...appSelector, ...tasksSelector, ...taskListsSelector },
    "tasksByListId",
    "searchWord",
    "tasks",
    "taskLists"
  );

  const filteredTasks = useMemo(
    () =>
      _.omitBy(
        _.mapValues(tasksByListId, (tasks) =>
          tasks.filter(
            (t) =>
              t.title?.includes(searchWord) || t.notes?.includes(searchWord)
          )
        ),
        (ts) => ts.length === 0
      ),
    [tasksByListId, searchWord]
  );

  return (
    <Paper className={classes.paper}>
      {searchWord && (
        <List>
          {Object.keys(filteredTasks).map((listId) => {
            const list = taskLists.filter((list) => list.id === listId)[0];
            return (
              <>
                <ListSubheader className={classes.subHeader}>
                  {list.title}
                </ListSubheader>
                {filteredTasks[listId].map((task) => (
                  <TaskListItem
                    key={task.id}
                    task={{ ...task, children: [] }}
                    taskList={list}
                  />
                ))}
              </>
            );
          })}
        </List>
      )}
    </Paper>
  );
};
