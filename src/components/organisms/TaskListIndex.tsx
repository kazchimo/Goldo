import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  makeStyles,
} from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import { taskListsSelector } from "../../modules/selector/taskListsSelector";

const useStyles = makeStyles({
  container: {
    width: 200,
  },
  subheader: {
    textAlign: "start",
  },
});

export const TaskListIndex: React.FC = () => {
  const taskLists = useSelector(taskListsSelector.taskLists);
  const classes = useStyles();

  return (
    <List
      dense
      subheader={
        <ListSubheader className={classes.subheader}>Task Lists</ListSubheader>
      }
      className={classes.container}
    >
      <Divider variant={"middle"} />
      {taskLists.map((taskList) => (
        <ListItem key={taskList.id}>
          <ListItemText primary={taskList.title} />
        </ListItem>
      ))}
    </List>
  );
};
