import React from "react";
import {
  CCard,
  CCardBody,
  CFormCheck,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CButton,
  CTableRow,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CPagination,
  CPaginationItem,
  CForm,
  CFormLabel,
  CFormInput,
  CCardFooter,
} from "@coreui/react";
// import { DocsExample } from '../../components'
import CIcon from "@coreui/icons-react";
import {
  cilBell,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilColorBorder,
  cilTrash,
  cilLowVision,
} from "@coreui/icons";
import { Link } from "react-router-dom";

const mediaGallery = () => {
  return (
    <div className="">
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-2">
            <div>
              <CCardHeader>
                <strong>Add Content</strong>
              </CCardHeader>
              <CNav variant="tabs" className="py-2">
                <CNavItem>
                  <CNavLink
                    href="/#/addElearningFileUpload"
                    style={{ cursor: "pointer" }}
                  >
                    {/* <CIcon icon={cilMediaPlay} className="me-2" /> */}
                    <strong>Upload Video</strong>
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink
                    href="/#/addmediaGallery"
                    active
                    style={{ cursor: "pointer" }}
                  >
                    {/* <CIcon icon={cilCode} className="me-2" /> */}
                    <strong>Media Library</strong>
                  </CNavLink>
                </CNavItem>
              </CNav>
            </div>
            <CCardBody>
              <CTable hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col"></CTableHeaderCell>
                    <CTableHeaderCell scope="col">File Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Format</CTableHeaderCell>
                    <CTableHeaderCell scope="col">File Size</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Date Added</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CFormCheck
                      id="flexCheckDefault"
                      style={{ marginTop: "11px" }}
                    />
                    <CTableDataCell>Mark</CTableDataCell>
                    <CTableDataCell>MP4</CTableDataCell>
                    <CTableDataCell>4Gb</CTableDataCell>
                    <CTableDataCell>23/10/23</CTableDataCell>
                    <CTableDataCell scope="col">
                      <CIcon
                        icon={cilLowVision}
                        size="lg"
                        style={{ cursor: "pointer" }}
                        className="me-2"
                      />
                      <CIcon
                        icon={cilColorBorder}
                        size="lg"
                        style={{ cursor: "pointer" }}
                        className="me-2"
                      />
                      <CIcon
                        icon={cilTrash}
                        size="lg"
                        style={{ cursor: "pointer" }}
                      />
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CFormCheck
                      id="flexCheckDefault"
                      style={{ marginTop: "11px" }}
                    />
                    <CTableDataCell>Mark</CTableDataCell>
                    <CTableDataCell>MP4</CTableDataCell>
                    <CTableDataCell>4Gb</CTableDataCell>
                    <CTableDataCell>23/10/23</CTableDataCell>
                    <CTableDataCell scope="col">
                      <CIcon
                        icon={cilLowVision}
                        size="lg"
                        style={{ cursor: "pointer" }}
                        className="me-2"
                      />
                      <CIcon
                        icon={cilColorBorder}
                        size="lg"
                        style={{ cursor: "pointer" }}
                        className="me-2"
                      />
                      <CIcon
                        icon={cilTrash}
                        size="lg"
                        style={{ cursor: "pointer" }}
                      />
                    </CTableDataCell>{" "}
                  </CTableRow>
                  <CTableRow>
                    <CFormCheck
                      id="flexCheckDefault"
                      style={{ marginTop: "11px" }}
                    />
                    <CTableDataCell>Mark</CTableDataCell>
                    <CTableDataCell>MP4</CTableDataCell>
                    <CTableDataCell>4Gb</CTableDataCell>
                    <CTableDataCell>23/10/23</CTableDataCell>
                    <CTableDataCell scope="col">
                      <CIcon
                        icon={cilLowVision}
                        size="lg"
                        style={{ cursor: "pointer" }}
                        className="me-2"
                      />
                      <CIcon
                        icon={cilColorBorder}
                        size="lg"
                        style={{ cursor: "pointer" }}
                        className="me-2"
                      />
                      <CIcon
                        icon={cilTrash}
                        size="lg"
                        style={{ cursor: "pointer" }}
                      />
                    </CTableDataCell>{" "}
                  </CTableRow>
                  <CTableRow>
                    <CFormCheck
                      id="inlineCheckbox"
                      style={{ marginTop: "11px" }}
                    />
                    <CTableDataCell>Mark</CTableDataCell>
                    <CTableDataCell>MP4</CTableDataCell>
                    <CTableDataCell>4Gb</CTableDataCell>
                    <CTableDataCell>23/10/23</CTableDataCell>
                    <CTableDataCell scope="col">
                      <CIcon
                        icon={cilLowVision}
                        size="lg"
                        style={{ cursor: "pointer" }}
                        className="me-2"
                      />
                      <CIcon
                        icon={cilColorBorder}
                        size="lg"
                        style={{ cursor: "pointer" }}
                        className="me-2"
                      />
                      <CIcon
                        icon={cilTrash}
                        size="lg"
                        style={{ cursor: "pointer" }}
                      />
                    </CTableDataCell>{" "}
                  </CTableRow>
                  <CTableRow>
                    <CFormCheck
                      id="inlineCheckbox"
                      style={{ marginTop: "11px" }}
                    />
                    <CTableDataCell>Mark</CTableDataCell>
                    <CTableDataCell>MP4</CTableDataCell>
                    <CTableDataCell>4Gb</CTableDataCell>
                    <CTableDataCell>23/10/23</CTableDataCell>
                    <CTableDataCell scope="col">
                      <CIcon
                        icon={cilLowVision}
                        size="lg"
                        style={{ cursor: "pointer" }}
                        className="me-2"
                      />
                      <CIcon
                        icon={cilColorBorder}
                        size="lg"
                        style={{ cursor: "pointer" }}
                        className="me-2"
                      />
                      <CIcon
                        icon={cilTrash}
                        size="lg"
                        style={{ cursor: "pointer" }}
                      />
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
              <CPagination aria-label="Page navigation example">
                <CPaginationItem>Previous</CPaginationItem>
                <CPaginationItem>1</CPaginationItem>
                <CPaginationItem>2</CPaginationItem>
                <CPaginationItem>3</CPaginationItem>
                <CPaginationItem>Next</CPaginationItem>
              </CPagination>
              {/* </DocsExample> */}
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
    </div>
  );
};
export default mediaGallery;
