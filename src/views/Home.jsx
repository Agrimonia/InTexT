import React from "react";
import { Layout, Menu, Icon } from "antd";
import NotesTable from "../components/notes-table";

const { Header, Content, Footer, Sider } = Layout;

// const SubMenu = Menu.SubMenu;
export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
            <Menu.Item key="1">
              <Icon type="inbox" />
              <span>我的文档</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="user" />
              <span>用户中心</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="logout" />
              <span>登出</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: "#fff", padding: 0 }} />
          <Content>
            <NotesTable />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            InTexT ©2018 Created by JoTang
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
