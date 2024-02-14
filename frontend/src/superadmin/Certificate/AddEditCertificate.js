import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CRow,
  CFormSwitch,
  CForm,
  CCardFooter,
  CFormCheck,
  CButton,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../../scss/required.scss";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
import { Toast } from "primereact/toast";
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";
import generalUpdateApi from "src/server/generalUpdateApi";
import ContentEditor from "./ContentEditor";
import "../../css/form.css";

const initialFormState = {
  certificateName: "",
  bgImage: "",
  description: "",
  baseLanguage: "",
  certificateCode: "",
  certStructure: "",
  orientation: "",
  meta: "",
  userRelease: 1,
  isActive: 1,
};


const addEditCertificate = () => {
  const toast = useRef(null),
    [showModalP, setShowModalP] = useState(false),
    [isloading, setLoading1] = useState(false),
    token = "Bearer " + localStorage.getItem("ApiToken"),
    navigate = useNavigate(),
    [validationMessages, setValidationMessages] = useState({}),
    [showValidationMessages, setShowValidationMessages] = useState(false);
  let formData = new FormData(),
    [imgData, setImgData] = useState(null),
    [certificateDetail, setCertificatedetail] = useState(""),
    [certImg, setCertImg] = useState(""),
    [editorState, setEditorState] = useState(""),
    [certStructure, setCertStructure] = useState(""),
    [dynamicField, setDynamicField] = useState([]),
    [updateImg, setUpdateImg] = useState(""),
    colorName = localStorage.getItem("ThemeColor"),
    [themes, setThemes] = useState(colorName),
    [certificateId, setCertificateId] = useState();

  const [form, setForm] = useState(initialFormState);

  // let certificateId1 = "";
  // useEffect(() => {
  //   certificateId1 = localStorage.getItem("certificateId");
  //   setCertificateId(certificateId1);
  // }, []);

  useEffect(() => {
    const storedCertificateId = localStorage.getItem("certificateId");
    if (storedCertificateId) {
      setCertificateId(storedCertificateId);
    }
  }, []);

  // const onChangePicture = (e) => {
  //   if (e.target.files[0]) {
  //     setCertImg(e.target.files[0]);
  //     if (e.target.files[0].type === "application/pdf") {
  //       loadPDF(URL.createObjectURL(e.target.files[0]));
  //     } else {
  //       setForm({ ...form, bgImage: e.target.files[0] });
  //       const reader = new FileReader();
  //       reader.addEventListener("load", () => {
  //         setImgData(reader.result);
  //       });
  //       reader.readAsDataURL(e.target.files[0]);
  //     }
  //   } else {
  //     setImgData(null);
  //     setCertImg("");
  //   }
  // };

  const onChangePicture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCertImg(file);
      if (file.type === "application/pdf") {
        loadPDF(URL.createObjectURL(file));
      } else {
        setForm({ ...form, bgImage: file });
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setImgData(reader.result);
        });
        reader.readAsDataURL(file);
      }
    } else {
      setImgData(null);
      setCertImg("");
    }
  };

  // const getCertificateListing = async () => {
  //   try {
  //     const res = await getApiCall("getCertificateList");
  //     if (!certificateId) {
  //       if (
  //         (res.length > 0 && res[0].certificateCode === null) ||
  //         res.length === 0
  //       ) {
  //         setForm({
  //           ...form,
  //           certificateCode: 100001,
  //         });
  //       } else {
  //         setForm({
  //           ...form,
  //           certificateCode: parseInt(res[0].certificateCode) + 1,
  //         });
  //       }
  //     }
  //     setroleDetail(res);
  //   } catch (err) {}
  // };

  const getCertificateListing = async () => {
    try {
      const res = await getApiCall("getCertificateList");
      if (!certificateId) {
        const newCertificateCode = (res.length > 0 && res[0].certificateCode === null) || res.length === 0
          ? 100001
          : parseInt(res[0].certificateCode) + 1;
        setForm({ ...form, certificateCode: newCertificateCode });
      }
      setroleDetail(res);
    } catch (err) {
      console.error("Error fetching certificate list:", err);
    }
  };

  useEffect(() => {
    if (token) {
      getCertificateListing();
    }
  }, []);

  // function loadPreview(url) {
  //   if (url) {
  //     const extension = url.substring(url.lastIndexOf(".")).substring(1);
  //     if (extension === "pdf") {
  //       loadPDF(url);
  //     }
  //     return url;
  //   }
  // }

  function loadPreview(url) {
    if (url && url.endsWith(".pdf")) {
      loadPDF(url);
    }
  }

  // function renderPage(page) {
  //   const canvas = document.createElement("canvas");
  //   const viewport = page.getViewport({ scale: 2 });
  //   canvas.width = viewport.width;
  //   canvas.height = viewport.height;
  //   const context = canvas.getContext("2d");
  //   const renderTask = page.render({
  //     canvasContext: context,
  //     viewport: viewport,
  //   });

  //   renderTask.promise.then(async () => {
  //     const imgData = canvas.toDataURL("image/png");
  //     setImgData(imgData);
  //     const response = await fetch(imgData);
  //     const blob = await response.blob();
  //     setForm({ ...form, bgImage: blob });
  //   });
  // }

  async function renderPage(page) {
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext("2d");

    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;

    const imgData = canvas.toDataURL("image/png");
    const response = await fetch(imgData);
    const blob = await response.blob();

    setImgData(imgData);
    setForm({ ...form, bgImage: blob });
  }

  // function loadPDF(url) {
  //   pdfjsLib.getDocument(url).promise.then((pdf) => {
  //     pdf.getPage(1).then((page) => {
  //       renderPage(page);
  //     });
  //   });
  // }

  async function loadPDF(url) {
    try {
      const pdf = await pdfjsLib.getDocument(url).promise;
      const page = await pdf.getPage(1);
      renderPage(page);
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  }

  const updateParentState = (childState) => {
    setEditorState(childState);
  };

  // useEffect(() => {
  //   if (editorState) {
  //     setForm({ ...form, certStructure: editorState });
  //     setValidationMessages({
  //       ...validationMessages,
  //       certStructure: editorState ? "" : "Certificate structure is required",
  //     });
  //   }
  // }, [editorState]);

  // const [form, setForm] = useState({
  //   certificateName: "",
  //   bgImage: "",
  //   description: "",
  //   baseLanguage: "",
  //   certificateCode: "",
  //   certStructure: "",
  //   orientation: "",
  //   meta: "",
  //   userRelease: 1,
  //   isActive: 1,
  // });

  useEffect(() => {
    if (editorState) {
      setForm(prevForm => ({
        ...prevForm,
        certStructure: editorState
      }));

      setValidationMessages(prevMessages => ({
        ...prevMessages,
        certStructure: editorState ? "" : "Certificate structure is required"
      }));
    }
  }, [editorState]);

  useEffect(() => {
    getDynamicFields();
  }, []);

  const getDynamicFields = async () => {
    try {
      const res = await getApiCall("getDynamicFieldList");
      setDynamicField(res);
    } catch (err) { }
  };

  useEffect(() => {
    if (certificateId) {
      certificateApi(Number(certificateId));
    }
  }, [certificateId]);

  const addCertificate = async (form) => {
    setLoading1(true);
    try {
      const res = await postApiCall(
        "addNewCertificate",
        form,
        "multipart/form-data"
      );
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Certificate Added Successfully",
        life: 3000,
      });
      setTimeout(() => {
        navigate("/superadmin/certificatelist");
      }, 1500);
    } catch (err) { }
  };

  // const validateForm = () => {
  //   const messages = {};
  //   let isValid = true;

  //   if (!form.certificateName) {
  //     messages.certificateName = "Certificate Name is required";
  //     isValid = false;
  //   } else {
  //     messages.certificateName = "";
  //   }

  //   if (!form.certificateCode) {
  //     messages.certificateCode = "Certificate Code is required";
  //     isValid = false;
  //   }

  //   if (!form.orientation) {
  //     messages.orientation = "Orientation is required";
  //     isValid = false;
  //   }

  //   if (!form.description) {
  //     messages.description = "Description is required";
  //     isValid = false;
  //   }

  //   if (!form.meta) {
  //     messages.meta = "Meta is required";
  //     isValid = false;
  //   }

  //   if (!certificateId)
  //     if (!form.bgImage || certImg === "") {
  //       messages.bgImage = "Image is required";
  //       isValid = false;
  //     }

  //   if (!form.certStructure || form.certStructure.trim() === "") {
  //     messages.certStructure = "Certificate Structure is required";
  //     isValid = false;
  //   }

  //   setValidationMessages(messages);
  //   setShowValidationMessages(!isValid);

  //   return isValid;
  // };

  const validateForm = () => {
    const messages = {};
    let isValid = true;

    const requiredFields = [
      { field: 'certificateName', message: 'Certificate Name is required' },
      { field: 'certificateCode', message: 'Certificate Code is required' },
      { field: 'orientation', message: 'Orientation is required' },
      { field: 'description', message: 'Description is required' },
      { field: 'meta', message: 'Meta is required' }
    ];

    requiredFields.forEach(({ field, message }) => {
      if (!form[field]) {
        messages[field] = message;
        isValid = false;
      } else {
        messages[field] = '';
      }
    });

    if (!certificateId && (!form.bgImage || certImg === '')) {
      messages.bgImage = 'Image is required';
      isValid = false;
    }

    if (!form.certStructure || form.certStructure.trim() === '') {
      messages.certStructure = 'Certificate Structure is required';
      isValid = false;
    }

    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };

  const handleSave = () => {
    if (validateForm()) {
      certificateId ? updatecertificateApi(form) : addCertificate(form);
    }
  };

  // useMemo(() => {
  //   if (certificateDetail) {
  //     setForm({
  //       certificateName: certificateDetail.certificateName,
  //       orientation: certificateDetail.orientation,
  //       description: certificateDetail.description,
  //       meta: certificateDetail.meta,
  //       baseLanguage: certificateDetail.baseLanguage,
  //       isActive: certificateDetail.isActive,
  //       certStructure: certificateDetail.certStructure,
  //       certificateCode: certificateDetail.certificateCode,
  //     });
  //     loadPreview(form.bgImage);
  //     setCertStructure(certificateDetail?.certStructure);
  //   }
  // }, [certificateDetail]);

  useMemo(() => {
    if (certificateDetail) {
      const {
        certificateName, orientation, description, meta, baseLanguage, isActive, certStructure, certificateCode, bgImage
      } = certificateDetail;

      setForm({
        certificateName, orientation, description, meta, baseLanguage, isActive, certStructure, certificateCode,
        bgImage
      });
      setCertStructure(certStructure);
    }
  }, [certificateDetail]);

  useEffect(() => {
    if (form.bgImage) {
      loadPreview(form.bgImage);
    }
  }, [form.bgImage]);

  const certificateApi = async (id) => {
    try {
      const res = await getApiCall("getCertificateById", id);
      setCertificatedetail(res);
      setImgData(res.bgimage);
    } catch (err) { }
  };
  const handleClose = () => {
    setShowModalP(false);
  };

  const updatecertificateApi = async (form) => {
    let formData = new FormData();

    formData.append("certificateId", certificateId);
    formData.append("certificateName", form.certificateName);
    formData.append("certificateCode", form.certificateCode);
    formData.append("description", form.description);
    formData.append("baseLanguage", form.baseLanguage);
    formData.append("orientation", form.orientation);
    formData.append("certStructure", form.certStructure);
    formData.append("meta", form.meta);
    formData.append("bgImage", form.bgImage || "");
    setLoading1(true);
    try {
      const res = await generalUpdateApi("updateCertificateById", formData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Certificate Updated Successfully",
        life: 3000,
      });
      setLoading1(false);
      localStorage.removeItem("certificateId");
      setTimeout(() => {
        navigate("/superadmin/certificatelist");
      }, 3000);
    } catch (err) {
      setLoading1(false);
    }
  };

  return (
    <CRow>
      <Toast ref={toast} />
      <CModal
        visible={showModalP}
        onClose={handleClose}
        alignment="center"
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Preview</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div id="divToPrint" className="ql-editor">
            <div
              style={{
                backgroundImage: `url(${certImg ? imgData : imgData})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div
                style={{ height: "550px" }}
                dangerouslySetInnerHTML={{ __html: form?.certStructure }}
              />
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
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className={`formHeader${themes}`}>
            <strong>Certificate</strong>
          </CCardHeader>
          <CCardBody className="card-body org border-top p-9">
            <CForm
              className={`row g-15 needs-validation InputThemeColor${themes}`}
              form={form}
              onFinish={addCertificate}
            >
              <CRow className="mb-3">
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7 required"
                    >
                      Certificate Name
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="text"
                        value={form.certificateName}
                        onChange={(e) => {
                          setForm({ ...form, certificateName: e.target.value });
                          setValidationMessages({
                            ...validationMessages,
                            certificateName: e.target.value
                              ? ""
                              : "Certificate Name is required",
                          });
                        }}
                        id="validationCustom01"
                        required
                        placeholder="Certificate Name"
                      />
                      {showValidationMessages &&
                        validationMessages.certificateName && (
                          <div className="fw-bolder" style={{ color: "red" }}>
                            {validationMessages.certificateName}
                          </div>
                        )}
                    </div>
                  </CRow>
                </CCol>
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7 required"
                    >
                      Certificate Code
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="number"
                        onKeyDown={(e) => {
                          if (e.key === "e" || e.key === "E") {
                            e.preventDefault();
                          }
                        }}
                        disabled
                        id="validationCustom01"
                        value={form.certificateCode}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            certificateCode: e.target.value,
                          });
                          setValidationMessages({
                            ...validationMessages,
                            certificateCode: e.target.value
                              ? ""
                              : "Certificate Code is required",
                          });
                        }}
                        placeholder="Certificate Code"
                      />
                      {showValidationMessages &&
                        validationMessages.certificateCode && (
                          <div className="fw-bolder" style={{ color: "red" }}>
                            {validationMessages.certificateCode}
                          </div>
                        )}
                    </div>
                  </CRow>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7 required"
                    >
                      Orientation
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormCheck
                        inline
                        type="radio"
                        name="orientation"
                        id="inlineCheckbox1"
                        value={form.orientation}
                        checked={form.orientation === "P"}
                        onClick={() => {
                          setForm({ ...form, orientation: "P" });
                          setValidationMessages({
                            ...validationMessages,
                            orientation: "P" ? "" : "Orientation is required",
                          });
                        }}
                        label="Portrait"
                      />
                      <CFormCheck
                        inline
                        type="radio"
                        name="orientation"
                        id="inlineCheckbox2"
                        value={form.orientation}
                        checked={form.orientation === "L"}
                        onClick={() => {
                          setForm({ ...form, orientation: "L" });
                          setValidationMessages({
                            ...validationMessages,
                            orientation: "P" ? "" : "Orientation is required",
                          });
                        }}
                        label="Landscape"
                      />
                      {showValidationMessages &&
                        validationMessages.orientation && (
                          <div className="fw-bolder" style={{ color: "red" }}>
                            {validationMessages.orientation}
                          </div>
                        )}
                    </div>
                  </CRow>
                </CCol>
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7 "
                    >
                      Base Language
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        value={form.baseLanguage}
                        onChange={(e) => {
                          setForm({ ...form, baseLanguage: e.target.value });
                        }}
                        // required
                        placeholder="Base Language"
                      />
                      {showValidationMessages &&
                        validationMessages.baseLanguage && (
                          <div className="fw-bolder" style={{ color: "red" }}>
                            {validationMessages.baseLanguage}
                          </div>
                        )}
                    </div>
                  </CRow>
                </CCol>
              </CRow>

              <CRow className="mb-4">
                <CCol md={12}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-md-2 col-form-label fw-bolder fs-7 required"
                    >
                      Description
                    </CFormLabel>
                    <div className="col-sm-8 col-md-9">
                      <CFormTextarea
                        rows={3}
                        // size="lg"
                        type="text"
                        id="validationCustom01"
                        value={form.description}
                        onChange={(e) => {
                          setForm({ ...form, description: e.target.value });
                          setValidationMessages({
                            ...validationMessages,
                            description: e.target.value
                              ? ""
                              : "Description is required",
                          });
                        }}
                        required
                        placeholder="Description"
                      />
                      {showValidationMessages &&
                        validationMessages.description && (
                          <div className="fw-bolder" style={{ color: "red" }}>
                            {validationMessages.description}
                          </div>
                        )}
                    </div>
                  </CRow>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7 required"
                    >
                      Meta Keyword
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        value={form.meta}
                        onChange={(e) => {
                          setForm({ ...form, meta: e.target.value });
                          setValidationMessages({
                            ...validationMessages,
                            meta: e.target.value ? "" : "Meta is required",
                          });
                        }}
                        required
                        placeholder="Meta"
                      />
                      {showValidationMessages && validationMessages.meta && (
                        <div className="fw-bolder" style={{ color: "red" }}>
                          {validationMessages.meta}
                        </div>
                      )}
                    </div>
                  </CRow>
                </CCol>
                <CCol md={6}>
                  <CRow className="mb-4">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7 required"
                    >
                      Status
                    </CFormLabel>

                    <div className={`col-sm-7  themeColors${themes}`}>
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

              <CRow className="mb-3">
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7 required"
                    >
                      Image / PDF
                    </CFormLabel>
                    <div className="col-sm-7">
                      {certificateDetail && <></>}

                      <CFormInput
                        type="file"
                        id="formFile"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          setForm({ ...form, bgImage: e.target.files[0] }),
                            setUpdateImg(e.target.files[0]);
                          setValidationMessages({
                            ...validationMessages,
                            bgImage: e.target.files[0]
                              ? ""
                              : "Image is required",
                          });
                          onChangePicture(e);
                        }}
                      />
                      {showValidationMessages && validationMessages.bgImage && (
                        <div className="fw-bolder" style={{ color: "red" }}>
                          {validationMessages.bgImage}
                        </div>
                      )}
                    </div>
                    {imgData && (
                      <img
                        style={{
                          objectFit: "contain ",
                          width: "300px",
                          height: "200px",
                          marginTop: "10px",
                          marginLeft: "35%",
                        }}
                        src={imgData}
                      ></img>
                    )}
                  </CRow>
                </CCol>
              </CRow>
              <CRow className="">
                <CFormLabel
                  htmlFor=""
                  className="col-sm-4 col-form-label fw-bolder fs-7 required"
                >
                  Certificate Structure
                </CFormLabel>
                <div className="col-lg-12 fv-row">
                  <ContentEditor
                    // notificationContent={notificationContent}
                    dynamicList={dynamicField}
                    updateParentState={updateParentState}
                    certStructure={certStructure}
                  />

                  {showValidationMessages &&
                    validationMessages.certStructure && (
                      <div className="fw-bolder" style={{ color: "red" }}>
                        {validationMessages.certStructure}
                      </div>
                    )}
                </div>
              </CRow>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <div className="d-flex justify-content-between">
              <div className="">
                <CButton
                  className={`me-2 saveButtonTheme${themes}`}
                  onClick={() => setShowModalP(true)}
                >
                  Preview
                </CButton>
              </div>
              <div className="">
                <Link
                  to="/superadmin/certificatelist"
                  className={`btn btn-primary me-2 saveButtonTheme${themes}`}
                  onClick={() => {
                    localStorage.removeItem("certificateId");
                  }}
                >
                  Back
                </Link>
                <CButton
                  className={`me-2 saveButtonTheme${themes}`}
                  onClick={() => {
                    localStorage.removeItem("certificateId");
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
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default addEditCertificate;
