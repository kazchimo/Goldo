import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
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
