import { CircularProgress, makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import { TaskBoardPage } from "./components/page/TaskBoardPage";
import { useBoundActions } from "./lib/hooks/useBoundActions";
import { useSelectors } from "./lib/hooks/useSelectors";
import { authSelector } from "./modules/selector/authSelector";
import { gapiSelector } from "./modules/selector/gapiSelector";
import { authActions } from "./modules/slice/authSlice";
import { gapiActions } from "./modules/slice/gapiSlice";

const useStyles = makeStyles((theme) => ({
  app: {
    backgroundColor: theme.palette.background.default,
    height: "100%",
    width: "fit-content",
    minWidth: "100%",
  },
}));

function App() {
  const { initGapi, signIn } = useBoundActions({
    ...authActions,
    ...gapiActions,
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
    }
  }, [gapiIsInit]);

  useEffect(() => {
    initGapi();
  }, []);

  return (
    <div className={classes.app}>
      {login && gapiIsInit ? <TaskBoardPage /> : <CircularProgress />}
    </div>
  );
}

export default App;
