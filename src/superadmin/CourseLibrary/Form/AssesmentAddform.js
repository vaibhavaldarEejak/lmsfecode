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

const assesmentAddform = () => {
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
                      className="col-sm-4 col-form-label fw-bolder fs-7"
                    >
                      Quiz Type
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormCheck
                        inline
                        type="radio"
                        name="orientation"
                        id="inlineCheckbox1"
                        value="P"
                        label="Portrait"
                      />
                      <CFormCheck
                        inline
                        type="radio"
                        name="orientation"
                        id="inlineCheckbox2"
                        value="L"
                        label="Landscape"
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
                      <CFormInput type="file" id="formFile" />
                    </div>
                  </CRow>
                </CCol>
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7 required"
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
                      Points
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        required
                        placeholder="Points"
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
            </CForm>
          </CCardBody>
          <CCardFooter>
            <div className="d-flex justify-content-end">
              <Link to={`/settingAddForm`} className="btn btn-primary me-2">
                Next
              </Link>
              <Link to="/manageCourseLibrary" className="btn btn-primary">
                Back
              </Link>
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default assesmentAddform;
