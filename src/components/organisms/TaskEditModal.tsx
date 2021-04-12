import { Dialog, makeStyles } from "@material-ui/core";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import React, { ReactEventHandler } from "react";
import * as Yup from "yup";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { TaskView } from "../../lib/taskView/TaskView";
import { tasksActions } from "../../modules/slice/taskSlice";

type Props = {
  open: boolean;
  task: TaskView;
  onBackdropClick: ReactEventHandler<{}>;
};

const useStyles = makeStyles({
  container: {
    width: 300,
    padding: 8,
  },
});

const schema = Yup.object().shape({
  title: Yup.string().required(),
});

export const TaskEditModal: React.FC<Props> = ({
  open,
  task,
  onBackdropClick,
}) => {
  const classes = useStyles();
  const { updateTask } = useBoundActions(tasksActions);

  return (
    <Formik
      initialValues={{ title: task.title }}
      onSubmit={(v, { setSubmitting }) => {
        const updated = { ...task, ...v };
        if (task !== updated) {
          updateTask(updated);
        }
        setSubmitting(false);
      }}
      validationSchema={schema}
    >
      {({ errors, submitForm }) => (
        <Dialog
          open={open}
          onBackdropClick={(e) => {
            submitForm().then(() => {
              if (Object.values(errors).every((e) => !e)) {
                onBackdropClick(e);
              }
            });
          }}
          PaperProps={{
            className: classes.container,
          }}
        >
          <Form>
            <Field component={TextField} name={"title"} />
          </Form>
        </Dialog>
      )}
    </Formik>
  );
};
