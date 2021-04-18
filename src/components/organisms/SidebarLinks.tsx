import { Divider, ListSubheader } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import CalendarViewDayIcon from "@material-ui/icons/CalendarViewDay";
import TodayIcon from "@material-ui/icons/Today";
import ViewColumnIcon from "@material-ui/icons/ViewColumn";
import React from "react";
import { useHistory } from "react-router-dom";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { taskListsSelector } from "../../modules/selector/taskListsSelector";

export const SidebarLinks: React.FC = () => {
  const history = useHistory();
  const { taskLists } = useSelectors(taskListsSelector, "taskLists");

  return (
    <>
      <List>
        <ListItem button onClick={() => history.push("/today")}>
          <ListItemIcon>
            <TodayIcon />
          </ListItemIcon>
          <ListItemText primary={"Today"} />
        </ListItem>
        <ListItem button onClick={() => history.push("/board")}>
          <ListItemIcon>
            <ViewColumnIcon />
          </ListItemIcon>
          <ListItemText primary={"Kanban Board"} />
        </ListItem>
        <ListItem button onClick={() => history.push("/timeline")}>
          <ListItemIcon>
            <CalendarViewDayIcon />
          </ListItemIcon>
          <ListItemText primary={"Timeline"} />
        </ListItem>
      </List>
      <Divider />
      <List
        disablePadding
        dense
        subheader={<ListSubheader>Task Lists</ListSubheader>}
      >
        {taskLists.map((list) => (
          <ListItem
            button
            key={list.id}
            onClick={() => history.push("/taskList/" + list.id)}
          >
            <ListItemText primary={list.title} />
          </ListItem>
        ))}
      </List>
    </>
  );
};
