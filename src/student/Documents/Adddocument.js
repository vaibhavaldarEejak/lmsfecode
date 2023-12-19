import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CRow,
  CFormSelect,
  CFormSwitch,
  CForm,
  CCardFooter,
  CFormCheck,
  CButton,
} from "@coreui/react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
} from "@coreui/react";
import "../../scss/required.scss";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
import { Toast } from "primereact/toast";
import postApiCall from "src/server/postApiCall";
import getApiCall from "src/server/getApiCall";
const API_URL = process.env.REACT_APP_API_URL;

const addDocument = () => {
  const toast = useRef(null);
  const [showModalP, setShowModalP] = useState(false);
  const [isloading, setLoading1] = useState(false);
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const navigate = useNavigate();
  const [validationMessages, setValidationMessages] = useState({});
  const [showValidationMessages, setShowValidationMessages] = useState(false);
  const [imgData, setImgData] = useState(null);
  const [certificateDetail, setCertificatedetail] = useState("");
  const certificateId = window.location.href.split("?")[1];
  const [certImg, setCertImg] = useState();

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

  function loadPreview(url) {
    if (url) {
      const extension = url.substring(url.lastIndexOf(".")).substring(1);
      if (extension === "pdf") {
        loadPDF(url);
      }
      return url;
    }
  }

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
    title: "",
    category: "",
    documentLink: "",
    isActive: 1,
  });

  useEffect(() => {
    if (certificateId) {
      certificateApi(Number(certificateId));
    }
  }, [certificateId]);

  const addCertificate = async (form) => {
    setLoading1(true);
    try {
      const response = await postApiCall(
        "addDocument",
        form,
        "multipart/form-data"
      );
      if (!isloading) {
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Document Added Successfully",
          life: 3000,
        });
      }
      setTimeout(() => {
        navigate("/student/document");
      }, 1500);
    } catch (error) {
      let errorMessage = "An error occurred";
      if (
        error.response &&
        error.response.data &&
        error?.response?.data?.errors
      ) {
        errorMessage = error?.response?.data?.errors;
      }
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errorMessage,
        life: 3000,
      });
      setLoading1(false);
    }
  };

  const handleSave = () => {
    {
      addCertificate(form);
    }
  };

  useEffect(() => {
    if (certificateDetail) {
      setForm({
        title: certificateDetail.title,

        category: certificateDetail.category,

        documentLink: certificateDetail.documentLink,
        isActive: certificateDetail.isActive,
      });
    }
  }, [certificateDetail]);
  const [certificateImage, setCertificateImage] = useState();
  const certificateApi = async (id) => {
    try {
      const res = await getApiCall("getCertificateById", id);
      setCertificatedetail(res);
      setCertificateImage(res.bgimage);
    } catch (err) {}
  };
  const handleClose = () => {
    setShowModalP(false);
  };
  const updatecertificateApi = (form) => {
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
    axios
      .post(`${API_URL}/updateCertificateById/?_method=PUT`, formData, {
        headers: { Authorization: token },
      })
      .then((response) => {
        setLoading1(false);
        if (response) {
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Certificate Updated Successfully",
            life: 3000,
          });
        }

        setTimeout(() => {
          navigate("/superadmin/certificatelist");
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
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
                backgroundImage: `url(${
                  certImg ? imgData : loadPreview(form?.bgImage)
                })`,
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
          <CCardHeader>
            <strong>Add Document</strong>
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
                      Document Name
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="text"
                        value={form.title}
                        onChange={(e) => {
                          setForm({ ...form, title: e.target.value });
                          setValidationMessages({
                            ...validationMessages,
                            title: e.target.value
                              ? ""
                              : "title Name is required",
                          });
                        }}
                        id="validationCustom01"
                        required
                        placeholder="Document Name"
                      />
                      {showValidationMessages && validationMessages.title && (
                        <div className="fw-bolder" style={{ color: "red" }}>
                          {validationMessages.title}
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
                      Category
                    </CFormLabel>

                    <div className="col-sm-7">
                      <CFormSelect
                        value={form.category}
                        onChange={(e) =>
                          setForm({ ...form, category: e.target.value })
                        }
                        id="validationCustom01"
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="aadharcard">Aadhar Card</option>
                        <option value="pancard">PAN Card</option>
                        <option value="electioncard">Election Card</option>
                        <option value="drivinglicense">Driving License</option>
                      </CFormSelect>
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
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7 required"
                    >
                      Upload Document
                    </CFormLabel>
                    <div className="col-sm-7">
                      {certificateDetail && (
                        <img
                          src={certificateDetail.documentLink}
                          style={{ height: "150px" }}
                        />
                      )}

                      <CFormInput
                        type="file"
                        id="formFile"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          setForm({ ...form, documentLink: e.target.files[0] }),
                            setValidationMessages({
                              ...validationMessages,
                              documentLink: e.target.files[0]
                                ? ""
                                : "Image is required",
                            });
                          onChangePicture(e);
                        }}
                      />
                      {showValidationMessages &&
                        validationMessages.documentLink && (
                          <div className="fw-bolder" style={{ color: "red" }}>
                            {validationMessages.documentLink}
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

                <CCol md={6}>
                  <CRow className="mb-3">
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
            </CForm>
          </CCardBody>
          <CCardFooter>
            <div className="d-flex justify-content-start">
              <CButton
                className={`me-2 saveButtonTheme${themes}`}
                onClick={() => setShowModalP(true)}
              >
                Preview
              </CButton>
            </div>
            <div className="d-flex justify-content-end">
              <Link
                to="/student/document"
                className={`btn btn-primary me-2 saveButtonTheme${themes}`}
              >
                Back
              </Link>
              <CButton
                className={`me-2 saveButtonTheme${themes}`}
                onClick={handleSave}
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

export default addDocument;
