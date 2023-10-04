import React from "react";
import "../../App.js";

const FooterButtons = ({ icon, onClick }) => {
  return (
    <button className="copy-text" onClick={onClick}>       
       <img src={icon} height={25} width={25} alt="icons" />
    </button>
  );
};

export default FooterButtons;
