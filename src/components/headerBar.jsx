import React from "react";
import "../assets/headerBar.scss";

export default function HeaderBar() {
  return (
    <div className="header-bar">
      <header>InText</header>
      <div className="header-button">
        {/* <SearchBar /> */}
        <button>登录</button>
        <button>注册</button>
      </div>
    </div>
  );
}
