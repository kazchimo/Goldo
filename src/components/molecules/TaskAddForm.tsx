import { IconButton, makeStyles } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Field, FieldProps, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import React, { useCallback, useRef } from "react";
import * as Yup from "yup";
import { TaskList } from "../../lib/gapi";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { tasksActions } from "../../modules/slice/taskSlice";

type Props = {
  taskList: TaskList;
  parentId?: string;
  previous?: string;
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

export const TaskAddForm: React.FC<Props> = ({
  taskList,
  parentId,
  previous,
}) => {
  const { createTask } = useBoundActions(tasksActions);
  const classes = useStyles();
  const ref = useRef<HTMLInputElement | null>(null);

  const submit = useCallback(
    (v: Values, { setSubmitting, resetForm }: FormikHelpers<Values>) => {
      resetForm();
      createTask({
        task: {
          title: v.title,
          listId: taskList.id,
          parent: parentId,
        },
        previous,
      });

      setSubmitting(false);
      ref.current?.focus();
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
          <Field name={"title"} className={classes.addForm}>
            {(props: FieldProps) => (
              <TextField
                {...props}
                placeholder={"New Task"}
                fullWidth
                inputRef={ref}
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
          </Field>
        </Form>
      )}
    </Formik>
  );
};
