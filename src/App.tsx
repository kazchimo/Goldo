import { CircularProgress } from "@material-ui/core";
import React, { useEffect } from "react";
import "./App.css";
import { TaskBoard } from "./components/page/TaskBoard";
import { useBoundActions } from "./lib/hooks/useBoundActions";
import { useSelectors } from "./lib/hooks/useSelectors";
import { actions } from "./modules/reducers";
import { selectors } from "./modules/selectors";

function App() {
  const { loadGapi, restoreLogin, successLogin } = useBoundActions(actions);
  const { gapiLoaded, login } = useSelectors(selectors, "gapiLoaded", "login");

  useEffect(() => {
    if (gapiLoaded && !login) {
      gapi.auth.authorize(
        {
          client_id: process.env["REACT_APP_CLIENT_ID"],
          scope: "https://www.googleapis.com/auth/tasks",
          immediate: false,
        },
        (res) => {
          successLogin(res);
        }
      );
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
