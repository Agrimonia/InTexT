import ReactDOM from "react-dom";
import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";

import EditorPage from "./views/Editor.jsx";
import NotFound from "./views/NotFound.jsx";

import "./assets/index.scss";

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={EditorPage} />
      <Route path="*" component={NotFound} />
    </Switch>
  </BrowserRouter>
);

const HTMLContainer = document.getElementById("container");

ReactDOM.render(<App />, HTMLContainer);
