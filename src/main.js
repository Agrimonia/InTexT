import ReactDOM from "react-dom";
import React from "react";

import EditorPage from "./pages/editor.jsx";

import "./assets/index.scss";

const HTMLContainer = document.getElementById("container");

ReactDOM.render(<EditorPage />, HTMLContainer);
