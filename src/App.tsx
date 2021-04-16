import { makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { TaskBoardPage } from "./components/page/TaskBoardPage";
import { TodayPage } from "./components/page/TodayPage";
import { useBoundActions } from "./lib/hooks/useBoundActions";
import { useSelectors } from "./lib/hooks/useSelectors";
import { appSelector } from "./modules/selector/appSelector";
import { authSelector } from "./modules/selector/authSelector";
import { gapiSelector } from "./modules/selector/gapiSelector";
import { taskListsSelector } from "./modules/selector/taskListsSelector";
import { appActions } from "./modules/slice/appSlice";
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
    resetInitialLoading,
    initGapi,
    signIn,
    restoreTheme,
    fetchTasks,
    fetchTaskLists,
    offLoading,
    onLoading,
  } = useBoundActions({
    ...appActions,
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
  const [shouldReload, setShouldReload] = useState(true);

  useEffect(() => {
    initGapi();
    restoreTheme();
  });

  useEffect(() => {
    if (gapiIsInit && !login) {
      signIn();
    }
  }, [gapiIsInit, login]);

  useEffect(() => {
    if (gapiIsInit && login && shouldReload) {
      resetInitialLoading();
      onLoading();
      fetchTaskLists();
    }
  }, [gapiIsInit, login, shouldReload]);

  useEffect(() => {
    if (finishInitialLoading) {
      offLoading();
      setShouldReload(false);
      resetInitialLoading();
    }
  }, [finishInitialLoading]);

  useEffect(() => {
    if (shouldReload) {
      taskLists.forEach((t) => {
        if (t.id) {
          fetchTasks(t.id);
        }
      });
    }
  }, [taskLists, shouldReload]);

  useEffect(() => {
    window.addEventListener("focus", () => {
      console.log("focus");
      setShouldReload(true);
    });

    return () => {
      window.removeEventListener("focus", () => setShouldReload(true));
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
        </Switch>
      )}
    </div>
  );
}

export default App;
