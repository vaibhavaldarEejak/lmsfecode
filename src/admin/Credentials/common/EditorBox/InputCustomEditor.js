import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../../../css/quillp.css";
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import {
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";

//import {shallowEqual, useSelector, useDispatch} from 'react-redux'

// import * as commonReducer from '../../modules/common/redux/commonRedux'
// import {RootState} from '../../modules/common/setup'

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
  //const dispatch = useDispatch()

  const [showModal, setShowModal] = React.useState(false);
  const [state, setState] = React.useState({ value });
  const [inputText, setInputText] = React.useState("");

  useEffect(() => {
    setState({ value });
  }, [value]);

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
  const handleDyChange = (e) => {
    setState({
      value: state.value + `<p> ${e.value} </p>`,
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
        />
        <ReactQuill
          style={{ height: "150px" }}
          theme="snow"
          readOnly={disabled}
          value={state.value}
          onChange={handleChange}
          placeholder={"Write something awesome..."}
          modules={modules}
          formats={formats}
        />
      </div>
      {/* <ReactQuill theme='snow' value={value} onChange={onChange} /> */}

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
