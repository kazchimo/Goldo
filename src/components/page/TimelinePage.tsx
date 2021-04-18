import { Grid, List, ListItem } from "@material-ui/core";
import React from "react";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { tasksSelector } from "../../modules/selector/taskSelector";

export const TimelinePage: React.FC = () => {
  const { dueTasksByDate } = useSelectors(tasksSelector, "dueTasksByDate");

  return (
    <List>
      {Object.keys(dueTasksByDate).map((k) => (
        <ListItem key={k}>
          <List></List>
        </ListItem>
      ))}
    </List>
  );
};
