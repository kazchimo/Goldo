import React, { useEffect } from "react";
import "./App.css";
import { useBoundActions } from "./lib/hooks/useBoundActions";
import { useGapiClient } from "./lib/hooks/useGapiClient";
import { actions } from "./modules/reducers";

function App() {
  const { loadGapiClient } = useBoundActions(actions);
  const client = useGapiClient();

  useEffect(() => {
    loadGapiClient();
  });

  useEffect(() => {
    if (client) {
      client
        .request({
          path: "https://tasks.googleapis.com/tasks/v1/users/@me/lists",
        })
        .execute((r) => console.log(r));
    }
  });

  return <div className="App">hello</div>;
}

export default App;
