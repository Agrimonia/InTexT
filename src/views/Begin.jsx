import React from "react";
//import LoginState from "../store/LoginStateStore";
import { Button, Steps, Icon } from "antd";
import history from "../history";
import "../assets/Begin.scss";
import cookie from "react-cookies";

const Step = Steps.Step;

export default class BeginPage extends React.Component {
  constructor() {
    super();
    this.state = { template: "默认" };
  }

  handleLogout = () => {
    history.push({
      pathname: "/login",
      state: { template: this.state.template }
    });
  };

  handleHome = () => {
    history.push({
      pathname: "/home",
      state: { template: this.state.template }
    });
  };

  handleLogin = () => {
    history.push({
      pathname: "/login",
      state: { template: this.state.template }
    });
  };

  handleSign = () => {
    history.push({
      pathname: "/signup",
      state: { template: this.state.template }
    });
  };

  handleAbout = () => {
    const w = window.open("about:blank");
    w.location.href = "https://intext.jotang.party/";
  };

  render() {
    if (cookie.load("token") != "") {
      this.handleHome;
    }
    return (
      <div className="img">
        <h1 className="A">
          抒写
          <p className="Z">Intelligent Text Editor</p>
        </h1>
        <div className="B">
          <p className="W">
            {cookie.load("token") != "" ? (
              <span>
                亲爱的 {cookie.load("username")},您已经登录啦！
                <p>快进入抒写吧！</p>
              </span>
            ) : (
              <p>无需注册，马上体验抒写！</p>
            )}
            <p>
              <Button
                className="but"
                icon="highlight"
                onClick={this.handleHome}
              >
                现在开始
              </Button>
            </p>
          </p>
        </div>

        <Steps className="D">
          <Step status="finish" title="注册" icon={<Icon type="user" />} />
          <Step status="finish" title="登录" icon={<Icon type="solution" />} />
          <Step status="process" title="进入抒写" icon={<Icon type="book" />} />
          <Step status="wait" title="畅游抒写" icon={<Icon type="smile-o" />} />
        </Steps>

        <div className="C">
          <Button
            className="button"
            icon="left-square"
            onClick={this.handleSign}
          >
            注册
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button className="button" icon="eye" onClick={this.handleAbout}>
            About
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button
            className="button"
            icon="right-square"
            onClick={this.handleLogin}
          >
            登录
          </Button>
        </div>
      </div>
    );
  }
}
