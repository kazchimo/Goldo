import { List, ListSubheader, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";
import React from "react";
import { TaskList } from "../../lib/gapi";
import { TaskView } from "../../lib/taskView/TaskView";
import { TaskAddForm } from "./TaskAddForm";
import { TaskListItem } from "./TaskListItem";

type Props = {
  task: TaskView;
  taskList: TaskList;
};

const useStyles = makeStyles((theme) => ({
  list: {
    height: 450,
    overflow: "auto",
    backgroundColor: theme.palette.background.paper,
  },
  form: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  paper: {
    width: 300,
  },
}));

export const TaskModalSubTask: React.FC<Props> = ({ task, taskList }) => {
  const classes = useStyles();

  return (
    <Paper elevation={0} variant={"outlined"} className={classes.paper}>
      <List
        dense
        subheader={<ListSubheader>Sub Tasks</ListSubheader>}
        className={classes.list}
      >
        {task.children.map((t) => (
          <TaskListItem key={t.id} task={t} taskList={taskList} />
        ))}
      </List>
      <div className={classes.form}>
        <TaskAddForm
          taskList={taskList}
          parentId={task.id}
          previous={_.last(task.children)?.id}
        />
      </div>
    </Paper>
  );
};
