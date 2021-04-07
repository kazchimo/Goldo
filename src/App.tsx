import { CircularProgress } from "@material-ui/core";
import React, { useEffect } from "react";
import "./App.css";
import { TaskBoardPage } from "./components/page/TaskBoardPage";
import { useBoundActions } from "./lib/hooks/useBoundActions";
import { useSelectors } from "./lib/hooks/useSelectors";
import { authSelector } from "./modules/selector/authSelector";
import { gapiSelector } from "./modules/selector/gapiSelector";
import { authActions } from "./modules/slice/authSlice";
import { gapiActions } from "./modules/slice/gapiSlice";

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

  useEffect(() => {
    if (gapiIsInit && !login) {
      signIn();
    }
  }, [gapiIsInit]);

  useEffect(() => {
    initGapi();
  }, []);

  return (
    <div className="App">
      {login && gapiIsInit ? <TaskBoardPage /> : <CircularProgress />}
    </div>
  );
}

export default App;
