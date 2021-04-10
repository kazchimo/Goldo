import {
  Checkbox,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { TaskView } from "../../modules/slice/taskSlice";

type Props = {
  task: TaskView;
  index: number;
};

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export const TaskListItem: React.FC<Props> = ({ task, index }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = task.children.length > 0;
  const classes = useStyles();

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
            <Collapse in={open}>
              <List dense className={classes.nested}>
                {task.children.map((child, idx) => (
                  <TaskListItem task={child} index={idx} key={child.id} />
                ))}
              </List>
            </Collapse>
          )}
        </>
      )}
    </Draggable>
  );
};
