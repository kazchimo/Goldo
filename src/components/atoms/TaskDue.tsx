import { Button, IconButton } from "@material-ui/core";
import EventNoteIcon from "@material-ui/icons/EventNote";
import { differenceInCalendarDays, parseISO } from "date-fns";
import React, { useCallback, useState } from "react";
import { DueTaskView } from "../../lib/gapi";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { tasksActions } from "../../modules/slice/taskSlice";
import { TaskDatePickerDialog } from "../organisms/TaskDatePickerDialog";
import ClearIcon from "@material-ui/icons/Clear";

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

  return (
    <>
      <TaskDatePickerDialog task={task} open={open} close={closePicker} />
      <Button
        onMouseEnter={enter}
        onMouseLeave={leave}
        onClick={openPicker}
        style={{ padding: 2, textTransform: "none" }}
        size={"small"}
        color={diff >= 0 ? "primary" : "secondary"}
        startIcon={
          <EventNoteIcon
            fontSize={"small"}
            color={diff >= 0 ? "primary" : "secondary"}
          />
        }
      >
        {dayString(diff)}
      </Button>
      {hover && (
        <IconButton
          size={"small"}
          onClick={() => updateTask({ ...task, due: undefined })}
        >
          <ClearIcon fontSize={"small"} />
        </IconButton>
      )}
    </>
  );
};
