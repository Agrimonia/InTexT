import React from "react";
import { Editor, EditorState, RichUtils } from "draft-js";

export default class DraftEditor extends React.Component {
  constructor() {
    super();
    this.state = {
      editorState: EditorState.createEmpty(),
      anchorKey: "",
      currentContent: {}
    };
  }

  onChange = editorState => {
    this.setState({
      editorState: editorState,
      anchorKey: editorState.getSelection().getAnchorKey(),
      currentContent: editorState.getCurrentContent()
    });
    console.log(this.state);
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

  render() {
    return (
      <div>
        <Editor
          editorState={this.state.editorState}
          handleKeyCommand={this.handleKeyCommand}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
