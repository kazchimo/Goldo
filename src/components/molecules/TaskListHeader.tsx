import { Grid, IconButton, ListSubheader, makeStyles } from "@material-ui/core";
import { TextField } from "formik-material-ui";
import React from "react";
import { TaskList } from "../../lib/gapi";
import { FieldAttributes, Form, Formik } from "formik";
import { Field } from "formik";
import AddIcon from "@material-ui/icons/Add";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { tasksActions } from "../../modules/slice/taskSlice";

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
  const { createTask } = useBoundActions(tasksActions);

  return (
    <ListSubheader className={classes.subHeader}>
      <Grid container>
        <Grid item xs={12}>
          {taskList.title}
        </Grid>
        <Grid item xs={12}>
          <Formik
            initialValues={{ newTaskTitle: "" }}
            onSubmit={(v, { setSubmitting }) => {
              if (taskList.id) {
                createTask({
                  taskListId: taskList.id,
                  task: { title: v.newTaskTitle },
                });
              } else {
                console.error("doesn't have a taskList id");
              }

              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Field
                  component={(p: FieldAttributes<any>) => (
                    <TextField {...p} label={"New Task"} />
                  )}
                  name={"newTaskTitle"}
                  className={classes.addForm}
                />
                <IconButton
                  type={"submit"}
                  size={"small"}
                  disabled={isSubmitting}
                >
                  <AddIcon />
                </IconButton>
              </Form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </ListSubheader>
  );
};
