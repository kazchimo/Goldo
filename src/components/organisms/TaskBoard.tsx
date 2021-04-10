import { List, ListSubheader, makeStyles, Paper } from "@material-ui/core";
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { TaskList } from "../../lib/gapi";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { tasksSelector } from "../../modules/selector/taskSelector";
import { TaskListItem } from "../molecules/TaskListItem";

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
              <TaskListItem task={t} index={idx} />
            ))}
          </List>
        </Paper>
      )}
    </Droppable>
  );
};
