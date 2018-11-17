import React from "react";

import { connect } from "react-redux";

import { login } from "../actions/user";

export class LoginContainer extends React.Component {
  onClick = e => {
    e.preventDefault();
    this.props.login({
      name: this.refs.name.value
    });
  };

  render() {
    return (
      <div>
        <div>
          <input type="text" ref="name" placeholder="Enter your username" />
        </div>
        <div>
          <button onClick={this.onClick}>Login</button>
        </div>
      </div>
    );
  }
}
export default connect(
  null,
  { login }
)(LoginContainer);
