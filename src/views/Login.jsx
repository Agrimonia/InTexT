import React from "react";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import { APIClient } from "../utils/client.js";
import history from "../history";
import LoginState from "../store/LoginStateStore";
import "../assets/Login.scss";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      errored: false
    };
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        APIClient.post("/login", values)
          .then(response => {
            LoginState.token = response.data.token;
            LoginState.username = values.username;
            history.push("/home");
          })
          .catch(error => {
            this.setState({
              errored: true
            });
            console.log("响应失败:", error);
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator("username", {
            rules: [{ required: true, message: "Please input your username!" }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="testuser"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "Please input your Password!" }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="123456"
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            登录
          </Button>
          {this.state.errored ? (
            <p className="errorInfo">用户名或密码错误！</p>
          ) : null}
        </Form.Item>
      </Form>
    );
  }
}
const LoginForm = Form.create()(Login);

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Member Login</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
