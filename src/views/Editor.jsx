import React from "react";
import {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
  RichUtils
} from "draft-js";

import Header from "../components/editor-header";
import { generateNoteID } from "../utils/id";
import localforage from "localforage";

import "../assets/Editor.scss";

export default class EditorPage extends React.Component {
  constructor() {
    super();
    this.state = {
      note_title: "",
      editorState: EditorState.createEmpty(),
      global_id: ""
    };
    this.titleRef = React.createRef();
    this.contentRef = React.createRef();
  }

  componentDidMount() {
    if (this.props.location.state.hasOwnProperty("global_id")) {
      this.setState(
        {
          note_title: this.props.location.state.note_title,
          global_id: this.props.location.state.global_id
        },
        () => {
          console.log("打开文章", this.state.global_id);
          this.getContentFromLocal();
        }
      );
    } else {
      this.setState(
        {
          global_id: generateNoteID()
        },
        () => {
          console.log("初始化新文章", this.state.global_id);
        }
      );
    }
  }

  focus = e => this.refs.editor.focus();

  getContentFromLocal() {
    console.log(this.state.global_id);
    localforage.getItem(this.state.global_id).then(value => {
      this.setState({
        editorState: EditorState.createWithContent(
          convertFromRaw(JSON.parse(value))
        )
      });
    });
  }
  saveContentToLocal = content => {
    localforage.setItem(
      this.state.global_id,
      JSON.stringify(convertToRaw(content))
    );
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
    this.setState({ note_title: e.target.value });
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
    this.saveContentToLocal(contentState);
    this.setState({
      editorState
    });
    // console.log(this.getTextArrayFromEditor());
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
