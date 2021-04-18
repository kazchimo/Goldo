import { Field, FieldProps, Form, Formik } from "formik";
import { InputBase } from "formik-material-ui";
import React from "react";
import * as Yup from "yup";
import { Task } from "../../lib/gapi";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { tasksActions } from "../../modules/slice/taskSlice";

type Props = {
  task: Task;
};

const schema = Yup.object().shape({
  title: Yup.string().required(),
});

export const TaskListItemText: React.FC<Props> = ({ task }) => {
  const { updateTask } = useBoundActions(tasksActions);

  return (
    <Formik
      initialValues={{ title: task.title }}
      validationSchema={schema}
      onSubmit={(v, { setSubmitting }) => {
        if (task.title !== v.title) {
          updateTask({
            task: { ...task, title: v.title },
            taskId: task.id,
            listId: task.listId,
          });
        }
        setSubmitting(false);
      }}
    >
      {({ submitForm }) => (
        <Form>
          <Field name={"title"}>
            {(props: FieldProps) => (
              <InputBase
                {...props}
                onBlur={submitForm}
                margin={"dense"}
                fullWidth
                multiline
                style={{ padding: "inherit" }}
                inputProps={{
                  style: { fontSize: "small" },
                }}
              />
            )}
          </Field>
        </Form>
      )}
    </Formik>
  );
};
