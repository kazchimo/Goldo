import { Dialog } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import "date-fns";
import { parseISO } from "date-fns";
import React, { useState } from "react";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { TaskView } from "../../lib/taskView/TaskView";
import { tasksActions } from "../../modules/slice/taskSlice";

type Props = {
  task: TaskView;
  open: boolean;
  close: () => void;
};

export const TaskDatePicker: React.FC<Props> = ({ task, open, close }) => {
  const [due, setDue] = useState<Date | null>(
    task.due ? parseISO(task.due) : null
  );
  const { updateTask } = useBoundActions(tasksActions);

  return (
    <Dialog
      open={open}
      onBackdropClick={() => {
        close();
        if (due?.toISOString() !== task.due) {
          updateTask({ ...task, due: due?.toISOString() });
        }
      }}
    >
      <DatePicker onChange={(d) => setDue(d)} value={due} variant={"static"} />
    </Dialog>
  );
};
