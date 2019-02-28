import React from "react";
import { APIClient } from "../utils/client.js";
import {
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete
} from "antd";
import history from "../history";
import "../assets/Signup.scss";

const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;

class Signup extends React.Component {
  state = {
    confirmDirty: false,
    autoCompleteResult: []
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        APIClient.post("/register", values)
          .then(response => {
            console.log(response);
            alert("注册成功，请登录");
            history.push("/login");
          })
          .catch(error => {
            console.log(response);
            alert("注册失败");
            console.log("响应失败:", error); //用户名唯一存在问题
          });
      }
    });
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("密码不一致");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { autoCompleteResult } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 30,
          offset: 0
        },
        sm: {
          span: 18,
          offset: 8
        }
      }
    };

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item {...formItemLayout} label="请输入邮箱">
          {getFieldDecorator("email", {
            rules: [
              {
                type: "email",
                message: "无效邮箱地址"
              },
              {
                required: true,
                message: "请输入你的邮箱地址"
              }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="请输入密码">
          {getFieldDecorator("password", {
            rules: [
              {
                required: true,
                message: "请输入你的密码"
              },
              {
                validator: this.validateToNextPassword
              }
            ]
          })(<Input type="password" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="请确认密码">
          {getFieldDecorator("confirm", {
            rules: [
              {
                required: true,
                message: "请再次输入密码"
              },
              {
                validator: this.compareToFirstPassword
              }
            ]
          })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label={
            <span>
              用户名&nbsp;
              <Tooltip title="你想让别人怎么称呼你呢？">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator("username", {
            rules: [
              { required: true, message: "请输入你的用户名", whitespace: false }
            ]
          })(<Input />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          {getFieldDecorator("agreement", {
            valuePropName: "checked"
          })(
            <Checkbox>
              我已阅读<a href="">用户协议</a>
            </Checkbox>
          )}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            注册
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const SignupForm = Form.create()(Signup);

const SignupPage = () => {
  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1 className="signup-title">
          <font className="logo">InTexT</font>&nbsp;&nbsp;Sign Up
        </h1>
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
