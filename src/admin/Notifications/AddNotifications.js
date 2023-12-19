import React, { useEffect, useMemo, useState, useRef } from "react";
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
  CButton,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { _ } from "core-js";
import { useNavigate } from "react-router-dom";
import { InputCustomEditor } from "./EditorBox/InputCustomEditor";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import "../../scss/required.scss";
import postApiCall from "src/server/postApiCall";
import getApiCall from "src/server/getApiCall";
import generalUpdateApi from "src/server/generalUpdateApi";

const API_URL = process.env.REACT_APP_API_URL;

const addEditNotifications = ({ handleNotification }) => {
  const token = "Bearer " + localStorage.getItem("ApiToken"),
    toast = useRef(null),
    notificationId = window.location.href.split("?")[1],
    [notificationDetail, setnotificationDetail] = useState(""),
    navigate = useNavigate(),
    [validationMessages, setValidationMessages] = useState({}),
    [showValidationMessages, setShowValidationMessages] = useState(false),
    [isLoading, setIsLoading] = useState(false),
    [isloading, setLoading1] = useState(false),
    colorName = localStorage.getItem("ThemeColor"),
    [themes, setThemes] = useState(colorName),
    notificationTypeList = [
      {
        label: "Email",
        value: "email",
      },
      {
        label: "Text",
        value: "text",
      },
    ],
    [form, setForm] = useState({
      notificationName: "",
      notificationType: "",
      subject: "",
      notificationContent: "",
      notificationDate: "",
      isActive: 1,
    });

  // let notificationId = "";
  // useEffect(() => {
  //   notificationId = localStorage.getItem("notificationId1");
  // }, []);

  const addNotifications = async (data) => {
    setLoading1(true);

    try {
      const res = await postApiCall("addOrganizationNotification", data);
      if (response) {
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Notification Added Successfully",
          life: 3000,
        });
        setTimeout(() => {
          navigate("/admin/notificationlist");
        }, 3000);
      }
    } catch (e) {
      setLoading1(false);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Adding Notification ",
        life: 3000,
      });
    }
  };

  const notificationDetailApi = async (id) => {
    setIsLoading(true);
    try {
      const res = await getApiCall(`getOrganizationNotificationById`, id);
      setnotificationDetail(res);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };

  const updateNotifications = async (data) => {
    const updateData = {
      notificationId: notificationId,
      notificationName: data.notificationName,
      notificationType: data.notificationType,
      subject: data.subject,
      notificationContent: data.notificationContent,
      notificationDate: data.notificationDate,
      isActive: data.isActive,
    };

    setLoading1(true);

    try {
      const res = await generalUpdateApi(
        "updateOrganizationNotification",
        updateData
      );

      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Notification Updated Successfully",
        life: 3000,
      });
      setLoading1(false);
      // localStorage.removeItem("notificationId1");

      setTimeout(() => {
        navigate("/admin/notificationlist");
      }, 3000);
    } catch (error) {
      setLoading1(false);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Updating Notification",
        life: 3000,
      });
    }
  };

  const validateForm = (e) => {
    const messages = {};
    let isValid = true;

    if (!form.notificationName) {
      messages.notificationName = "Notification Name is required";
      isValid = false;
    } else {
      messages.notificationName = "";
    }

    if (!form.notificationType) {
      messages.notificationType = "Notification Type is required";
      isValid = false;
    }

    if (!form.subject) {
      messages.subject = "Subject is required";
      isValid = false;
    }

    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };

  useEffect(() => {
    if (notificationDetail) {
      setForm({
        notificationId: notificationId,
        notificationName: notificationDetail.notificationName,
        notificationType: notificationDetail.notificationType,
        subject: notificationDetail.subject,
        notificationContent: notificationDetail.notificationContent,
        notificationDate: notificationDetail.notificationDate,
        isActive: notificationDetail.isActive,
      });
    }
  }, [notificationDetail]);
  const handleSave = () => {
    if (validateForm()) {
      if (notificationId) {
        updateNotifications(form);
      } else {
        addNotifications(form);
      }
    }
  };

  useEffect(() => {
    if (notificationId) {
      notificationDetailApi(Number(notificationId));
    }
  }, [notificationId]);

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <Toast ref={toast} />
          <CCardHeader>
            <strong>Notification</strong>
          </CCardHeader>
          {isLoading ? (
            <CCardBody className="card-body border-top p-9">
              <CForm className="row g-15 needs-validation">
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-lg-4 col-form-label fw-bolder fs-7"
                      >
                        <Skeleton width="85%" className="mr-2"></Skeleton>
                      </CFormLabel>
                      <div className="col-lg-7 py-2">
                        <Skeleton width="97%"></Skeleton>
                      </div>
                    </CRow>
                  </CCol>
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-lg-4 col-form-label fw-bolder fs-7"
                      >
                        <Skeleton width="85%" className="mr-2"></Skeleton>
                      </CFormLabel>
                      <div className="col-lg-7 py-2">
                        <Skeleton width="97%"></Skeleton>
                      </div>
                    </CRow>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-lg-4 col-form-label fw-bolder fs-7"
                      >
                        <Skeleton width="85%" className="mr-2"></Skeleton>
                      </CFormLabel>
                      <div className="col-lg-7 py-2">
                        <Skeleton width="97%"></Skeleton>
                      </div>
                    </CRow>
                  </CCol>
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-lg-4 col-form-label fw-bolder fs-7"
                      >
                        <Skeleton width="85%" className="mr-2"></Skeleton>
                      </CFormLabel>
                      <div className="col-lg-7 py-2">
                        <Skeleton width="97%"></Skeleton>
                      </div>
                    </CRow>
                  </CCol>
                </CRow>

                <CRow className="mb-lg-0">
                  <CFormLabel
                    htmlFor=""
                    className="col-lg-4 col-form-label fw-bolder fs-7"
                  >
                    <Skeleton width="85%" className="mr-2"></Skeleton>
                  </CFormLabel>
                  <div className="col-lg-12 fv-row">
                    <Skeleton width="100%" height="190px"></Skeleton>
                  </div>
                </CRow>
              </CForm>
            </CCardBody>
          ) : (
            <CCardBody className="card-body org border-top p-9">
              <CForm className="row g-15 needs-validation">
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-lg-4 col-form-label fw-bolder fs-7 required"
                      >
                        Notification Name
                      </CFormLabel>
                      <div className="col-lg-7">
                        <CFormInput
                          type="text"
                          id="validationCustom01"
                          required
                          value={form.notificationName}
                          onChange={(e) => {
                            setForm({
                              ...form,
                              notificationName: e.target.value,
                            });
                            setValidationMessages({
                              ...validationMessages,
                              notificationName: e.target.value
                                ? ""
                                : "Notification Name is required",
                            });
                          }}
                          placeholder="Notification Name"
                        />
                        {showValidationMessages &&
                          validationMessages.notificationName && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.notificationName}
                            </div>
                          )}
                      </div>
                    </CRow>
                  </CCol>
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-lg-4 col-form-label fw-bolder fs-7 required"
                      >
                        Notification Type
                      </CFormLabel>
                      <div className="col-lg-7">
                        <CFormSelect
                          required
                          aria-label="select example"
                          value={form.notificationType}
                          onChange={(e) => {
                            setForm({
                              ...form,
                              notificationType: e.target.value,
                            });
                            setValidationMessages({
                              ...validationMessages,
                              notificationType: e
                                ? ""
                                : "Notification Type is required",
                            });
                          }}
                        >
                          <option disabled value={""}>
                            Select
                          </option>
                          {notificationTypeList.map((e) => (
                            <option key={e.value} value={e.value}>
                              {e.label}
                            </option>
                          ))}
                        </CFormSelect>
                        {showValidationMessages &&
                          validationMessages.notificationType && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.notificationType}
                            </div>
                          )}
                      </div>
                    </CRow>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-lg-4 col-form-label fw-bolder fs-7 required"
                      >
                        Subject
                      </CFormLabel>
                      <div className="col-lg-7">
                        <CFormInput
                          type="text"
                          id="validationCustom01"
                          required
                          value={form.subject}
                          onChange={(e) => {
                            setForm({ ...form, subject: e.target.value });
                            setValidationMessages({
                              ...validationMessages,
                              subject: e ? "" : "Subject is required",
                            });
                          }}
                          placeholder="Subject"
                        />
                        {showValidationMessages &&
                          validationMessages.subject && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.subject}
                            </div>
                          )}
                      </div>
                    </CRow>
                  </CCol>
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-lg-4 col-form-label fw-bolder fs-7"
                      >
                        Status
                      </CFormLabel>
                      <div className="col-lg-7">
                        <CFormSwitch
                          size="xl"
                          id="formSwitchCheckDefaultXL"
                          checked={form.isActive === 1}
                          onChange={(e) =>
                            e.target.checked
                              ? setForm({ ...form, isActive: 1 })
                              : setForm({ ...form, isActive: 2 })
                          }
                        />
                      </div>
                    </CRow>
                  </CCol>
                </CRow>

                <CRow className="mb-lg-0">
                  <CFormLabel
                    htmlFor=""
                    className="col-lg-4 col-form-label fw-bolder fs-7 required"
                  >
                    Notification Content
                  </CFormLabel>
                  <div className="col-lg-12 fv-row">
                    <InputCustomEditor
                      disabled={false}
                      type="text"
                      id="validationCustom01"
                      required
                      value={form.notificationContent}
                      onChange={(e) => {
                        setForm({ ...form, notificationContent: e });
                        setValidationMessages({
                          ...validationMessages,
                          notificationContent: e
                            ? ""
                            : "Notification Content is required",
                        });
                      }}
                      placeholder="Notification Content"
                    />
                    {showValidationMessages &&
                      validationMessages.notificationContent && (
                        <div className="fw-bolder" style={{ color: "red" }}>
                          {validationMessages.notificationContent}
                        </div>
                      )}
                  </div>
                </CRow>
              </CForm>
            </CCardBody>
          )}
          <CCardFooter>
            <div className="d-flex justify-content-end">
              <Link
                to="/admin/notificationlist"
                className={`btn btn-primary me-2 saveButtonTheme${themes}`}
                onClick={() => {
                  // localStorage.removeItem("notificationId1");
                }}
              >
                Back
              </Link>
              <CButton
                className={`me-2 saveButtonTheme${themes}`}
                onClick={handleSave}
                disabled={isloading}
              >
                {isloading && (
                  <span
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                Save
              </CButton>
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default addEditNotifications;
