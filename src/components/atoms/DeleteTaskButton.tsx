import { Grid, IconButton, Tooltip } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { useConfirm } from "material-ui-confirm";
import React from "react";
import { Task } from "../../lib/gapi";
import { useBoundActions } from "../../lib/hooks/useBoundActions";
import { tasksActions } from "../../modules/slice/taskSlice";

type Props = {
  task: Task;
};

export const DeleteTaskButton: React.FC<Props> = ({ task }) => {
  const confirm = useConfirm();
  const { deleteTask } = useBoundActions(tasksActions);
  const onClick = () =>
    confirm({ title: "Are you sure you want to delete task?" })
      .then(() => deleteTask(task))
      .catch(() => {});

  return (
    <Tooltip title={"delete"} placement={"left"}>
      <IconButton size={"small"} onClick={onClick}>
        <DeleteIcon fontSize={"small"} />
      </IconButton>
    </Tooltip>
  );
};
