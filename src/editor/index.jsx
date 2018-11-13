import React from "react";
import {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
  RichUtils
} from "draft-js";
import HeaderBar from "../components/headerBar";

import "../assets/editor.scss";

export default class DraftEditor extends React.Component {
  constructor() {
    super();
    this.state = {};
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

  onChange = editorState => {
    const contentState = editorState.getCurrentContent();
    this.saveContent(contentState);
    this.setState({
      editorState
    });
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
        <HeaderBar />
        <Editor
          editorState={this.state.editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
