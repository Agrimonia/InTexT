import React from "react";
import {
  Upload,
  message,
  Layout,
  Menu,
  Icon,
  Modal,
  Cascader,
  Button
} from "antd";
const { Header, Content, Footer, Sider } = Layout;
import NotesTable from "../components/notes-table";
import history from "../history";
import LoginState from "../store/LoginStateStore";
import "../assets/Home.scss";

// const SubMenu = Menu.SubMenu;
export default class Home extends React.Component {
  constructor() {
    super();
    this.state = { templateVisible: false, template: "默认" };
  }

  showModal = () => {
    this.setState({ templateVisible: true });
  };

  handleOk = () => {
    history.push({
      pathname: "/editor",
      state: { template: this.state.template }
    });
  };

  handleCancel = () => {
    this.setState({
      templateVisible: false
    });
  };

  onChange = value => {
    const valueStr = value.reduce((a, b) => `${a}/${b}`);
    this.setState(
      {
        template: valueStr
      },
      () => {
        console.log(this.state.template);
      }
    );
  };

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Modal
          title="选择您需要的文章类型"
          centered
          visible={this.state.templateVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Cascader
            defaultValue={["默认"]}
            options={options}
            onChange={this.onChange}
          />
        </Modal>
        <Sider>
          <h1 className="logo">InTexT</h1>
          <Menu theme="dark" defaultSelectedKeys={["2"]} mode="inline">
            <Menu.Item key="1">
              <Icon type="user" />
              <span>用户中心</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="inbox" />
              <span>我的文档</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="logout" />
              <span>登出</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header>
            <p className="welcome">
              当前用户：{LoginState.username || "未登录"}
            </p>
            <div className="button-container">
              <Button onClick={this.showModal} type="primary">
                新建
              </Button>
              <Upload {...uploadProps}>
                <Button onClick={this.handleImport}>导入</Button>
              </Upload>
            </div>
          </Header>
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

const options = [
  {
    value: "默认",
    label: "默认"
  },
  {
    value: "中文",
    label: "中文",
    children: [
      {
        value: "小说",
        label: "小说",
        children: [
          {
            value: "玄幻",
            label: "玄幻"
          },
          {
            value: "仙侠",
            label: "仙侠"
          }
        ]
      },
      {
        value: "报告",
        label: "报告",
        children: [
          {
            value: "思想报告",
            label: "思想报告"
          },
          {
            value: "学习报告",
            label: "学习报告"
          }
        ]
      }
    ]
  },
  {
    value: "English",
    label: "English",
    children: [
      {
        value: "Application Letter",
        label: "Application Letter"
      },
      {
        value: "Narration",
        label: "Narration"
      },
      {
        value: "Motivation Letter",
        label: "Motivation Letter"
      }
    ]
  }
];

const uploadProps = {
  name: "file",
  action: "https://intext.jotang/party/api/upload_note/",
  headers: {
    authorization: "authorization-text"
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
};
