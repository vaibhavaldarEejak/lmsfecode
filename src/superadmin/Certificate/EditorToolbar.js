import React, { useEffect } from "react";
import { Quill } from "react-quill";
import Select from "react-select";
import "../Certificate/fonts.css";

const API_URL = process.env.REACT_APP_API_URL;

// Add sizes to whitelist and register them
const Size = Quill.import("formats/size");
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);

// Add fonts to whitelist and register them
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

// const options = [
//   {value: 'chocolate', label: 'Chocolate'},
//   {value: 'strawberry', label: 'Strawberry'},
//   {value: 'vanilla', label: 'Vanilla'},
// ]

function insertHeart(e) {
  // const cursorPosition = this.quill.getSelection().index;
  // this.quill.insertText(cursorPosition, "♥");
  // this.quill.setSelection(cursorPosition + 1);
}

// Modules object for setting up the Quill editor
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

//const CustomHeart = () => <span>h t m l</span>

// Quill Toolbar component
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

    <span className="ql-formats ql-customField">
      <Select
        maxMenuHeight={210}
        name="form-field-name"
        placeholder="Custom Field"
        options={props?.dynamicField.map((i) => ({
          value: i?.dynamicFieldTag,
          label: i?.dynamicFieldName,
        }))}
        onChange={(value) => props.handleDyChange(value)}
      />

      {/* <select className='ql-font' onChange={(e) => {}}>
        {props?.dynamicField.map((i) => (
          <option key={i?.dynamicFieldId} value={i?.dynamicFieldTag}>
            {i?.dynamicFieldName}
          </option>
        ))}
      </select> */}
    </span>
  </div>
);
export default QuillToolbar;
