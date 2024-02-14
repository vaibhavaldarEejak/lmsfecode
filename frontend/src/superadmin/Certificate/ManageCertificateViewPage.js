import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormLabel,
  CRow,
  CForm,
  CCardFooter,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
} from "@coreui/react";
import { Link } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist";
import getApiCall from "src/server/getApiCall";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;

import "../../css/form.css";

const initialFormState = {
  certificateId: "",
  certificateName: "",
  certificateCode: "",
  orientation: "",
  baseLanguage: "",
  meta: "",
  description: "",
  certStructure: "",
  bgimage: "",
};

const ManageCertificateViewPage = () => {
  const [certificateDetail, setcertificateDetail] = useState(""),
    [imgData, setImgData] = useState(null),
    [visible, setVisible] = useState(false),
    colorName = localStorage.getItem("ThemeColor"),
    [themes, setThemes] = useState(colorName),
    [form,setForm]=useState(initialFormState);
    // [form, setform] = useState({
    //   certificateId: "",
    //   certificateName: "",
    //   certificateCode: "",
    //   orientation: "",
    //   baseLanguage: "",
    //   meta: "",
    //   description: "",
    //   certStructure: "",
    //   bgimage: "",
    // });
      
    const [certificateId,setCertificateId]=useState('');
    useEffect(() => {
      const storedCertificateId = localStorage.getItem("certificateId");
      if (storedCertificateId) {
        setCertificateId(storedCertificateId);
      }
    }, []);
  
    // useEffect(() => {
      //   certificateId = localStorage.getItem("certificateId");
      // }, []);

  useEffect(() => {
    if (certificateDetail) {
      // setForm({
      //   certificateId: certificateDetail.certificateId,
      //   certificateName: certificateDetail.certificateName,
      //   certificateCode: certificateDetail.certificateCode,
      //   orientation: certificateDetail.orientation,
      //   baseLanguage: certificateDetail.baseLanguage,
      //   meta: certificateDetail.meta,
      //   description: certificateDetail.description,
      //   certStructure: certificateDetail.certStructure,
      //   bgimage: certificateDetail.bgimage,
      // });
      
      setForm(prevForm => ({
        ...prevForm,
        certificateId: certificateDetail.certificateId,
        certificateName: certificateDetail.certificateName,
        certificateCode: certificateDetail.certificateCode,
        orientation: certificateDetail.orientation,
        baseLanguage: certificateDetail.baseLanguage,
        meta: certificateDetail.meta,
        description: certificateDetail.description,
        certStructure: certificateDetail.certStructure,
        bgimage: certificateDetail.bgimage,
      }));
    }
    loadPreview(form?.bgimage);
  }, [certificateDetail]);

  const certificateDetailApi = async (id) => {
    try {
      const res = await getApiCall("getCertificateById", id);
      setcertificateDetail(res);
    } catch (err) {}
  };

  useEffect(() => {
    if (certificateId) {
      certificateDetailApi(Number(certificateId));
    }
  }, [certificateId]);
  const handlePreview = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };

  function loadPreview(url) {
    if (url) {
      const extension = url.substring(url.lastIndexOf(".")).substring(1);
      if (extension === "pdf") {
        loadPDF(url);
      }
      setImgData(url);
    }
  }

  function renderPage(page) {
    const viewport = page.getViewport({ scale: 1 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext("2d");
  
    const renderTask = page.render({ canvasContext: context, viewport: viewport });
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

  return (
    <div className={`parentClass${themes}`}>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Certificate Details</strong>
            </CCardHeader>
            <CCardBody className="card-body org border-top p-9">
              <CModal visible={visible} onClose={handleClose} size="lg">
                <CModalHeader>
                  <strong>Preview</strong>
                </CModalHeader>
                <CModalBody>
                  <div id="divToPrint" className="ql-editor">
                    <div
                      style={{
                        backgroundImage: `url(${
                          imgData ? imgData : form?.bgimage
                        })`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                      }}
                    >
                      <div
                        style={{ height: "550px" }}
                        dangerouslySetInnerHTML={{
                          __html: certificateDetail.certStructure,
                        }}
                      />
                    </div>
                  </div>
                </CModalBody>
                <CModalFooter>
                  <CButton
                    color="primary"
                    onClick={handleClose}
                    className={`saveButtonTheme${themes}`}
                  >
                    Close
                  </CButton>
                </CModalFooter>
              </CModal>
              <CForm
                className="row g-15 needs-validation ps-4"
                form={form}
                onFinish={certificateDetailApi}
              >
                <CRow className="mb-3">
                  <CCol lg={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Certificate Name :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {certificateDetail.certificateName}
                      </div>
                    </CRow>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Certificate Code :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {certificateDetail.certificateCode}
                      </div>
                    </CRow>

                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Orientation :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {certificateDetail.orientation === "P"
                          ? "Portrait"
                          : "Landscape"}
                      </div>
                    </CRow>

                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Base Language :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {certificateDetail.baseLanguage}
                      </div>
                    </CRow>

                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Meta :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {certificateDetail.meta}
                      </div>
                    </CRow>

                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Description :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        <span className="fs-7">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: certificateDetail.description,
                            }}
                          />
                        </span>
                      </div>
                    </CRow>

                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Cert Structure :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        <CButton
                          className={`btn btn-light-info text-light saveButtonTheme${themes}`}
                          title="Preview"
                          color="primary"
                          onClick={handlePreview}
                        >
                          Click to preview
                        </CButton>
                      </div>
                    </CRow>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <div className={`d-flex justify-content-end `}>
                <Link
                  to="/superadmin/certificatelist"
                  className={`btn btn-primary saveButtonTheme${themes}`}
                  onClick={() => {
                    localStorage.removeItem("ModuleID");
                  }}
                >
                  Back
                </Link>
              </div>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default ManageCertificateViewPage;
