import {
  Divider,
  Grid,
  List,
  ListItem,
  ListSubheader,
  Paper,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { taskListsSelector } from "../../modules/selector/taskListsSelector";
import { tasksSelector } from "../../modules/selector/taskSelector";
import { TaskListItem } from "../molecules/TaskListItem";

const useStyles = makeStyles({
  boardPaper: {
    maxWidth: 800,
    marginLeft: "auto",
    marginRight: "auto",
  },
  innerList: {
    width: "inherit",
  },
});

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

  const todayListIds = Object.keys(todayTaskViewByListId);
  const overdueListIds = Object.keys(overdueTaskViewsByListId);

  return (
    <Paper variant={"outlined"} className={classes.boardPaper}>
      <List
        subheader={
          <ListSubheader>Today - {new Date().toDateString()}</ListSubheader>
        }
      >
        {todayListIds.map((listId) => (
          <ListItem key={listId}>
            <List
              className={classes.innerList}
              subheader={
                <ListSubheader>
                  {taskLists.filter((l) => l.id === listId)[0].title}
                  <Divider />
                </ListSubheader>
              }
            >
              {todayTaskViewByListId[listId].map((task, i) => (
                <TaskListItem
                  key={task.id}
                  task={{ ...task, children: [] }}
                  taskList={taskLists.filter((l) => l.id === listId)[0]}
                  index={i}
                />
              ))}
            </List>
          </ListItem>
        ))}
      </List>
      {overdueListIds.length > 0 && (
        <List subheader={<ListSubheader>Overdue</ListSubheader>}>
          {overdueListIds.map((listId) => (
            <ListItem key={listId}>
              <List
                className={classes.innerList}
                subheader={
                  <ListSubheader>
                    {taskLists.filter((l) => l.id === listId)[0].title}
                    <Divider />
                  </ListSubheader>
                }
              >
                {overdueTaskViewsByListId[listId].map((task, i) => (
                  <TaskListItem
                    key={task.id}
                    task={{ ...task, children: [] }}
                    taskList={taskLists.filter((l) => l.id === listId)[0]}
                    index={i}
                  />
                ))}
              </List>
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};
