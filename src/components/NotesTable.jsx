import React from "react";
import { Table, Divider, Tag } from "antd";
import { APIClient } from "../utils/client";
import "../assets/documents.scss";

export default class NotesTable extends React.Component {
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
    return (
      <Table dataSource={data}>
        <ColumnGroup title="Name">
          <Column title="First Name" dataIndex="firstName" key="firstName" />
          <Column title="Last Name" dataIndex="lastName" key="lastName" />
        </ColumnGroup>
        <Column title="Age" dataIndex="age" key="age" />
        <Column title="Address" dataIndex="address" key="address" />
        <Column
          title="Tags"
          dataIndex="tags"
          key="tags"
          render={tags => (
            <span>
              {tags.map(tag => (
                <Tag color="blue" key={tag}>
                  {tag}
                </Tag>
              ))}
            </span>
          )}
        />
        <Column
          title="Action"
          key="action"
          render={(text, record) => (
            <span>
              <a href="javascript:;">Invite {record.lastName}</a>
              <Divider type="vertical" />
              <a href="javascript:;">Delete</a>
            </span>
          )}
        />
      </Table>
    );
  }
}
