import { IconButton, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Field, FieldProps, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import React, { useCallback } from "react";
import * as Yup from "yup";
import { TaskList } from "../../lib/gapi";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { tasksActions } from "../../modules/slice/taskSlice";

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

type Values = {
  title: string;
};

export const TaskAddForm: React.FC<Props> = ({ taskList }) => {
  const { createTask } = useBoundActions(tasksActions);
  const classes = useStyles();

  const submit = useCallback(
    (v: Values, { setSubmitting, resetForm }: FormikHelpers<Values>) => {
      if (taskList.id) {
        resetForm();
        createTask({
          task: { title: v.title, listId: taskList.id },
        });
      } else {
        console.error("doesn't have a taskList id");
      }

      setSubmitting(false);
    },
    [taskList, createTask]
  );

  return (
    <Formik
      initialValues={{ title: "" }}
      validationSchema={schema}
      onSubmit={submit}
    >
      {({ isSubmitting, setErrors }) => (
        <Form>
          <Field
            render={(props: FieldProps) => (
              <TextField
                {...props}
                label={"New Task"}
                fullWidth
                onBlur={() => setErrors({ title: "" })}
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
