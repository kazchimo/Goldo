import {
  Divider,
  List,
  ListItem,
  ListSubheader,
  Paper,
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
  const { todayTaskViewByListId, taskLists } = useSelectors(
    { ...tasksSelector, ...taskListsSelector },
    "todayTaskViewByListId",
    "taskLists"
  );
  const classes = useStyles();

  const taskListIds = Object.keys(todayTaskViewByListId);

  return (
    <Paper variant={"outlined"} className={classes.boardPaper}>
      <List subheader={<ListSubheader>Today</ListSubheader>}>
        {taskListIds.map((listId) => (
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
    </Paper>
  );
};
