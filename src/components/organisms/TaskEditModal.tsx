import { Dialog, Grid, makeStyles } from "@material-ui/core";
import { parseISO } from "date-fns";
import { Field, FieldProps, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import { DatePicker } from "formik-material-ui-pickers";
import React, { ReactEventHandler } from "react";
import * as Yup from "yup";
import { TaskList } from "../../lib/gapi";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { TaskView } from "../../lib/taskView/TaskView";
import { tasksActions } from "../../modules/slice/taskSlice";
import { DeleteTaskButton } from "../atoms/DeleteTaskButton";
import { TaskModalSubTask } from "../molecules/TaskModalSubTask";

type Props = {
  open: boolean;
  task: TaskView;
  onBackdropClick: ReactEventHandler<{}>;
  taskList: TaskList;
};

const useStyles = makeStyles({
  container: {
    padding: 16,
  },
  taskForm: {
    marginBottom: 32,
  },
});

const schema = Yup.object().shape({
  title: Yup.string().required(),
});

export const TaskEditModal: React.FC<Props> = ({
  open,
  task,
  onBackdropClick,
  taskList,
}) => {
  const classes = useStyles();
  const { updateTask } = useBoundActions(tasksActions);

  return (
    <Formik
      initialValues={{
        title: task.title,
        notes: task.notes,
        due: task.due ? parseISO(task.due) : undefined,
      }}
      onSubmit={(v, { setSubmitting }) => {
        const updated = { ...task, ...v, due: v.due?.toISOString() };
        updateTask(updated);
        setSubmitting(false);
      }}
      validationSchema={schema}
    >
      {({ errors, submitForm, setFieldValue, dirty }) => (
        <Dialog
          open={open}
          onBackdropClick={(e) => {
            if (dirty) {
              submitForm().then(() => {
                if (Object.values(errors).every((e) => !e)) {
                  onBackdropClick(e);
                }
              });
            } else {
              onBackdropClick(e);
            }
          }}
          PaperProps={{
            className: classes.container,
          }}
        >
          <Form className={classes.taskForm}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <DeleteTaskButton task={task} />
              </Grid>
              <Grid item>
                <Field name={"title"}>
                  {(props: FieldProps) => (
                    <TextField
                      {...props}
                      label={"title"}
                      multiline
                      fullWidth
                      variant={"outlined"}
                    />
                  )}
                </Field>{" "}
              </Grid>
              <Grid item>
                <Field name={"notes"}>
                  {(props: FieldProps) => (
                    <TextField
                      {...props}
                      label={"detail"}
                      multiline
                      fullWidth
                      variant={"outlined"}
                      rows={2}
                    />
                  )}
                </Field>
              </Grid>
              <Grid item>
                <Field name={"due"} label={"Due"}>
                  {(props: FieldProps) => (
                    <DatePicker
                      {...props}
                      onChange={(v) => setFieldValue("due", v)}
                      disablePast
                      disableToolbar
                      variant={"static"}
                    />
                  )}
                </Field>
              </Grid>
            </Grid>
          </Form>
          <TaskModalSubTask task={task} taskList={taskList} />
        </Dialog>
      )}
    </Formik>
  );
};
