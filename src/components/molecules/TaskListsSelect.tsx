import { FormControl, InputLabel, MenuItem } from "@material-ui/core";
import { Field } from "formik";
import { Select } from "formik-material-ui";
import React from "react";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { taskListsSelector } from "../../modules/selector/taskListsSelector";

type Props = {};

export const TaskListsSelect: React.VFC<Props> = () => {
  const { taskLists } = useSelectors(taskListsSelector, "taskLists");

  return (
    <FormControl style={{ width: "100%" }}>
      <InputLabel>Task List</InputLabel>
      <Field component={Select} name={"listId"}>
        {taskLists.map((list) => (
          <MenuItem key={list.id} value={list.id}>
            {list.title}
          </MenuItem>
        ))}
      </Field>
    </FormControl>
  );
};
