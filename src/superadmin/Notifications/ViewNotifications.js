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
import "../../css/form.css";
import getApiCall from "src/server/getApiCall";

const ViewNotifications = () => {
  // const notificationId = window.location.href.split("?")[1],
  let notificationId = "";
  useEffect(() => {
    notificationId = localStorage.getItem("notificationId");
  }, []);

  const [notificationDetail, setnotificationDetail] = useState(""),
    [loading, setLoading] = useState(false),
    colorName = localStorage.getItem("ThemeColor"),
    [themes, setThemes] = useState(colorName),
    [form, setform] = useState({
      notificationId: "",
      notificationName: "",
      notificationType: "",
      subject: "",
      notificationContent: "",
      notificationDate: "",
      isActive: 1,
      certStructure: "",
      bgimage: "",
    });

  useEffect(() => {
    if (notificationDetail) {
      setform({
        notificationId: notificationDetail.notificationId,
        notificationName: notificationDetail.notificationName,
        notificationType: notificationDetail.notificationType,
        subject: notificationDetail.subject,
        notificationContent: notificationDetail.notificationContent,
        notificationDate: notificationDetail.notificationDate,
        certStructure: notificationDetail.certStructure,
        isActive: notificationDetail.isActive,
        bgimage: notificationDetail.bgimage,
      });
    }
  }, [notificationDetail]);

  const notificationDetailApi = async (id) => {
    try {
      const res = await getApiCall("getNotificationById", id);
      setnotificationDetail(res);
      setLoading(false);
    } catch (err) {}
  };

  useEffect(() => {
    if (notificationId) {
      notificationDetailApi(Number(notificationId));
    }
  }, [notificationId]);

  return (
    <div>
      <CRow>
        {loading ? (
          <div
            className="pt-3 text-center d d-flex justify-content-center align-items-center"
            style={{ height: "70vh" }}
          >
            <div className="spinner-border " role="status">
              <span className="sr-only"></span>
            </div>
          </div>
        ) : (
          <CCol xs={12} style={{ padding: "1px" }}>
            <CCard className="mb-4 card-ric">
              <CCardHeader>
                <strong>Notifications Details</strong>
              </CCardHeader>
              <CCardBody className="card-body org border-top p-9">
                <CForm
                  className={`row g-15 needs-validation ps-4 InputThemeColor${themes}`}
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
                              className={`badge badge-light-info saveButtonTheme${themes}`}
                              color="primary"
                            >
                              {notificationDetail?.isActive === 1
                                ? "Active"
                                : "In-Active"}
                            </CBadge>
                          ) : (
                            <CBadge
                              className={`badge badge-light-info saveButtonTheme${themes}`}
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
                <div
                  className="d-flex justify-content-end"
                  style={{ margin: "1rem 0 0" }}
                >
                  <Link
                    to="/superadmin/notificationlisting"
                    className={`btn btn-primary saveButtonTheme${themes}`}
                  >
                    Back
                  </Link>
                </div>
              </CCardFooter>
            </CCard>
          </CCol>
        )}
      </CRow>
    </div>
  );
};

export default ViewNotifications;
