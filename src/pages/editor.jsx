import React from "react";
import {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
  RichUtils
} from "draft-js";
import Header from "../components/header";

import "../assets/editor.scss";

export default class EditorPage extends React.Component {
  constructor() {
    super();
    this.state = {
      title: "Hello World"
    };
    this.titleRef = React.createRef();
    this.contentRef = React.createRef();
    this.focus = e => this.refs.editor.focus();
    const content = window.localStorage.getItem("content");

    if (content) {
      this.state.editorState = EditorState.createWithContent(
        convertFromRaw(JSON.parse(content))
      );
    } else {
      this.state.editorState = EditorState.createEmpty();
    }
  }
  componentDidMount() {
    // this.titleRef.focus()
  }
  onChange = editorState => {
    const contentState = editorState.getCurrentContent();
    this.saveContent(contentState);
    this.setState({
      editorState
    });
    console.log(this.getTextArrayFromEditor());
  };

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
      console.log(content);
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

  saveContent = content => {
    window.localStorage.setItem(
      "content",
      JSON.stringify(convertToRaw(content))
    );
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
                onKeyDown={this.handleTitleKeyCommand}
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
