import {
  Checkbox,
  Collapse,
  IconButton,
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
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { tasksActions, TaskView } from "../../modules/slice/taskSlice";
import DoneIcon from "@material-ui/icons/Done";

type Props = {
  task: TaskView;
  taskListId: string;
  index: number;
};

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export const TaskListItem: React.FC<Props> = ({ task, index, taskListId }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { completeTask } = useBoundActions(tasksActions);

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
              <IconButton
                size={"small"}
                onClick={() =>
                  completeTask({
                    task,
                    taskListId,
                  })
                }
              >
                <DoneIcon />
              </IconButton>
            </ListItemIcon>
            <ListItemText primary={task.title} />
            {hasChildren && (open ? <ExpandLess /> : <ExpandMore />)}
          </ListItem>
          {hasChildren && (
            <Collapse in={open}>
              <List dense className={classes.nested}>
                {task.children.map((child, idx) => (
                  <TaskListItem
                    task={child}
                    index={idx}
                    key={child.id}
                    taskListId={taskListId}
                  />
                ))}
              </List>
            </Collapse>
          )}
        </>
      )}
    </Draggable>
  );
};
