import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ViewColumnIcon from "@material-ui/icons/ViewColumn";
import React from "react";
import { useHistory } from "react-router-dom";
import TodayIcon from "@material-ui/icons/Today";
import CalendarViewDayIcon from "@material-ui/icons/CalendarViewDay";

export const SidebarLinks: React.FC = () => {
  const history = useHistory();

  return (
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
  );
};
