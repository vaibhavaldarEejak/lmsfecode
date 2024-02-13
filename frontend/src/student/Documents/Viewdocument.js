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
import axios from "axios";
import Player from "../../student/Documents/Player";

const API_URL = process.env.REACT_APP_API_URL;

const Viewdocuments = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  // const documentId = window.location.href.split("?")[1];
  let documentId = "";
  useEffect(() => {
    documentId = localStorage.getItem("documentLibraryId");
  }, []);
  const [imgData, setImgData] = useState(null);
  const [certificateDetail, setcertificateDetail] = useState("");
  const [visible, setVisible] = useState(false);
  const [showModalP, setShowModalP] = useState(false);
  const [form, setform] = useState({
    documentId: "",
    categoryName: "",
    documentLink: "",
    certStructure: "",
    documentLibraryLink: "",
    category: [],
  });
  const [extension, setextension] = useState("");

  useEffect(() => {
    if (doccumentdetailApi) {
      setform({
        documentId: certificateDetail.documentId,
        certificateName: certificateDetail.categoryName,
        certificateCode: certificateDetail.documentLink,
        documentLibraryLink: certificateDetail.documentLibraryLink,
        orientation: certificateDetail.orientation,
        baseLanguage: certificateDetail.baseLanguage,
        meta: certificateDetail.meta,
        category: [{ categoryId: "", categoryName: "" }],
      });
    }
  }, [certificateDetail]);

  const removeHtmlTags = (htmlString) => {
    const div = document.createElement("div");
    div.innerHTML = htmlString;
    return div.textContent || div.innerText || "";
  };

  const getStatusText = (isActive) => {
    return isActive === 1 ? "Active" : "Inactive";
  };

  const doccumentdetailApi = (documentLibraryId) => {
    axios
      .get(`${API_URL}/getDocumentLibraryById/${documentLibraryId}`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        setcertificateDetail(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (documentId) {
      doccumentdetailApi(Number(documentId));
    }
  }, [documentId]);
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
  const scrollableContainerStyle = {
    maxHeight: "750px", // Adjust the maximum height as needed
    overflowY: "auto", // Enable vertical scrolling when content overflows
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
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  return (
    <div className={`parentClass${themes}`}>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Document Details</strong>
            </CCardHeader>

            <CModal
              visible={visible}
              onClose={handleClose}
              alignment="center"
              size="lg"
              scrollable
            >
              <CModalHeader>
                <strong>Preview</strong>
              </CModalHeader>
              <CModalBody>
                <div style={scrollableContainerStyle}>
                  {/* Wrap your content in a scrollable container */}
                  <Player
                    extension={extension}
                    documentLibraryLink={certificateDetail.documentLibraryLink}
                    documentLibraryTitle={
                      certificateDetail.documentLibraryTitle
                    }
                  />
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

            <CCardBody className="card-body border-top p-9">
              <CModal visible={visible} onClose={handleClose} size="lg">
                {/* Modal content */}
              </CModal>
              <CForm
                className="row g-15 needs-validation ps-4"
                form={form}
                onFinish={doccumentdetailApi}
              >
                <CCol
                  lg={12}
                  className="d-flex flex-wrap align-items-center"
                  style={{ marginBottom: "20px" }}
                >
                  {/* Document Name */}
                  <CFormLabel htmlFor="" className="fw-bolder fs-7 me-3">
                    Document Name:
                  </CFormLabel>
                  <div className="py-2" style={{ marginBottom: "5px" }}>
                    {certificateDetail.documentLibraryTitle}
                  </div>
                </CCol>

                <CRow className="mb-3">
                  <CCol lg={12}>
                    {/* Document Description */}
                    <CFormLabel htmlFor="" className="fw-bolder fs-7">
                      Document Description:
                    </CFormLabel>
                    <div className="py-2">
                      {removeHtmlTags(
                        certificateDetail.documentLibraryDescription
                      )}
                    </div>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol lg={12}>
                    {/* Category */}
                    <CFormLabel htmlFor="" className="fw-bolder fs-7">
                      Category:
                    </CFormLabel>
                    <div className="py-2">{certificateDetail.categoryName}</div>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol lg={12} className="d-flex flex-wrap align-items-center">
                    <CFormLabel htmlFor="" className="fw-bolder fs-7 me-3">
                      Status:
                    </CFormLabel>
                    <div
                      className="py-2"
                      style={{ marginRight: "10px", marginBottom: "5px" }}
                    >
                      {getStatusText(certificateDetail.isActive)}
                    </div>
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol lg={12}>
                    <div className="d-inline-flex align-items-center">
                      {/* Document */}
                      <CFormLabel htmlFor="" className="fw-bolder fs-7">
                        Document:
                      </CFormLabel>
                      <div className="py-2 ms-3">
                        <CButton
                          className={`btn btn-light-info text-light saveButtonTheme${themes}`}
                          title="Preview"
                          color="primary"
                          onClick={handlePreview}
                        >
                          Click to preview
                        </CButton>
                      </div>
                    </div>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <div className={`d-flex justify-content-end `}>
                <Link
                  to="/student/document"
                  onClick={() => {
                    localStorage.removeItem("documentLibraryId");
                  }}
                  className={`btn btn-primary saveButtonTheme${themes}`}
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

export default Viewdocuments;
