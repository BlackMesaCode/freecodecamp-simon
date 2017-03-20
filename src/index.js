import "./index.scss";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";

import App from "./components/App.js";
import Home from "./components/Home.js";


ReactDOM.render((
    <Router>
        <App>
            <Route path="/" component={Home}/>
        </App>
    </Router>)
, document.getElementById("app"));
