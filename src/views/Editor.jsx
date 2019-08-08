import React from "react";
import {
  Editor,
  EditorState,
  Modifier,
  convertToRaw,
  convertFromRaw,
  RichUtils,
  CompositeDecorator
} from "draft-js";
import { generateNoteID } from "../utils/id";
import localforage from "localforage";
//import LoginState from "../store/LoginStateStore";
//import languagetool from "languagetool-api";
import { APIClient } from "../utils/client";
import { Button, Menu, Icon, Dropdown, Popover } from "antd";
import { NavLink } from "react-router-dom";
import "../assets/Editor.scss";
import "../assets/editor-header.scss";
import cookie from "react-cookies";
import $ from "jquery";
import { start } from "repl";
import { $mobx } from "mobx";
const languagetool = require("languagetool-api");
const flag = 0;

export default class EditorPage extends React.Component {
  constructor() {
    super();
    const compositeDecorator = new CompositeDecorator([
      {
        // 拼写检查装饰器策略函数
        strategy: (contentBlock, callback, contentState) => {
          const contenttext = contentBlock.getText();
          if (contenttext && this.state.problemList) {
            this.state.problemList.forEach(problem => {
              callback(problem.from, problem.to);
            });
          }
        },
        //拼写装饰组件
        component: props => {
          console.log("props", props);
          const mistake = MistakenTextDetail(
            props.decoratedText,
            this.state.problemList
          );
          console.log(mistake.replaceValue);
          const PopContent = (
            <>
              <p>MistakeDetails(错误详情)</p>
              <a>{mistake.message}</a>
              <p>BestSuggestion（最佳建议）</p>
              <a onClick={this.mistakeReplace}>{mistake.replaceValue}</a>
            </>
          );
          //return<span class="warning-text">{props.children}</span>
          return (
            <Popover content={PopContent} title={mistake.wrongText}>
              <span class="warning-text-problem">{props.children}</span>
            </Popover>
          );
        }
      },
      {
        //预测语句装饰器策略函数
        strategy: (contentBlock, callback, contentState) => {
          const ContentText = contentBlock.getText();
          //console.log(ContentText)
          if (ContentText) {
            let start, lastText;
            let textList = [];
            if (this.state.language == "en-US") {
              textList = ContentText.split(/[，。；‘’“”：]/);
            } else {
              textList = ContentText.split(/[，。？！：“”；]/);
            }
            if (textList.length >= 2) {
              lastText = textList[textList.length - 2];
              this.state.lastText_position = textList[textList.length - 1]; //定位在最后一个句子上
              start = ContentText.indexOf(this.state.lastText_position);
              //console.log('lastText'+lastText)
              this.state.predictedText = lastText;

              APIClient.post("/sentences/send", {
                qurey_sentence: lastText
              }).then(response => {
                //console.log(response.data)
                //console.log("res"+JSON.parse(JSON.stringify(response)));
                //const res=JSON.stringify(response.data);
                //console.log(res);
                this.state.predicitonList = response.data;
                //console.log("preList"+this.state.predicitonList)
                //console.log(typeof(this.state.predicitonList))
                //console.log(this.state.predicitonList[2])
              });
              //console.log(cookie.load('contentText'))
              callback(start, start + this.state.lastText_position.length);
            }

            /*fetch("http://localhost:5000/api/sentences/send", {
                method: 'POST',
                headers: 'Access-Control-Allow-Origin',
                body: lastText,
              }).then((response) => {
                if (response.ok) {
                    return response.json();
                }
              }).then((json) => {
                alert(JSON.stringify(json));
              }).catch((error) => {
                console.error(error);
              });*/
          }
        },
        //预测语句装饰组件
        component: props => {
          //console.log('props:',props)
          //console.log('dddd'+this.state.predicitonList[0])
          const Popcontent = (
            <>
              <p>Next statement</p>
              <a onClick={this.mistakeReplace}>
                {this.state.predicitonList[0]}
              </a>
              <br />
              <a onClick={this.mistakeReplace}>
                {this.state.predicitonList[1]}
              </a>
              <br />
            </>
          );
          return (
            <Popover content={Popcontent} title={this.predictedText}>
              <span className="warning-text-prediction">{props.children}</span>
            </Popover>
          );
        }
      }
    ]);

    this.state = {
      note_title: "无标题", // 文章标题
      template: cookie.load("template"), // 文章模板
      global_id: "", // 文章的全局ID
      author: cookie.load("username"), // 文章作者
      editorState: EditorState.createEmpty(compositeDecorator), // 初始化文章内容
      loading: false, // TODO: 文章加载状态
      language: "zh-CN", // 文章模板语言
      spellCheck: true, // 是否开启拼写检查
      problemList: [], // 拼写检查结果
      prediciton: false, //是否开启下一句预测
      predicitonList: [], //预测语句队列
      predictedText: "", //根据此语句预测下一句
      lastText_position: "" //替换区间
    };
    this.titleRef = React.createRef();
    this.contentRef = React.createRef();
    this.predicitonList = [""];
    // 复合装饰器
    this.setState({
      predicitonList: arr
    });
    this.onChange = editorState => {
      const contentState = editorState.getCurrentContent();
      const text = this.getSentenceFromEditor();
      cookie.save("contentText", text, { path: "/" });
      this.saveContentToLocal(contentState);
      this.setState({
        editorState
      });
    };
  }

  componentDidMount() {
    if (this.state.global_id) {
      //this.props.location.state.hasOwnProperty("global_id")
      // 如果 URL 带文章ID，则读取本地存储
      // TODO: 判断本地文章是否为最新，否则从后台同步文章
      this.setState(
        {
          note_title:
            this.props.location.state.note_title || this.state.note_title,
          global_id: this.props.location.state.global_id,
          //this.props.location.state.global_id,
          template: this.props.location.state.template
        },
        () => {
          //console.log("打开文章", this.state.global_id);
          //console.log("文章类型：", this.state.template);
          this.getContentFromLocal();
        }
      );
    } else {
      // 否则创建新文章
      this.setState(
        {
          global_id: generateNoteID(),
          template: this.state.template
        },
        () => {
          //console.log("初始化新文章", this.state.global_id);
          //console.log("文章类型：", this.state.template);
          APIClient.post("/note/create", {
            global_id: this.state.global_id,
            template: this.state.template,
            note_title: this.state.note_title,
            author: this.state.author
          });
        }
      );
    }

    // 土办法判断文章模板语言
    if (this.state.template.startsWith("En")) {
      //this.props.location.state.template.startsWith("En")
      this.setState({
        language: "en-US",
        note_title: "Untitled"
      });
    } else if (this.state.template.startsWith("中")) {
      //this.props.location.state.template.startsWith("中")
      this.setState({
        language: "zh-CN",
        note_title: "合同"
      });
    }
  }
  // 根据文章 ID 从本地存储拉取文章
  getContentFromLocal = () => {
    //console.log("this.state.global_id:", this.state.global_id);
    localforage.getItem(this.state.global_id).then(value => {
      this.setState({
        editorState: EditorState.createWithContent(
          convertFromRaw(JSON.parse(value)),
          this.compositeDecorator
        )
      });
    });
  };
  // 保存文章到本地存储
  saveContentToLocal = content => {
    localforage.setItem(
      this.state.global_id,
      JSON.stringify(convertToRaw(content))
    );
    //console.log(localforage.getItem());
  };
  // 获取文章文本内容
  getSentenceFromEditor = () => {
    const text = this.state.editorState.getCurrentContent().getPlainText();
    return text;
  };

  setcompositeDecorator = () => {
    if (this.state.spellCheck) {
      this.setState({
        editorState: EditorState.set(this.state.editorState, {
          decorator: this.compositeDecorator[0]
        })
      });
    } else {
      this.setState({
        editorState: EditorState.set(this.state.editorState, {
          decorator: null
        })
      });
    }
  };

  //点击替换语句
  mistakeReplace = event => {
    //console.log("mistakeReplace");
    const Selected_statement = event.target.innerHTML;
    //console.log(typeof(Selected_statement));
    this.state.predictedText = Selected_statement;
    const contentstate = this.state.editorState.getCurrentContent();
    const selectionState = this.state.editorState.getSelection();
    //console.log(selectionState);
    const insertstat = Modifier.replaceText(
      contentstate,
      selectionState,
      Selected_statement
    );
    const newContent = EditorState.push(
      this.state.editorState,
      insertstat,
      "replace-prediction"
    );
    this.onChange(newContent);
  };
  // 根据 toolMenu 的菜单项 key 触发事件
  handleToolMenuClick = ({ key }) => {
    if (key === "SPELLCHECK") {
      this.setState(
        { spellCheck: !this.state.spellCheck },
        this.setcompositeDecorator
      );
    }
    if (key === "PREDICTION") {
      this.setState(
        {
          prediciton: !this.state.prediciton
        },
        this.setcompositeDecorator
      );
    }
  };
  // 同步文章标题更改
  handleTitleChange = e => {
    this.setState({ note_title: e.target.value }, () => {
      APIClient.post("/note/update", {
        global_id: this.state.global_id,
        note_title: this.state.note_title
      });
    });
  };
  // 输入标题后回车会跳转到正文
  handleTitleKeyCommand = command => {
    if (command.keyCode == 13) {
      // Enter: 13
      const content = this.contentRef.current;
      content.focus();
    }
  };
  // 编辑器响应内容更改
  handleKeyCommand = command => {
    const newState = RichUtils.handleKeyCommand(
      this.state.editorState,
      command
    );
    if (newState) {
      this.onChange(newState);
      //cookie.save('contentText',text,{path:"/"});
      return "handled";
    }
    return "not-handled";
  };

  // 触发拼写检查
  requestSpellCheck = editorState => {
    const sentences = this.getSentenceFromEditor();
    //console.log("getSentenceFromEditor:", sentences);
    languagetool.check(
      { language: this.state.language, text: sentences },
      (err, res) => {
        if (err) {
          //console.log("error from languagetool:", err);
        } else {
          languagetool.showMistakes(res, function(arr) {
            //console.log("response from languagetool:", res);
            arr.forEach(function(item) {
              //console.log(item);
            });
          });
          let results = [];
          res.matches.map(match => {
            var result = {
              from: match.offset,
              to: match.offset + match.length,
              type: match.rule.category.name,
              message: match.message,
              shortMessage: match.shortMessage,
              replaceValue: match.replacements[0].value,
              wrongText: match.context.text.slice(
                match.context.offset,
                match.context.offset + match.context.length
              )
            };
            //console.log(","+result);
            results.push(result);
          });
          //console.log("problemList: ", results);
          this.setState({
            problemList: results
          });
          this.onChange;
        }
      }
    );
  };

  //触发预测语句功能
  requestPrediction = () => {
    const sentences = this.getSentenceFromEditor();
    //console.log("getSentenceFromEditor:",sentences);
  };

  render() {
    //console.log("bwq"+cookie.load('contentText'))
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
          {this.state.spellCheck ? (
            <>
              <Icon type="check" />
              <span>智能纠错</span>
            </>
          ) : (
            <span>智能纠错</span>
          )}
        </Menu.Item>
        <Menu.Item key="PREDICTION">
          {this.state.prediciton ? (
            <>
              <Icon type="check" />
              <span>智能预测</span>
            </>
          ) : (
            <span>智能预测</span>
          )}
        </Menu.Item>
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
            <Button
              shape="circle"
              icon="check"
              onClick={this.requestSpellCheck}
            />
            <Button
              shape="circle"
              icon="edit"
              onClick={this.requestPrediction}
            />
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
                placeholder={this.state.note_title}
                onChange={this.handleTitleChange}
                onKeyUp={this.handleTitleKeyCommand}
              />
            </div>

            <Editor
              ref={this.contentRef}
              editorState={this.state.editorState}
              handleKeyCommand={this.handleKeyCommand}
              onChange={this.onChange}
              spellCheck={true}
            >
              {" "}
              {}
            </Editor>
          </div>
        </div>
      </div>
    );
  }
}

function MistakenTextDetail(MisText, problemList) {
  for (let i = 0; i < problemList.length; i++) {
    if (problemList[i].wrongText === MisText) {
      //console.log("llllllll" + problemList[i]);
      return problemList[i];
    }
  }
}

const arr = ["kkk"];
