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

const UserManagement = () => {
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>User Management</strong>
            </CCardHeader>
            <CContainer>
              <div className="container">
                <div className="row gy-5 g-xl-8 p-15 py-5">
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col  px-2 py-2 my-0">
                    <Link
                      to={`/admin/grouplist`}
                      title="Group List"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/com001.svg"
                        href="/admin/grouplist"
                        name={"Group List"}
                      />
                    </Link>
                  </div>
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col  px-2 py-2 my-0">
                    <Link
                      to={`/admin/instructortrainerlist`}
                      title="Instructor/Trainer List"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/com009.svg"
                        href="/admin/instructortrainerlist"
                        name={"Instructor/Trainer List"}
                      />
                    </Link>
                  </div>
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col  px-2 py-2 my-0">
                    <Link
                      to={`/admin/subadminlist`}
                      title="SubAdmin"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/fin001.svg"
                        href="/admin/subadminlist"
                        name={"SubAdmin"}
                      />
                    </Link>
                  </div>
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col  px-2 py-2 my-0">
                    <Link
                      to={`/admin/userlist`}
                      title="User List"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/com012.svg"
                        href="/admin/userlist"
                        name={"User List"}
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

export default UserManagement;
