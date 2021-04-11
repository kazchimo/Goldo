import { Dialog, makeStyles } from "@material-ui/core";
import { TextField } from "formik-material-ui";
import React, { ReactEventHandler } from "react";
import { Field, FieldProps, Form, Formik, FormikHelpers } from "formik";
import { Task } from "../../lib/gapi";

type Props = {
  open: boolean;
  task: Task;
  onBackdropClick: ReactEventHandler<{}>;
};

const useStyles = makeStyles({
  container: {
    width: 300,
    padding: 8,
  },
});

export const TaskEditModal: React.FC<Props> = ({
  open,
  task,
  onBackdropClick,
}) => {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onBackdropClick={onBackdropClick}
      PaperProps={{
        className: classes.container,
      }}
    >
      <Formik initialValues={{ title: task.title }} onSubmit={console.log}>
        {() => (
          <Form>
            <Field component={TextField} name={"title"} />
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};
