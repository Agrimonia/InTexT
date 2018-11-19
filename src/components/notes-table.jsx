import React from "react";
import { Table, Divider } from "antd";
const Column = Table.Column;
import { APIClient } from "../utils/client";
import { NavLink } from "react-router-dom";
import "../assets/notes-table.scss";

export default class NotesTable extends React.Component {
  constructor() {
    super();
    this.state = {
      notes: [],
      loading: true
    };
  }

  componentDidMount() {
    this.getNoteList();
  }
  timeSort = (a, b) => {
    a = a.slice(0, 10);
    b = b.slice(0, 10);
    const timestamp_a = new Date(a);
    const timestamp_b = new Date(b);
    return timestamp_a - timestamp_b;
  };
  getNoteList = () => {
    APIClient.get("/note_list")
      .then(response => {
        const notes = response.data.notes.filter(note => {
          return note.is_del == "False";
        });
        console.log(notes);
        this.setState({
          notes: notes,
          loading: false
        });
      })
      .catch(error => {
        console.log("获取文章数据失败", error);
      });
  };

  handleDelete = global_id => {
    this.setState({
      loading: true
    });
    APIClient.post("/note/delete", { global_id: global_id })
      .then(this.getNoteList())
      .catch(error => {
        console.log("删除文章失败", error);
      });
  };

  render() {
    return (
      <Table dataSource={this.state.notes} rowKey="global_id">
        <Column
          title="名称"
          dataIndex="note_title"
          key="note_title"
          render={(note_title, record) => (
            <NavLink
              to={{
                pathname: "/editor",
                state: {
                  note_title: note_title,
                  global_id: record.global_id,
                  template: record.template
                }
              }}
            >
              {note_title}
            </NavLink>
          )}
        />
        <Column title="模板" dataIndex="template" key="template" />
        <Column
          title="修改时间"
          dataIndex="update_time"
          key="update_time"
          sorter={this.timeSort}
        />
        <Column
          title="操作"
          dataIndex="global_id"
          key="action"
          render={global_id => (
            <span>
              <a href="javascript:;">分享</a>
              <Divider type="vertical" />
              <a onClick={this.handleDelete.bind(this, global_id)}>删除</a>
              {/* render 函数中要 bind this */}
            </span>
          )}
        />
      </Table>
    );
  }
}
