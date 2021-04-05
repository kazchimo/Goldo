import React, { useEffect } from "react";
import "./App.css";
import { useBoundActions } from "./lib/hooks/useBoundActions";
import { useTaskApi } from "./lib/hooks/useTaskApi";
import { actions } from "./modules/reducers";

function App() {
  const { loadGapiClient } = useBoundActions(actions);
  const { getTasks } = useTaskApi();

  useEffect(() => {
    loadGapiClient();
  });

  useEffect(() => {
    getTasks()?.execute((a) => console.log(a.items.map((b) => b.title)));
  }, [getTasks]);

  return <div className="App">hello</div>;
}

export default App;
