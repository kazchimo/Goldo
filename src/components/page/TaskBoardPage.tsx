import React, { useEffect } from "react";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { taskListsSelector } from "../../modules/selector/taskListsSelector";
import { taskListActions } from "../../modules/slice/taskListSlice";
import { tasksActions } from "../../modules/slice/taskSlice";
import { TaskBoard } from "../organisms/Board";

export const TaskBoardPage: React.FC = () => {
  const { fetchTaskLists, fetchTasks } = useBoundActions({
    ...tasksActions,
    ...taskListActions,
  });
  const { taskLists } = useSelectors(taskListsSelector, "taskLists");

  useEffect(() => {
    fetchTaskLists();
  }, []);

  useEffect(() => {
    taskLists.forEach((t) => {
      if (t.id) {
        fetchTasks(t.id);
      }
    });
  }, [taskLists]);

  return (
    <div>
      {taskLists.map((t) => (
        <TaskBoard key={t.id} taskList={t} />
      ))}
    </div>
  );
};
