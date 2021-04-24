import { Button, IconButton } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import EventNoteIcon from "@material-ui/icons/EventNote";
import { differenceInCalendarDays, parseISO } from "date-fns";
import React from "react";
import { DueTaskView } from "../../lib/gapi";
import { useBool } from "../../lib/hooks/useBool";
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
  const [open, openPicker, closePicker] = useBool();
  const [mouseEnter, onMouseEnter, onMouseLeave] = useBool();
  const { updateTask } = useBoundActions(tasksActions);

  const color = diff === 0 ? "primary" : diff >= 1 ? "inherit" : "secondary";

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
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
      {mouseEnter && (
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
