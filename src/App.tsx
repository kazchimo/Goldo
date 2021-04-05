import React, { useEffect } from "react";
import "./App.css";
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

  useEffect(() => {
    if (clientLoaded) {
      window.gapi.client.setToken({
        access_token: window.localStorage.getItem("authToken")!,
      });

      window.gapi.client
        .request({
          path: "https://tasks.googleapis.com/tasks/v1/users/@me/lists",
        })
        .execute((r) => console.log(r));
    }
  });

  return <div className="App">hello</div>;
}

export default App;
