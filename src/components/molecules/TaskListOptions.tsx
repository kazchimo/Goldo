import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useConfirm } from "material-ui-confirm";
import React from "react";
import { TaskList } from "../../lib/gapi";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { taskListActions } from "../../modules/slice/taskListSlice";

type Props = {
  taskList: TaskList;
};

export const TaskListOptions: React.FC<Props> = ({ taskList }) => {
  const { deleteTaskList } = useBoundActions(taskListActions);
  const confirm = useConfirm();

  const deleteList = () =>
    confirm({ title: "Really want to delete ?" }).then(
      () => taskList.id && deleteTaskList(taskList.id)
    );

  return (
    <List dense>
      <ListItem button onClick={deleteList}>
        <ListItemIcon>
          <DeleteIcon fontSize={"small"} />
        </ListItemIcon>
        <ListItemText primary={"delte task list"} />
      </ListItem>
    </List>
  );
};
