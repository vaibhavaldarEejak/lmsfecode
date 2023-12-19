import React, { useEffect, useState, useRef } from "react";
import {
  CCard,
  CForm,
  CCardBody,
  CCardFooter,
  CCol,
  CRow,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CImage,
  CFormSwitch,
} from "@coreui/react";

import { Toast } from "primereact/toast";
import { InputCustomEditor } from "../Category/InputCustomEditor";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import generalUpdateApi from "src/server/generalUpdateApi";
import postApiCall from "src/server/postApiCall";
import getApiCall from "src/server/getApiCall";
import { useNavigate } from "react-router-dom";

function AddEditClasses() {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  // const classroomId = window.location.href.split("?")[1];
  const toast = useRef(null);
  const [sessionPopup, setSessionPopup] = useState(false);
  const [classroomId, setClassroomId] = useState(null);
  let classId1 = "";
  useEffect(() => {
    classId1 = localStorage.getItem("classId1");
    setClassroomId(classId1);
  }, []);

  const [classCourseId, setClassCourseId] = useState(null);
  let courseId1 = "";
  useEffect(() => {
    courseId1 = localStorage.getItem("classCourseId");
    setClassCourseId(courseId1);
  }, []);
  const [sessionData, setSessionData] = useState({
    class: "",
    sessionData: [],
  });
  const navigate = useNavigate();

  const [instructorList, setInstructorList] = useState([]);
  const [orgcertificateList, setOrgCertificateList] = useState([]);
  const [classId, setClassId] = useState(null);

  const [classesForm, setClassesForm] = useState({
    className: "",
    courseId: "",
    class_id: "",
    classStatus: "",
    classCertificate: "",
    classMaximumSeats: "",
    classDeliveryType: "",
    classVirtualClassroom: "",
    classLocation: "",
    classWaitingAllowed: 0,
    classNumberOfWaiting: "",
  });

  const [sessionForm, setSessionForm] = useState({
    sessionDate: "",
    sessionHours: "",
    sessionMinutes: "",
    sessionStartTimeHours: "",
    sessionStartTimeMinutes: "",
    sessionAmPm: "AM",
    sessionInstructorId: "",
  });

  const [classesPayload, setClassesPayload] = useState({
    className: "",
    maxSeats: "",
    deliveryType: "",
    virtualClassDescription: "",
    waitingAllowed: 0,
    noOfWaiting: "",
    location: "",
    sessions: [],
  });
  const [updatePayload, setUpdatePayload] = useState();

  const [validationMessages, setValidationMessages] = useState([]);
  const [showValidationMessages, setShowValidationMessages] = useState(false);
  const [validationMessages1, setValidationMessages1] = useState([]);
  const [showValidationMessages1, setShowValidationMessages1] = useState(false);

  const validateFormClasses = () => {
    let formIsValid = true;
    let newValidationMessages = {};
    if (!classesForm.className) {
      newValidationMessages.className = "Class Name is required";
      formIsValid = false;
    }
    if (!classesForm.classMaximumSeats) {
      newValidationMessages.classMaximumSeats = "Maximum Seats is required";
      formIsValid = false;
    }
    if (!classesForm.classDeliveryType) {
      newValidationMessages.classDeliveryType = "Delivery Type is required";
      formIsValid = false;
    }

    if (
      classesForm.classDeliveryType === "Virtual Classroom" &&
      !classesForm.classVirtualClassroom
    ) {
      newValidationMessages.classVirtualClassroom =
        "Virtual Session Information is required";
      formIsValid = false;
    }

    setValidationMessages(newValidationMessages);
    setShowValidationMessages(!formIsValid);
    return formIsValid;
  };

  const validateFormSession = () => {
    let formIsValid1 = true;
    let newValidationMessages1 = {};
    if (!sessionForm.sessionDate) {
      newValidationMessages1.sessionDate = "Session Date is required";
      formIsValid1 = false;
    }
    if (!sessionForm.sessionHours) {
      newValidationMessages1.sessionHours = "Session Hours is required";
      formIsValid1 = false;
    }
    // if (!sessionForm.sessionMinutes) {
    //   newValidationMessages1.sessionMinutes = "Session Minutes is required";
    //   formIsValid1 = false;
    // }
    if (!sessionForm.sessionStartTimeHours) {
      newValidationMessages1.sessionStartTimeHours =
        "Session Start Time Hours is required";
      formIsValid1 = false;
    }
    if (!sessionForm.sessionStartTimeMinutes) {
      newValidationMessages1.sessionStartTimeMinutes =
        "Session Start Time Minutes is required";
      formIsValid1 = false;
    }
    // if (!sessionForm.sessionAmPm) {
    //   newValidationMessages1.sessionAmPm = "Session AM/PM is required";
    //   formIsValid1 = false;
    // }
    if (!sessionForm.sessionInstructorId) {
      newValidationMessages1.sessionInstructorId =
        "Session Instructor is required";
      formIsValid1 = false;
    }

    setValidationMessages1(newValidationMessages1);
    setShowValidationMessages1(!formIsValid1);
    return formIsValid1;
  };

  const instructorNameBodyTemplate = (rowData) => {
    const instructor = instructorList.find(
      (item) => item.userId === parseInt(rowData.instructorId)
    );
    return instructor?.firstName + " " + instructor?.lastName;
  };
  const [editModeCourseId, setEditModeCourseId] = useState();
  const getOrgClassandSessionById = async (id) => {
    try {
      const response = await getApiCall(`getOrgClassandSessionById`, id);
      setEditModeCourseId(response.courseId);
      setClassesForm({
        ...classesForm,
        class_id: response.class_id,
        courseId: response.courseId,
        className: response.className,
        classStatus: response.classStatus,
        classMaximumSeats: response.maxSeats,
        classLocation: response.location,
        classDeliveryType:
          response.deliveryType === 0 ? "inperson" : 'Virtual Classroom"',
        classVirtualClassroom: response.virtualClassDescription,
      });

      const transformedSessions = response.sessions.map((session) => ({
        sessionId: session.sessionId,
        sessionDate: session.sessionDate,
        hrs: session.duration_hours,
        minutes: session.duration_minutes,
        startTime: session.startTime,
        timezone: session.timezone,
        instructorId: session.instructorId,
      }));
      console;
      setSessionData({ sessionData: transformedSessions });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (classroomId != null) {
      getOrgClassandSessionById(classroomId);
    }
  }, [classroomId]);
  useEffect(() => {
    if (classCourseId != null) {
      getOrgClassCourse(classCourseId);
    } else {
      getOrgClassCourse(editModeCourseId);
    }
  }, [classCourseId, editModeCourseId]);

  const getInstructorList = async () => {
    try {
      const response = await getApiCall(`getInstructorList`);
      setInstructorList(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setClassesPayload({
      ...classesPayload,
      courseId: classroomId ? classroomId : classCourseId,
      className: classesForm.className,
      maxSeats: classesForm.classMaximumSeats,
      deliveryType: classesForm.classDeliveryType,
      virtualClassDescription: classesForm.classVirtualClassroom,
      waitingAllowed: classesForm.classWaitingAllowed,
      noOfWaiting: classesForm.classNumberOfWaiting,
      location: classesForm.classLocation,
    });
  }, [classesForm, classCourseId]);

  useEffect(() => {
    //if session is not empty
    if (validateFormSession()) {
      setClassesPayload({
        ...classesPayload,
        sessions: [
          {
            // class: classId,
            date: sessionForm.sessionDate,
            hrs: sessionForm.sessionHours,
            minutes: sessionForm.sessionMinutes,
            startTime: `${sessionForm.sessionStartTimeHours}:${sessionForm.sessionStartTimeMinutes} ${sessionForm.sessionAmPm}`,
            timezone: "1",
            instructorId: sessionForm.sessionInstructorId,
          },
        ],
      });
    }
  }, [sessionForm]);

  useEffect(() => {
    setUpdatePayload((prevData) => {
      return {
        ...prevData,
        id: classesForm?.class_id,
        courseId: classesForm?.courseId,
        className: classesForm?.className,
        location: classesForm?.classLocation,
        maxSeats: classesForm?.classMaximumSeats,
        deliveryType: classesForm?.classDeliveryType,
        virtualClassDescription: classesForm?.classVirtualClassroom,
        isActive: classesForm?.classStatus,
        waitingAllowed: classesForm?.classWaitingAllowed,
        noOfWaiting: classesForm?.classNumberOfWaiting,
        organizationId: classId?.organizationId,
        sessions: sessionData.sessionData,
      };
    });
  }, [classesForm, sessionData]);

  // useEffect(() => {
  //   console.log({ sessionData });
  //   console.log({ updatePayload });
  // }, [sessionData, updatePayload]);

  const addClasses = async () => {
    try {
      const response = await postApiCall("addOrgClass", classesPayload);
      if (response) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Class Added Successfully",
          life: 3000,
        });
        setClassId(response);
        localStorage.removeItem("courseLibraryId");
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateClassAndSession = async (id) => {
    try {
      const response = await generalUpdateApi(
        "updateOrgClassandSessionById",
        updatePayload,
        id
      );
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Class updated Successfully",
        life: 3000,
      });
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong",
        life: 3000,
      });
    }
  };

  const getOrgCertificateList = async () => {
    try {
      const response = await getApiCall(`getOrgCertificateOptionList`);
      setOrgCertificateList(response);
    } catch (error) {
      console.log(error);
    }
  };
  const [courseData, setCourseData] = useState();
  const [loading, setLoading] = useState(false);
  const getOrgClassCourse = async (id) => {
    setLoading(true);
    try {
      const response = await getApiCall(`getOrgClassCourse`, id);
      setCourseData(response);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const getOrgClassSessionById = async (id) => {
    try {
      const response = await getApiCall(`getOrgClassSessionById`, id);
      setSessionForm(response);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (token !== "Bearer null") {
      getInstructorList();
      getOrgCertificateList();
    }
  }, []);

  const [apiCallValue, setApiCall] = useState(false);
  useEffect(() => {
    if (classroomId === null) {
      if (apiCallValue === true) {
        addSessions(sessionData);
      }
    }
  }, [sessionData, apiCallValue]);

  const addSessions = async (sessionDataNew) => {
    try {
      const response = await postApiCall("addOrgSession", sessionDataNew);

      // getSessionData(classId);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Session Added Successfully",
        life: 3000,
      });
      //clear state
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong",
        life: 3000,
      });
    }
  };

  const [displayTextButton, setDisplayTextButton] = useState(false);
  const confirmDeleteProduct = (id) => {
    const filteredData = sessionData.sessionData.filter(
      (item) => item.sessionId !== id
      // (item) => {
      //   console.log({ item });
      // }
    );
    setSessionData(filteredData);
  };
  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      {classroomId != null && (
        <div
          onClick={() => {
            setSessionPopup(true);
            console.log({ responseData });
            getOrgClassSessionById(responseData.sessionId);
            // localStorage.setItem("sessionID", responseData.sessionID);
          }}
        >
          <CImage
            src="/custom_icon/edit.svg"
            alt="edit.svg"
            style={{ height: "25px", cursor: "pointer" }}
            className="me-2"
            title="Edit Session"
          />
        </div>
      )}
      <CImage
        src="/custom_icon/bin.svg"
        className="me-3"
        alt="bin.svg"
        style={{ height: "24px", cursor: "pointer" }}
        onClick={() => confirmDeleteProduct(responseData.sessionId)}
        title="Delete Credential"
      />
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <CModal
        visible={sessionPopup}
        onClose={() => setSessionPopup(false)}
        size="md"
      >
        <CModalHeader closeButton>
          <CModalTitle>Add Session</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm
            className="row g-15 needs-validation"
            style={{ width: "25rem", margin: "1rem auto" }}
          >
            <div className="mb-3" style={{ display: "flex", gap: "4rem" }}>
              <CFormLabel
                htmlFor=""
                className=" col-form-label fw-bolder fs-7 required"
              >
                Session Date
              </CFormLabel>
              <div className="">
                <CFormInput
                  style={{ width: "13rem" }}
                  type="date"
                  id="validationCustom01"
                  required
                  placeholder="Session Date"
                  value={sessionForm.sessionDate}
                  onChange={(e) => {
                    setSessionForm({
                      ...sessionForm,
                      sessionDate: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="mb-3" style={{ display: "flex", gap: "4rem" }}>
              <CFormLabel
                htmlFor=""
                className=" col-form-label fw-bolder fs-7 required"
              >
                Session Time
              </CFormLabel>
              <div className="" style={{ width: "13rem" }}>
                {/* <CFormInput
                  type="number"
                  id="validationCustom02"
                  required
                  min={1}
                  max={9999}
                  placeholder="Session Time"
                  value={sessionForm.sessionHours}
                  onChange={(e) => {
                    setSessionForm({
                      ...sessionForm,
                      sessionHours: e.target.value,
                    });
                  }}
                /> */}
                <input
                  type="time"
                  id="appt"
                  name="appt"
                  min="09:00"
                  max="18:00"
                  value={sessionForm.sessionHours}
                  onChange={(e) => {
                    setSessionForm({
                      ...sessionForm,
                      sessionHours: e.target.value,
                    });
                  }}
                  style={{ width: "13rem", height: "2.2rem" }}
                />
              </div>
            </div>
            <div
              className="mb-3"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexDirection: "row",
                gap: "2.3rem",
              }}
            >
              <CFormLabel
                htmlFor=""
                className=" col-form-label fw-bolder fs-7 required"
                style={{}}
              >
                Session Duration
              </CFormLabel>
              <div style={{ display: "flex", gap: "1.1rem" }}>
                <div className="" style={{ width: "6rem" }}>
                  <CFormSelect
                    id="validationCustom05"
                    required
                    value={sessionForm.sessionStartTimeHours}
                    onChange={(e) => {
                      setSessionForm({
                        ...sessionForm,
                        sessionStartTimeHours: e.target.value,
                      });
                    }}
                  >
                    <option value="">Hours</option>
                    {/* 1 to 12 */}
                    {[...Array(12).keys()].map((item, index) => {
                      return (
                        <option key={index} value={item + 1}>
                          {item + 1}
                        </option>
                      );
                    })}
                  </CFormSelect>
                </div>
                <div className="" style={{ width: "6rem" }}>
                  <CFormSelect
                    id="validationCustom05"
                    required
                    value={sessionForm.sessionStartTimeMinutes}
                    onChange={(e) => {
                      setSessionForm({
                        ...sessionForm,
                        sessionStartTimeMinutes: e.target.value,
                      });
                    }}
                  >
                    <option value="">Minutes</option>
                    {/* 00 to 60 */}
                    {[...Array(60).keys()].map((item, index) => {
                      if (item < 10) {
                        item = "0" + item;
                      }
                      return (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      );
                    })}
                  </CFormSelect>
                </div>
              </div>
              {/* <div className="">
                  <CFormSelect
                    id="validationCustom05"
                    required
                    value={sessionForm.sessionAmPm}
                    onChange={(e) => {
                      setSessionForm({
                        ...sessionForm,
                        sessionAmPm: e.target.value,
                      });
                      setValidationMessages({
                        ...validationMessages,
                        sessionAmPm: e.target.value
                          ? ""
                          : "Session AM/PM is required",
                      });
                    }}
                  >
                    <option value="">Select Session AM/PM</option>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </CFormSelect>
                  {showValidationMessages && validationMessages.sessionAmPm && (
                    <div className="fw-bolder" style={{ color: "red" }}>
                      {validationMessages.sessionAmPm}
                    </div>
                  )}
                </div> */}
            </div>
            <div
              className="mb-3"
              style={{
                display: "flex",
                gap: "5.3rem",
              }}
            >
              <CFormLabel
                htmlFor=""
                className="col-form-label fw-bolder fs-7 required"
              >
                Time Zone
              </CFormLabel>
              <div className="">
                <CFormInput
                  type="text"
                  style={{ width: "13rem" }}
                  id="validationCustom06"
                  required
                  placeholder="Time Zone"
                  value={sessionForm.sessionTimeZone}
                  onChange={(e) => {
                    setSessionForm({
                      ...sessionForm,
                      sessionTimeZone: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="mb-3" style={{ display: "flex", gap: "2rem" }}>
              <CFormLabel
                htmlFor=""
                className=" col-form-label fw-bolder fs-7 required"
              >
                Session Instructor
              </CFormLabel>
              <div className="">
                <CFormSelect
                  style={{ width: "13rem" }}
                  id="validationCustom05"
                  required
                  value={sessionForm.sessionInstructorId}
                  onChange={(e) => {
                    setSessionForm({
                      ...sessionForm,
                      sessionInstructorId: e.target.value,
                    });
                  }}
                >
                  <option value="">Select Instructor</option>
                  {instructorList.map((item, index) => {
                    return (
                      <option key={index} value={item.userId}>
                        {item.firstName}
                      </option>
                    );
                  })}
                </CFormSelect>
              </div>
            </div>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="primary"
            disabled={
              sessionForm.sessionDate === "" ||
              sessionForm.sessionHours === "" ||
              sessionForm.sessionInstructorId === ""
                ? true
                : false
            }
            onClick={() => {
              setSessionPopup(false);
              setApiCall(true);
              setSessionForm({
                sessionDate: "",
                sessionHours: "",
                sessionMinutes: "",
                sessionStartTimeHours: "",
                sessionStartTimeMinutes: "",
                sessionAmPm: "AM",
                sessionInstructorId: "",
              });
              setSessionData((oldData) => {
                return {
                  ...oldData,
                  class: classId,
                  sessionData: [
                    ...oldData.sessionData,
                    {
                      class_id: sessionData.sessionData.length + 1,
                      sessionDate: sessionForm.sessionDate,
                      hrs: sessionForm.sessionHours,
                      minutes: "0",
                      startTime: `${sessionForm.sessionStartTimeHours}:${sessionForm.sessionStartTimeMinutes} ${sessionForm.sessionAmPm}`,
                      timezone: "1",
                      instructorId: sessionForm.sessionInstructorId,
                    },
                  ],
                };
              });
            }}
          >
            Add Sessions
          </CButton>
          <CButton
            color="secondary"
            onClick={() => {
              setSessionPopup(false);
              setSessionForm({
                sessionDate: "",
                sessionHours: "",
                sessionMinutes: "",
                sessionStartTimeHours: "",
                sessionStartTimeMinutes: "",
                sessionAmPm: "AM",
                sessionInstructorId: "",
              });
            }}
          >
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
      {loading ? (
        <div
          style={{
            width: "100%",
            height: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            class="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
        </div>
      ) : (
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardBody className="p-4">
                <CForm
                  className={`row g-15 needs-validation ps-4 InputThemeColor`}
                >
                  <CRow className="mb-4">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-3 col-form-label fw-bolder fs-7"
                        >
                          Training Name:
                        </CFormLabel>
                        <div
                          className="col-sm-8 col-md-9"
                          style={{ marginTop: "5px" }}
                        >
                          {courseData?.trainingName}
                        </div>
                      </CRow>
                    </CCol>

                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-3 col-form-label fw-bolder fs-7 "
                        >
                          Training Type:
                        </CFormLabel>
                        <div className="col-sm-8" style={{ marginTop: "5px" }}>
                          {courseData?.trainingType}
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>
                  <CRow className="mb-4">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-3 col-form-label fw-bolder fs-7"
                        >
                          Training Category
                        </CFormLabel>
                        <div
                          className="col-sm-8 col-md-9"
                          style={{ marginTop: "5px" }}
                        >
                          {courseData?.trainingCategory &&
                            courseData?.trainingCategory.length > 0 && (
                              <div>
                                {courseData.trainingCategory
                                  .map((category) => category?.categoryName)
                                  .join(", ")}
                              </div>
                            )}
                        </div>
                      </CRow>
                    </CCol>
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-3 col-form-label fw-bolder fs-7"
                        >
                          Credit
                        </CFormLabel>
                        <div
                          className="col-sm-8 col-md-9"
                          style={{ marginTop: "5px" }}
                        >
                          {courseData?.credits}
                        </div>
                      </CRow>
                    </CCol>

                    {/* Fourth Column - Content for Row 3 */}
                    {/* Add your content for the fourth column here */}
                  </CRow>
                </CForm>
              </CCardBody>
              <CCardBody className="card-body border-top p-9">
                <CForm className="row g-15 needs-validation">
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7 required"
                        >
                          Class Name
                        </CFormLabel>
                        <div className="col-sm-7">
                          <CFormInput
                            type="text"
                            id="validationCustom01"
                            required
                            placeholder="Class Name"
                            value={classesForm.className}
                            onChange={(e) => {
                              setClassesForm({
                                ...classesForm,
                                className: e.target.value,
                              });
                              setValidationMessages({
                                ...validationMessages,
                                className: e.target.value
                                  ? ""
                                  : "Class Name is required",
                              });
                            }}
                          />

                          {showValidationMessages &&
                            validationMessages.className && (
                              <div
                                className="fw-bolder"
                                style={{ color: "red" }}
                              >
                                {validationMessages.className}
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
                          Maximum Seats
                        </CFormLabel>
                        <div className="col-sm-7">
                          <CFormInput
                            type="number"
                            id="validationCustom04"
                            required
                            min={1}
                            max={9999}
                            placeholder="Maximum Seats"
                            value={classesForm.classMaximumSeats}
                            onChange={(e) => {
                              setClassesForm({
                                ...classesForm,
                                classMaximumSeats: e.target.value,
                              });
                              setValidationMessages({
                                ...validationMessages,
                                classMaximumSeats: e.target.value
                                  ? ""
                                  : "Maximum Seats is required",
                              });
                            }}
                          />
                          {showValidationMessages &&
                            validationMessages.classMaximumSeats && (
                              <div
                                className="fw-bolder"
                                style={{ color: "red" }}
                              >
                                {validationMessages.classMaximumSeats}
                              </div>
                            )}
                        </div>
                      </CRow>
                    </CCol>
                    {/* <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 py-2 required"
                      >
                        Status
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormSelect
                          id="validationCustom02"
                          required
                          value={classesForm.classStatus}
                          onChange={(e) => {
                            setClassesForm({
                              ...classesForm,
                              classStatus: e.target.value,
                            });
                            setValidationMessages({
                              ...validationMessages,
                              classStatus: e.target.value
                                ? ""
                                : "Class Status is required",
                            });
                          }}
                        >
                          <option value="">Select Status</option>
                          <option value="Draft">Draft</option>
                          <option value="Saved">Saved</option>
                          <option value="Published">Published</option>
                        </CFormSelect>
                        {showValidationMessages &&
                          validationMessages.classStatus && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.classStatus}
                            </div>
                          )}
                      </div>
                    </CRow>
                  </CCol> */}
                  </CRow>
                  <CRow className="mb-3">
                    {/* <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Certificate
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormSelect
                          id="validationCustom03"
                          required
                          value={classesForm.classCertificate}
                          onChange={(e) => {
                            setClassesForm({
                              ...classesForm,
                              classCertificate: e.target.value,
                            });
                            setValidationMessages({
                              ...validationMessages,
                              classCertificate: e.target.value
                                ? ""
                                : "Class Certificate is required",
                            });
                          }}
                        >
                          <option value="">Select Certificate</option>
                          {orgcertificateList.map((item, index) => {
                            return (
                              <option key={index} value={item.certificateId}>
                                {item.certificateName}
                              </option>
                            );
                          })}
                        </CFormSelect>
                        {showValidationMessages &&
                          validationMessages.classCertificate && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.classCertificate}
                            </div>
                          )}
                      </div>
                    </CRow>
                  </CCol> */}
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7 required"
                        >
                          Delivery Type
                        </CFormLabel>
                        <div className="col-sm-7">
                          <CFormSelect
                            id="validationCustom05"
                            required
                            value={classesForm.classDeliveryType}
                            onChange={(e) => {
                              setClassesForm({
                                ...classesForm,
                                classDeliveryType: e.target.value,
                              });
                              setValidationMessages({
                                ...validationMessages,
                                classDeliveryType: e.target.value
                                  ? ""
                                  : "Delivery Type is required",
                              });
                            }}
                          >
                            <option value="">Select Delivery Type</option>
                            <option value="inperson">Inperson</option>
                            <option value="Virtual Classroom">
                              Virtual Classroom
                            </option>
                            \
                          </CFormSelect>
                          {showValidationMessages &&
                            validationMessages.classDeliveryType && (
                              <div
                                className="fw-bolder"
                                style={{ color: "red" }}
                              >
                                {validationMessages.classDeliveryType}
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
                          Location
                        </CFormLabel>
                        <div className="col-sm-7">
                          <CFormInput
                            id="validationCustom04"
                            required
                            placeholder="Location"
                            value={classesForm.classLocation}
                            onChange={(e) => {
                              setClassesForm({
                                ...classesForm,
                                classLocation: e.target.value,
                              });
                              setValidationMessages({
                                ...validationMessages,
                                classLocation: e.target.value
                                  ? ""
                                  : "Maximum Seats is required",
                              });
                            }}
                          />
                          {showValidationMessages &&
                            validationMessages.classLocation && (
                              <div
                                className="fw-bolder"
                                style={{ color: "red" }}
                              >
                                {validationMessages.classLocation}
                              </div>
                            )}
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>
                  {classesForm.classDeliveryType === "Virtual Classroom" && (
                    <CRow className="mb-3">
                      <CCol md={12}>
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-7 col-form-label fw-bolder fs-7 "
                          >
                            Virtual Session Information
                          </CFormLabel>
                          <div className="col-sm-12">
                            <InputCustomEditor
                              value={classesForm.classVirtualClassroom}
                              onChange={(e) => {
                                setClassesForm({
                                  ...classesForm,
                                  classVirtualClassroom: e,
                                });
                              }}
                            />
                          </div>
                        </CRow>
                      </CCol>
                    </CRow>
                  )}
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7 "
                        >
                          Waiting Allowed
                        </CFormLabel>
                        <div className="col-sm-7">
                          <CFormSwitch
                            size="xl"
                            id="formSwitchCheckDefaultXL"
                            checked={classesForm.classWaitingAllowed === 1}
                            onChange={(e) =>
                              e.target.checked
                                ? setClassesForm({
                                    ...classesForm,
                                    classWaitingAllowed: 1,
                                  })
                                : setClassesForm({
                                    ...classesForm,
                                    classWaitingAllowed: 0,
                                  })
                            }
                          />
                        </div>
                      </CRow>
                    </CCol>
                    {classesForm.classWaitingAllowed === 1 && (
                      <CCol md={6}>
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-4 col-form-label fw-bolder fs-7 required"
                          >
                            Number Of Waiting
                          </CFormLabel>
                          <div className="col-sm-7">
                            <CFormInput
                              id="validationCustom04"
                              required
                              type="number"
                              placeholder="Number Of Waiting"
                              value={classesForm.classNumberOfWaiting}
                              onChange={(e) => {
                                setClassesForm({
                                  ...classesForm,
                                  classNumberOfWaiting: e.target.value,
                                });
                              }}
                            />
                          </div>
                        </CRow>
                      </CCol>
                    )}
                  </CRow>
                </CForm>

                {displayTextButton === true &&
                  sessionData?.sessionData?.length <= 0 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <div>
                        There are no session added yet. Please click on bellow
                        button to add the session
                      </div>
                      <CButton
                        className="btn btn-primary me-2 "
                        style={{ width: "9rem", marginTop: "1rem" }}
                        onClick={() => {
                          setSessionPopup(true);
                        }}
                      >
                        Add Sessions
                      </CButton>
                    </div>
                  )}
                {sessionData?.sessionData?.length >= 1 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "end",
                      flexDirection: "column",
                    }}
                  >
                    <CButton
                      className="btn btn-primary "
                      style={{ width: "9rem" }}
                      onClick={() => {
                        setSessionPopup(true);
                      }}
                    >
                      Add Sessions
                    </CButton>
                  </div>
                )}
              </CCardBody>
              {sessionData?.sessionData?.length >= 1 && (
                <CCardBody className="p-9">
                  <DataTable
                    value={sessionData.sessionData}
                    className="p-datatable-gridlines p-datatable-sm"
                    rowHover
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    dataKey="id"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} sessions"
                    emptyMessage="No sessions found"
                  >
                    <Column
                      field="sessionDate"
                      header="Session Date"
                      sortable
                      filter
                    />
                    <Column
                      field="startTime"
                      header="Session Start Time"
                      sortable
                      filter
                    />
                    <Column
                      body={instructorNameBodyTemplate}
                      header="Instructor"
                      sortable
                      filter
                    />
                    <Column
                      field="Action"
                      header="Action"
                      body={buttonTemplate}
                    />
                  </DataTable>
                </CCardBody>
              )}

              <CCardFooter>
                <div className="d-flex justify-content-end">
                  {classroomId === null ? (
                    <CButton
                      className="btn btn-primary me-2"
                      onClick={() => {
                        if (sessionData.sessionData?.length <= 0) {
                          if (validateFormClasses()) {
                            addClasses();
                          }
                        } else {
                          navigate(-1);
                        }
                      }}
                    >
                      Save
                    </CButton>
                  ) : (
                    <CButton
                      className="btn btn-primary me-2"
                      onClick={() => {
                        updateClassAndSession(classesForm?.class_id);
                        localStorage.removeItem("classId1");
                      }}
                    >
                      Update
                    </CButton>
                  )}
                  {classroomId != null ? (
                    <></>
                  ) : (
                    <>
                      {!displayTextButton && (
                        <CButton
                          className="btn btn-primary me-2"
                          onClick={() => {
                            if (validateFormClasses()) {
                              if (displayTextButton === false) {
                                addClasses();
                              }
                              setDisplayTextButton(true);
                            }
                          }}
                        >
                          Save and Continue
                        </CButton>
                      )}
                    </>
                  )}

                  <div
                    className="btn btn-primary me-2"
                    onClick={() => {
                      localStorage.removeItem("courseLibraryId");
                      navigate(-1);
                    }}
                  >
                    Back
                  </div>
                </div>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      )}
    </div>
  );
}

export default AddEditClasses;
