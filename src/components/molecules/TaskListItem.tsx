import {
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Task } from "../../lib/gapi";

type Props = {
  task: Task;
  index: number;
};

export const TaskListItem: React.FC<Props> = ({ task, index }) => {
  return (
    <Draggable draggableId={"draggable-" + task.id} index={index}>
      {(provided) => (
        <ListItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <ListItemIcon>
            <Checkbox />
          </ListItemIcon>
          <ListItemText primary={task.title} />
        </ListItem>
      )}
    </Draggable>
  );
};
