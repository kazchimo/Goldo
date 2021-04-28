import { Button, Tooltip } from "@material-ui/core";
import React, { VFC } from "react";
import AddIcon from "@material-ui/icons/Add";
import { useBool } from "../../lib/hooks/useBool";
import { AddTaskListModal } from "../organisms/AddTaskListModal";

export const AddTaskListButton: VFC = () => {
  const [open, openModal, closeModal] = useBool();

  return (
    <>
      <AddTaskListModal open={open} close={closeModal} />
      <Tooltip title="Add new task list">
        <Button
          variant={"outlined"}
          style={{ width: "100%" }}
          onClick={() => openModal()}
        >
          <AddIcon />
        </Button>
      </Tooltip>
    </>
  );
};
