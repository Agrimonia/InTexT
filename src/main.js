import ReactDOM from "react-dom";
import React from "react";

import DraftEditor from "./editor/index.jsx";

import "./assets/index.scss";

const HTMLContainer = document.getElementById("container");

ReactDOM.render(<DraftEditor />, HTMLContainer);
