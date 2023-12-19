import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormLabel,
  CRow,
  CForm,
  CCardFooter,
  CBadge,
} from "@coreui/react";
import { Link } from "react-router-dom";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import getApiCall from "src/server/getApiCall";
const API_URL = process.env.REACT_APP_API_URL;

const ViewGenericGroup = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const groupId = window.location.href.split("?")[1];
  const [groupDetail, setgroupDetail] = useState("");
  const [form, setform] = useState({
    groupId: "",
    groupName: "",
    parentGroup: "",
    description: "",
    organization: "",
    isActive: 1,
  });

  useEffect(() => {
    if (groupDetail) {
      setform({
        groupId: groupDetail.groupId,
        groupName: groupDetail.groupName,
        parentGroup: groupDetail.parentGroup,
        description: groupDetail.description,
        organization: groupDetail.organization,
        isActive: groupDetail.isActive,
      });
    }
  }, [groupDetail]);

  const groupDetailApi = async (id) => {
    try {
      const res = await getApiCall("getGroupById", id);
      setgroupDetail(res);
    } catch (err) {
      var errMsg = err?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
    }
  };

  useEffect(() => {
    if (groupId) {
      groupDetailApi(Number(groupId));
    }
  }, [groupId]);
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  return (
    <div>
      <CRow className={`InputThemeColor${themes}`}>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Category Details</strong>
            </CCardHeader>
            <CCardBody className="card-body border-top p-9">
              <CForm
                className="row g-15 needs-validation ps-4"
                form={form}
                onFinish={groupDetailApi}
              >
                <CRow className="mb-3">
                  <CCol lg={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Group Name :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {groupDetail.groupName}
                      </div>
                    </CRow>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Description :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {groupDetail.description}
                      </div>
                    </CRow>

                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Status :
                      </CFormLabel>
                      <div className="col-sm-7 py-2 fs-6">
                        {groupDetail?.isActive === 1 ? (
                          <CBadge
                            className={`badge badge-light-info saveButtonTheme${themes}`}
                            color="primary"
                          >
                            {groupDetail?.isActive === 1
                              ? "Active"
                              : "In-Active"}
                          </CBadge>
                        ) : (
                          <CBadge
                            className={`badge badge-light-info saveButtonTheme${themes}`}
                            color="secondary"
                          >
                            {groupDetail?.isActive === 1
                              ? "Active"
                              : "In-Active"}
                          </CBadge>
                        )}
                      </div>
                    </CRow>
                  </CCol>
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Organize User Group Based On :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {groupDetail.organization}
                      </div>
                    </CRow>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <div className="d-flex justify-content-end">
                <Link
                  to="/superadmin/genericgrouplist"
                  className={`btn btn-primary saveButtonTheme${themes}`}
                >
                  Back
                </Link>
              </div>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default ViewGenericGroup;
