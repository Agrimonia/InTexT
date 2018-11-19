import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = "https://i.loli.net/2018/11/14/5bec09142d118.gif";

const NotFound = () => (
  <div>
    <img
      src={PageNotFound}
      style={{
        display: "block",
        margin: "auto",
        position: "relative"
      }}
    />
    <center>
      <Link to="/home">Return to Home Page</Link>
    </center>
  </div>
);
export default NotFound;
