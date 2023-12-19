import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import {
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import axios from "axios";
import getApiCall from "src/server/getApiCall";

const API_URL = process.env.REACT_APP_API_URL;
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
  const [showModal, setShowModal] = React.useState(false);
  const [state, setState] = React.useState({ value });
  const [inputText, setInputText] = React.useState("");

  useEffect(() => {
    setState({ value });
  }, [value]);

  const [dynamicField, setDynamicField] = useState([]);
  const token = "Bearer " + localStorage.getItem("ApiToken");
  //async await get method to store data in dynamicFields
  const getDynamicFields = async () => {
    try {
      const res = await getApiCall("getDynamicFieldList");
      setDynamicField(res);
    } catch (err) {}
  };
  useEffect(() => {
    getDynamicFields();
  }, []);
  const handleChange = (value) => {
    setState({ value });
    onChange(value);
  };
  const handleClick = () => {
    setInputText(state.value);
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
  };
  const handleTextChange = (e) => {
    setState({ value: e.target.value });
    setInputText(e.target.value);
  };
  const [pTagClass, setPTagClass] = useState("");
  let testnewValue;

  useEffect(() => {
    setPTagClass(testnewValue);
  }, [state]);

  // Get all the <p> elements on the page
  const paragraphs = document.getElementsByTagName("p");

  // Select the latest <p> tag
  const latestParagraph = paragraphs[paragraphs.length - 1];
  // console.log("asdsa", latestParagraph?.className);
  testnewValue = latestParagraph?.className;
  // console.log({ latestParagraph });

  const handleDyChange = (e) => {
    // console.log("e", e);
    // console.log("state & value", state.value + e.value);
    setState({
      value: state.value + `<p class="${pTagClass}"> ${e.value} </p>`,
    });
  };
  return (
    <React.Fragment>
      <CModal visible={showModal} onClose={handleClose} className="modal-width">
        <CModalHeader>
          <CModalTitle>Html Editor</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="card-body">
            <div className="row mb-7">
              <div className="col-lg-12 fv-row">
                <textarea
                  rows={10}
                  className="form-control"
                  value={inputText}
                  onChange={(e) => handleTextChange(e)}
                ></textarea>
              </div>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleClose}
          >
            Close
          </button>
        </CModalFooter>
      </CModal>
      <div className="text-editor">
        <EditorToolbar
          toolbar={toolbar}
          handleClick={handleClick}
          handleDyChange={handleDyChange}
          dynamicField={dynamicField || []}
        />
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
      </div>
      {showErrorMessage && required && (
        <p className="error-message fw-bolder">
          {errorMessage ? errorMessage : value === "" && `${label} is required`}
        </p>
      )}
    </React.Fragment>
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
