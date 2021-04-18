import { List, ListItem, ListItemText, Typography } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { TaskList } from "../../lib/gapi";
import { TaskView } from "../../lib/taskView/TaskView";
import { TaskAddForm } from "./TaskAddForm";
import { TaskListItem } from "./TaskListItem";

type Props = {
  task: TaskView;
  taskList: TaskList;
};

export const TaskModalSubTask: React.FC<Props> = ({ task, taskList }) => {
  return (
    <>
      <Typography>Sub Tasks</Typography>
      <List dense>
        {task.children.map((t, idx) => (
          <TaskListItem key={t.id} task={t} index={idx} taskList={taskList} />
        ))}
        <ListItem>
          <ListItemText inset>
            <TaskAddForm
              taskList={taskList}
              parentId={task.id}
              previous={_.last(task.children)?.id}
            />
          </ListItemText>
        </ListItem>
      </List>
    </>
  );
};
