import React from "react";
import ListWidget from "./ListWidget";
import { Link } from "react-router-dom";
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
  CContainer,
} from "@coreui/react";

const TrainingManagement = () => {
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Training Management</strong>
            </CCardHeader>
            <CContainer>
              <div className="container">
                <div className="row gy-5 g-xl-8 p-15 py-5">
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col  px-2 py-2 my-0">
                    <Link
                      to={`/admin/coursecataloglist`}
                      title="Course Catalog"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/com005.svg"
                        href="/admin/coursecataloglist"
                        name={"Course Catalog"}
                      />
                    </Link>
                  </div>
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col  px-2 py-2 my-0">
                    <Link
                      to={`/admin/credentials`}
                      title="Credentials"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/com009.svg"
                        href="/admin/credentials"
                        name={"Credentials"}
                      />
                    </Link>
                  </div>
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col  px-2 py-2 my-0">
                    <Link
                      to={`/admin/organizationlearningplan`}
                      title="learning Plan"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/fin001.svg"
                        href="/admin/organizationlearningplan"
                        name={"Learning Plan"}
                      />
                    </Link>
                  </div>
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col  px-2 py-2 my-0">
                    <Link
                      to={`/admin/traininglibrarylist`}
                      title="Training Library"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/fil012.svg"
                        href="/admin/traininglibrarylist"
                        name={"Training Library"}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </CContainer>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default TrainingManagement;
