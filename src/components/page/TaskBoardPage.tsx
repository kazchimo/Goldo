import { makeStyles } from "@material-ui/core";
import React, { createRef, RefObject, useEffect, useRef } from "react";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { taskBoardPageSelector } from "../../modules/selector/taskBoardPageSelector";
import { taskListsSelector } from "../../modules/selector/taskListsSelector";
import { loadingActions } from "../../modules/slice/loadingSlice";
import { taskListActions } from "../../modules/slice/taskListSlice";
import { tasksActions } from "../../modules/slice/taskSlice";
import { TaskBoard } from "../organisms/TaskBoard";
import { TaskListIndex } from "../organisms/TaskListIndex";

const useStyles = makeStyles({
  container: {
    display: "flex",
  },
  boardContainer: {
    marginRight: 8,
    marginLeft: 8,
  },
  index: {
    marginLeft: 32,
  },
});

export const TaskBoardPage: React.FC = () => {
  const { fetchTaskLists, fetchTasks, onLoading, offLoading } = useBoundActions(
    {
      ...tasksActions,
      ...taskListActions,
      ...loadingActions,
    }
  );
  const { taskLists, finishInitialLoading } = useSelectors(
    { ...taskListsSelector, ...taskBoardPageSelector },
    "taskLists",
    "finishInitialLoading"
  );
  const classes = useStyles();
  const refs = useRef<{ [listId: string]: RefObject<HTMLDivElement> }>({});

  taskLists.forEach((list) => {
    refs.current[list.id] = createRef();
  });

  useEffect(() => {
    fetchTaskLists();
    onLoading();
  }, []);

  useEffect(() => {
    if (finishInitialLoading) {
      offLoading();
    }
  }, [finishInitialLoading]);

  useEffect(() => {
    taskLists.forEach((t) => {
      if (t.id) {
        fetchTasks(t.id);
      }
    });
  }, [taskLists]);

  return (
    <div className={classes.container}>
      <div className={classes.index}>
        <TaskListIndex refs={refs} />
      </div>
      {taskLists.map((t) => (
        <div
          key={t.id}
          className={classes.boardContainer}
          ref={refs.current[t.id]}
        >
          <TaskBoard taskList={t} />
        </div>
      ))}
    </div>
  );
};
