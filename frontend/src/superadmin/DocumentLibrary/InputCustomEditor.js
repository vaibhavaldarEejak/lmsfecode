import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../css/quillp.css";
import EditorToolbar, { modules, formats } from "./EditorToolbar";

const InputCustomEditor = ({
  onChange,
  value,
  errorMessage = null,
  showErrorMessage,
  required,
  label,
  disabled = false,
  toolbar = "",
}) => {
  const [state, setState] = React.useState({ value });

  useEffect(() => {
    setState({ value });
  }, [value]);

  const handleChange = (value) => {
    setState({ value });
    onChange(value);
  };

  return (
    <div className="text-editor">
      <EditorToolbar toolbar={toolbar} />
      <ReactQuill
        style={{ height: "190px" }}
        readOnly={disabled}
        theme="snow"
        value={state.value}
        onChange={handleChange}
        placeholder={"Write something awesome..."}
        modules={modules}
        formats={formats}
      />
      {showErrorMessage && required && (
        <p className="error-message fw-bolder">
          {errorMessage ? errorMessage : value === "" && `${label} is required`}
        </p>
      )}
    </div>
  );
};

InputCustomEditor.defaultProps = {
  showErrorMessage: false,
  required: false,
};

InputCustomEditor.propTypes = {
  showErrorMessage: false,
  required: false,
  errorMessage: "",
  value: "",
  label: "",
  onChange: () => {},
};

export { InputCustomEditor };