import { Grid, Typography } from "@material-ui/core";
import React from "react";
import { hasDue, TaskList } from "../../lib/gapi";
import { TaskView } from "../../lib/taskView/TaskView";
import { TaskDue } from "../atoms/TaskDue";

type Props = {
  task: TaskView;
  showListName?: boolean;
  taskList: TaskList;
};

export const TaskListItemMetas: React.FC<Props> = ({
  task,
  showListName,
  taskList,
}) => {
  return (
    <Grid container alignItems={"flex-end"} justify={"space-between"}>
      <Grid item>{hasDue(task) && <TaskDue task={task} />}</Grid>
      {showListName && (
        <Grid item style={{ marginLeft: "auto" }}>
          <Typography variant={"body2"} color={"textSecondary"}>
            {taskList.title}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};
