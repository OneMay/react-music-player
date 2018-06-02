import React from "react";
import "./header.less";

function Header() {
  return (
    <div className="components-header row">
      <img
        src="/static/images/logo.png"
        width="40"
        alt=""
        className="-col-auto"
      />
      <h1 className="caption">React Music Player</h1>
    </div>
  );
}

export default Header;
