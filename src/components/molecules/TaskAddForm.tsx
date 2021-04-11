import { IconButton, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Field, FieldProps, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import React from "react";
import { TaskList } from "../../lib/gapi";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { tasksActions } from "../../modules/slice/taskSlice";
import * as Yup from "yup";

type Props = {
  taskList: TaskList;
};

const useStyles = makeStyles({
  addForm: {
    marginRight: 8,
  },
});

const schema = Yup.object().shape({
  title: Yup.string().required(),
});

export const TaskAddForm: React.FC<Props> = ({ taskList }) => {
  const { createTask } = useBoundActions(tasksActions);
  const classes = useStyles();

  return (
    <Formik
      initialValues={{ newTaskTitle: "" }}
      validationSchema={schema}
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
            render={(props: FieldProps) => (
              <TextField
                {...props}
                label={"New Task"}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <IconButton
                      type={"submit"}
                      size={"small"}
                      disabled={isSubmitting}
                    >
                      <AddIcon />
                    </IconButton>
                  ),
                }}
              />
            )}
            name={"title"}
            className={classes.addForm}
          />
        </Form>
      )}
    </Formik>
  );
};
