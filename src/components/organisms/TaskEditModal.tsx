import {
  Dialog,
  Grid,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { parseISO } from "date-fns";
import { DatePicker } from "formik-material-ui-pickers";
import { Field, FieldProps, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import _ from "lodash";
import React, { ReactEventHandler } from "react";
import * as Yup from "yup";
import { TaskList } from "../../lib/gapi";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { TaskView } from "../../lib/taskView/TaskView";
import { tasksActions } from "../../modules/slice/taskSlice";
import { DeleteTaskButton } from "../atoms/DeleteTaskButton";
import { TaskAddForm } from "../molecules/TaskAddForm";
import { TaskListItem } from "../molecules/TaskListItem";

type Props = {
  open: boolean;
  task: TaskView;
  onBackdropClick: ReactEventHandler<{}>;
  taskList: TaskList;
};

const useStyles = makeStyles({
  container: {
    width: 300,
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
        const equal =
          task.title === updated.title &&
          task.notes === updated.notes &&
          task.due === updated.due;
        if (!equal) {
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
                </Field>
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
                <Field component={DatePicker} name={"due"} />
              </Grid>
            </Grid>
          </Form>
          <Typography>Sub Tasks</Typography>
          <List dense>
            {task.children.map((t, idx) => (
              <TaskListItem
                key={t.id}
                task={t}
                index={idx}
                taskList={taskList}
              />
            ))}
            <ListItem>
              <ListItemText inset>
                <TaskAddForm
                  taskList={taskList}
                  parentId={task.id}
                  previous={_.last(task.children)?.id}
                />
              </ListItemText>
            </ListItem>
          </List>
        </Dialog>
      )}
    </Formik>
  );
};
