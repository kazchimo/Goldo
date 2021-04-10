import { Grid, makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { taskListsSelector } from "../../modules/selector/taskListsSelector";
import { taskListActions } from "../../modules/slice/taskListSlice";
import { tasksActions } from "../../modules/slice/taskSlice";
import { TaskBoard } from "../organisms/TaskBoard";

const useStyles = makeStyles({
  container: {
    display: "flex",
  },
  boardContainer: {
    marginRight: 8,
    marginLeft: 8,
  },
});

export const TaskBoardPage: React.FC = () => {
  const { fetchTaskLists, fetchTasks } = useBoundActions({
    ...tasksActions,
    ...taskListActions,
  });
  const { taskLists } = useSelectors(taskListsSelector, "taskLists");
  const classes = useStyles();

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
    <div className={classes.container}>
      {taskLists.map((t) => (
        <div className={classes.boardContainer}>
          <TaskBoard key={t.id} taskList={t} />
        </div>
      ))}
    </div>
  );
};
