import {
  Checkbox,
  Collapse,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { TaskView } from "../../modules/slice/taskSlice";

type Props = {
  task: TaskView;
  index: number;
};

export const TaskListItem: React.FC<Props> = ({ task, index }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = task.children.length > 0;

  return (
    <Draggable draggableId={"draggable-" + task.id} index={index}>
      {(provided) => (
        <>
          <ListItem
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={hasChildren ? () => setOpen((a) => !a) : () => {}}
          >
            <ListItemIcon>
              <Checkbox size={"small"} />
            </ListItemIcon>
            <ListItemText primary={task.title} />
            {hasChildren && (open ? <ExpandLess /> : <ExpandMore />)}
          </ListItem>
          {hasChildren && (
            <Collapse in={open}>{task.children.map((t) => t.id)}</Collapse>
          )}
        </>
      )}
    </Draggable>
  );
};
