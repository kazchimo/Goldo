import { Form, Formik, Field, FieldProps } from "formik";
import { InputBase } from "formik-material-ui";
import * as Yup from "yup";
import React from "react";
import { TaskList } from "../../lib/gapi";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { taskListActions } from "../../modules/slice/taskListSlice";

type Props = {
  taskList: TaskList;
};

const schema = Yup.object().shape({
  title: Yup.string().required(),
});

export const TaskListTitleForm: React.FC<Props> = ({ taskList }) => {
  const { updateList } = useBoundActions(taskListActions);

  return (
    <Formik
      initialValues={{ title: taskList.title }}
      validationSchema={schema}
      onSubmit={(v, { setSubmitting }) => {
        if (taskList.title !== v.title) {
          updateList({ ...taskList, title: v.title });
        }
        setSubmitting(false);
      }}
    >
      {({ submitForm }) => (
        <Form>
          <Field name={"title"}>
            {(props: FieldProps) => (
              <InputBase {...props} onBlur={submitForm} />
            )}
          </Field>
        </Form>
      )}
    </Formik>
  );
};
