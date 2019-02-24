import React from "react";
import {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
  RichUtils
} from "draft-js";
import { generateNoteID } from "../utils/id";
import localforage from "localforage";
import LoginState from "../store/LoginStateStore";
import languagetool from "languagetool-api";
import { APIClient } from "../utils/client";
import { Button, Menu, Icon, Dropdown } from "antd";
import { NavLink } from "react-router-dom";
import "../assets/Editor.scss";
import "../assets/editor-header.scss";

export default class EditorPage extends React.Component {
  constructor() {
    super();
    this.state = {
      note_title: "无标题",
      template: "默认",
      global_id: "",
      author: LoginState.username,
      editorState: EditorState.createEmpty(),
      loading: false,
      language: "zh-CN",
      spellCheck: false, // 是否开启拼写检查
      spellCheckList: []
    };
    this.titleRef = React.createRef();
    this.contentRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.location.state.hasOwnProperty("global_id")) {
      this.setState(
        {
          note_title:
            this.props.location.state.note_title || this.state.note_title,
          global_id: this.props.location.state.global_id,
          template: this.props.location.state.template
        },
        () => {
          console.log("打开文章", this.state.global_id);
          console.log("文章类型：", this.state.template);
          this.getContentFromLocal();
        }
      );
    } else {
      this.setState(
        {
          global_id: generateNoteID(),
          template: this.props.location.state.template
        },
        () => {
          console.log("初始化新文章", this.state.global_id);
          console.log("文章类型：", this.state.template);
          APIClient.post("/note/create", {
            global_id: this.state.global_id,
            template: this.state.template,
            note_title: this.state.note_title,
            author: this.state.author
          });
        }
      );
    }
    if (this.props.location.state.template.startsWith("En")) {
      this.setState({
        language: "en-US"
      });
    } else if (this.props.location.state.template.startsWith("中")) {
      this.setState({
        language: "zh-CN"
      });
    }
  }

  focus = e => this.refs.editor.focus();

  getContentFromLocal = () => {
    // console.log("this.state.global_id:", this.state.global_id);
    localforage.getItem(this.state.global_id).then(value => {
      this.setState({
        editorState: EditorState.createWithContent(
          convertFromRaw(JSON.parse(value))
        )
      });
    });
  };
  saveContentToLocal = content => {
    localforage.setItem(
      this.state.global_id,
      JSON.stringify(convertToRaw(content))
    );
  };

  getSentenceFromEditor = () => {
    const text = this.state.editorState.getCurrentContent().getPlainText();
    // const validText = text
    //   .split(/[。.]/)
    //   .map(t => t.trim())
    //   .filter(t => t.length > 3);
    return text;
  };

  handleToolMenuClick = ({ key }) => {
    if (key === "SPELLCHECK") {
      this.setState({ spellcheck: !this.state.spellcheck });
    }
  };

  // Title
  handleTitleChange = e => {
    this.setState({ note_title: e.target.value }, () => {
      APIClient.post("/note/update", {
        global_id: this.state.global_id,
        note_title: this.state.note_title
      });
    });
  };

  handleTitleKeyCommand = command => {
    if (command.keyCode == 13) {
      // Enter: 13
      const content = this.contentRef.current;
      content.focus();
    }
  };

  handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(
      this.state.editorState,
      command
    );

    if (newState) {
      this.onChange(newState);
      return "handled";
    }

    return "not-handled";
  };

  spellCheck = () => {
    const sentences = this.getSentenceFromEditor();
    // console.log("getSentenceFromEditor:", sentences);
    languagetool.check(
      { language: this.state.language, text: sentences },
      (err, res) => {
        if (err) {
          console.log("error from languagetool:", err);
        } else {
          console.log(JSON.stringify(res));
          let results = [];
          res.matches.map(match => {
            const result = {
              from: match.offset,
              to: match.offset + match.length,
              type: match.rule.category.name,
              message: match.message,
              shortMessage: match.shortMessage
              // replaceValue: match.replacements[0].value
            };
            results.push(result);
          });
          console.log("spellCheckList", JSON.stringify(results));
          this.setState({
            spellCheckList: results
          });
        }
      }
    );
  };

  onChange = editorState => {
    const contentState = editorState.getCurrentContent();
    this.saveContentToLocal(contentState);
    this.setState({
      editorState
    });
    // console.log("change!");
    // TODO: 更低频地调用拼写检查 API
  };

  render() {
    const exportMenu = (
      <Menu>
        <Menu.Item key="HTML">导出为 HTML</Menu.Item>
        <Menu.Item key="Markdown">导出为 Markdown</Menu.Item>
        <Menu.Item key="DOC">导出为 DOC</Menu.Item>
        <Menu.Item key="PDF">导出为 PDF</Menu.Item>
      </Menu>
    );

    const toolMenu = (
      <Menu onClick={this.handleToolMenuClick}>
        <Menu.Item key="SPELLCHECK">
          {this.state.spellcheck ? (
            <>
              <Icon type="check" />
              <span>智能纠错</span>
            </>
          ) : (
            <span>智能纠错</span>
          )}
        </Menu.Item>
        <Menu.Item disabled>智能建议</Menu.Item>
      </Menu>
    );

    return (
      <div>
        <div className="header-bar">
          <span className="header-button-left">
            <NavLink to="/home">
              <Button shape="circle" icon="left" />
            </NavLink>
            <Dropdown overlay={exportMenu} placement="topLeft">
              <Button shape="circle" icon="export" />
            </Dropdown>
            <Dropdown overlay={toolMenu} placement="topLeft">
              <Button shape="circle" icon="tool" />
            </Dropdown>
          </span>
          <span className="header-title">{this.state.note_title}</span>
        </div>

        <div className="editor-area">
          <div className="editor-assistant" />
          <div className="editor-content">
            <div className="editor-title-box">
              <input
                ref={this.titleRef}
                className="editor-title"
                value={this.state.note_title}
                placeholder="无标题"
                onChange={this.handleTitleChange}
                onKeyUp={this.handleTitleKeyCommand}
              />
            </div>
            <Editor
              ref={this.contentRef}
              editorState={this.state.editorState}
              handleKeyCommand={this.handleKeyCommand}
              onChange={this.onChange}
            />
          </div>
        </div>
      </div>
    );
  }
}
