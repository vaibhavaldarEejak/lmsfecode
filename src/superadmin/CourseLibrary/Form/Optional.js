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
  CInputGroup,
  CInputGroupText,
  CCardFooter,
} from "@coreui/react";
import { Link } from "react-router-dom";

const optional = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Optional Items</strong>
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
                      Handouts
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
                      className="col-sm-3 col-form-label fw-bolder fs-7"
                    >
                      Status
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormSelect required aria-label="select example">
                        <option disabled selected>
                          Select Status
                        </option>
                        <option value="1">Published</option>
                        <option value="2">Unpublished</option>
                        <option value="3">Draft</option>
                      </CFormSelect>
                    </div>
                  </CRow>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <div className="d-flex justify-content-end">
              <Link
                to={`/manageCourseLibrary`}
                className="btn btn-primary me-2"
              >
                Submit
              </Link>
              <Link to="/addElearningFileUpload" className="btn btn-primary">
                Previous
              </Link>
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default optional;
