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
  CInputGroup,
  CInputGroupText,
} from "@coreui/react";
import { Link } from "react-router-dom";
import "../../../scss/required.scss";

const settingAddForm = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Settings</strong>
          </CCardHeader>
          <CCardBody className="card-body border-top p-9">
            <CForm className="row g-15 needs-validation">
              <CRow className="mb-3">
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-10 col-form-label fw-bolder fs-7 required"
                    >
                      Must receive a passing score to achieve completed status :
                    </CFormLabel>
                    <div className="col-sm-2">
                      <CFormSwitch size="xl" id="formSwitchCheckDefaultXL" />
                    </div>
                  </CRow>
                </CCol>
                <CCol md={6}>
                  <CRow className="mb-3">
                    <div className="col-sm-11">
                      <CFormInput
                        type="number"
                        id="validationCustom01"
                        required
                        placeholder="Passing Score"
                      />
                    </div>
                  </CRow>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-5 col-form-label fw-bolder fs-7 required"
                    >
                      Randomize Questions :
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormSwitch size="xl" id="formSwitchCheckDefaultXL" />
                    </div>
                  </CRow>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-5 col-form-label fw-bolder fs-7"
                    >
                      Display Questions :
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormCheck
                        inline
                        type="radio"
                        name="displayQuestions"
                        id="inlineCheckbox1"
                        value="slideView"
                        label="Slide View"
                      />
                      <CFormCheck
                        inline
                        type="radio"
                        name="displayQuestions"
                        id="inlineCheckbox2"
                        value="listView"
                        label="List View"
                      />
                    </div>
                  </CRow>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-5 col-form-label fw-bolder fs-7"
                    >
                      Hide completed assessment after being recorded on
                      transcript :
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormSwitch size="xl" id="formSwitchCheckDefaultXL" />
                    </div>
                  </CRow>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-5 col-form-label fw-bolder fs-7 required"
                    >
                      # of Attempts :
                    </CFormLabel>
                    <div className="col-sm-6">
                      <CFormInput
                        type="number"
                        id="validationCustom01"
                        required
                        placeholder="No. of Attempts"
                      />
                    </div>
                  </CRow>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-5 col-form-label fw-bolder fs-7"
                    >
                      Allow learner to view the results :
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormSwitch size="xl" id="formSwitchCheckDefaultXL" />
                    </div>
                  </CRow>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-5 col-form-label fw-bolder fs-7"
                    >
                      Post-Quiz Action :
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormCheck
                        inline
                        type="radio"
                        name="displayQuestions"
                        id="inlineCheckbox1"
                        value="slideView"
                        label="Display Total Score and Pass/Fail Status Only"
                      />
                      <CFormCheck
                        inline
                        type="radio"
                        name="displayQuestions"
                        id="inlineCheckbox2"
                        value="listView"
                        label="Display Score/Status and Correct Answers"
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
                      className="col-sm-10 col-form-label fw-bolder fs-7"
                    >
                      Time Limit :
                    </CFormLabel>
                    <div className="col-sm-2">
                      <CFormSwitch size="xl" id="formSwitchCheckDefaultXL" />
                    </div>
                  </CRow>
                </CCol>
                <CCol md={6}>
                  <CRow className="mb-3">
                    {/* <CFormLabel htmlFor="" className="col-sm-4 col-form-label fw-bolder fs-7">
                      Quiz Type
                    </CFormLabel> */}
                    <div className="col-sm-11">
                      <CInputGroup>
                        <CInputGroupText className="required">
                          Hours And Minutes
                        </CInputGroupText>
                        <CFormInput type="time" aria-label="Hours" />
                        <CFormInput type="time" aria-label="Minutes" />
                      </CInputGroup>
                    </div>
                  </CRow>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <div className="d-flex justify-content-end">
              <Link to={`/questionAdd`} className="btn btn-primary me-2">
                Next
              </Link>
              <Link to="/addNewAssessment" className="btn btn-primary">
                Previous
              </Link>
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default settingAddForm;
