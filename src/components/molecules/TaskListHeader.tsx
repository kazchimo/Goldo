import { Grid, ListSubheader, makeStyles } from "@material-ui/core";
import React from "react";
import { TaskList } from "../../lib/gapi";
import { TaskAddForm } from "./TaskAddForm";

type Props = {
  taskList: TaskList;
};

const useStyles = makeStyles((theme) => ({
  subHeader: {
    backgroundColor: theme.palette.background.paper,
    paddingBottom: 8,
  },
  addForm: {
    marginRight: 8,
  },
}));

export const TaskListHeader: React.FC<Props> = ({ taskList }) => {
  const classes = useStyles();

  return (
    <ListSubheader className={classes.subHeader}>
      <Grid container>
        <Grid item xs={12}>
          {taskList.title}
        </Grid>
        <Grid item xs={12}>
          <TaskAddForm taskList={taskList} />
        </Grid>
      </Grid>
    </ListSubheader>
  );
};
