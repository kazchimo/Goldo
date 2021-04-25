import { Divider, ListSubheader } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import CalendarViewDayIcon from "@material-ui/icons/CalendarViewDay";
import TodayIcon from "@material-ui/icons/Today";
import ViewColumnIcon from "@material-ui/icons/ViewColumn";
import React from "react";
import { useHistory } from "react-router-dom";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { taskListsSelector } from "../../modules/selector/taskListsSelector";
import SettingsIcon from "@material-ui/icons/Settings";

const useStyles = makeStyles((theme) => ({
  taskListItemText: {
    marginLeft: theme.spacing(2),
  },
  settingsContainer: {
    marginBottom: theme.spacing(1),
    marginTop: "auto",
  },
  bottomDivider: {
    marginBottom: theme.spacing(1),
  },
}));

export const SidebarLinks: React.FC = () => {
  const history = useHistory();
  const { taskLists } = useSelectors(taskListsSelector, "taskLists");
  const classes = useStyles();

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
            <ListItemText
              className={classes.taskListItemText}
              primary={list.title}
            />
          </ListItem>
        ))}
      </List>
      <div className={classes.settingsContainer}>
        <Divider className={classes.bottomDivider} />
        <ListItem button onClick={() => history.push("/settings")}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={"Settings"} />
        </ListItem>
      </div>
    </>
  );
};
