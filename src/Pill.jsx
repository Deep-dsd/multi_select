import React from "react";
import { RxCross2 } from "react-icons/rx";
const Pill = ({ image, text, onClick }) => {
  return (
    <span className="user-pill" onClick={onClick}>
      <img src={image} alt={text} />
      <span>{text}</span>
      <span className="delete">
        <RxCross2 />
      </span>
    </span>
  );
};

export default Pill;
