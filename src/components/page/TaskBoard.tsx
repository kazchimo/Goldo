import React, { useEffect } from "react";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { taskListsSelector } from "../../modules/selector/taskListsSelector";
import { taskListActions } from "../../modules/slice/taskListSlice";
import { tasksActions } from "../../modules/slice/taskSlice";

export const TaskBoard: React.FC = () => {
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
      fetchTasks(t.id);
    });
  }, [taskLists]);

  return (
    <div>
      {taskLists.map((t) => (
        <p>{t.title}</p>
      ))}
    </div>
  );
};
