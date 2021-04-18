import { Divider, List, ListItem, ListSubheader } from "@material-ui/core";
import { parseISO } from "date-fns";
import _ from "lodash";
import React from "react";
import { useSelectors } from "../../lib/hooks/useSelectors";
import { taskListsSelector } from "../../modules/selector/taskListsSelector";
import { tasksSelector } from "../../modules/selector/taskSelector";
import { TaskListItem } from "../molecules/TaskListItem";

export const TimelinePage: React.FC = () => {
  const { dueTasksByDate, taskLists } = useSelectors(
    { ...tasksSelector, ...taskListsSelector },
    "dueTasksByDate",
    "taskLists"
  );

  return (
    <List>
      {_.sortBy(Object.keys(dueTasksByDate), (d) => new Date(d)).map((due) => (
        <ListItem key={due}>
          <List
            style={{ width: "100%" }}
            subheader={
              <ListSubheader>
                {due}
                <Divider />
              </ListSubheader>
            }
          >
            {dueTasksByDate[due].map((task, i) => (
              <TaskListItem
                showListName
                key={task.id}
                task={{ ...task, children: [] }}
                taskList={
                  taskLists.filter((list) => list.id === task.listId)[0]
                }
                index={i}
              />
            ))}
          </List>
        </ListItem>
      ))}
    </List>
  );
};
