import { CircularProgress } from "@material-ui/core";
import React, { useEffect } from "react";
import "./App.css";
import { TaskBoard } from "./components/page/TaskBoard";
import { authorize } from "./lib/gapi";
import { useBoundActions } from "./lib/hooks/useBoundActions";
import { useSelectors } from "./lib/hooks/useSelectors";
import { actions } from "./modules/reducers";
import { selectors } from "./modules/selectors";

function App() {
  const { loadGapi, restoreLogin, successLogin } = useBoundActions(actions);
  const { gapiLoaded, login } = useSelectors(selectors, "gapiLoaded", "login");

  useEffect(() => {
    if (gapiLoaded && !login) {
      authorize((res) => {
        successLogin(res);
      });
    }
  }, [gapiLoaded]);

  useEffect(() => {
    loadGapi();
    restoreLogin();
  }, []);

  return (
    <div className="App">{login ? <TaskBoard /> : <CircularProgress />}</div>
  );
}

export default App;
