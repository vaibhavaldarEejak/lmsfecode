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

const CreditManagement = () => {
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Credit Management</strong>
            </CCardHeader>
            <CContainer>
              <div className="container">
                <div className="row gy-5 g-xl-8 p-15 py-5">
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col  px-2 py-2 my-0">
                    <Link
                      to={`/admin/teamcreditlist`}
                      title="Team Credit"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/com005.svg"
                        href="/admin/teamcreditlist"
                        name={"Team Credit"}
                      />
                    </Link>
                  </div>
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col offset-xxl-1 px-2 py-2 my-0">
                    <Link
                      to={`/admin/teamapprovalreportlist`}
                      title="Team Approval"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/com009.svg"
                        href="/admin/teamapprovalreportlist"
                        name={"Team Approval"}
                      />
                    </Link>
                  </div>
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center offset-xxl-1 col  px-2 py-2 my-0">
                    <Link
                      to={``}
                      title="My Team"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/com012.svg"
                        href=""
                        name={"My Team"}
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

export default CreditManagement;
