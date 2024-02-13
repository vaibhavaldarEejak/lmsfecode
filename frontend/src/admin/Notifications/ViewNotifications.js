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
const API_URL = process.env.REACT_APP_API_URL;
import getApiCall from "src/server/getApiCall";
import "../../css/form.css";

const ViewNotifications = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  // const notificationId = window.location.href.split("?")[1];
  let notificationId = "";
  useEffect(() => {
    notificationId = localStorage.getItem("notificationId1");
  }, []);
  const [notificationDetail, setnotificationDetail] = useState("");
  const [form, setform] = useState({
    notificationName: "",
    notificationType: "",
    subject: "",
    notificationContent: "",
    notificationDate: "",
    isActive: 1,
  });

  useEffect(() => {
    if (notificationId) {
      notificationDetailApi(Number(notificationId));
    }
    if (notificationDetail) {
      setform({
        notificationId: notificationId,
        notificationName: notificationDetail.notificationName,
        notificationType: notificationDetail.notificationType,
        subject: notificationDetail.subject,
        notificationContent: notificationDetail.notificationContent,
        notificationDate: notificationDetail.notificationDate,
        isActive: notificationDetail.isActive,
      });
    }
  }, [notificationDetail, notificationId]);

  const notificationDetailApi = async (id) => {
    try {
      const res = await getApiCall("getOrganizationNotificationById", id);
      setnotificationDetail(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Notifications Details</strong>
            </CCardHeader>
            <CCardBody className="card-body org border-top p-9">
              <CForm
                className="row g-15 needs-validation ps-4"
                form={form}
                onFinish={notificationDetailApi}
              >
                <CRow className="mb-3">
                  <CCol lg={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Notification Name :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {notificationDetail.notificationName}
                      </div>
                    </CRow>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Notification Type :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {notificationDetail.notificationType}
                      </div>
                    </CRow>

                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Subject :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {notificationDetail.subject}
                      </div>
                    </CRow>

                    <CRow className="mb-1">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Content :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        <span className="fs-7">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: notificationDetail.notificationContent,
                            }}
                          />
                        </span>
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
                        {notificationDetail?.isActive === 1 ? (
                          <CBadge
                            className="badge badge-light-info "
                            color="primary"
                          >
                            {notificationDetail?.isActive === 1
                              ? "Active"
                              : "In-Active"}
                          </CBadge>
                        ) : (
                          <CBadge
                            className="badge badge-light-info "
                            color="secondary"
                          >
                            {notificationDetail?.isActive === 1
                              ? "Active"
                              : "In-Active"}
                          </CBadge>
                        )}
                      </div>
                    </CRow>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <div className="d-flex justify-content-end">
                <Link to="/admin/notificationlist" className="btn btn-primary">
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

export default ViewNotifications;
