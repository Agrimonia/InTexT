import React from "react";
import { Card, Icon } from "antd";
import Loading from "./loading";
import { APIClient } from "../utils/client";
import "../assets/documents.scss";

export default class Documents extends React.Component {
  constructor() {
    super();
    this.state = {
      notes: [],
      loading: true
    };
  }

  componentDidMount() {
    APIClient.get("/note_list/")
      .then(response => {
        const notes = response.data;
        this.setState({
          notes: notes
        });
      })
      .catch(error => {
        console.log("获取文章数据失败", error);
      });
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    } else {
      const Papers = this.state.notes.map(note => {
        return <Paper note={note} />;
      });
      return (
        <div className="documents-container">
          <Card id="new-doc">
            <Icon type="plus" />
          </Card>
          {Papers}
        </div>
      );
    }
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
