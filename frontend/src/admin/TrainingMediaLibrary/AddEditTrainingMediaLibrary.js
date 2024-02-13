import React, { useState, useEffect, useRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormTextarea,
  CFormLabel,
  CRow,
  CFormSelect,
  CFormSwitch,
  CForm,
  CCardFooter,
  CButton,
  CInputGroup,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
const token = "Bearer " + localStorage.getItem("ApiToken");
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
import postApiCall from "src/server/postApiCall";
import getApiCall from "src/server/getApiCall";
import "../../css/form.css";
import { ProgressBar } from "primereact/progressbar";

const AddEditTrainingMediaLibrary = () => {
  var fileTypesAllowed = [];
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const [version, setVersion] = useState(),
    [contentId, setContentId] = useState(0),
    [parentContentId, setParentContentId] = useState(null),
    [value1, setValue1] = useState(0),
    [files, setfiles] = useState(null),
    [mediaType, setMediaType] = useState("3"),
    [mediaData, setMediaData] = useState(null),
    [contentType, setContentType] = useState([]),
    [parentContent, setParentContent] = useState([]),
    [selectedParentContent, setSelectedParentContent] = useState(null),
    [previewData, setPreviewData] = useState(),
    navigate = useNavigate();
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);

  const [validationMessages, setValidationMessages] = useState({});
  const [showValidationMessages, setShowValidationMessages] = useState(false);

  function getYoutubeId(link) {
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/;
    const match = link.match(youtubeRegex);
    if (match) {
      setMediaPayload({
        ...mediaPayload,
        mediaUrl: "https://www.youtube.com/embed/" + match[1],
      });
    } else {
      setMediaPayload({
        ...mediaPayload,
        mediaUrl: link,
      });
    }
  }

  const [versionList, setversionList] = useState([
    {
      value: 0,
      label: null,
    },
  ]);

  const [mediaPayload, setMediaPayload] = useState({
    optionType: null,
    parentContent: null,
    contentVersion: null,
    contentType: null,
    mediaUrl: "",
    isActive: 1,
    contentName: "",
  });

  const validateForm = (e) => {
    const messages = {};
    let isValid = true;

    if (mediaType === "3") {
      if (!mediaPayload.contentName) {
        messages.contentName = "Content Name is required";
        isValid = false;
      } else {
        messages.contentName = "";
      }
    } else {
      if (!mediaPayload.parentContent) {
        messages.parentContent = "Parent Content is required";
        isValid = false;
      } else {
        messages.parentContent = "";
      }
    }

    if (!mediaPayload.mediaUrl) {
      messages.mediaUrl = "Media is required";
      isValid = false;
    } else {
      messages.mediaUrl = "";
    }

    if (!mediaPayload.contentType) {
      messages.contentType = "Content Type is required";
      isValid = false;
    } else {
      messages.contentType = "";
    }

    if (mediaType === "2") {
      if (!version || version === null) {
        messages.version = "Version is required";
        isValid = false;
      } else {
        messages.version = "";
      }
    }

    if (mediaType === "1") {
      if (!mediaPayload.contentVersion) {
        messages.version = "Version is required";
        isValid = false;
      } else {
        messages.version = "";
      }
    }

    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };

  const handleMediaTypeChange = (event) => {
    setMediaType(event.target.value);
    setSelectedParentContent("");
    setMediaPayload((prevState) => ({
      ...prevState,
      contentType: 0,
    }));
  };

  const onChangeisActive = (value) => {
    setMediaPayload((prevState) => ({
      ...prevState,
      isActive: value,
    }));
  };

  const handleContentTypeChange = (value) => {
    if (value == 0) {
      setfiles(null);
    } else {
      setContentId(value);
      var uploadMedia1 = document.getElementById("uploadMedia1");
      var uploadMedia2 = document.getElementById("uploadMedia2");
      var uploadMedia3 = document.getElementById("uploadMedia3");
      fileTypesAllowed = contentType.filter(
        (e) => e.contentTypesId == value
      )[0]["supportFormats"];
      if (fileTypesAllowed) {
        fileTypesAllowed = fileTypesAllowed.replaceAll("|", ",");
        setfiles(fileTypesAllowed);
        if (uploadMedia1) uploadMedia1.setAttribute("accept", fileTypesAllowed);
        if (uploadMedia2) uploadMedia2.setAttribute("accept", fileTypesAllowed);
        if (uploadMedia3) uploadMedia3.setAttribute("accept", fileTypesAllowed);
      }

      // console.log("fileTypesAllowed", fileTypesAllowed);
      setMediaPayload((prevState) => ({
        ...prevState,
        contentType: value,
      }));
    }
  };

  // useEffect(() => {
  //   if (contentId == 3 || contentId == 9) {
  //     setLoading(true);
  //   } else {
  //     setLoading(false);
  //   }
  // }, [contentId]);

  let arr = {
    name: "",
    blob: "",
    format: "",
  };

  function renderPage(page) {
    let imgData = "";
    const canvas = document.createElement("canvas");
    const viewport = page.getViewport({ scale: 1 });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext("2d");

    const renderTask = page.render({
      canvasContext: context,
      viewport: viewport,
    });
    renderTask.promise.then(() => {
      imgData = canvas.toDataURL("image/png");
      (arr.blob = imgData), (arr.name = ""), (arr.format = "pdf");
      setPreviewData(arr);
      // handoutData.push(imgData);
    });
  }

  function loadPDF(url) {
    pdfjsLib.getDocument(url).promise.then((pdf) => {
      pdf.getPage(1).then((page) => {
        renderPage(page);
      });
    });
  }

  const handleMediaChange = (e) => {
    const files = e.target.files[0];
    // setFile(files);

    if (files) {
      setLoading(false);
      const fileType = files.type;
      const fileName = files.name;

      const reader = new FileReader();

      reader.readAsDataURL(files);

      reader.onloadend = () => {
        const res = reader.result;
        if (fileType === "application/pdf") {
          loadPDF(URL.createObjectURL(files));
          // arr.push({ name: fileName, blob: "", format: "pdf" });
        } else if (
          fileType === "image/jpeg" ||
          fileType === "image/jpg" ||
          fileType === "image/png"
        ) {
          (arr.blob = res), (arr.name = fileName), (arr.format = "img");
          setPreviewData(arr);
        } else {
          (arr.blob = ""), (arr.name = fileName), (arr.format = "doc");
          setPreviewData(arr);
        }
      };
    }
  };

  const handleChangeParentContent = (value) => {
    setParentContentId(value);
    setSelectedParentContent(value);
    setMediaPayload((prevState) => ({
      ...prevState,
      parentContent: value,
    }));
  };

  const onChangeContentVersion = (value) => {
    setVersion(value);
    setMediaPayload((prevState) => ({
      ...prevState,
      contentVersion: value,
    }));
  };

  const getContentTypes = async () => {
    try {
      const res = await getApiCall("getContentTypeList");
      setContentType(res);
    } catch (err) {}
  };
  const getContentVersion = async () => {
    const formData = new FormData();
    formData.append("contentId", parentContentId);
    formData.append("optionType", mediaType);
    try {
      const res = await postApiCall("getContentVersion", formData);
      setVersion(res.version.toString());
      setversionList(
        res.version.length > 0 &&
          res.version.map((e) => ({
            value: e,
            label: e,
          }))
      );
      if (res.contentTypesId) {
        setMediaPayload((prevState) => ({
          ...prevState,
          contentType: res.contentTypesId,
        }));

        setMediaData({
          contentTypesId: res.contentTypesId,
          contentTypesName: res.contentTypesName,
          mediaName: res.mediaName,
          version: res.version,
        });
      }
      handleContentTypeChange(res.contentTypesId);
    } catch (err) {
      var errMsg = err?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
    }
  };

  const getParentContent = async () => {
    try {
      const res = await getApiCall("getParentContentList");
      setParentContent(res);
    } catch (err) {}
  };

  const manageMedia = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (mediaType === "3") {
        setLoading(true);
        const fileName = mediaPayload.mediaUrl?.name?.split(".")[0];
        const uniqueFileName = `${fileName}`;
        const withoutWhitespaces = uniqueFileName.replace(/\s/g, "");

        const formData = new FormData();

        formData.append("optionType", mediaType);
        formData.append("contentName", mediaPayload.contentName);
        formData.append("contentVersion", 1.0);
        formData.append("contentType", mediaPayload.contentType);
        formData.append("mediaUrl", mediaPayload.mediaUrl);
        formData.append("isActive", mediaPayload.isActive || 1);
        formData.append("fileName", withoutWhitespaces);

        try {
          const res = await postApiCall("addMedia", formData);

          setLoading(false);

          // const extractResponse = extractZip(mediaPayload.mediaUrl);

          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Media Updated Successfully",
            life: 3000,
          });
          setTimeout(() => {
            navigate("/admin/trainingmedialibrary");
          }, 2000);
        } catch (err) {
          setLoading(false);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Media has not been added",
            life: 3000,
          });
        }
      } else {
        setLoading(true);
        //post data that has only filesallowed extesnions
        const fileName = mediaPayload.mediaUrl?.name.split(".")[0];
        const uniqueFileName = `${fileName}`;
        const withoutWhitespaces = uniqueFileName.replace(/\s/g, "");

        const formData = new FormData();
        formData.append("optionType", mediaType);
        formData.append("parentContent", mediaPayload.parentContent);
        formData.append("contentVersion", version);
        formData.append("contentName", mediaPayload.contentName);
        formData.append("contentType", mediaPayload.contentType);
        formData.append("mediaUrl", mediaPayload.mediaUrl);
        formData.append("isActive", mediaPayload.isActive || 1);
        formData.append("fileName", withoutWhitespaces);

        try {
          const res = await postApiCall("addMedia", formData);
          setLoading(false);

          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Media Updated Successfully",
            life: 3000,
          });
          setTimeout(() => {
            navigate("/admin/trainingmedialibrary");
          }, 2000);
        } catch (err) {
          setLoading(false);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Media has not been updated",
            life: 3000,
          });
        }
      }
    }
  };

  useEffect(() => {
    if (token !== "Bearer null") {
      getContentTypes();
      getParentContent();
    }
  }, []);

  useEffect(() => {
    if (parentContentId && mediaType) {
      if (mediaType == 1 && parentContentId) {
        getContentVersion();
      } else if (mediaType == 2 && parentContentId) {
        getContentVersion();
      }
    }
  }, [parentContentId, mediaType]);

  return (
    <CRow>
      <CCol xs={12}>
        <Toast ref={toast} />
        <CCard className="mb-4">
          <CCardHeader className={`formHeader`}>
            <strong>Manage Media</strong>
          </CCardHeader>

          <CCardBody className="card-body org border-top p-9">
            <CForm className={`row g-15 needs-validation InputThemeColor`}>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7"
                    >
                      Media
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormSelect
                        id="media-type"
                        name="media-type"
                        value={mediaType}
                        onChange={handleMediaTypeChange}
                        aria-label="select example"
                      >
                        <option value="" disabled>
                          Select Media
                        </option>
                        <option value="3">Add New File</option>
                        <option value="2">Add New Version</option>
                        <option value="1">Update/Replace Existing Media</option>
                      </CFormSelect>
                    </div>
                  </CRow>
                </CCol>

                {mediaType === "3" ? (
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Content Name
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormInput
                          type="text"
                          placeholder="Content Name"
                          onChange={(e) => {
                            setMediaPayload({
                              ...mediaPayload,
                              contentName: e.target.value,
                            });
                            setValidationMessages({
                              ...validationMessages,
                              contentName: e.target.value
                                ? ""
                                : "ContentName is required",
                            });
                          }}
                        />
                        {showValidationMessages &&
                          validationMessages.contentName && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.contentName}
                            </div>
                          )}
                      </div>
                    </CRow>
                  </CCol>
                ) : (
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Parent Content
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CInputGroup>
                          <CFormSelect
                            required
                            aria-label="select example"
                            onChange={(e) => {
                              handleChangeParentContent(e.target.value);
                              setValidationMessages({
                                ...validationMessages,
                                parentContent: e.target.value
                                  ? ""
                                  : "ParentContent is required",
                              });
                            }}
                          >
                            <option>Select Parent Content</option>
                            {parentContent.map((parent) => (
                              <option value={parent.contentId}>
                                {parent.contentName}
                              </option>
                            ))}
                          </CFormSelect>
                        </CInputGroup>
                        {showValidationMessages &&
                          validationMessages.parentContent && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.parentContent}
                            </div>
                          )}
                      </div>
                    </CRow>
                  </CCol>
                )}
              </CRow>
              <>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Content Type
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormSelect
                          required
                          value={mediaPayload.contentType}
                          aria-label="Select Content Type"
                          id="contentType"
                          onChange={(e) => {
                            handleContentTypeChange(e.target.value);
                            setValidationMessages({
                              ...validationMessages,
                              contentType: e.target.value
                                ? ""
                                : "ContentType is required",
                            });
                          }}
                        >
                          <option value={0}>Select Content Type</option>
                          {
                            /*map content type with options. */
                            contentType.map((contentTypes) => (
                              <option
                                value={contentTypes.contentTypesId}
                                key={contentTypes.contentTypesId}
                              >
                                {contentTypes.contentType}
                              </option>
                            ))
                          }
                        </CFormSelect>
                        {showValidationMessages &&
                          validationMessages.contentType && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.contentType}
                            </div>
                          )}
                      </div>
                    </CRow>
                  </CCol>
                  {mediaType === "3" && (
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7 required"
                        >
                          Version
                        </CFormLabel>
                        <div className="col-sm-7">
                          <CFormInput
                            disabled
                            type="text"
                            placeholder="Version"
                            value={"1.0"}
                          />
                        </div>
                      </CRow>
                    </CCol>
                  )}

                  {mediaType === "1" && (
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7 required"
                        >
                          Version
                        </CFormLabel>
                        <div className="col-sm-7">
                          <CFormSelect
                            required
                            id="versionSet"
                            classNamePrefix="Select Content Version"
                            onChange={(e) => {
                              onChangeContentVersion(e.target.value);
                              setValidationMessages({
                                ...validationMessages,
                                version: e.target.value
                                  ? ""
                                  : "Version is required",
                              });
                            }}
                          >
                            <option>Select Version</option>
                            {versionList &&
                              versionList.map((e) => (
                                <option value={e.value} key={e.value}>
                                  {e.value}
                                </option>
                              ))}
                          </CFormSelect>
                          {showValidationMessages &&
                            validationMessages.version && (
                              <div
                                className="fw-bolder"
                                style={{ color: "red" }}
                              >
                                {validationMessages.version}
                              </div>
                            )}
                        </div>
                      </CRow>
                    </CCol>
                  )}
                  {mediaType === "2" && (
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7 required"
                        >
                          Version
                        </CFormLabel>
                        <div className="col-sm-7">
                          <CFormInput
                            disabled
                            type="text"
                            placeholder="Version"
                            value={version}
                          />
                          {showValidationMessages &&
                            validationMessages.version && (
                              <div
                                className="fw-bolder"
                                style={{ color: "red" }}
                              >
                                {validationMessages.version}
                              </div>
                            )}
                        </div>
                      </CRow>
                    </CCol>
                  )}
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    {mediaPayload?.contentType == 5 ||
                    mediaPayload?.contentType == 8 ? (
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7 required"
                        >
                          Add URL
                        </CFormLabel>
                        <div className="col-sm-7 ">
                          <CFormTextarea
                            type="textarea"
                            className="mb-3"
                            placeholder="Add URL"
                            onChange={(e) => {
                              getYoutubeId(e.target.value);
                              setValidationMessages({
                                ...validationMessages,
                                mediaUrl: e.target.value
                                  ? ""
                                  : "MediaUrl is required",
                              });
                            }}
                          />

                          {selectedParentContent && mediaType === "1" && (
                            <>
                              {mediaData && (
                                <div
                                  className="alert alert-success"
                                  style={{ marginTop: "5px" }}
                                >
                                  <strong>Current File : </strong>
                                  {mediaData.mediaName}
                                </div>
                              )}
                            </>
                          )}
                          {showValidationMessages &&
                            validationMessages.mediaUrl && (
                              <div
                                className="fw-bolder"
                                style={{ color: "red" }}
                              >
                                {validationMessages.mediaUrl}
                              </div>
                            )}
                        </div>
                      </CRow>
                    ) : (
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7 required"
                        >
                          Upload Media
                        </CFormLabel>
                        <div className="col-sm-7">
                          <div className="input-group">
                            <CFormInput
                              type="file"
                              accept={files}
                              id="uploadMedia3"
                              onChange={(e) => {
                                handleMediaChange(e);
                                setMediaPayload({
                                  ...mediaPayload,
                                  mediaUrl: e.target.files[0],
                                });
                                setValidationMessages({
                                  ...validationMessages,
                                  mediaUrl: e.target.value
                                    ? ""
                                    : "MediaUrl is required",
                                });
                              }}
                            />
                            {files && (
                              <>
                                <label
                                  className="input-group-text"
                                  htmlFor="formFile"
                                  style={{
                                    fontSize: ".4rem",
                                    cursor: "pointer",
                                    padding: "0.2rem 0.5rem",
                                  }}
                                >
                                  <i
                                    className="custom-choose-btn2"
                                    data-pr-tooltip={`Files Allowed: ${files}`}
                                    data-pr-position="right"
                                    data-pr-at="right+5 top"
                                    data-pr-my="left center-2"
                                    style={{
                                      fontSize: ".4rem",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <img src="/media/icon/gen045.svg" />
                                  </i>
                                </label>
                                <Tooltip
                                  target=".custom-choose-btn2"
                                  content="Upload Only PDF,DOC,PPT,JPG,JPEG"
                                  position="bottom"
                                ></Tooltip>
                              </>
                            )}
                          </div>

                          {selectedParentContent && mediaType === "1" && (
                            <>
                              {mediaData && (
                                <>
                                  <div
                                    className="alert alert-success"
                                    style={{ marginTop: "5px" }}
                                  >
                                    <strong>Current File : </strong>
                                    {mediaData.mediaName}
                                  </div>
                                </>
                              )}
                            </>
                          )}

                          {previewData && (
                            <>
                              {previewData?.format === "docx" ||
                              previewData?.format === "pptx" ||
                              previewData?.format === "xlsx" ||
                              previewData?.format === "doc" ||
                              previewData?.format === "ppt" ||
                              previewData?.format === "xls" ? (
                                <>
                                  <div className="alert alert-success mt-1">
                                    <strong>File Selected: </strong>
                                    {previewData?.name}
                                  </div>
                                </>
                              ) : (
                                <img
                                  style={{
                                    objectFit: "contain ",
                                    width: "500px",
                                    height: "300px",
                                    marginLeft: "-60px",
                                  }}
                                  src={previewData?.blob}
                                  alt="File Preview"
                                ></img>
                              )}
                            </>
                          )}
                          {showValidationMessages &&
                            validationMessages.mediaUrl && (
                              <div
                                className="fw-bolder"
                                style={{ color: "red" }}
                              >
                                {validationMessages.mediaUrl}
                              </div>
                            )}
                        </div>
                      </CRow>
                    )}
                  </CCol>

                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Status
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormSwitch
                          size="xl"
                          defaultChecked
                          id="formSwitchCheckDefaultXL"
                          onChange={(e) =>
                            onChangeisActive(e.target.checked ? 1 : 2)
                          }
                        />
                      </div>
                    </CRow>
                  </CCol>
                </CRow>
              </>
            </CForm>
          </CCardBody>

          <CCardFooter>
            <div className="d-flex justify-content-end mt-1">
              {/* {(mediaPayload?.contentType == 3 ||
                mediaPayload?.contentType == 9) &&
                mediaPayload.mediaUrl && (
                  <ProgressBar
                    value={value1}
                    className="mt-2 me-2"
                    style={{ width: "30%" }}
                  ></ProgressBar>
                )} */}

              <CButton
                // to="/admin/trainingmedialibrary"
                onClick={() => {
                  navigate(-1);
                }}
                className={`btn btn-primary saveButtonTheme me-2`}
              >
                Back
              </CButton>
              <div>
                {mediaPayload.contentType == 3 ||
                mediaPayload.contentType == 9 ? (
                  <CButton
                    className={`btn btn-primary saveButtonTheme me-2`}
                    onClick={manageMedia}
                    disabled={loading}
                  >
                    Save
                  </CButton>
                ) : (
                  <CButton
                    className={`btn btn-primary saveButtonTheme me-2`}
                    onClick={manageMedia}
                    disabled={loading}
                  >
                    {loading && (
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    )}
                    Save
                  </CButton>
                )}
              </div>
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default AddEditTrainingMediaLibrary;
