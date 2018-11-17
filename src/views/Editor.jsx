import React from "react";
import {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
  RichUtils
} from "draft-js";
import { connect } from "react-redux";
import Header from "../components/header";

import localforage from "localforage";

import "../assets/editor.scss";

class EditorPage extends React.Component {
  constructor() {
    super();
    this.state = {
      title: "Hello World",
      editorState: EditorState.createEmpty()
    };
    this.titleRef = React.createRef();
    this.contentRef = React.createRef();
  }

  componentDidMount() {
    this.getContentFromLocal();
  }

  focus = e => this.refs.editor.focus();

  getContentFromLocal() {
    localforage.getItem("content").then(value => {
      this.setState({
        editorState: EditorState.createWithContent(
          convertFromRaw(JSON.parse(value))
        )
      });
    });
  }

  getTextArrayFromEditor = () => {
    const textArray = this.state.editorState
      .getCurrentContent()
      .getBlocksAsArray()
      .map(o => {
        return o.text;
      });
    return textArray;
  };

  // Title
  handleTitleChange = e => {
    this.setState({ title: e.target.value });
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

  onChange = editorState => {
    const contentState = editorState.getCurrentContent();
    this.saveContent(contentState);
    this.setState({
      editorState
    });
    // console.log(this.getTextArrayFromEditor());
  };

  saveContent = content => {
    localforage.setItem("content", JSON.stringify(convertToRaw(content)));
  };

  render() {
    return (
      <div>
        <Header />
        <div className="editor-area">
          <div className="editor-content">
            <div className="editor-title-box">
              <input
                ref={this.titleRef}
                className="editor-title"
                value={this.state.title}
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

export default connect(state => ({ authData: state.user.data }))(EditorPage);
