import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import Home from "./views/Home";
import EditorPage from "./views/Editor";
import NotFound from "./views/NotFound";
import LoginPage from "./views/Login";
import SignupPage from "./views/Signup";
//import LoginState from "./store/LoginStateStore";
import BeginPage from "./views/Begin";

const App = () => (
  <Switch>
    <Route exact path="/" component={BeginPage} />
    <Route path="/login" component={LoginPage} />
    <Route path="/signup" component={SignupPage} />
    <Route path="/editor" component={EditorPage} />
    <Route path="/home" component={Home} />
    <Route path="*" component={NotFound} />
  </Switch>
);

export default withRouter(App);
