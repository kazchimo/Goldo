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
  const { todayTaskViewByListId, taskLists } = useSelectors(
    { ...tasksSelector, ...taskListsSelector },
    "todayTaskViewByListId",
    "taskLists"
  );
  const classes = useStyles();

  const taskListIds = Object.keys(todayTaskViewByListId);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Paper variant={"outlined"} className={classes.boardPaper}>
          {taskListIds.map((listId) => (
            <List key={listId} subheader={<ListSubheader>Today</ListSubheader>}>
              <ListItem>
                <List
                  className={classes.innerList}
                  subheader={
                    <ListSubheader>
                      {taskLists.filter((l) => l.id === listId)[0].title}
                      <Divider />
                    </ListSubheader>
                  }
                >
                  <Grid container>
                    {todayTaskViewByListId[listId].map((task, i) => (
                      <Grid item xs={12} key={task.id}>
                        <TaskListItem
                          task={task}
                          taskList={taskLists.filter((l) => l.id === listId)[0]}
                          index={i}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </List>
              </ListItem>
            </List>
          ))}
        </Paper>
      </Grid>
    </Grid>
  );
};
