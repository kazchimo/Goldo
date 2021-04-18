import { Divider, List, ListSubheader } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { Task, TaskList } from "../../lib/gapi";
import { TaskListItem } from "../molecules/TaskListItem";

type Props = {
  taskList: TaskList;
  tasks: Task[];
};

const useStyles = makeStyles((theme) => ({
  innerList: {
    width: "inherit",
  },
}));

export const SimpleTaskList: React.FC<Props> = ({ taskList, tasks }) => {
  const classes = useStyles();

  return (
    <List
      dense
      className={classes.innerList}
      subheader={
        <ListSubheader>
          {taskList.title}
          <Divider />
        </ListSubheader>
      }
    >
      {tasks.map((task, i) => (
        <TaskListItem
          key={task.id}
          task={{ ...task, children: [] }}
          taskList={taskList}
          index={i}
        />
      ))}
    </List>
  );
};
