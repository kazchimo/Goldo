import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    useEffect(() => {
        window.gapi.client.setToken({access_token: window.localStorage.getItem("authToken")!})
        window.gapi.client.request({
            path: "https://tasks.googleapis.com/tasks/v1/users/@me/lists"
        }).execute(r => console.log(r));
    })

    return (
        <div className="App">
            {window.localStorage.getItem("authToken")}
            {window.localStorage.getItem("login")}
            <button id="authorize_button">Authorize</button>
            <button id="signout_button">Sign Out</button>
        </div>
    );
}

export default App;
