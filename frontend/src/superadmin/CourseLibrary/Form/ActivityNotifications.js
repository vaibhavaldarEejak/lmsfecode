import React from "react";
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
} from "@coreui/react";
import { Link } from "react-router-dom";

const activityNotifications = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Notifications</strong>
          </CCardHeader>
          <CCardBody className="card-body border-top p-9">
            <CForm className="row g-15 needs-validation">
              <CRow className="mb-3">
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7"
                    >
                      Activity Notifications:
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormCheck
                        inline
                        type="radio"
                        name="sslForAicc"
                        id="inlineCheckbox1"
                        value="Yes"
                        label="Yes"
                      />
                      <CFormCheck
                        inline
                        type="radio"
                        name="sslForAicc"
                        id="inlineCheckbox2"
                        value="No"
                        label="No"
                      />
                    </div>
                  </CRow>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={4}>
                  <CRow className="mb-3">
                    <div className="col-sm-12">
                      <CCard className="mb-4">
                        <CCardHeader>
                          <strong>User Notificatons</strong>
                        </CCardHeader>
                        <CCardBody className="card-body border-top p-9">
                          <CForm className="row g-15 needs-validation">
                            <div>
                              <CFormCheck id="flexCheckDefault" /> Notifications
                              First Word
                            </div>
                            <div>
                              <CFormCheck id="flexCheckDefault" /> Notifications
                              Second Word
                            </div>
                            <div>
                              <CFormCheck id="flexCheckDefault" /> Notifications
                              Third Word
                            </div>
                            <div>
                              <CFormCheck id="flexCheckDefault" /> Notifications
                              Fourth Word
                            </div>
                            <div>
                              <CFormCheck id="flexCheckDefault" /> Notifications
                              Five Word
                            </div>
                          </CForm>
                        </CCardBody>
                      </CCard>
                    </div>
                  </CRow>
                </CCol>
                <CCol md={4}>
                  <CRow className="mb-3">
                    <div className="col-sm-12">
                      <CCard className="mb-4">
                        <CCardHeader>
                          <strong>Superviser Notifications</strong>
                        </CCardHeader>
                        <CCardBody className="card-body border-top p-9">
                          <CForm className="row g-15 needs-validation">
                            <div>
                              <CFormCheck id="flexCheckDefault" /> Notifications
                              First Word
                            </div>
                            <div>
                              <CFormCheck id="flexCheckDefault" /> Notifications
                              Second Word
                            </div>
                            <div>
                              <CFormCheck id="flexCheckDefault" /> Notifications
                              Third Word
                            </div>
                            <div>
                              <CFormCheck id="flexCheckDefault" /> Notifications
                              Fourth Word
                            </div>
                            <div>
                              <CFormCheck id="flexCheckDefault" /> Notifications
                              Five Word
                            </div>
                          </CForm>
                        </CCardBody>
                      </CCard>
                    </div>
                  </CRow>
                </CCol>
                <CCol md={4}>
                  <CRow className="mb-3">
                    <div className="col-sm-12">
                      <CCard className="mb-4">
                        <CCardHeader>
                          <strong>Instructor Notifications</strong>
                        </CCardHeader>
                        <CCardBody className="card-body border-top p-9">
                          <CForm className="row g-15 needs-validation">
                            <div>
                              <CFormCheck id="flexCheckDefault" /> Notifications
                              First Word
                            </div>
                            <div>
                              <CFormCheck id="flexCheckDefault" /> Notifications
                              Second Word
                            </div>
                            <div>
                              <CFormCheck id="flexCheckDefault" /> Notifications
                              Third Word
                            </div>
                            <div>
                              <CFormCheck id="flexCheckDefault" /> Notifications
                              Fourth Word
                            </div>
                            <div>
                              <CFormCheck id="flexCheckDefault" /> Notifications
                              Five Word
                            </div>
                          </CForm>
                        </CCardBody>
                      </CCard>
                    </div>
                  </CRow>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <div className="d-flex justify-content-end">
              <Link to={`/optional`} className="btn btn-primary me-2">
                Next
              </Link>
              <Link to="/manageNotifications" className="btn btn-primary">
                Previous
              </Link>
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default activityNotifications;
