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




export const modules = {
  toolbar: {
    container: "#toolbar",
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true,
  },
};

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
      <select className="ql-font">
        <option value="arial" selected>
          Arial
        </option>
        <option value="comic-sans">Comic Sans</option>
        <option value="courier-new">Courier New</option>
        <option value="georgia">Georgia</option>
        <option value="helvetica">Helvetica</option>
        <option value="lucida">Lucida</option>
      </select>
      <select className="ql-size" defaultValue="medium">
        <option value="extra-small">Size 1</option>
        <option value="small">Size 2</option>
        <option value="medium">Size 3</option>
        <option value="large">Size 4</option>
      </select>
    </span>
    <span className="ql-formats">
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
    </span>
    <span className="ql-formats">
      <button className="ql-list" value="ordered" />
      <button className="ql-list" value="bullet" />
    </span>
    <span className="ql-formats">
      <select className="ql-align" />
    </span>
    <span className="ql-formats">
      <button className="ql-link" />
    </span>
    <span className="ql-formats">
      <button className="ql-image" />
    </span>
    <span className="ql-formats">
      <input
        type="button"
        className="btn bg-transparent"
        onClick={() => props?.handleClick("test")}
        value={"HTML"}
      />
    </span>
  </div>
);
export default QuillToolbar;
