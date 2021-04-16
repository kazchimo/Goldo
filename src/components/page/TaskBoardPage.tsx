import { makeStyles } from "@material-ui/core";
import React, { createRef, RefObject, useRef } from "react";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { taskListsSelector } from "../../modules/selector/taskListsSelector";
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
});

export const TaskBoardPage: React.FC = () => {
  const { taskLists } = useSelectors({ ...taskListsSelector }, "taskLists");
  const classes = useStyles();
  const refs = useRef<{ [listId: string]: RefObject<HTMLDivElement> }>({});

  taskLists.forEach((list) => {
    refs.current[list.id] = createRef();
  });

  return (
    <div className={classes.container}>
      <div>
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
