import { CircularProgress } from "@material-ui/core";
import React, { useEffect } from "react";
import "./App.css";
import { TaskBoard } from "./components/page/TaskBoard";
import { useBoundActions } from "./lib/hooks/useBoundActions";
import { useSelectors } from "./lib/hooks/useSelectors";
import { actions } from "./modules/reducers";
import { selectors } from "./modules/selectors";

function App() {
  const { loadGapiClient } = useBoundActions(actions);
  const { clientLoaded } = useSelectors(selectors, "clientLoaded");

  useEffect(() => {
    loadGapiClient();
  });

  return (
    <div className="App">
      {clientLoaded ? <TaskBoard /> : <CircularProgress />}
    </div>
  );
}

export default App;
