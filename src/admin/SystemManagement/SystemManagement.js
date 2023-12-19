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

const SystemManagement = () => {
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>System Management</strong>
            </CCardHeader>
            <CContainer>
              <div className="container">
                <div className="row gy-5 g-xl-8 p-15 py-5">
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col  px-2 py-2 my-0">
                    <Link
                      to={`/admin/categorylist`}
                      title="Category"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/com005.svg"
                        href="/admin/categorylist"
                        name={"Category"}
                      />
                    </Link>
                  </div>
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 offset-xxl-1 col-xs-center col  px-2 py-2 my-0">
                    <Link
                      to={`/admin/notificationlist`}
                      title="Notifications"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/com009.svg"
                        href="/admin/notificationlist"
                        name={"Notifications"}
                      />
                    </Link>
                  </div>
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 offset-xxl-1 col-xs-center col  px-2 py-2 my-0">
                    <Link
                      to={``}
                      title="Skills"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/fin001.svg"
                        href=""
                        name={"Skills"}
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

export default SystemManagement;
