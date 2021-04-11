import {
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import React, { useCallback, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { useSnack } from "../../lib/hooks/useSnack";
import { TaskView } from "../../lib/taskView/TaskView";
import { tasksActions } from "../../modules/slice/taskSlice";
import EditIcon from "@material-ui/icons/Edit";

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
  const { successSnack } = useSnack();
  const [mouseEnter, setMouseEnter] = useState(false);

  const hasChildren = task.children.length > 0;

  const finishTask = useCallback(() => {
    successSnack("Complete Task");
    task.id && completeTask({ taskId: task.id, taskListId });
  }, [successSnack]);

  return (
    <Draggable draggableId={"draggable-" + task.id} index={index}>
      {(provided) => (
        <>
          <ListItem
            onMouseEnter={() => setMouseEnter(true)}
            onMouseLeave={() => setMouseEnter(false)}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={hasChildren ? () => setOpen((a) => !a) : () => {}}
          >
            <ListItemIcon>
              <IconButton size={"small"} onClick={finishTask}>
                <DoneIcon fontSize={"small"} />
              </IconButton>
            </ListItemIcon>
            <ListItemText primary={task.title} />
            {mouseEnter && (
              <IconButton size={"small"}>
                <EditIcon fontSize={"small"} />
              </IconButton>
            )}
            {hasChildren && (
              <IconButton size={"small"}>
                {open ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
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
