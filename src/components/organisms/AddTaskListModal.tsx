import {
  Button,
  Dialog,
  DialogTitle,
  Grid,
  makeStyles,
} from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import React, { VFC } from "react";
import * as Yup from "yup";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { taskListActions } from "../../modules/slice/taskListSlice";

type Props = {
  open: boolean;
  close: () => void;
};

const useStyles = makeStyles((theme) => ({
  dialog: {
    padding: theme.spacing(2),
  },
  buttonContainer: {
    textAlign: "end",
  },
}));

const schema = Yup.object().shape({
  title: Yup.string().required(),
});

export const AddTaskListModal: VFC<Props> = ({ open, close }) => {
  const { createTaskList } = useBoundActions(taskListActions);
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onBackdropClick={close}
      PaperProps={{
        className: classes.dialog,
      }}
    >
      <DialogTitle>Add New Task List</DialogTitle>
      <Formik
        initialValues={{ title: "" }}
        onSubmit={(v, { setSubmitting }) => {
          setSubmitting(false);
          createTaskList(v.title);
          close();
        }}
        validationSchema={schema}
      >
        {() => (
          <Grid component={Form} container spacing={2}>
            <Grid item xs={12}>
              <Field component={TextField} name={"title"} fullWidth />
            </Grid>
            <Grid item xs={12} className={classes.buttonContainer}>
              <Button type={"submit"} variant={"outlined"} color="primary">
                Add
              </Button>
            </Grid>
          </Grid>
        )}
      </Formik>
    </Dialog>
  );
};
