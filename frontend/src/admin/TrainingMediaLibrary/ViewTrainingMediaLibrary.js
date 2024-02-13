import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CRow,
  CModal,
  CButton,
  CForm,
  CCardFooter,
  CBadge,
} from "@coreui/react";
import { Link } from "react-router-dom";
// import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;
import Player from "./Player";
import getApiCall from "src/server/getApiCall";
import "../../css/form.css";

const ViewTrainingMediaLibrary = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  // const contentId = window.location.href.split("?")[1];
  const [contentId, setContentId] = useState("");
  let contentId1 = "";
  useEffect(() => {
    contentId1 = localStorage.getItem("contentId");
    setContentId(contentId1);
  }, []);

  const [showModalP, setShowModalP] = useState(false);
  const [mediaDetail, setMediadetail] = useState("");
  const [extension, setextension] = useState("");

  const navigate = useNavigate();
  const [form, setform] = useState({
    contentName: "",
    contentVersion: "",
    contentTypeId: "",
    contentType: "",
    isActive: "Active",
    mediaUrl: "",
  });

  useEffect(() => {
    if (mediaDetail) {
      setform({
        contentName: mediaDetail.contentName,
        contentVersion: mediaDetail.contentVersion,
        contentTypeId: mediaDetail.contentTypeId,
        contentType: mediaDetail.contentType,
        mediaUrl: mediaDetail.mediaUrl,
        isActive: mediaDetail.isActive,
      });
      if (mediaDetail?.mediaUrl) {
        const fileName = mediaDetail?.mediaUrl;
        const lastDotIndex = fileName.lastIndexOf(".");

        if (mediaDetail.contentType === "SCORM") {
          setextension("zip");
        } else {
          setextension(fileName.substring(lastDotIndex));
        }
      }
    }
  }, [mediaDetail]);

  useEffect(() => {
    if (contentId) {
      medialibraryApi(Number(contentId));
    }
  }, [contentId]);

  const [loading, setLoading] = useState(false);
  const medialibraryApi = async (id) => {
    setLoading(true);
    try {
      const response = await getApiCall("getOrgMediaById", id);
      setMediadetail(response);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setShowModalP(false);
  };

  // const handleClick = (value) => {
  //   if (value.contentType === "SCORM") {
  //     navigate(
  //       `/admin/trainingmedialibrarylist/scormPlayer?${value.mediaUrl}?${value.scormID}?${value.scormVersion}?${contentId}?${value.mediaId}`
  //     );
  //   } else if (value.contentType === "video") {
  //     window.open(
  //       `${value.mediaUrl}`,
  //       "_blank",
  //       "width=1080,height=700"
  //     );
  //   } else {
  //     setShowModalP(true);
  //   }
  // };

  return (
    <CRow>
      <CModal
        visible={showModalP}
        onClose={handleClose}
        alignment="center"
        size="lg"
        scrollable
      >
        <CModalHeader>
          <CModalTitle>Preview</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div id="divToPrint" className="ql-editor">
            <Player
              extension={extension}
              mediaUrl={mediaDetail.mediaUrl}
              mediaName={mediaDetail.mediaName}
            />
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
            <strong>Media Details</strong>
          </CCardHeader>
          <CCardBody className="card-body org border-top p-9">
            <CForm
              className="row g-15 needs-validation ps-4"
              form={form}
              onFinish={medialibraryApi}
            >
              <CRow className="mb-3">
                <CCol lg={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7"
                    >
                      Content Name :
                    </CFormLabel>
                    <div className="col-sm-7 py-2">{form.contentName}</div>
                  </CRow>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7"
                    >
                      Content Version :
                    </CFormLabel>
                    <div className="col-sm-7 py-2">{form.contentVersion}</div>
                  </CRow>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7"
                    >
                      Content Type :
                    </CFormLabel>
                    <div className="col-sm-7 py-2">{form.contentType}</div>
                  </CRow>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7"
                    >
                      Status :
                    </CFormLabel>
                    <div className="col-sm-7 py-2 fs-6">
                      {form?.isActive === 1 ? (
                        <CBadge
                          className="badge badge-light-info "
                          color="primary"
                        >
                          {form?.isActive === 1 ? "Active" : "In-Active"}
                        </CBadge>
                      ) : (
                        <CBadge
                          className="badge badge-light-info "
                          color="secondary"
                        >
                          {form?.isActive === 1 ? "Active" : "In-Active"}
                        </CBadge>
                      )}
                    </div>
                  </CRow>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7"
                    >
                      Media Name :
                    </CFormLabel>
                    <div className="col-sm-7 py-2">
                      <CButton
                        className="me-2 rounded"
                        size="sm"
                        disabled={loading}
                        // onClick={() =>{ setShowModalP(true)}}
                        onClick={() => {
                          // handleClick(mediaDetail);
                          navigate(
                            `/admin/player?${contentId}?media?eLearning`
                          );
                        }}
                        title="Preview"
                      >
                        Preview
                      </CButton>
                    </div>
                  </CRow>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <div className="d-flex justify-content-end">
              {/* <Link className="btn btn-primary me-2" onClick={handleSave}>
                Save
              </Link> */}
              <Link
                to="/admin/trainingmedialibrary"
                className="btn btn-primary"
                onClick={() => {
                  localStorage.removeItem("contentId");
                }}
              >
                Back
              </Link>
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ViewTrainingMediaLibrary;
