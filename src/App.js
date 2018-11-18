import React from "react";
import { Route, Switch, BrowserRouter, NavLink } from "react-router-dom";

import Introduction from "./views/Introduction";
import Home from "./views/Home";
import EditorPage from "./views/Editor";
import NotFound from "./views/NotFound";
import LoginForm from "./views/Login";

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Introduction} />
      <Route path="/login" component={LoginForm} />
      <Route path="/home" component={Home} />
      <Route path="/editor" component={EditorPage} />
      <Route path="*" component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default App;
