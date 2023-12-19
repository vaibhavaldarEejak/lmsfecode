import React, { useEffect } from "react";
import { Quill } from "react-quill";
import "./fonts.css";

const API_URL = process.env.REACT_APP_API_URL;


const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);


const Font = Quill.import("formats/font");
Font.whitelist = [
  "arial",
  "comic-sans",
  "courier-new",
  "georgia",
  "helvetica",
  "lucida",
];
Quill.register(Font, true);



function insertHeart(e) {
  
}

export const modules = {
  toolbar: {
    container: "#toolbar",
    handlers: {
      insertHeart: insertHeart,
    },
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true,
  },
};

// Formats objects for setting up the Quill editor
export const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "align",
  "strike",
  "script",
  "blockquote",
  "background",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "color",
  "code-block",
];

export const QuillToolbar = (props) => (
  <div id="toolbar" style={{ pointerEvents: props?.toolbar }}>
  
    <span className="ql-formats">
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
    </span>
   
  </div>
);
export default QuillToolbar;
