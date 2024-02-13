import React, { useEffect, createContext, useState, useRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
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
import { useNavigate } from "react-router-dom";
import Player from "./Player";
import getApiCall from "src/server/getApiCall";
import { Toast } from "primereact/toast";

import "../../css/form.css";

const ViewManageLibrary = () => {
  const contentId = window.location.href.split("?")[1],
    [showModalP, setShowModalP] = useState(false),
    [mediaDetail, setMediadetail] = useState(""),
    [extension, setextension] = useState(""),
    toast = useRef(null),
    navigate = useNavigate(),
    [form, setform] = useState({
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
      const fileName = mediaDetail.mediaUrl;
      const lastDotIndex = fileName.lastIndexOf(".");

      if (mediaDetail.contentType === "SCORM") {
        setextension("zip");
      } else {
        setextension(fileName.substring(lastDotIndex));
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
      const res = await getApiCall("getMediaById", id);
      setLoading(false);
      setMediadetail(res);
    } catch (err) {
      setLoading(false);
      var errMsg = err?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
    }
  };

  const handleClose = () => {
    setShowModalP(false);
  };
  const handleClick = (value) => {
    console.log({ value });
    console.log(value.contentType);
    if (value.contentType === "Video") {
      console.log(value.contentType);
      window.open(`${value.mediaUrl}`, "_blank", "width=1080,height=700");
    } else if (value.contentType === "SCORM") {
      navigate(
        `/superadmin/medialibrarylist/scormPlayer?${value.mediaUrl}?${value.scormID}?${value.scormVersion}?${contentId}?${value.mediaId}`
      );
    } else {
      setShowModalP(true);
    }
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
        scrollable
      >
        <CModalHeader>
          <CModalTitle>Preview</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <Player
            extension={extension}
            mediaUrl={mediaDetail.mediaUrl}
            mediaName={mediaDetail.mediaName}
          />
        </CModalBody>
        <CModalFooter>
          <button
            type="button"
            className={`btn btn-primary saveButtonTheme${themes}`}
            onClick={handleClose}
          >
            Close
          </button>
        </CModalFooter>
      </CModal>
      {loading ? (
        <div
          className="pt-3 text-center d d-flex justify-content-center align-items-center"
          style={{ height: "70vh" }}
        >
          <div className="spinner-border " role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      ) : (
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Media Details</strong>
            </CCardHeader>
            <CCardBody className="card-body org border-top p-9">
              <CForm
                className={`row g-15 needs-validation ps-4 InputThemeColor${themes}`}
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
                      <div className="col-sm-7 py-2">
                        {mediaDetail.contentName}
                      </div>
                    </CRow>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Content Version :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {mediaDetail.contentVersion}
                      </div>
                    </CRow>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Content Type :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {mediaDetail.contentType}
                      </div>
                    </CRow>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Status :
                      </CFormLabel>
                      <div className="col-sm-7 py-2 fs-6">
                        {mediaDetail?.isActive === 1 ? (
                          <CBadge
                            className={`badge badge-light-info saveButtonTheme${themes}`}
                            color="primary"
                          >
                            {mediaDetail?.isActive === 1
                              ? "Active"
                              : "In-Active"}
                          </CBadge>
                        ) : (
                          <CBadge
                            className={`badge badge-light-info saveButtonTheme${themes}`}
                            color="secondary"
                          >
                            {mediaDetail?.isActive === 1
                              ? "Active"
                              : "In-Active"}
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
                          className={`me-2 rounded saveButtonTheme${themes}`}
                          disabled={loading}
                          size="sm"
                          onClick={() => {
                            // handleClick(mediaDetail);
                            navigate(
                              `/subadmin/player?${contentId}?media?eLearning`
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
                <Link
                  to="/superadmin/medialibrarylist"
                  className={`btn btn-primary saveButtonTheme${themes}`}
                >
                  Back
                </Link>
              </div>
            </CCardFooter>
          </CCard>
        </CCol>
      )}
    </CRow>
  );
};
export default ViewManageLibrary;
