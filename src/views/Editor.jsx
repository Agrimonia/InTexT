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
import LoginState from "../store/LoginStateStore";
import languagetool from "languagetool-api";
import debounce from "lodash.debounce";
import "../assets/Editor.scss";
import { APIClient } from "../utils/client";

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
    console.log("getSentenceFromEditor:", sentences);
    languagetool.check(
      { language: this.state.language, text: sentences },
      (err, res) => {
        if (err) {
          console.log("error from languagetool:", err);
        } else {
          let results = [];
          res.matches.map(match => {
            const result = {
              key: match.sentence,
              type: match.rule.category.name,
              message: match.message,
              shortMessage: match.shortMessage,
              errorValue: match.context.text.slice(
                match.offset,
                match.offset + match.length
              ),
              replaceValue: match.replacements[0].value
            };
            results.push(result);
          });
          console.log("spellCheckList", results);
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
    // this.spellCheck();
  };

  render() {
    return (
      <div>
        <Header note_title={this.state.note_title} />
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
