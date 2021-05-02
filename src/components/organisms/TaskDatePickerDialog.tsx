import { Dialog } from "@material-ui/core";
import "date-fns";
import { parseISO } from "date-fns";
import { Formik } from "formik";
import React from "react";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { TaskView } from "../../lib/taskView/TaskView";
import { tasksActions } from "../../modules/slice/taskSlice";
import { TaskModalDueField } from "../atoms/TaskModalDueField";

type Props = {
  task: TaskView;
  open: boolean;
  close: () => void;
};

export const TaskDatePickerDialog: React.FC<Props> = ({
  task,
  open,
  close,
}) => {
  const { updateTask } = useBoundActions(tasksActions);

  return (
    <Formik
      initialValues={{ due: task.due ? parseISO(task.due) : undefined }}
      onSubmit={(v) => {
        updateTask({
          task: { ...task, due: v.due?.toISOString() },
          taskId: task.id,
          listId: task.listId,
        });
      }}
    >
      {({ setFieldValue, dirty, submitForm }) => (
        <Dialog
          open={open}
          onBackdropClick={() => {
            close();
            if (dirty) {
              submitForm().catch((v) => console.error(v));
            }
          }}
        >
          <TaskModalDueField setFieldValue={setFieldValue} />
        </Dialog>
      )}
    </Formik>
  );
};
