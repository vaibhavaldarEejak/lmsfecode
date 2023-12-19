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
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from "@coreui/react";
import { Link } from "react-router-dom";

const addElearningFileUpload = () => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-2">
          <CCardHeader>
            <strong>Add Content</strong>
          </CCardHeader>
          <CNav variant="tabs" className="py-2">
            <CNavItem>
              <CNavLink
                href="/#/addElearningFileUpload"
                active
                style={{ cursor: "pointer" }}
              >
                {/* <CIcon icon={cilMediaPlay} className="me-2" /> */}
                <strong>Upload Video</strong>
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="/#/addmediaGallery" style={{ cursor: "pointer" }}>
                {/* <CIcon icon={cilCode} className="me-2" /> */}
                <strong>Media Library</strong>
              </CNavLink>
            </CNavItem>
          </CNav>
          <CCardBody className="card-body border-top p-9">
            <CForm className="row g-15 needs-validation">
              <CRow className="mb-3">
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7"
                    >
                      Upload Video
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
                      className="col-sm-4 col-form-label fw-bolder fs-7"
                    >
                      Passing Score
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="Number"
                        id="validationCustom01"
                        required
                        placeholder="Passing Score"
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
                      className="col-sm-4 col-form-label fw-bolder fs-7"
                    >
                      SSL for AICC
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormCheck
                        inline
                        type="radio"
                        name="sslForAicc"
                        id="inlineCheckbox1"
                        value="1"
                        label="ON"
                      />
                      <CFormCheck
                        inline
                        type="radio"
                        name="sslForAicc"
                        id="inlineCheckbox2"
                        value="2"
                        label="OFF"
                      />
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
              <Link to="/addNewElearning" className="btn btn-primary">
                Previous
              </Link>
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default addElearningFileUpload;
