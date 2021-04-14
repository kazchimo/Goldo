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
import { TaskCompleteButton } from "../atoms/TaskCompleteButton";
import { TaskDue } from "../atoms/TaskDue";
import { TaskEditModal } from "../organisms/TaskEditModal";

type Props = {
  task: TaskView;
  taskListId: string;
  index: number;
};

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
  secondaryText: {
    overflowWrap: "anywhere",
  },
}));

export const TaskListItem: React.FC<Props> = ({ task, index, taskListId }) => {
  const [openSubtask, setOpenSubtask] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
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
          <TaskEditModal
            open={openEditModal}
            task={task}
            onBackdropClick={() => setOpenEditModal(false)}
          />
          <ListItem
            onMouseEnter={() => setMouseEnter(true)}
            onMouseLeave={() => setMouseEnter(false)}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={hasChildren ? () => setOpenSubtask((a) => !a) : () => {}}
          >
            <ListItemIcon>
              <TaskCompleteButton onClick={finishTask} />
            </ListItemIcon>
            <ListItemText
              secondary={task.notes}
              secondaryTypographyProps={{ className: classes.secondaryText }}
            >
              {task.title}
              {task.due && <TaskDue due={task.due} />}
            </ListItemText>
            {mouseEnter && (
              <IconButton size={"small"} onClick={() => setOpenEditModal(true)}>
                <EditIcon fontSize={"small"} />
              </IconButton>
            )}
            {hasChildren && (
              <IconButton size={"small"}>
                {openSubtask ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
          </ListItem>
          {hasChildren && (
            <Collapse in={openSubtask}>
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
