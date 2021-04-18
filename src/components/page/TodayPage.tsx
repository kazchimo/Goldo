import { List, ListItem, ListSubheader, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";
import React from "react";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { taskListsSelector } from "../../modules/selector/taskListsSelector";
import { tasksSelector } from "../../modules/selector/taskSelector";
import { SimpleTaskList } from "../organisms/SimpleTaskList";
import { TodayTaskAddForm } from "../organisms/TodayTaskAddForm";

const useStyles = makeStyles((theme) => ({
  boardPaper: {
    maxWidth: 800,
    marginLeft: "auto",
    marginRight: "auto",
  },
  innerList: {
    width: "inherit",
  },
  formItem: {
    padding: theme.spacing(4),
  },
}));

export const TodayPage: React.FC = () => {
  const {
    todayTaskViewByListId,
    taskLists,
    overdueTaskViewsByListId,
  } = useSelectors(
    { ...tasksSelector, ...taskListsSelector },
    "todayTaskViewByListId",
    "taskLists",
    "overdueTaskViewsByListId"
  );
  const classes = useStyles();

  const todayListIds = _.sortBy(Object.keys(todayTaskViewByListId));
  const overdueListIds = _.sortBy(Object.keys(overdueTaskViewsByListId));

  return (
    <Paper variant={"outlined"} className={classes.boardPaper}>
      <List
        subheader={
          <ListSubheader>Today - {new Date().toDateString()}</ListSubheader>
        }
        dense
      >
        <ListItem className={classes.formItem}>
          <TodayTaskAddForm />
        </ListItem>
        {todayListIds.map((listId) => (
          <ListItem key={listId}>
            <SimpleTaskList
              taskList={taskLists.filter((l) => l.id === listId)[0]}
              tasks={todayTaskViewByListId[listId]}
            />
          </ListItem>
        ))}
      </List>
      {overdueListIds.length > 0 && (
        <List subheader={<ListSubheader>Overdue</ListSubheader>}>
          {overdueListIds.map((listId) => (
            <ListItem key={listId}>
              <SimpleTaskList
                taskList={taskLists.filter((l) => l.id === listId)[0]}
                tasks={overdueTaskViewsByListId[listId]}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};
