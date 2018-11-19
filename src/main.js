import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import history from "./history";
import { Router } from "react-router";

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById("container")
);
