import React, { useEffect, useState, useRef } from "react";
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
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import "../../scss/required.scss";
import ContentEditor from "./ContentEditor";
import getApiCall from "src/server/getApiCall";
import generalUpdateApi from "src/server/generalUpdateApi";
import postApiCall from "src/server/postApiCall";
import "../../css/form.css";

const addEditNotifications = () => {
  const toast = useRef(null),
    // notificationId = window.location.href.split("?")[1],
    [notificationDetail, setnotificationDetail] = useState(""),
    [notificationCategoryList, setNotificationCategoryList] = useState(""),
    [notificationEventList, setNotificationEventList] = useState(""),
    navigate = useNavigate(),
    [validationMessages, setValidationMessages] = useState({}),
    [showValidationMessages, setShowValidationMessages] = useState(false),
    [isLoading, setIsLoading] = useState(false),
    [isloading, setLoading1] = useState(false),
    [notificationCategoryId, setNotificationCategoryId] = useState(null),
    [testId, setTestId] = useState(),
    [editorState, setEditorState] = useState(""),
    [notificationContent, setNotificationContent] = useState(""),
    [dynamicField, setDynamicField] = useState([]),
    colorName = localStorage.getItem("ThemeColor"),
    [themes, setThemes] = useState(colorName),
    [notificationId, setnotificationId] = useState(),
    [form, setForm] = useState({
      notificationName: "",
      notificationType: "",
      subject: "",
      notificationContent: "",
      notificationCategory: "",
      notificationEvent: "",
      isActive: 1,
    });

  let notificationId1 = "";
  useEffect(() => {
    notificationId1 = localStorage.getItem("notificationId");
    setnotificationId(notificationId1)
  }, []);

  const notificationTypeList = [
    {
      label: "Email",
      value: "email",
    },
    {
      label: "Text",
      value: "text",
    },
  ];

  useEffect(() => {
    notificationCategoryApi();
  }, []);

  useEffect(() => {
    if (testId != undefined) {
      getDynamicFields();
    }
  }, [testId]);

  const updateParentState = (childState) => {
    setEditorState(childState);
  };

  useEffect(() => {
    if (editorState) {
      setForm({ ...form, notificationContent: editorState });
      setValidationMessages({
        ...validationMessages,
        notificationContent: editorState
          ? ""
          : "Notification Content is required",
      });
    }
  }, [editorState]);

  //async await get method to store data in dynamicFields
  const getDynamicFields = async () => {
    try {
      const res = await getApiCall("getDynamicFieldListByEventId", testId);
      setDynamicField(res);
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

  //Notification Category API
  const notificationCategoryApi = async () => {
    setIsLoading(true);
    try {
      const res = await getApiCall("getNotificationCategoryList");
      setIsLoading(false);
      setNotificationCategoryList(res);
    } catch (err) {
      setIsLoading(false);
      var errMsg = err?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
    }
  };

  //Fetch event API
  const notificationEventApi = async (id) => {
    try {
      const res = await getApiCall("notificationEventListByCategoryId", id);
      setIsLoading(false);
      setNotificationEventList(res);
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
    if (notificationDetail) {
      setForm({
        notificationId: notificationId,
        notificationName: notificationDetail.notificationName,
        notificationType: notificationDetail.notificationType,
        notificationCategory: notificationDetail.notificationCategoryId,
        notificationEvent: notificationDetail.notificationEventId,
        subject: notificationDetail.subject,
        notificationContent: notificationDetail.notificationContent,
        isActive: notificationDetail.isActive,
      });
      notificationEventApi(notificationDetail.notificationCategoryId);
      setNotificationContent(notificationDetail?.notificationContent);
    }
  }, [notificationDetail]);

  const addNotifications = async (data) => {
    setLoading1(true);
    try {
      const res = await postApiCall("addNewNotification", data);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Notification Added Successfully",
        life: 3000,
      });
      setTimeout(() => {
        navigate("/superadmin/notificationlisting");
      }, 1000);
    } catch (err) {
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
      const res = await getApiCall("getNotificationById", id);
      setnotificationDetail(res);
      setIsLoading(false);
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Fetching Notification ",
        life: 3000,
      });
      setIsLoading(false);
    }
  };

  const updateNotifications = async (data) => {
    const updateData = {
      notificationId: notificationId,
      notificationName: data.notificationName,
      notificationType: data.notificationType,
      notificationCategory: data.notificationCategory,
      notificationEvent: data.notificationEvent,
      subject: data.subject,
      notificationContent: data.notificationContent,
      notificationDate: data.notificationDate,
      isActive: data.isActive,
    };
    setLoading1(true);
    try {
      const res = await generalUpdateApi("updateNotificationById", updateData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Notification Updated Successfully",
        life: 3000,
      });
      localStorage.removeItem("notificationId");
      setTimeout(() => {
        navigate("/superadmin/notificationlisting");
      }, 3000);
    } catch (err) {
      setLoading1(false);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Updating Notification",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    if (notificationId) {
      notificationDetailApi(Number(notificationId));
    }
  }, [notificationId]);

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
    if (!form.notificationCategory) {
      messages.notificationCategory = "Notification Category is required";
      isValid = false;
    }
    if (!form.notificationEvent) {
      messages.notificationEvent = "Notification Event is required";
      isValid = false;
    }
    if (!form.notificationContent) {
      messages.notificationContent = "Notification Content is required";
      isValid = false;
    }

    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };

  useEffect(() => {
    if (notificationCategoryId) {
      notificationDetailApi(Number(notificationCategoryId));
    }
  }, [notificationCategoryId]);

  const handleSave = () => {
    localStorage.removeItem("notificationId");
    if (validateForm()) {
      if (notificationId) {
        localStorage.removeItem("notificationId");
        updateNotifications(form);
      } else {
        addNotifications(form);
      }
    }
  };

  const handleChange = (value) => {
    setNotificationCategoryId(value);
  };

  return (
    <div className="container">
      <div className="container-fluid">
        <CRow>
          <CCol xs={12} style={{ padding: "1px" }}>
            <CCard className="mb-4 card-ric">
              <Toast ref={toast} />
              <CCardHeader className={`formHeader${themes} fs-14`}>
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
                            className="col-sm-4 col-form-label fw-bolder fs-7"
                          >
                            <Skeleton width="85%" className="mr-2"></Skeleton>
                          </CFormLabel>
                          <div className="col-sm-7 py-2">
                            <Skeleton width="97%"></Skeleton>
                          </div>
                        </CRow>
                      </CCol>
                      <CCol md={6}>
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-4 col-form-label fw-bolder fs-7"
                          >
                            <Skeleton width="85%" className="mr-2"></Skeleton>
                          </CFormLabel>
                          <div className="col-sm-7 py-2">
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
                            className="col-sm-4 col-form-label fw-bolder fs-7"
                          >
                            <Skeleton width="85%" className="mr-2"></Skeleton>
                          </CFormLabel>
                          <div className="col-sm-7 py-2">
                            <Skeleton width="97%"></Skeleton>
                          </div>
                        </CRow>
                      </CCol>
                      <CCol md={6}>
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-4 col-form-label fw-bolder fs-7"
                          >
                            <Skeleton width="85%" className="mr-2"></Skeleton>
                          </CFormLabel>
                          <div className="col-sm-7 py-2">
                            <Skeleton width="97%"></Skeleton>
                          </div>
                        </CRow>
                      </CCol>
                    </CRow>

                    {/* <CCol md={6}> */}
                    <CRow className="mb-5">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        <Skeleton width="85%" className="mr-2"></Skeleton>
                      </CFormLabel>
                      <div className="col-lg-12 fv-row">
                        <Skeleton width="100%" height="190px"></Skeleton>
                      </div>
                    </CRow>
                    {/* </CCol> */}
                  </CForm>
                </CCardBody>
              ) : (
                <CCardBody
                  className="card-body notif border-top p-9"
                  style={{ margin: "0rem 0 1rem 0 " }}
                >
                  <CForm
                    className={`g-15 needs-validation InputThemeColor${themes}`}
                  >
                    <CRow className="mb-1">
                      <CCol md={6}>
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-4 col-form-label fw-bolder fs-7 required"
                          >
                            Notification Name
                          </CFormLabel>
                          <div className="col-sm-7">
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
                                <div
                                  className="fw-bolder"
                                  style={{ color: "red" }}
                                >
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
                            className="col-sm-4 col-form-label fw-bolder fs-7 required"
                          >
                            Notification Type
                          </CFormLabel>
                          <div className="col-sm-7">
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
                                <div
                                  className="fw-bolder"
                                  style={{ color: "red" }}
                                >
                                  {validationMessages.notificationType}
                                </div>
                              )}
                          </div>
                        </CRow>
                      </CCol>
                    </CRow>

                    <CRow className="mb-1">
                      <CCol md={6}>
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-4 col-form-label fw-bolder fs-7 required"
                          >
                            Category
                          </CFormLabel>
                          <div className="col-sm-7">
                            <CFormSelect
                              required
                              aria-label="select example"
                              value={form.notificationCategory}
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  notificationCategory: e.target.value,
                                });
                                notificationEventApi(e.target.value);
                                setValidationMessages({
                                  ...validationMessages,
                                  notificationCategory: e.target.value
                                    ? ""
                                    : "Notification Category is required",
                                });
                              }}
                            >
                              <option disabled value={""}>
                                Select
                              </option>
                              {notificationCategoryList &&
                                notificationCategoryList.map((e) => (
                                  <option
                                    key={e.notificationCategoryId}
                                    value={e.notificationCategoryId}
                                  >
                                    {e.notificationCategoryName}
                                  </option>
                                ))}
                            </CFormSelect>
                            {showValidationMessages &&
                              validationMessages.notificationCategory && (
                                <div
                                  className="fw-bolder"
                                  style={{ color: "red" }}
                                >
                                  {validationMessages.notificationCategory}
                                </div>
                              )}
                          </div>
                        </CRow>
                      </CCol>
                      <CCol md={6}>
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-4 col-form-label fw-bolder fs-7 required"
                          >
                            Event
                          </CFormLabel>
                          <div className="col-sm-7">
                            <CFormSelect
                              required
                              aria-label="select example"
                              value={form.notificationEvent}
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  notificationEvent: e.target.value,
                                });
                                setTestId(e.target.value);
                                setValidationMessages({
                                  ...validationMessages,
                                  notificationEvent: e.target.value
                                    ? ""
                                    : "Notification Event is required",
                                });
                              }}
                            >
                              <option value={""}>Select</option>
                              {notificationEventList &&
                                notificationEventList.map((e) => (
                                  <option
                                    key={e.notificationEventId}
                                    value={e.notificationEventId}
                                  >
                                    {e.notificationEventName}
                                  </option>
                                ))}
                            </CFormSelect>
                            {showValidationMessages &&
                              validationMessages.notificationEvent && (
                                <div
                                  className="fw-bolder"
                                  style={{ color: "red" }}
                                >
                                  {validationMessages.notificationEvent}
                                </div>
                              )}
                          </div>
                        </CRow>
                      </CCol>
                    </CRow>

                    <CRow className="mb-1">
                      <CCol md={6}>
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-4 col-form-label fw-bolder fs-7 required"
                          >
                            Subject
                          </CFormLabel>
                          <div className="col-sm-7">
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
                                <div
                                  className="fw-bolder"
                                  style={{ color: "red" }}
                                >
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
                            className="col-sm-4 col-form-label fw-bolder fs-7"
                          >
                            Status
                          </CFormLabel>
                          <div className="col-sm-7">
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

                    <CRow className="">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Notification Content
                      </CFormLabel>
                      <div className="col-lg-12 fv-row">
                        <ContentEditor
                          dynamicList={dynamicField}
                          updateParentState={updateParentState}
                          notificationContent={notificationContent}
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
                <div
                  className={`d-flex justify-content-end `}
                  style={{ margin: "1rem 0rem 0 " }}
                >
                  <Link
                    to="/superadmin/notificationlisting"
                    className={`btn btn-primary me-2 saveButtonTheme${themes}`}
                    onClick={() => {
                      localStorage.removeItem("notificationId");
                    }}
                  >
                    Back
                  </Link>
                  <CButton
                    className={`me-2 saveButtonTheme${themes}`}
                    onClick={() => {
                      localStorage.removeItem("notificationId");
                      handleSave();
                    }}
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
      </div>
    </div>
  );
};

export default addEditNotifications;
