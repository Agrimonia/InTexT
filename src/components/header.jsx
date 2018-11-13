import React from "react";
import { Button, Menu } from "antd";

import "../assets/header.scss";

export default class Header extends React.Component {
  constructor() {
    super();
    this.state = { loading: false, title: "" };
  }
  enterLoading = () => {
    this.setState({ loading: true });
    // check();

    // this.setState({ loading: false});
  };

  render() {
    const exportMenu = (
      <Menu>
        <Menu.Item />
      </Menu>
    );
    return (
      <div className="header-bar">
        <span className="header-button-left">
          <Button shape="circle" icon="left" />
          <Dropdown overlay={menu} placement="topLeft">
            <Button shape="circle" icon="export" />
          </Dropdown>
        </span>
        <h1>{this.title}</h1>
        <span className="header-button-right">
          <Button
            type="primary"
            loading={this.state.loading}
            onClick={this.enterLoading}
          >
            Check
          </Button>
        </span>
      </div>
    );
  }
}
