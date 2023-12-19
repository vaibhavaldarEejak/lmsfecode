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
import "../../../scss/required.scss";

const classRoomAddForm = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Activites</strong>
          </CCardHeader>
          <CCardBody className="card-body border-top p-9">
            <CForm className="row g-15 needs-validation">
              <CRow className="mb-3">
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7 required"
                    >
                      Course Title
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        required
                        placeholder="Course Title"
                      />
                    </div>
                  </CRow>
                </CCol>
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7 required"
                    >
                      Description
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        required
                        placeholder="Description"
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
                      Reference Code
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormSelect required aria-label="select example">
                        <option disabled selected>
                          Select Reference Code
                        </option>
                        <option value="1">Reference One</option>
                        <option value="2">Reference Two</option>
                        <option value="3">Reference Three</option>
                      </CFormSelect>
                    </div>
                  </CRow>
                </CCol>
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7 required"
                    >
                      Course Image
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput type="file" id="formFile" />
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
                      Categories
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormSelect required aria-label="select example">
                        <option disabled selected>
                          Select Categories
                        </option>
                        <option value="1">Categories One</option>
                        <option value="2">Categories Two</option>
                        <option value="3">Categories Three</option>
                      </CFormSelect>
                    </div>
                  </CRow>
                </CCol>
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7"
                    >
                      Credits
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        required
                        placeholder="Credits"
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
                      Certificate
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormSelect required aria-label="select example">
                        <option disabled selected>
                          Select Certificate
                        </option>
                        <option value="1">Certificate One</option>
                        <option value="2">Certificate Two</option>
                        <option value="3">Certificate Three</option>
                      </CFormSelect>
                    </div>
                  </CRow>
                </CCol>
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7"
                    >
                      Visibilty
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormSwitch size="xl" id="formSwitchCheckDefaultXL" />
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
                      ILT Assessment
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormSelect required aria-label="select example">
                        <option disabled selected>
                          Select ILT Assessment
                        </option>
                        <option value="1">Assessment One</option>
                        <option value="2">Assessment Two</option>
                        <option value="3">Assessment Three</option>
                      </CFormSelect>
                    </div>
                  </CRow>
                </CCol>
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7"
                    >
                      Activity Reviews
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormSwitch size="xl" id="formSwitchCheckDefaultXL" />
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
                      Enrollment Type
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        required
                        placeholder="Enrollment Type"
                      />
                    </div>
                  </CRow>
                </CCol>
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7"
                    >
                      Unenrollment
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormSwitch size="xl" id="formSwitchCheckDefaultXL" />
                    </div>
                  </CRow>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <div className="d-flex justify-content-end">
              <Link to={`/Notifications`} className="btn btn-primary me-2">
                Next
              </Link>
              <Link to="/manageCourseLibrary" className="btn btn-primary">
                Previous
              </Link>
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default classRoomAddForm;
