import React, { useEffect, useState, useRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSwitch,
  CRow,
  CFormTextarea,
  CFormSelect,
  CForm,
  CCardFooter,
  CFormCheck,
  CButton,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./../../css/themes.css";
import { Toast } from "primereact/toast";
import { InputCustomEditor } from "../InputCustomEditor/InputCustomEditor";
import CreatableSelect from "react-select/creatable";
import { Tooltip } from "primereact/tooltip";
import * as pdfjsLib from "pdfjs-dist";
import postApiCall from "src/server/postApiCall";
import getApiCall from "src/server/getApiCall";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

const adddocument = () => {
  const toast = useRef(null),
    [isloading, setLoading1] = useState(false),
    token = "Bearer " + localStorage.getItem("ApiToken"),
    navigate = useNavigate(),
    [validationMessages, setValidationMessages] = useState({}),
    [showValidationMessages, setShowValidationMessages] = useState(false),
    [showErrorMessage, setShowErrorMessage] = useState(false),
    [imgData, setImgData] = useState(null),
    [docDetail, setDocdetail] = useState(""),
    [certImg, setCertImg] = useState(),
    [categoryListing, setcategoryListing] = useState([]),
    [cat, setCat] = useState([]),
    [isChecked, setIsChecked] = useState(false),
    [previewData, setPreviewData] = useState(),
    [showTextEditor, setShowTextEditor] = useState(false),
    [selectedFile, setSelectedFile] = useState(null),
    colorName = localStorage.getItem("ThemeColor"),
    [themes, setThemes] = useState(colorName);
  let formData = new FormData();

  const onChangePicture = (e) => {
    if (e.target.files[0]) {
      setCertImg(e.target.files[0]);
      if (e.target.files[0].type === "application/pdf") {
        loadPDF(URL.createObjectURL(e.target.files[0]));
      } else {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setImgData(reader.result);
        });
        reader.readAsDataURL(e.target.files[0]);
      }
    } else {
      setImgData(null);
      setCertImg(null);
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
    });
  }

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewData({
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }
  };

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
    });
  }
  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    setForm({ ...form, allowDownload: checked ? 1 : 0 });
  };

  const handleDocumentTypeChange = (e) => {
    const selectedType = e.target.value;
    setForm({ ...form, documentLibraryType: selectedType });
    setShowTextEditor(selectedType === "4");
    setShowValidationMessages(false);
    setValidationMessages({ documentLibraryType: "" });
  };
  const handlePublishChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === "1") {
      setForm({ ...form, isPublish: 1 });
    } else if (selectedValue === "0") {
      setForm({ ...form, isPublish: 0 });
    }

    setForm({ ...form, isPublish: selectedValue });
    setShowValidationMessages(false);
    setValidationMessages({ isPublish: "" });
  };
  useEffect(() => {
    if (token !== "Bearer null") {
      categoryList();
    }
    setForm({
      ...form,
      category: null,
    });
  }, []);

  const isDocumentFile = (file) => {
    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const fileExtension = getFileExtension(file.name);
    return allowedExtensions.includes(fileExtension.toLowerCase());
  };

  const getFileExtension = (filename) => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  function renderPage(page) {
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
      const imgData = canvas.toDataURL("image/png");
      setImgData(imgData);
    });
  }

  function loadPDF(url) {
    pdfjsLib.getDocument(url).promise.then((pdf) => {
      pdf.getPage(1).then((page) => {
        renderPage(page);
      });
    });
  }

  const [form, setForm] = useState({
    documentLibraryTitle: "",
    category: null,
    documentLibraryDescription: "",
    documentLibraryLink: "",
    documentLibraryType: "",
    allowDownload: "",
    isActive: 1,
    isPublish: "",
  });

  const isVideoFile = (file) => {
    const allowedExtensions = [".mp4", ".mov", ".avi"];
    const fileExtension = getFileExtension(file.name);
    return allowedExtensions.includes(fileExtension.toLowerCase());
  };

  const isAudioFile = (file) => {
    const allowedExtensions = [".mp3", ".wav", ".ogg"];
    const fileExtension = getFileExtension(file.name);
    return allowedExtensions.includes(fileExtension.toLowerCase());
  };

  const isImageFile = (file) => {
    if (!file) return false;

    const allowedFormats = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
    ];
    return allowedFormats.includes(file.type);
  };

  const addDocument = async (data) => {
    setLoading1(true);
    try {
      const res = await postApiCall("addDocumentLibrary", data);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Document Added Successfully",
        life: 3000,
      });
      setTimeout(() => {
        navigate("/superadmin/documentlibrary");
      }, 3000);
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Adding Document",
        life: 3000,
      });
    }
  };

  const categoryList = async () => {
    try {
      const res = await getApiCall("getCategoryOptionList");
      setcategoryListing(
        res.map((e) => ({
          label: e.categoryName,
          value: e.categoryId,
        }))
      );
    } catch (err) { }
  };

  const addCategoryApi = async (text) => {
    const data = { categoryName: text };
    try {
      const res = await postApiCall("addNewCategory", data);
      categoryList();
      if (form.category == null) {
        setForm({
          ...form,
          category: [
            {
              value: res,
              label: text,
            },
          ],
        });
      } else {
        setForm({
          ...form,
          category: [
            ...form.category,
            {
              value: res,
              label: text,
            },
          ],
        });
      }
    } catch (err) {
      setLoading1(false);
    }
  };

  const handleCreateCategory = (value) => {
    addCategoryApi(value);
  };

  const handleChangeCategory = (value) => {
    setForm({ ...form, category: value });
  };

  const validateForm = () => {
    const messages = {};
    let isValid = true;

    if (!form.documentLibraryTitle) {
      messages.documentLibraryTitle = "Document Name is required";
      isValid = false;
    }

    if (!form.documentLibraryType) {
      messages.documentLibraryType = "Document Type is required";
      isValid = false;
    }

    if (!form.category) {
      messages.category = "Categories are required";
      isValid = false;
    }

    if (!form.isPublish) {
      messages.isPublish = "Publish field is required";
      isValid = false;
    }

    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };

  const handleSave = () => {
    if (validateForm()) {
      let categoryString = "";
      if (form.category && form.category.length > 0) {
        categoryString = form.category.map((e) => e.value).join(",");
      }
      const formData = new FormData();
      formData.append("documentLibraryTitle", form.documentLibraryTitle);
      formData.append("category", categoryString);
      formData.append("documentLibraryLink", selectedFile || "");
      formData.append("allowDownload", form.allowDownload);
      formData.append("documentLibraryType", form.documentLibraryType);
      formData.append("isPublish", form.isPublish);
      formData.append("isActive", form.isActive);
      formData.append(
        "documentLibraryDescription",
        form.documentLibraryDescription
      );
      addDocument(formData);
    }
  };

  useEffect(() => {
    if (docDetail) {
      setForm({
        documentLibraryTitle: docDetail.documentLibraryTitle,
        category: cat && cat.map((e) => ({ label: e.label, value: e.value })),
        documentLibraryDescription: docDetail.documentLibraryDescription,
        documentLibraryLink: docDetail.documentLibraryLink,
        allowDownload: docDetail.allowDownload,
        documentLibraryType: docDetail.documentLibraryType,
        isPublish: docDetail.isPublish,
        isActive: docDetail.isActive,
      });
    }
  }, [docDetail]);

  return (
    <CRow>
      <Toast ref={toast} />
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Add Document</strong>
          </CCardHeader>
          <CCardBody className="card-body org border-top p-9">
            <CForm
              className={`row g-15 needs-validation InputThemeColor${themes}`}
              form={form}
              onFinish={addDocument}
            >
              <CRow className="mb-1">
                <CCol md={6}>
                  <CRow className="mb-1">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      style={{ fontSize: '0.8rem' }}
                    >
                      Document Name
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="text"
                        value={form.documentLibraryTitle}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            documentLibraryTitle: e.target.value,
                          });
                          setValidationMessages({
                            ...validationMessages,
                            documentLibraryTitle: e.target.value
                              ? ""
                              : "Document Name is required",
                          });
                        }}
                        id="validationCustom01"
                        required
                        style={{ fontSize: '0.2rem' }}
                        placeholder="Document Name"
                      />
                      {showValidationMessages &&
                        validationMessages.documentLibraryTitle && (
                          <div className="fw-bolder" style={{ color: "red" }}>
                            {validationMessages.documentLibraryTitle}
                          </div>
                        )}
                    </div>
                  </CRow>
                </CCol>

                <CCol md={6}>
                  <CRow className="mb-1">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      style={{ fontSize: '0.8rem' }}
                    >
                      Category
                    </CFormLabel>

                    <div className="col-sm-7">
                      <CreatableSelect
                        isClearable
                        isMulti
                        options={categoryListing}
                        value={form.category}
                        onCreateOption={handleCreateCategory}
                        onChange={(e) => {
                          handleChangeCategory(e);
                          setValidationMessages({
                            ...validationMessages,
                            category: e ? "" : "Categories is required",
                          });
                        }}
                        feedbackInvalid="location"
                        id="validationCustom12"
                        required
                        placeholder="Select"
                      />
                      {showValidationMessages &&
                        validationMessages.category && (
                          <div className="fw-bolder" style={{ color: "red" }}>
                            {validationMessages.category}
                          </div>
                        )}
                    </div>
                    <div className="col-sm-7 offset-sm-4 mt-2"></div>
                  </CRow>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={2} className="mb-2">
                  <CFormLabel
                    htmlFor=""
                    className="col-form-label fw-bolder fs-7"
                    style={{ fontSize: '0.8rem' }}
                  >
                    Description
                  </CFormLabel>
                </CCol>
                <CCol md={10}>
                  <InputCustomEditor
                    value={form.documentLibraryDescription}
                    id="validationCustom01"
                    required
                    label="Description"
                    showErrorMessage={showErrorMessage}
                    onChange={(e) => {
                      setForm({ ...form, documentLibraryDescription: e });
                      setValidationMessages({
                        ...validationMessages,
                        documentLibraryDescription: e
                          ? ""
                          : "Description is required",
                      });
                    }}
                  />
                  {showValidationMessages && validationMessages.description && (
                    <div className="fw-bolder" style={{ color: "red" }}>
                      {validationMessages.description}
                    </div>
                  )}
                </CCol>
              </CRow>

              <CRow className="mb-1">
                <CCol md={6}>
                  <CRow className="mb-2">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      style={{ fontSize: '0.8rem' }}
                    >
                      Document Type
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormSelect
                        value={form.documentLibraryType}
                        onChange={handleDocumentTypeChange}
                        id="validationCustom01"
                        style={{ lineHeight: "1.5" }}
                        required
                      >
                        <option value="">Select a Document</option>
                        <option value="1">Document</option>
                        <option value="2">Image</option>
                        <option value="5">Video</option>
                        <option value="3">Audio</option>
                        <option value="4">Embeded code</option>
                      </CFormSelect>
                      {showValidationMessages &&
                        validationMessages.documentLibraryType && (
                          <div className="fw-bolder" style={{ color: "red" }}>
                            {validationMessages.documentLibraryType}
                          </div>
                        )}
                    </div>
                    <div className="col-sm-7 offset-sm-4 mt-2"></div>
                  </CRow>
                </CCol>


                <CCol md={4}>
                  <CRow className="mb-2">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      style={{ fontSize: '0.8rem' }}
                    >
                      Publish
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormSelect
                        value={form.isPublish}
                        onChange={handlePublishChange}
                        id="validationCustom01"
                        style={{ lineHeight: "1.5" }}
                        required

                      >
                        <option value="">Select</option>
                        <option value="1">Publish</option>
                        <option value="0">Unpublish</option>
                      </CFormSelect>
                      {showValidationMessages &&
                        validationMessages.documentLibraryType && (
                          <div className="fw-bolder" style={{ color: "red" }}>
                            {validationMessages.isPublish}
                          </div>
                        )}
                    </div>
                    <div className="col-sm-7 offset-sm-4 mt-2"></div>
                  </CRow>
                </CCol>

                <CCol md={2}>
                  <CRow className="mb-2">
                    <div className="col-sm-4">
                      <CFormLabel
                        htmlFor=""
                        className="col-form-label fs-7 fw-bolder"
                        style={{ fontSize: '0.8rem' }}
                      >
                        Status
                        <span className="text-danger" style={{ marginLeft: '4px' }}>*</span>
                      </CFormLabel>
                    </div>
                    <div className={`col-sm-7 themeColors${themes}`}>
                      <CFormSwitch
                        size="xl"
                        id="formSwitchCheckDefaultXL"
                        checked={form.isActive === 1}
                        onChange={(e) =>
                          e.target.checked
                            ? setForm({ ...form, isActive: 1 })
                            : setForm({ ...form, isActive: 2 })
                        }
                      />
                    </div>
                  </CRow>
                </CCol>

              </CRow>
              <CRow className="mb-1">
                {form.documentLibraryType && form.documentLibraryType !== "4" && (
                  <CCol md={6}>
                    <CRow className="mb-2">
                      <div
                        className={`InputThemeColor${themes}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginTop: "4px",
                        }}
                      >
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7 required"
                          style={{ fontSize: '0.8rem' }}
                        >
                          Upload File
                        </CFormLabel>
                        <CFormInput
                          type="file"
                          id="formFile"
                          accept={
                            form.documentLibraryType === "2"
                              ? "image/*"
                              : form.documentLibraryType === "1"
                                ? ".pdf, .doc, .docx"
                                : form.documentLibraryType === "5"
                                  ? "video/*"
                                  : form.documentLibraryType === "3"
                                    ? "audio/*"
                                    : form.documentLibraryType === "4"
                                      ? "embeddedcode/*"
                                      : ""
                          }
                          onChange={(e) => {
                            handleMediaChange(e);

                            const selectedFile = e.target.files[0];

                            if (
                              form.documentLibraryType === "2" &&
                              !isImageFile(selectedFile)
                            ) {
                              setValidationMessages({
                                documentLibraryType: "Please select a valid image file.",
                              });
                            } else if (
                              form.documentLibraryType === "1" &&
                              !isDocumentFile(selectedFile)
                            ) {
                              setValidationMessages({
                                documentLibraryType:
                                  "Please select a valid document file (PDF, DOC, DOCX).",
                              });
                            } else if (
                              form.documentLibraryType === "5" &&
                              !isVideoFile(selectedFile)
                            ) {
                              setValidationMessages({
                                documentLibraryType: "Please select a valid video file.",
                              });
                            } else if (
                              form.documentLibraryType === "3" &&
                              !isAudioFile(selectedFile)
                            ) {
                              setValidationMessages({
                                documentLibraryType: "Please select a valid audio file.",
                              });
                            } else {
                              setValidationMessages({
                                documentLibraryType: "",
                              });

                              setForm({
                                ...form,
                                documentLibraryFilename: selectedFile,
                              });
                              onChangePicture(e);
                            }
                          }}
                        />
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
                              data-pr-tooltip={`Files Allowed: ${form.documentLibraryType === "2"
                                ? "JPEG, PNG, SVG"
                                : form.documentLibraryType === "5"
                                  ? "mp4,wma,aac,m4a,flac,wav,flv"
                                  : form.documentLibraryType === "1"
                                    ? "doc,docx,ppt,pptx,xls,xlsv,pdf"
                                    : form.documentLibraryType === "3"
                                      ? "mp3,wma,aac,m4a,wav,flac"
                                      : ""
                                }`}
                              data-pr-position="right"
                              data-pr-at="right+5 top"
                              data-pr-my="left center-2"
                              style={{
                                fontSize: ".9rem",
                                cursor: "pointer",
                              }}
                            >
                              <img src="/media/icon/gen045.svg" />
                            </i>
                          </label>
                          <Tooltip
                            target=".custom-choose-btn2"
                            content={`Upload Only ${form.documentLibraryType === "2"
                              ? "JPEG, PNG, SVG"
                              : form.documentLibraryType === "1"
                                ? "PDF, DOC, PPT"
                                : ""
                              }`}
                            position="bottom"
                          ></Tooltip>
                        </>
                      </div>
                    </CRow>
                    <>
                      {previewData && (
                        <div
                          className="alert alert-success"
                          style={{
                            marginTop: "5px",
                            marginLeft: "200px",
                            maxHeight: "20px",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            lineHeight: "1",
                          }}
                        >
                          <strong>File Selected: </strong>
                          {previewData.name}
                        </div>
                      )}
                    </>
                  </CCol>
                )}

                {form.documentLibraryType === "4" && showTextEditor && (
                  <>
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-2 col-form-label fw-bolder fs-7 required"
                      style={{ fontSize: '0.8rem' }}
                    >
                      Upload Link
                    </CFormLabel>
                    <div className="col-sm-4" >
                      <CFormTextarea
                        type="textarea"
                        placeholder="Upload Document Link"
                        value={form.documentLibraryLink}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            documentLibraryLink: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </>
                )}



                {/* <CCol md={4}>
                  <CRow className="mb-3">
                    <div
                      className={`InputThemeColor${themes}`}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <CFormCheck
                        value="Modify user"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                      />
                      <span style={{ marginLeft: "10px", marginTop: "9px" }}>
                        Allow Download
                      </span>
                    </div>
                  </CRow>
                </CCol> */}



                <CCol md={6}>
                  <CRow className="mb-2">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fs-7 fw-bolder"
                      style={{ fontSize: '0.8rem' }}
                    >
                      Allow Download
                    </CFormLabel>
                    <div className="col-sm-2" style={{ display: "flex", alignItems: "center", marginLeft: "-60px" }}>

                      <CFormCheck
                        value="Modify user"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        style={{ width: "1rem", height: "1rem" }}
                      />
                    </div>
                    <div className="col-sm-7 offset-sm-4 mt-2"></div>
                  </CRow>
                </CCol>







              </CRow>

            </CForm>
          </CCardBody>
          <CCardFooter>
            <div className="d-flex justify-content-end">
              <Link
                to="/superadmin/documentlibrary"
                className={`btn btn-primary me-2 saveButtonTheme${themes}`}
                onClick={() => {
                  localStorage.removeItem("documentLibraryId");
                }}
              >
                Back
              </Link>
              <CButton
                className={`me-2 saveButtonTheme${themes}`}
                onClick={() => {
                  localStorage.removeItem("menuId");
                  handleSave();
                }}
                disabled={isloading}
              >
                {isloading && (
                  <span
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                Save
              </CButton>
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default adddocument;
