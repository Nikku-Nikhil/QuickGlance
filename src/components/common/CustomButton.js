import React from "react";
import "../../App.js";

const CustomButton = ({ text = "", disabled = false, onClick = () => {} }) => {
  return (
    <button className="btn" disabled={disabled} onClick={onClick}>
      <h4>{text}</h4>
    </button>
  );
};

export default CustomButton;
