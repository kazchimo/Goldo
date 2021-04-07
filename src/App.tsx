import { CircularProgress } from "@material-ui/core";
import React, { useEffect } from "react";
import "./App.css";
import { TaskBoard } from "./components/page/TaskBoard";
import { authorize } from "./lib/gapi";
import { useBoundActions } from "./lib/hooks/useBoundActions";
import { useSelectors } from "./lib/hooks/useSelectors";
import { authSelector } from "./modules/selector/authSelector";
import { gapiSelector } from "./modules/selector/gapiSelector";
import { authActions } from "./modules/slice/authSlice";
import { gapiActions } from "./modules/slice/gapiSlice";

function App() {
  const { loadGapi, restoreLogin, successLogin } = useBoundActions({
    ...authActions,
    ...gapiActions,
  });
  const { gapiLoaded, login } = useSelectors(
    { ...gapiSelector, ...authSelector },
    "gapiLoaded",
    "login"
  );

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
    <div className="App">
      {login && gapiLoaded ? <TaskBoard /> : <CircularProgress />}
    </div>
  );
}

export default App;
