import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  makeStyles,
} from "@material-ui/core";
import React, { MutableRefObject, RefObject } from "react";
import { useSelector } from "react-redux";
import { taskListsSelector } from "../../modules/selector/taskListsSelector";

type Props = {
  refs: MutableRefObject<{
    [listId: string]: RefObject<HTMLDivElement>;
  }>;
};

const useStyles = makeStyles({
  container: {
    width: 200,
  },
  subheader: {
    textAlign: "start",
  },
});

export const TaskListIndex: React.FC<Props> = ({ refs }) => {
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
        <ListItem
          key={taskList.id}
          button
          onClick={() =>
            refs.current[taskList.id].current?.scrollIntoView({
              behavior: "smooth",
              inline: "start",
            })
          }
        >
          <ListItemText primary={taskList.title} />
        </ListItem>
      ))}
    </List>
  );
};
