import React from "react";
import { Card, Icon } from "antd";

export default class Paper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { noteTitle, outLine, updateTime } = this.props;
    return (
      <Card
        title={noteTitle}
        extra={<Icon type="bars" />}
        style={{ width: 300 }}
      >
        <p>{outLine}</p>
        <p>{updateTime}</p>
      </Card>
    );
  }
}
