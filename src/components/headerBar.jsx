import React from "react";
import { Button, Icon } from "antd";

import "../assets/headerBar.scss";

export default class HeaderBar extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false
    };
  }
  enterLoadinåg = () => {
    this.setState({ loading: true });
    // check();
    sleep(100);
    // this.setState({ loading: false});
  };

  render() {
    return (
      <div className="header-bar">
        <span className="header-button-left">
          <Button shape="circle" size="large">
            <Icon type="left" />
          </Button>
        </span>
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
