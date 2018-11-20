import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import Home from "./views/Home";
import EditorPage from "./views/Editor";
import NotFound from "./views/NotFound";
import LoginForm from "./views/Login";

const App = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route path="/login" component={LoginForm} />
    <Route path="/editor" component={EditorPage} />
    <Route path="/home" component={Home} />
    <Route path="*" component={NotFound} />
  </Switch>
);

export default withRouter(App);
