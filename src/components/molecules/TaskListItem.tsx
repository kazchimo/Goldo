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
import React, { memo } from "react";
import { TaskList } from "../../lib/gapi";
import { useBool } from "../../lib/hooks/useBool";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { TaskView } from "../../lib/taskView/TaskView";
import { appSelector } from "../../modules/selector/appSelector";
import { appActions } from "../../modules/slice/appSlice";
import { TaskCompleteButton } from "../atoms/TaskCompleteButton";
import { TaskListItemText } from "../atoms/TaskListItemText";
import { TaskEditModal } from "../organisms/TaskEditModal";
import { TaskListItemMetas } from "./TaskListItemMetas";

type Props = {
  task: TaskView;
  taskList: TaskList;
  showListName?: boolean;
  invertColor?: boolean;
  hoverComplete?: boolean;
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
  ({ task, taskList, showListName, invertColor, hoverComplete }) => {
    const [openEditModal, openModal, closeModal] = useBool();
    const [mouseEnter, onMouseEnter, onMouseLeave] = useBool();
    const [
      isCompleteHover,
      isCompleteHoverToTrue,
      isCompleteHoverToFalse,
    ] = useBool();
    const { openTasks } = useSelectors(appSelector, "openTasks");
    const { invertOpenTask } = useBoundActions(appActions);
    const classes = useStyles({ onMouseOver: mouseEnter, invertColor });

    const open = (openTasks[taskList.id] || []).includes(task.id);

    const hasChildren = task.children.length > 0;

    return (
      <Paper className={classes.paper} elevation={0} square>
        <TaskEditModal
          taskList={taskList}
          open={openEditModal}
          task={task}
          onBackdropClick={closeModal}
        />
        <ListItem onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <ListItemIcon>
            <TaskCompleteButton
              task={task}
              isHover={hoverComplete}
              onHoverOut={isCompleteHoverToFalse}
              onHover={isCompleteHoverToTrue}
            />
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
                <IconButton size={"small"} onClick={openModal}>
                  <EditIcon fontSize={"small"} />
                </IconButton>
              )}
            </Grid>
          </Grid>
          {hasChildren && (
            <IconButton size={"small"} onClick={() => invertOpenTask(task)}>
              {open ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
        </ListItem>
        {hasChildren && (
          <Collapse in={open}>
            {open && (
              <List dense className={classes.nested}>
                {task.children.map((child) => (
                  <TaskListItem
                    hoverComplete={isCompleteHover}
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
    a.task.due === b.task.due &&
    a.hoverComplete === b.hoverComplete
);
