import React, { useEffect, useState, useRef } from "react";
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
  CInputGroup,
  CCardFooter,
  CButton,
} from "@coreui/react";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import * as pdfjsLib from "pdfjs-dist";
import { Tooltip } from "primereact/tooltip";
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";
import "../../css/form.css";
import { ProgressBar } from "primereact/progressbar";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
const token = "Bearer " + localStorage.getItem("ApiToken");

const addEditMediaLibrary = () => {
  var fileTypesAllowed = [];
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const [version, setVersion] = useState(),
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
  //chunk variables

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
    contentType: 0,
    mediaUrl: "",
    isActive: 1,
    contentName: "",
  });

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
    fileTypesAllowed = contentType?.filter(
      (e) => e?.contentTypesId == value
    )[0]["supportFormats"];

    if (fileTypesAllowed) {
      fileTypesAllowed = fileTypesAllowed?.replaceAll("|", ",");
      setfiles(fileTypesAllowed);
    }

    setMediaPayload((prevState) => ({
      ...prevState,
      contentType: value,
    }));
  };

  useEffect(() => {
    if (mediaPayload.contentType == 3 || mediaPayload.contentType == 9) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [mediaPayload.contentType]);

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
  const getContentVersion = async () => {
    const formData = new FormData();
    formData.append("mediaPayload.contentType", parentContentId);
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

  const manageMedia = async (e) => {
    e.preventDefault();

    if (mediaType === "3") {
      setLoading(true);
      const fileName = mediaPayload.mediaUrl?.name.split(".")[0];
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

        if (mediaPayload.contentType == 3) {
          uploadChunk();
        } else if (mediaPayload.contentType == 9) {
          extractZip();
        } else {
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Media Added Successfully",
            life: 3000,
          });
          setTimeout(() => {
            navigate("/superadmin/medialibrarylist");
          }, 2000);
        }
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
        if (mediaPayload.contentType == 3) {
          uploadChunk();
        } else if (mediaPayload.contentType == 9) {
          extractZip();
        } else {
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Media Updated Successfully",
            life: 3000,
          });
          setTimeout(() => {
            navigate("/superadmin/medialibrarylist");
          }, 2000);
        }
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
  };
  const interval = useRef(null);

  useEffect(() => {
    if (token !== "Bearer null") {
      getContentTypes();
      getParentContent();
    }
  }, []);

  useEffect(() => {
    if (parentContentId && mediaType) {
      if (mediaType == 3 && parentContentId) {
        setversionList([1.0]);
      } else if (mediaType == 1 && parentContentId) {
        getContentVersion();
      } else if (mediaType == 2 && parentContentId) {
        getContentVersion();
      }
    }
  }, [parentContentId, mediaType]);
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);

  const extractZip = () => {
    if (mediaPayload.mediaUrl) {
      const formData = new FormData();
      formData.append("file", mediaPayload.mediaUrl);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://18.190.114.28:3000/upload");

      xhr.upload.onprogress = (event) => {
        // increment i in every 2 seconds till it reaches totalChunks
        interval.current = setInterval(() => {
          if (i < totalChunks) {
            i++;
            console.log("i", i);
            progress = Math.round((i / totalChunks) * 100);
            console.log("progress", progress);
            setValue1(progress);

            if (i === totalChunks - 1) {
              setValue1(100);
            }
          }
        }, 2000);

        // console.log("progress", progress);

        return () => {
          if (interval.current) {
            clearInterval(interval.current);
            interval.current = null;
          }
        };
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          setValue1(100);
          clearInterval(interval.current);
          interval.current = null;
          const response = JSON.parse(xhr.responseText);
          console.log(response);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Media Updated Successfully",
            life: 3000,
          });
          setTimeout(() => {
            navigate("/superadmin/medialibrarylist");
          }, 1000);
        } else {
          console.error("Error uploading file:", xhr.statusText);
        }
      };

      xhr.onerror = () => {
        console.error("Network error occurred while uploading the file.");
      };

      xhr.send(formData);
    }
  };

  //testing chunk

  const uploadChunk = async () => {
    try {
      const chunkSize = 1024 * 2028; // 2MB chunk size
      const fileSize = mediaPayload.mediaUrl?.size;
      const totalChunks = Math.ceil(fileSize / chunkSize);

      const fileName = mediaPayload.mediaUrl?.name.split(".")[0];
      const uniqueFileName = `${fileName}`;
      const withoutWhitespaces = uniqueFileName.replace(/\s/g, "");

      const formData = new FormData();
      formData.append("fileName", withoutWhitespaces);
      formData.append("totalChunks", totalChunks);
      // formData.append("file", mediaPayload.mediaUrl);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://18.190.114.28:3000/uploadChunk");
      let i = 0;
      let progress = 0;
      xhr.upload.onprogress = (event) => {
        // increment i in every 2 seconds till it reaches totalChunks
        interval.current = setInterval(() => {
          if (i < totalChunks) {
            i++;
            console.log("i", i);
            progress = Math.round((i / totalChunks) * 100);
            console.log("progress", progress);
            setValue1(progress);

            if (i === totalChunks - 1) {
              setValue1(100);
            }
          }
        }, 2000);

        // console.log("progress", progress);

        return () => {
          if (interval.current) {
            clearInterval(interval.current);
            interval.current = null;
          }
        };
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setValue1(100);
          console.log(response);

          clearInterval(interval.current);
          interval.current = null;
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Media Updated Successfully",
            life: 3000,
          });

          setTimeout(() => {
            navigate("/superadmin/medialibrarylist");
          }, 1000);
          // response = true;
        } else {
          console.error("Error uploading file:", xhr.statusText);

          // response = false;
        }
      };

      xhr.onerror = () => {
        console.error("Network error occurred while uploading the file.");
        // responseStatus = false;
      };
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(fileSize, start + chunkSize);
        const chunkBlob = mediaPayload.mediaUrl?.slice(start, end);

        const reader = new FileReader();
        reader.onload = function () {
          const chunkArrayBuffer = reader.result;
          formData.append("chunkData", new Blob([chunkArrayBuffer]));
          if (i === totalChunks - 1) {
            xhr.send(formData);
          }
        };

        reader.readAsArrayBuffer(chunkBlob);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <CRow>
      <CCol xs={12}>
        <Toast ref={toast} />
        <CCard className="mb-4">
          <CCardHeader className={`formHeader${themes}`}>
            <strong>Manage Media</strong>
          </CCardHeader>

          <CCardBody className="card-body org border-top p-9">
            <CForm
              className={`row g-15 needs-validation InputThemeColor${themes}`}
            >
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
                        className="col-sm-4 col-form-label fw-bolder fs-7"
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
                          }}
                        />
                      </div>
                    </CRow>
                  </CCol>
                ) : (
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Parent Content
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CInputGroup>
                          <CFormSelect
                            required
                            aria-label="select example"
                            onChange={(e) =>
                              handleChangeParentContent(e.target.value)
                            }
                          >
                            <option>Select Parent Content</option>
                            {parentContent.map((parent) => (
                              <option value={parent.mediaPayload.contentType}>
                                {parent.contentName}
                              </option>
                            ))}
                          </CFormSelect>
                        </CInputGroup>
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
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Content Type
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormSelect
                          required
                          value={mediaPayload.contentType}
                          aria-label="Select Content Type"
                          id="contentType"
                          onChange={(e) =>
                            handleContentTypeChange(e.target.value)
                          }
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
                      </div>
                    </CRow>
                  </CCol>
                  {mediaType === "3" ? (
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
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
                  ) : (
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          Version
                        </CFormLabel>
                        <div className="col-sm-7">
                          <CFormSelect
                            required
                            id="versionSet"
                            classNamePrefix="Select Content Version"
                            onChange={(e) =>
                              onChangeContentVersion(e.target.value)
                            }
                          >
                            <option>Select Version</option>
                            {versionList &&
                              versionList.map((e) => (
                                <option value={e.value} key={e.value}>
                                  {e.value}
                                </option>
                              ))}
                          </CFormSelect>
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
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          Upload Media
                        </CFormLabel>
                        <div className="col-sm-7 ">
                          <CFormTextarea
                            type="textarea"
                            className="mb-3"
                            placeholder="Upload Media"
                            onChange={(e) => {
                              getYoutubeId(e.target.value);
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
                        </div>
                      </CRow>
                    ) : (
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
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
              {(mediaPayload?.contentType == 3 ||
                mediaPayload?.contentType == 9) &&
                mediaPayload.mediaUrl && (
                  <ProgressBar
                    value={value1}
                    className="mt-2 me-2"
                    style={{ width: "30%" }}
                  ></ProgressBar>
                )}

              <Link
                to="/superadmin/medialibrarylist"
                className={`btn btn-primary saveButtonTheme${themes} me-2`}
              >
                Back
              </Link>
              <div>
                {mediaPayload.contentType == 3 ||
                mediaPayload.contentType == 9 ? (
                  <CButton
                    className={`btn btn-primary saveButtonTheme${themes} me-2`}
                    onClick={manageMedia}
                    disabled={loading}
                  >
                    Save
                  </CButton>
                ) : (
                  <CButton
                    className={`btn btn-primary saveButtonTheme${themes} me-2`}
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

export default addEditMediaLibrary;
