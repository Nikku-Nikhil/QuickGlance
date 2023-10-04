import React from "react";
import "../../App.js";

function Loader() {
  return (
    <div className="loader-container">
      <div className="wrapper">
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="circle"></div>
        <div className="shadow"></div>
        <div className="shadow"></div>
        <div className="shadow"></div>
      </div>
      <h4 className="generatingText">Generating...</h4>
    </div>
  );
}

export default Loader;
