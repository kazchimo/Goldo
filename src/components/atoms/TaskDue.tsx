import { Button } from "@material-ui/core";
import EventNoteIcon from "@material-ui/icons/EventNote";
import { differenceInCalendarDays, parseISO } from "date-fns";
import React, { useCallback, useState } from "react";
import { DueTaskView } from "../../lib/gapi";
import { TaskDatePicker } from "../organisms/TaskDatePicker";

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

  const openPicker = useCallback(() => setOpen(true), [setOpen]);
  const closePicker = useCallback(() => setOpen(false), [setOpen]);

  return (
    <div>
      <TaskDatePicker task={task} open={open} close={closePicker} />
      <Button
        onClick={openPicker}
        style={{ maxWidth: "fit-content", padding: 2 }}
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
    </div>
  );
};
