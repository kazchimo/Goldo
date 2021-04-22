import { Button, IconButton } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import EventNoteIcon from "@material-ui/icons/EventNote";
import { differenceInCalendarDays, parseISO } from "date-fns";
import React, { useCallback, useState } from "react";
import { DueTaskView } from "../../lib/gapi";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { tasksActions } from "../../modules/slice/taskSlice";
import { TaskDatePickerDialog } from "../organisms/TaskDatePickerDialog";

type Props = {
  task: DueTaskView;
};

const dayString = (day: number) => {
  switch (day) {
    case 0:
      return "Today";
    case 1:
      return "Tomorrow";
    case -1:
      return "Yesterday";
    default:
      if (day > 0) {
        return `In ${day} days`;
      } else {
        return `${-day} days ago`;
      }
  }
};

export const TaskDue: React.FC<Props> = ({ task }) => {
  const diff = differenceInCalendarDays(parseISO(task.due), new Date());
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const enter = () => setHover(true);
  const leave = () => setHover(false);
  const { updateTask } = useBoundActions(tasksActions);

  const openPicker = useCallback(() => setOpen(true), [setOpen]);
  const closePicker = useCallback(() => setOpen(false), [setOpen]);
  const color = diff === 0 ? "primary" : diff >= 1 ? "inherit" : "secondary";

  return (
    <div onMouseEnter={enter} onMouseLeave={leave}>
      <TaskDatePickerDialog task={task} open={open} close={closePicker} />
      <Button
        onClick={openPicker}
        style={{ padding: 2, textTransform: "none" }}
        size={"small"}
        color={color}
        startIcon={<EventNoteIcon fontSize={"small"} color={color} />}
      >
        {dayString(diff)}
      </Button>
      {hover && (
        <IconButton
          size={"small"}
          onClick={() =>
            updateTask({
              task: { ...task, due: undefined },
              taskId: task.id,
              listId: task.listId,
            })
          }
        >
          <ClearIcon fontSize={"small"} />
        </IconButton>
      )}
    </div>
  );
};
