import {
  Checkbox,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  makeStyles,
  Paper,
} from "@material-ui/core";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { TaskList } from "../../lib/gapi";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { tasksSelector } from "../../modules/selector/taskSelector";

type Props = {
  taskList: TaskList;
};

const useStyles = makeStyles((theme) => ({
  board: {
    maxHeight: 800,
    width: 300,
    overflow: "auto",
  },
  subHeader: {
    backgroundColor: theme.palette.background.paper,
  },
}));

export const TaskBoard: React.FC<Props> = ({ taskList }) => {
  const { tasksByListId } = useSelectors(tasksSelector, "tasksByListId");
  const classes = useStyles();

  const tasks = (taskList.id && tasksByListId[taskList.id]) || [];

  return (
    <Droppable droppableId={"taskBoard-" + taskList.id}>
      {(provided) => (
        <Paper className={classes.board} elevation={0} variant={"outlined"}>
          <List
            ref={provided.innerRef}
            {...provided.droppableProps}
            subheader={
              <ListSubheader className={classes.subHeader}>
                {taskList.title}
              </ListSubheader>
            }
          >
            {provided.placeholder}
            {tasks.map((t, idx) => (
              <Draggable draggableId={"draggable-" + t.id} index={idx}>
                {(provided) => (
                  <ListItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <ListItemIcon>
                      <Checkbox />
                    </ListItemIcon>
                    <ListItemText primary={t.title} />
                  </ListItem>
                )}
              </Draggable>
            ))}
          </List>
        </Paper>
      )}
    </Droppable>
  );
};
