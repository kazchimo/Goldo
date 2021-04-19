import { Divider, List, ListSubheader, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { useParams } from "react-router-dom";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { taskListsSelector } from "../../modules/selector/taskListsSelector";
import { tasksSelector } from "../../modules/selector/taskSelector";
import { TaskAddForm } from "../molecules/TaskAddForm";
import { TaskListItem } from "../molecules/TaskListItem";

const useStyles = makeStyles((theme) => ({
  paper: {
    maxWidth: 800,
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

export const TaskListPage: React.FC = () => {
  const { taskListEntities, tasksViewByListId } = useSelectors(
    { ...taskListsSelector, ...tasksSelector },
    "taskListEntities",
    "tasksViewByListId"
  );
  const { listId } = useParams<{ listId: string }>();
  const classes = useStyles();

  const taskList = taskListEntities[listId];
  const tasks = tasksViewByListId[listId] || [];

  return (
    <>
      {taskList && (
        <Paper className={classes.paper}>
          <List
            subheader={
              <ListSubheader>
                {taskList.title}
                <TaskAddForm taskList={taskList} />
              </ListSubheader>
            }
          >
            {tasks.map((task, i) => (
              <TaskListItem
                task={task}
                taskList={taskList}
                index={i}
                key={task.id}
              />
            ))}
          </List>
        </Paper>
      )}
    </>
  );
};
