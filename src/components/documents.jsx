import React from "react";
import { Card, Icon } from "antd";

import "../assets/documents.scss";

export default class Documents extends React.Component {
  constructor() {
    super();
    this.state = {
      noteTitle: "无标题",
      outLine: "helloworld",
      updateTime: new Date().toLocaleDateString()
    };
  }

  render() {
    const list = [1, 2, 3, 4, 5, 6];
    const papers = list.map(() => {
      return (
        <Paper
          noteTitle={this.state.noteTitle}
          outLine={this.state.outLine}
          updateTime={this.state.updateTime}
        />
      );
    });
    return (
      <div className="documents-container">
        <Card id="new-doc">
          <Icon type="plus" />
        </Card>
        {papers}
      </div>
    );
  }
}

class Paper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { noteTitle, outLine, updateTime } = this.props;
    return (
      <Card
        title={noteTitle}
        extra={<Icon type="bars" />}
        style={{ width: 150 }}
      >
        <p>{outLine}</p>
        <p>{updateTime}</p>
      </Card>
    );
  }
}
