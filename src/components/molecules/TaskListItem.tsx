import {
  Collapse,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Paper,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import _ from "lodash";
import React, { memo, useCallback, useState } from "react";
import { DraggableProvided } from "react-beautiful-dnd";
import { TaskList } from "../../lib/gapi";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { TaskView } from "../../lib/taskView/TaskView";
import { tasksActions } from "../../modules/slice/taskSlice";
import { TaskCompleteButton } from "../atoms/TaskCompleteButton";
import { TaskListItemText } from "../atoms/TaskListItemText";
import { TaskEditModal } from "../organisms/TaskEditModal";
import { TaskListItemMetas } from "./TaskListItemMetas";

type Props = {
  task: TaskView;
  taskList: TaskList;
  showListName?: boolean;
  invertColor?: boolean;
  innerRef?: DraggableProvided["innerRef"];
};

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
  secondaryText: {
    overflowWrap: "anywhere",
  },
  paper: {
    backgroundColor: (props: { onMouseOver: boolean; invertColor?: boolean }) =>
      !props.invertColor
        ? props.onMouseOver
          ? theme.palette.background.default
          : theme.palette.background.paper
        : props.onMouseOver
        ? theme.palette.background.paper
        : theme.palette.background.default,
  },
}));

export const TaskListItem: React.FC<Props> = memo(
  ({ task, taskList, showListName, invertColor, innerRef }) => {
    const [openSubtask, setOpenSubtask] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const { completeTask } = useBoundActions(tasksActions);
    const [mouseEnter, setMouseEnter] = useState(false);
    const classes = useStyles({ onMouseOver: mouseEnter, invertColor });

    const hasChildren = task.children.length > 0;

    const finishTask = useCallback(() => {
      completeTask(task);
    }, [task]);

    return (
      <Paper className={classes.paper} elevation={0} square ref={innerRef}>
        <TaskEditModal
          taskList={taskList}
          open={openEditModal}
          task={task}
          onBackdropClick={() => setOpenEditModal(false)}
        />
        <ListItem
          onMouseEnter={() => setMouseEnter(true)}
          onMouseLeave={() => setMouseEnter(false)}
        >
          <ListItemIcon>
            <TaskCompleteButton onClick={finishTask} />
          </ListItemIcon>
          <Grid container alignItems={"center"}>
            <Grid item xs={11}>
              <ListItemText
                secondary={task.notes}
                secondaryTypographyProps={{
                  className: classes.secondaryText,
                }}
              >
                <TaskListItemText task={task} />
                <TaskListItemMetas
                  task={task}
                  taskList={taskList}
                  showListName={showListName}
                />
              </ListItemText>
            </Grid>
            <Grid item xs={1} style={{ textAlign: "center" }}>
              {mouseEnter && (
                <IconButton
                  size={"small"}
                  onClick={() => setOpenEditModal(true)}
                >
                  <EditIcon fontSize={"small"} />
                </IconButton>
              )}
            </Grid>
          </Grid>
          {hasChildren && (
            <IconButton
              size={"small"}
              onClick={() => setOpenSubtask((a) => !a)}
            >
              {openSubtask ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
        </ListItem>
        {hasChildren && (
          <Collapse in={openSubtask}>
            {openSubtask && (
              <List dense className={classes.nested}>
                {task.children.map((child, idx) => (
                  <TaskListItem
                    task={child}
                    key={child.id}
                    taskList={taskList}
                  />
                ))}
              </List>
            )}
          </Collapse>
        )}
      </Paper>
    );
  },
  (a, b) =>
    a.taskList === b.taskList &&
    _.isEqual(a.task.children, b.task.children) &&
    a.task.title === b.task.title &&
    a.task.parent === b.task.parent &&
    a.task.notes === b.task.notes &&
    a.task.due === b.task.due
);
