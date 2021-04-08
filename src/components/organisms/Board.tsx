import { Paper } from "@material-ui/core";
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { TaskList } from "../../lib/gapi";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { tasksSelector } from "../../modules/selector/taskSelector";

type Props = {
  taskList: TaskList;
};

export const TaskBoard: React.FC<Props> = ({ taskList }) => {
  const { tasksByListId } = useSelectors(tasksSelector, "tasksByListId");

  const tasks = (taskList.id && tasksByListId[taskList.id]) || [];

  return (
    <Droppable droppableId={"taskBoard"}>
      {(provided) => (
        <Paper ref={provided.innerRef} {...provided.droppableProps}>
          {taskList.title}
          {tasks.map((t) => (
            <p>{t.title}</p>
          ))}
        </Paper>
      )}
    </Droppable>
  );
};
