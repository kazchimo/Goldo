import { makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { SettingsPage } from "./components/page/SettingsPage";
import { TaskBoardPage } from "./components/page/TaskBoardPage";
import { TaskListPage } from "./components/page/TaskListPage";
import { TimelinePage } from "./components/page/TimelinePage";
import { TodayPage } from "./components/page/TodayPage";
import { useBool } from "./lib/hooks/useBool";
import { useBoundActions } from "./lib/hooks/useBoundActions";
import { useSelectors } from "./lib/hooks/useSelectors";
import { appSelector } from "./modules/selector/appSelector";
import { authSelector } from "./modules/selector/authSelector";
import { gapiSelector } from "./modules/selector/gapiSelector";
import { taskListsSelector } from "./modules/selector/taskListsSelector";
import { appActions } from "./modules/slice/appSlice";
import { authActions } from "./modules/slice/authSlice";
import { gapiActions } from "./modules/slice/gapiSlice";
import { taskListActions } from "./modules/slice/taskListSlice";
import { tasksActions } from "./modules/slice/taskSlice";
import { themeActions } from "./modules/slice/themeSlice";

const useStyles = makeStyles((theme) => ({
  app: {
    backgroundColor: theme.palette.background.default,
    height: "100%",
    width: "fit-content",
    minWidth: "100%",
  },
}));

function App() {
  const {
    initGapi,
    signIn,
    restoreTheme,
    fetchTasks,
    fetchTaskLists,
  } = useBoundActions({
    ...appActions,
    ...authActions,
    ...gapiActions,
    ...themeActions,
    ...tasksActions,
    ...taskListActions,
  });
  const { gapiIsInit, login, taskLists } = useSelectors(
    { ...gapiSelector, ...authSelector, ...appSelector, ...taskListsSelector },
    "gapiIsInit",
    "login",
    "taskLists"
  );
  const classes = useStyles();
  const [shouldReload, toShouldReload, toShouldNotReload] = useBool(true);
  const [taskListsInitialized, toTaskListInitialized] = useBool();

  useEffect(() => {
    initGapi();
    restoreTheme();
  }, []);

  useEffect(() => {
    if (gapiIsInit && !login) {
      signIn();
    }
  }, [gapiIsInit, login]);

  useEffect(() => {
    if (gapiIsInit && login) {
      if (!taskListsInitialized) {
        fetchTaskLists();
        toTaskListInitialized();
      }

      if (taskListsInitialized) {
        taskLists.forEach((t) => fetchTasks(t.id));
      }

      toShouldNotReload();
    }
  }, [gapiIsInit, login, taskLists, shouldReload]);

  useEffect(() => {
    window.addEventListener("focus", () => {
      toShouldReload();
    });

    return () => {
      window.removeEventListener("focus", toShouldReload);
    };
  });

  return (
    <div className={classes.app}>
      {login && gapiIsInit && (
        <Switch>
          <Route exact path={"/"}>
            <Redirect to={"/today"} />
          </Route>
          <Route path={["/board"]}>
            <TaskBoardPage />
          </Route>
          <Route path={["/today"]}>
            <TodayPage />
          </Route>
          <Route path={["/timeline"]}>
            <TimelinePage />
          </Route>
          <Route path={["/taskList/:listId"]}>
            <TaskListPage />
          </Route>
          <Route path={["/settings"]}>
            <SettingsPage />
          </Route>
        </Switch>
      )}
    </div>
  );
}

export default App;
