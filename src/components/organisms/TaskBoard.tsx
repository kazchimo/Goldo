import { List, makeStyles, Paper } from "@material-ui/core";
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { TaskList, taskListHasId } from "../../lib/gapi";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { tasksSelector } from "../../modules/selector/taskSelector";
import { TaskListHeader } from "../molecules/TaskListHeader";
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
}));

export const TaskBoard: React.FC<Props> = ({ taskList }) => {
  const { tasksByListId } = useSelectors(tasksSelector, "tasksByListId");
  const classes = useStyles();

  const tasks = (taskList.id && tasksByListId[taskList.id]) || [];

  return (
    <>
      {taskListHasId(taskList) && (
        <Droppable droppableId={"taskBoard-" + taskList.id}>
          {(provided) => (
            <Paper className={classes.board} elevation={0} variant={"outlined"}>
              <List
                ref={provided.innerRef}
                {...provided.droppableProps}
                subheader={<TaskListHeader taskList={taskList} />}
                dense
              >
                {provided.placeholder}
                {tasks.map((t, idx) => (
                  <TaskListItem
                    key={t.id}
                    task={t}
                    index={idx}
                    taskListId={taskList.id}
                  />
                ))}
              </List>
            </Paper>
          )}
        </Droppable>
      )}
    </>
  );
};
