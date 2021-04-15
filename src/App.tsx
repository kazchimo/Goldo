import {
  CircularProgress,
  LinearProgress,
  makeStyles,
} from "@material-ui/core";
import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { TaskBoardPage } from "./components/page/TaskBoardPage";
import { useBoundActions } from "./lib/hooks/useBoundActions";
import { useSelectors } from "./lib/hooks/useSelectors";
import { authSelector } from "./modules/selector/authSelector";
import { gapiSelector } from "./modules/selector/gapiSelector";
import { authActions } from "./modules/slice/authSlice";
import { gapiActions } from "./modules/slice/gapiSlice";
import { loadingActions } from "./modules/slice/loadingSlice";

const useStyles = makeStyles((theme) => ({
  app: {
    backgroundColor: theme.palette.background.default,
    height: "100%",
    width: "fit-content",
    minWidth: "100%",
  },
}));

function App() {
  const { initGapi, signIn, onLoading, offLoading } = useBoundActions({
    ...authActions,
    ...gapiActions,
    ...loadingActions,
  });
  const { gapiIsInit, login } = useSelectors(
    { ...gapiSelector, ...authSelector },
    "gapiIsInit",
    "login"
  );
  const classes = useStyles();

  useEffect(() => {
    if (gapiIsInit && !login) {
      signIn();
      onLoading();
    }
  }, [gapiIsInit, login]);

  useEffect(() => {
    initGapi();
  }, []);

  return (
    <div className={classes.app}>
      {login && gapiIsInit && (
        <Switch>
          <Route path={"/board"}>
            <TaskBoardPage />
          </Route>
        </Switch>
      )}
    </div>
  );
}

export default App;
