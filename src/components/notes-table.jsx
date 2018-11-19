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
      notes: [
        {
          global_id: "12355412342G787y",
          note_title: "十九大学习报告",
          author: "testuser",
          template: "报告/学习报告",
          update_time: "2018/11/19 下午9:30:28"
        },
        {
          global_id: "156542342347yf63",
          note_title: "玄幻小说第三章",
          author: "testuser",
          template: "小说/玄幻",
          update_time: "2018/11/19 下午9:30:28"
        }
      ],
      loading: true
    };
  }

  // componentDidMount() {
  //   APIClient.get("/note_list")
  //     .then(response => {
  //       // const notes = response.data;
  //       this.setState({
  //         notes: notes,
  //         loading: false
  //       });
  //     })
  //     .catch(error => {
  //       console.log("获取文章数据失败", error);
  //     });
  // }

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
        <Column title="作者" dataIndex="author" key="author" />
        <Column title="模板" dataIndex="template" key="template" />
        <Column title="修改时间" dataIndex="update_time" key="update_time" />
        <Column
          title="操作"
          dataIndex="global_id"
          key="action"
          render={global_id => (
            <span>
              <a href="javascript:;">分享</a>
              <Divider type="vertical" />
              <a href="javascript:;">删除</a>
            </span>
          )}
        />
      </Table>
    );
  }
}
