import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// import Userimage from "./Userimage/300-1.jpg";
import { ProgressBar } from "primereact/progressbar";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Panel } from "primereact/panel";
import axios from "axios";

import "primeflex/primeflex.css";

import {
  CCard,
  CImage,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CRow,
  CFormSelect,
  CForm,
  CCardFooter,
  CFormCheck,
  CContainer,
  CBadge,
} from "@coreui/react";

const UserNotificationHead = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const notificationId = window.location.href.split("?")[1];
  const [userNotificationDetail, setuserNotificationDetail] = useState("");
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (e) => {
    setActiveTab(e.index);
  };

  const userNotificationDetailApi = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/getNotificationById/${id}`, {
        headers: { Authorization: token },
      });
      setuserNotificationDetail(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    userNotificationDetailApi(notificationId);
  }, [notificationId]);
  return (
    <>
      <div className="card mb-5 mb-xl-10 p-card p-card-rounded">
        <Panel header={userNotificationDetail.subject} toggleable>
          <div className="card-body pt-9 pb-0">
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
                <div className="d-flex flex-column ">
                  <div className="d-flex align-items-center mb-2">
                    <a
                      href="#"
                      className="text-gray-800 text-hover-primary fs-10 fw-bolder me-1"
                      style={{
                        paddingLeft: "0px",
                        paddingTop: "10px",
                        textDecoration: "none",
                      }}
                    >
                      {userNotificationDetail.notificationContent}
                    </a>
                    <a href="#"></a>
                  </div>

                  <div className="d-flex flex-wrap fw-bold fs-7 mb-4 pe-2">
                    {/* <a
                      href="#"
                      className="d-flex align-items-center text-gray-400 text-hover-primary me-4 mb-2 pl-3"
                      style={{ textDecoration: "none" }}
                    >
                      <i className="fas fa-address-book me-0.1 fs-4"></i>
                      {userNotificationDetail.notificationContent}
                    </a> */}

                    <a
                      href="#"
                      className="d-flex align-items-center text-gray-500 text-hover-primary mb-4"
                      style={{ textDecoration: "none" }}
                    >
                      <i className="pi pi-envelope"></i>
                      {userNotificationDetail.notificationDate}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {/* <CCard>
        <div className="card mb-5 mb-xl-10">
          <Panel header="Profile Details" toggleable>
            <CCardBody className="card-body border-top p-9">
              <CForm className="row g-15 needs-validation">
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Notification Name
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {userNotificationDetail.notificationName}
                      </div>
                    </CRow>
                  </CCol>
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Last Name
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {userNotificationDetail.lastName}
                      </div>
                    </CRow>
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Job Title
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {userNotificationDetail.jobTitleName}
                      </div>
                    </CRow>
                  </CCol>

                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Company Name
                      </CFormLabel>
                      <div className="col-sm-7  py-2">
                        {userNotificationDetail.organizationName}
                      </div>
                    </CRow>
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Division
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {userNotificationDetail.divisionName}
                      </div>
                    </CRow>
                  </CCol>

                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Area
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {userNotificationDetail.areaName}
                      </div>
                    </CRow>
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Location
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {userNotificationDetail.locationName}
                      </div>
                    </CRow>
                  </CCol>

                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        QR Code
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {userNotificationDetail.barcode}
                       
                      </div>
                    </CRow>
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Phone Number
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {userNotificationDetail.phone}
                      </div>
                    </CRow>
                  </CCol>

                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Email Address
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {userNotificationDetail.email}
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
                        Username
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {userNotificationDetail.userName}
                      </div>
                    </CRow>
                  </CCol>
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder"
                      >
                        Status
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {userNotificationDetail.status}
                      </div>
                    </CRow>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </Panel>
        </div>
      </CCard> */}
    </>
  );
};

export default UserNotificationHead;
