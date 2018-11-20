import React from "react";
import {
  Editor,
  EditorState,
  convertToRaw,
  convertFromRaw,
  CompositeDecorator,
  RichUtils
} from "draft-js";
import { List } from "antd";
import Header from "../components/editor-header";
import { generateNoteID } from "../utils/id";
import localforage from "localforage";
import LoginState from "../store/LoginStateStore";
import languagetool from "languagetool-api";
import debounce from "lodash.debounce";
import {
  METADATA_URL_DEV,
  WEIGHT_URL_DEV,
  WORDINDEX_URL_DEV
} from "../predict/next-sentence";
import KerasJS from "keras-js";
import "../assets/Editor.scss";
import { APIClient } from "../utils/client";

const WarningUnderline = props => (
  <span className="warning-text">{props.children}</span>
);

const spellStrategy = (contentBlock, callback) => {
  const text = contentBlock.getText();
  console.log(text);
  const regex = new RegExp(text, "g");
  let matchArr, start, end;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    end = start + matchArr[0].length;
    console.log("start:", start);
    console.log("start:", end);
    callback(start, end);
  }
};

const generateDecorator = errorValue => {
  return new CompositeDecorator([
    {
      strategy: spellStrategy,
      component: WarningUnderline
    }
  ]);
};

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
      spellCheckList: [],
      // model
      modelLoading: true,
      modelLoadingProgress: 0,
      modelInitializing: true,
      modelInitProgress: 0,
      modelRunning: false
    };
    this.titleRef = React.createRef();
    this.contentRef = React.createRef();
  }

  // componentWillMount() {
  //   // 加载模型
  //   this.model = new KerasJS.Model({
  //     filepath: MODEL_FILEPATH_PROD,
  //     gpu: false
  //   });
  //   this.model.events.on("loadingProgress", this.handleLoadingProgress);
  //   this.model.events.on("initProgress", this.handleInitProgress);
  // }
  componentDidMount() {
    // 从路由参数获取文章属性
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
    // 判断拼写检查的语言
    if (this.props.location.state.template.startsWith("En")) {
      this.setState({
        language: "en-US"
      });
    } else if (this.props.location.state.template.startsWith("中")) {
      this.setState({
        language: "zh-CN"
      });
    }
    this.loadData();
  }
  // 给拼写检查的结果加装饰器
  // componentDidUpdate() {
  //   const list = this.state.spellCheckList;
  //   for (let i = 0; i < list.length; i++) {
  //     this.setState({
  //       editorState: EditorState.set(this.state.editorState, {
  //         decorator: generateDecorator(list[i].errorValue)
  //       })
  //     });
  //   }
  // }

  // componentWillUnmount() {
  //   // 清理模型
  //   this.model.cleanup();
  //   this.model.events.removeAllListeners();
  // }

  focus = e => this.refs.editor.focus();

  getContentFromLocal = () => {
    console.log(this.state.global_id);
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
    console.log("check!");
    console.log(sentences);
    languagetool.check(
      { language: this.state.language, text: sentences },
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
          let results = [];
          res.matches.map(match => {
            const result = {
              key: match.sentence,
              type: match.rule.category.name,
              message: match.message,
              shortMessage: match.shortMessage,
              start: match.offset,
              end: match.offset + match.length,
              errorValue: match.context.text.slice(
                match.offset,
                match.offset + match.length
              ),
              replaceValue: match.replacements[0].value
            };
            results.push(result);
          });
          console.log(results);
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
    // console.log("change!");
    // if (editorState.getCurrentContent().getPlainText() !== this.state.editorState.getCurrentContent().getPlainText()) {
    //   this.spellCheck();
    // }
    this.setState({
      editorState
    });
  };

  render() {
    return (
      <div>
        <Header note_title={this.state.note_title} />
        <div className="editor-area">
          <div className="editor-assistant">
            <List
              // header={AssistantHeader}
              // footer={AssistantFooter}
              bordered
              dataSource={this.state.spellCheckList}
              loading={this.state.loading}
              locale={{ emptyText: "暂无错误" }}
              renderItem={item => (
                <List.Item key={item.key}>
                  <p>type: {item.type}</p>
                  <p>shortMessage: {item.shortMessage}</p>
                  <p>
                    {item.errorValue}=>{item.replaceValue}
                  </p>
                </List.Item>
              )}
            />
          </div>
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
