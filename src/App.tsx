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
           hello
        </div>
    );
}

export default App;
