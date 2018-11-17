import ReactDOM from "react-dom";
import React from "react";
import { Route, Switch, BrowserRouter, NavLink } from "react-router-dom";

import { connect } from "react-redux";

import { logout } from "./actions/user";

import Loading from "./views/Loading";
import Home from "./views/Home";
import EditorPage from "./views/Editor";
import NotFound from "./views/NotFound";
import LoginComponent from "./views/Login";

import "./assets/index.scss";

import {
  userIsAuthenticatedRedir,
  userIsNotAuthenticatedRedir,
  userIsAuthenticated,
  userIsNotAuthenticated
} from "./auth";

// Need to apply the hocs here to avoid applying them inside the render method
const Login = userIsNotAuthenticatedRedir(LoginComponent);
const Protected = userIsAuthenticatedRedir(EditorPage);

const LoginLink = userIsNotAuthenticated(() => (
  <NavLink activeClassName={styles.active} to="/login">
    Login
  </NavLink>
));
const LogoutLink = userIsAuthenticated(({ logout }) => (
  <a href="#" onClick={() => logout()}>
    Logout
  </a>
));
const App = ({ user, logout }) => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/editor" component={Protected} />
      <Route path="/login" component={Login} />
      <Route path="*" component={NotFound} />
    </Switch>
  </BrowserRouter>
);

const mapStateToProps = state => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  { logout }
)(App);
