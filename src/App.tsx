import { makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { TaskBoardPage } from "./components/page/TaskBoardPage";
import { TodayPage } from "./components/page/TodayPage";
import { useBoundActions } from "./lib/hooks/useBoundActions";
import { useSelectors } from "./lib/hooks/useSelectors";
import { appSelector } from "./modules/selector/appSelector";
import { authSelector } from "./modules/selector/authSelector";
import { gapiSelector } from "./modules/selector/gapiSelector";
import { taskListsSelector } from "./modules/selector/taskListsSelector";
import { authActions } from "./modules/slice/authSlice";
import { gapiActions } from "./modules/slice/gapiSlice";
import { loadingActions } from "./modules/slice/loadingSlice";
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
    offLoading,
    onLoading,
  } = useBoundActions({
    ...authActions,
    ...gapiActions,
    ...themeActions,
    ...tasksActions,
    ...taskListActions,
    ...loadingActions,
  });
  const { gapiIsInit, login, finishInitialLoading, taskLists } = useSelectors(
    { ...gapiSelector, ...authSelector, ...appSelector, ...taskListsSelector },
    "gapiIsInit",
    "login",
    "finishInitialLoading",
    "taskLists"
  );
  const classes = useStyles();

  useEffect(() => {
    initGapi();
    restoreTheme();

    if (gapiIsInit && !login) {
      signIn();
      onLoading();
      fetchTaskLists();
    }
  }, [gapiIsInit, login]);

  useEffect(() => {
    if (finishInitialLoading) {
      offLoading();
    }
  }, [finishInitialLoading]);

  useEffect(() => {
    taskLists.forEach((t) => {
      if (t.id) {
        fetchTasks(t.id);
      }
    });
  }, [taskLists]);

  return (
    <div className={classes.app}>
      {login && gapiIsInit && (
        <Switch>
          <Route path={"/board"}>
            <TaskBoardPage />
          </Route>
          <Route path={"/today"}>
            <TodayPage />
          </Route>
        </Switch>
      )}
    </div>
  );
}

export default App;
