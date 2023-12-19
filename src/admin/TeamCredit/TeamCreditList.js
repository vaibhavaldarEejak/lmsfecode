import React, { useRef, useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTabContent,
  CTabPane,
  CBadge,
  CFormCheck,
  CFormInput,
  CNav,
  CNavItem,
  CNavLink,
  CModal,
  CButton,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CImage,
  CFormSelect,
  CTabs,
} from "@coreui/react";
import { Link } from "react-router-dom";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Skeleton } from "primereact/skeleton";
import "../../css/table.css";
import getApiCall from "src/server/getApiCall";
import { Toast } from "primereact/toast";
import postApiCall from "src/server/postApiCall";
import { TabPanel, TabView } from "primereact/tabview";
import TrainingInProgressDataTable from "./TrainingInProgressDataTable";
import RequirmentLearningPlanModelTable from "./RequirmentLearningPlanModelTable";
import RequirmentAssessmentTableModel from "./RequirmentAssessmentTableModel";
import TranscriptTable from "./TranscriptTable";
import TranscriptHistory from "./TranscriptHistory";
import Player from "src/superadmin/MediaLibrary/Player";

const TeamCreditList = () => {
  const [responseData, setResponseData] = useState(null);
  const colorName = localStorage.getItem("ThemeColor");
  const [coursevisible, setCoursevisible] = useState(false);
  const [trainingProgressModel, setTrainingProgressModel] = useState(false);
  const [requirmentModel, setRequirmentModel] = useState(false);
  const [transcriptModal, setTranscriptModal] = useState(false);
  const [certificateModal, setCertificateModal] = useState(false);
  const [transcriptHistoryModal, setTranscriptHistoryModal] = useState(false);
  const [courseListbyCat, setCourseListbyCat] = useState([]);
  const [certificateList, setCertificateList] = useState([]);
  const [creditListbyCat, setCreditListbyCat] = useState([]);
  const [courseId, setCourseId] = useState();
  const [globalFilterValue3, setGlobalFilterValue3] = useState("");
  const [globalFilterValue2, setGlobalFilterValue2] = useState("");
  const [rowClick, setRowClick] = useState(false);
  const [filters2, setFilters2] = useState(null);
  const [categoryId, setCategoryId] = useState([]);
  const [userId, setUserId] = useState();
  const toast = useRef(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [isAnyUserSelected, setIsAnyUserSelected] = useState(false);
  const [isCreditGiven, setIsCreditGiven] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedCourseType, setSelectedCourseType] = useState(null);

  const [themes, setThemes] = useState(colorName);
  const [trainingUserId, setTrainingUserId] = useState();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeIndex1, setActiveIndex1] = useState(0);
  const [certificateView, setCertificateView] = useState(false);

  const menu = useRef(null);
  const dt = useRef(null);
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const [level, setLevel] = useState("1");

  const [extension, setextension] = useState("");

  const getMyTeamList = async () => {
    try {
      const response = await getApiCall(`getMyTeamList?level=${level}`);
      setResponseData(response);
    } catch (error) {
      console.log(error);
    }
  };
  const getCertificatelist = async (id) => {
    try {
      const response = await getApiCall("viewCreditCertificate", id);
      setCertificateList(response);
    } catch (error) {
      console.log(error);
    }
  };

  const getCourseListByUserId = async (courseType) => {
    const data = {
      userIds: selectedUserIds,
    };
    try {
      const response = await postApiCall("getCourseListByUserId", data);

      // Filter courses based on the selected course type
      const filteredCourses = response.filter(
        (course) => course.trainingType === courseType
      );

      setCourseListbyCat(filteredCourses);
      setSelectedCourseType(courseType); // Set the selected course type
      setCoursevisible(true); // Open the modal popup
    } catch (error) {
      // Handle error
    }
  };
  const giveCredit = async (courseIds) => {
    const data = {
      userIds: selectedUserIds,
      courseIds: [courseIds],
    };

    try {
      const response = await postApiCall("giveCredit", data);

      toast.current.show({
        severity: "success",
        summary: "Credit Added Successfully",
        life: 3000,
      });
      setIsCreditGiven(true);
      setTimeout(() => {
        setCoursevisible(false);
      }, 3000);
    } catch (error) {
      console.error("Error giving credit:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error,
        life: 3000,
      });
    }
  };

  const getViewCreditListByUserId = async (id) => {
    try {
      const response = await getApiCall("viewCreditListByUserId", id);
      setCreditListbyCat(response);
    } catch (error) {
      // Handle errors
      console.error("Error fetching history data:", error);
    }
  };

  useEffect(() => {
    if (token !== "Bearer null") {
      getMyTeamList();
      // initFilters();
      // initFilters2();
      // initFilters3();
    }
  }, [level]);

  const onGlobalFilterChange3 = (e) => {
    const value = e.target.value;
    setGlobalFilterValue3(value); // Update globalFilterValue3 state here
  };

  const onGlobalFilterChange2 = (e) => {
    const value = e.target.value;
    let _filters2 = { ...filters2 };
    _filters2["global"].value = value;

    setFilters2(_filters2);
    setGlobalFilterValue2(value);
  };
  const coursePopUp = (id) => {
    setCourseId(id);
    getCourseListByUserId(id);
    setCoursevisible(true);
  };

  const creditPopUp = (id) => {
    setCourseId(id);
    getViewCreditListByUserId(id);
  };
  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };
  const badges = () => (
    <>
      <CBadge className="badge badge-light-info text-primary" color="light">
        <span>{responseData.creditScore}</span>
      </CBadge>
    </>
  );

  const name = (userlist) => <>{userlist ? userlist?.userName : "-"}</>;

  const email = (responseData) => (
    <>{responseData.email ? responseData?.email : "-"}</>
  );

  const jobTitle = (responseData) => (
    <>{responseData.jobTitle ? responseData?.jobTitle : "-"}</>
  );
  const transcriptButton = (responseData) => (
    <div
      className="d-flex"
      style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
    >
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          setTrainingUserId(responseData.userId);
          setTranscriptModal(true);
        }}
      >
        Transcript
      </button>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          setTrainingUserId(responseData.userId);
          setTranscriptHistoryModal(true);
        }}
      >
        Transcript History
      </button>
    </div>
  );
  const certificateButton = (responseData) => (
    <div
      className="d-flex"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <button
        type="button"
        className="btn btn-primary "
        onClick={() => {
          setCertificateModal(true);
          getCertificatelist(responseData.userId);
        }}
      >
        View
      </button>
    </div>
  );
  const [certificateUrl, setCertificateUrl] = useState();
  const certificateActionButton = (responseData) => (
    <div className="d-flex">
      <button
        type="button"
        className="btn btn-primary me-2 mt-3"
        onClick={() => {
          setCertificateView(true);
          setCertificateUrl(responseData.certificateLink);
        }}
      >
        View Certificate
      </button>
      <button
        type="button"
        className="btn btn-primary me-2 mt-3"
        onClick={() => {
          handleDownload(responseData);
        }}
      >
        Download Certificate
      </button>
    </div>
  );

  const handleDownload = async (value) => {
    try {
      const response = await fetch(value.certificateLink);
      const contentDisposition = response.headers.get("content-disposition");
      let filename = "file"; // Default filename
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=(['"]?)([^"';\n]*)\1?/
        );
        if (filenameMatch && filenameMatch.length >= 3) {
          filename = filenameMatch[2];
        }
      }

      const fileBlob = await response.blob();
      const blobUrl = URL.createObjectURL(fileBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      var errMsg = err?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
    }
  };
  const requirmentButton = (responseData) => (
    <div
      className="d-flex "
      style={{ display: "flex", justifyContent: "center" }}
    >
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          setRequirmentModel(true);
          setTrainingUserId(responseData.userId);
          // api
        }}
      >
        View
      </button>
    </div>
  );
  const trainingInProgressButton = (responseData) => (
    <div
      className="d-flex"
      style={{ display: "flex", justifyContent: "center" }}
    >
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          setTrainingProgressModel(true);
          setTrainingUserId(responseData.userId);
          // api
        }}
      >
        View
      </button>
    </div>
  );

  const exportCSV = () => {
    dt.current.exportCSV();
  };
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const clearFilter = () => {
    initFilters();
  };

  const catpopup = () => {
    if (categoryId.length > 0) {
      setCoursevisible(true);
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Select Categories",
        life: 3000,
      });
    }
  };

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <div onClick={() => creditPopUp(responseData.userId)}>
        <CImage
          src="/custom_icon/eye.svg"
          style={{ height: "25px", marginRight: "15px" }} // Add margin here
          className="me-1 responsiveImage"
          alt="eye.svg"
          title="View Course"
        />
      </div>

      <div
        onClick={() => {
          setTrainingProgressModel(true);
        }}
        className="me-2"
        title="History"
        style={{
          height: "25px",
          cursor: "pointer",
          marginLeft: "10px",
          marginRight: "10px",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="21"
          fill="currentColor"
          class="bi bi-calendar-check-fill"
          viewBox="0 0 16 16"
        >
          <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4V.5zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm-5.146-5.146-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708z" />
        </svg>
      </div>

      <div title="View">
        <Link
          to={`/admin/userlist/viewuser`}
          onClick={() => {
            localStorage.setItem("userId", responseData.userId);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="25"
            fill="currentColor"
            class="bi bi-person-fill"
            viewBox="0 0 16 16"
            style={{ marginRight: "10px" }}
          >
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          </svg>
        </Link>
      </div>
    </div>
  );

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      userName: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      email: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      jobTitle: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      roleName: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
    });
    setGlobalFilterValue("");
  };

  const initFilters2 = () => {
    setFilters2({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      // courseName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      // coursetype: { value: null, matchMode: FilterMatchMode.CONTAINS },
      // coursecredit: { value: null, matchMode: FilterMatchMode.CONTAINS },
      // global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      courseName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      coursetype: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      coursecredit: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue2("");
  };

  const initFilters3 = () => {
    setFilters2({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      // courseName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      // coursetype: { value: null, matchMode: FilterMatchMode.CONTAINS },
      // coursecredit: { value: null, matchMode: FilterMatchMode.CONTAINS },
      // global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      courseName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      credit: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      coursecredit: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue3("");
  };

  const items = [
    {
      label: "Options",
      items: [
        {
          label: "elearning",
        },
        {
          label: "Classroom",
        },
        {
          label: "Manual Training",
        },
        {
          label: "Credential Items",
        },
      ],
    },
  ];

  const errorMessages = "-";
  const checkbox1 = (responseData) => (
    <>
      <input
        className="form-check-input"
        type="checkbox"
        onChange={(event) => handleChange(event, responseData.userId)}
        checked={selectedUserIds.includes(responseData.userId)}
        style={{ marginTop: "11px" }}
      />
    </>
  );

  const checkbox2 = (responseData) => (
    <>
      <input
        className="form-check-input"
        type="checkbox"
        onChange={(event) =>
          handleGiveCreditCheckboxChange(event, responseData.courseId)
        }
        checked={selectedCourseIds.includes(responseData.courseId)}
        style={{ marginTop: "11px" }}
      />
    </>
  );

  const handleCourseClick = (courseId) => {
    setSelectedCourseId(courseId);
    giveCredit(courseId); // Call giveCredit function here with the selected courseId
  };

  const handleGiveCreditCheckboxChange = (event, courseId) => {
    const isChecked = event.target.checked;

    setSelectedCourseIds((prevSelectedCourseIds) => {
      if (isChecked) {
        return [...prevSelectedCourseIds, courseId];
      } else {
        return prevSelectedCourseIds.filter((id) => id !== courseId);
      }
    });
  };

  const handleChange = (event, selectedUserId) => {
    const isChecked = event.target.checked;

    setSelectedUserIds((prevSelectedUserIds) => {
      if (isChecked) {
        return [...prevSelectedUserIds, selectedUserId];
      } else {
        return prevSelectedUserIds.filter(
          (userId) => userId !== selectedUserId
        );
      }
    });
    setUserId(selectedUserId);
    setIsAnyUserSelected(isChecked);
  };

  const credits = (responseData) => (
    <>
      <div style={{ textAlign: "center" }}>
        <CBadge className="badge badge-light-info text-info" color="light">
          {responseData.credits ? responseData.credits : "-"}
        </CBadge>
      </div>
    </>
  );

  const handleClose = () => {
    setCertificateModal(true);
    setCertificateView(false);
  };

  const onChangeRole = (evt) => {
    const value = evt.target.value;
    setLevel(value);
  };
  return (
    <div className="">
      <div className="container">
        <div className="container-fluid">
          <CRow>
            <CCol xs={12} style={{ padding: "1px" }}>
              <CCard className="mb-7 card-ric">
                <div>
                  <CCardHeader className="p-0">
                    <CNav variant="tabs">
                      <CNavItem>
                        <Link
                          style={{ cursor: "pointer", textDecoration: "none" }}
                          to={`/admin/teamcreditlist`}
                        >
                          <CNavLink active style={{ cursor: "pointer" }}>
                            <strong>Team Credit</strong>
                          </CNavLink>
                        </Link>
                      </CNavItem>
                    </CNav>
                    <CTabContent className="rounded-bottom">
                      <CTabPane className="p-3 preview" visible>
                        <div className="card-header border-0 d-flex justify-content-between">
                          <div className="d-flex gap-3">
                            <span className="p-input-icon-left">
                              <i className="pi pi-search" />
                              <InputText
                                value={globalFilterValue}
                                onChange={onGlobalFilterChange}
                                style={{ height: "40px" }}
                                className="p-input-sm"
                                placeholder="Search..."
                              />
                            </span>
                            <div>
                              <CFormSelect
                                className=""
                                type="text"
                                id="validationCustom01"
                                required
                                style={{
                                  height: "2.5rem",
                                  width: "9rem",
                                  fontSize: "1.2rem !important",
                                }}
                                onChange={(e) => onChangeRole(e)}
                              >
                                <option
                                  style={{ fontSize: "1.4rem" }}
                                  value="1"
                                >
                                  level 1
                                </option>
                                <option
                                  style={{ fontSize: "1.4rem" }}
                                  value="2"
                                >
                                  level 2
                                </option>
                                <option
                                  style={{ fontSize: "1.4rem" }}
                                  value="3"
                                >
                                  level 3
                                </option>
                              </CFormSelect>
                            </div>
                          </div>

                          <div className=" ml-4 ">
                            <Button
                              title="Export Users"
                              style={{ height: "40px" }}
                              icon="pi pi-upload"
                              className="btn btn-info me-2"
                              onClick={exportCSV}
                            />
                            {/* <CDropdown>
                              <CDropdownToggle
                                title="Credits"
                                style={{ height: "40px" }}
                                label="Give Credit"
                                icon="pi pi-bars"
                                disabled={!isAnyUserSelected}
                              >
                                Give Credit
                              </CDropdownToggle>
                              <CDropdownMenu>
                                <CDropdownItem
                                  onClick={() =>
                                    getCourseListByUserId("eLearning")
                                  } // Pass the course type as a parameter
                                  style={{ cursor: "pointer" }}
                                >
                                  elearning
                                </CDropdownItem>
                                <CDropdownItem
                                  onClick={() =>
                                    getCourseListByUserId("Classroom")
                                  } // Pass the course type as a parameter
                                  style={{ cursor: "pointer" }}
                                >
                                  Classroom
                                </CDropdownItem>
                                <CDropdownItem
                                  onClick={() =>
                                    getCourseListByUserId("Assesment")
                                  } // Pass the course type as a parameter
                                  style={{ cursor: "pointer" }}
                                >
                                  Assesment
                                </CDropdownItem>
                              </CDropdownMenu>
                            </CDropdown> */}
                            <div className="d-grid gap-2 d-md-flex"></div>
                          </div>
                        </div>
                      </CTabPane>
                    </CTabContent>
                  </CCardHeader>
                </div>
                <CCardBody>
                  <Toast ref={toast} />
                  {/* Requirment Model */}
                  <CModal
                    size="xl"
                    visible={requirmentModel}
                    onClose={() => setRequirmentModel(false)}
                    scrollable
                  >
                    <CModalHeader closeButton={true}>
                      <div style={{ fontWeight: 600 }}>Requirments</div>
                    </CModalHeader>
                    <CModalBody>
                      <TabView
                        activeIndex={activeIndex1}
                        onTabChange={(e) => setActiveIndex1(e.index)}
                      >
                        <TabPanel header="Learning Plan">
                          <RequirmentLearningPlanModelTable
                            userID={trainingUserId}
                          />
                        </TabPanel>
                        <TabPanel header="Assessments">
                          <RequirmentAssessmentTableModel
                            userID={trainingUserId}
                          />
                        </TabPanel>
                      </TabView>
                    </CModalBody>
                    <CModalFooter>
                      <CButton
                        className="btn btn-primary"
                        onClick={() => setRequirmentModel(false)}
                      >
                        Cancel
                      </CButton>
                    </CModalFooter>
                  </CModal>
                  {/* Training Model */}
                  <CModal
                    size="xl"
                    visible={trainingProgressModel}
                    onClose={() => setTrainingProgressModel(false)}
                    scrollable
                  >
                    <CModalHeader closeButton={true}>
                      <div style={{ fontWeight: 600 }}>
                        Training In Progress
                      </div>
                    </CModalHeader>
                    <CModalBody>
                      <TabView
                        activeIndex={activeIndex}
                        onTabChange={(e) => setActiveIndex(e.index)}
                      >
                        <TabPanel header="eLearning">
                          <TrainingInProgressDataTable
                            userID={trainingUserId}
                            indexValue={activeIndex}
                          />
                        </TabPanel>
                        <TabPanel header="Classroom">
                          <TrainingInProgressDataTable
                            userID={trainingUserId}
                            indexValue={activeIndex}
                          />
                        </TabPanel>
                        <TabPanel header="Assessment">
                          <TrainingInProgressDataTable
                            userID={trainingUserId}
                            indexValue={activeIndex}
                          />
                        </TabPanel>
                        <TabPanel header="Credential">
                          <TrainingInProgressDataTable
                            userID={trainingUserId}
                            indexValue={activeIndex}
                          />
                        </TabPanel>
                      </TabView>
                    </CModalBody>
                    <CModalFooter>
                      <CButton
                        className="btn btn-primary"
                        onClick={() => setTrainingProgressModel(false)}
                      >
                        Cancel
                      </CButton>
                    </CModalFooter>
                  </CModal>
                  {/* Certificate */}
                  <CModal
                    size="xl"
                    visible={certificateModal}
                    onClose={() => setCertificateModal(false)}
                    scrollable
                  >
                    <CModalHeader closeButton={true}>
                      <CTabContent className="rounded-bottom">
                        <CTabPane className="p-3 preview" visible>
                          <div style={{ fontWeight: 600 }}>Certificate</div>
                        </CTabPane>
                      </CTabContent>
                    </CModalHeader>
                    <CModalBody>
                      <DataTable
                        selectionMode={rowClick ? null : "checkbox"}
                        value={certificateList}
                        removableSort
                        showGridlines
                        rowHover
                        emptyMessage="-"
                        dataKey="courseId"
                      >
                        <Column
                          field="trainingName"
                          header="Training Name"
                        ></Column>
                        <Column field="credits" header="Course Credit"></Column>
                        <Column
                          field="view"
                          header="View"
                          body={certificateActionButton}
                        ></Column>
                      </DataTable>
                    </CModalBody>
                    <CModalFooter>
                      <CButton
                        className="btn btn-primary"
                        onClick={() => setCertificateModal(false)}
                      >
                        Cancel
                      </CButton>
                    </CModalFooter>
                  </CModal>
                  {/* Certificate View */}
                  <CModal
                    visible={certificateView}
                    onClose={handleClose}
                    size="lg"
                  >
                    <CModalHeader>
                      <strong>View Certificate</strong>
                    </CModalHeader>
                    <CModalBody>
                      <Player extension={extension} mediaUrl={certificateUrl} />
                    </CModalBody>
                    <CModalFooter>
                      <CButton
                        color="primary"
                        onClick={handleClose}
                        className={`saveButtonTheme${themes}`}
                      >
                        Close
                      </CButton>
                    </CModalFooter>
                  </CModal>
                  {/* Transcript Model */}
                  <CModal
                    size="xl"
                    visible={transcriptModal}
                    onClose={() => setTranscriptModal(false)}
                    scrollable
                  >
                    <CModalHeader closeButton={true}>
                      <div style={{ fontWeight: 600 }}>Transcript </div>
                    </CModalHeader>
                    <CModalBody>
                      <TranscriptTable userID={trainingUserId} />
                    </CModalBody>
                    <CModalFooter>
                      <CButton
                        className="btn btn-primary"
                        onClick={() => setTranscriptModal(false)}
                      >
                        Cancel
                      </CButton>
                    </CModalFooter>
                  </CModal>
                  <CModal
                    size="xl"
                    visible={transcriptHistoryModal}
                    onClose={() => setTranscriptHistoryModal(false)}
                    scrollable
                  >
                    <CModalHeader closeButton={true}>
                      <div style={{ fontWeight: 600 }}>Transcript History</div>
                    </CModalHeader>
                    <CModalBody>
                      <TranscriptHistory />
                    </CModalBody>
                    <CModalFooter>
                      <CButton
                        className="btn btn-primary"
                        onClick={() => setTranscriptHistoryModal(false)}
                      >
                        Cancel
                      </CButton>
                    </CModalFooter>
                  </CModal>
                  {!responseData ? (
                    <div className="card">
                      <DataTable
                        value={items}
                        showGridlines
                        className="p-datatable-striped"
                      >
                        <Column
                          field="Name"
                          header=" Name"
                          sortable
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="email"
                          header="Email"
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="jobTitle"
                          header="Job Title"
                          body={bodyTemplate}
                        />
                        <Column
                          field="roleName"
                          header="User Role"
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          style={{ width: "12%", textAlign: "center" }}
                          body={bodyTemplate}
                          header="Credit Score"
                        />

                        <Column
                          field="Action"
                          header="Action"
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                      </DataTable>
                    </div>
                  ) : (
                    <DataTable
                      ref={dt}
                      value={responseData}
                      removableSort
                      paginator
                      showGridlines
                      rowHover
                      emptyMessage="No records found."
                      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                      rows={10}
                      rowsPerPageOptions={[10, 20, 50]}
                      dataKey="organizationId"
                      filters={filters}
                      filterDisplay="row"
                      globalFilterFields={["userName", "email", "jobTitle"]}
                    >
                      <Column body={checkbox1} style={{ width: "1%" }}></Column>
                      <Column
                        header="Username"
                        body={name}
                        // sortable
                        // showFilterMenu={false}
                        // filter
                        // field="userName"
                        // filterElement={teamNameFilterTemplate}
                        // filterPlaceholder="Search"
                      />
                      <Column
                        field="email"
                        header="Email"
                        body={email}
                        // sortable
                        // showFilterMenu={false}
                        // filter
                        // filterElement={emailFilterTemplate}
                        // filterPlaceholder="Search"
                      />
                      <Column
                        field="jobTitle"
                        header="Job Title"
                        body={jobTitle}
                        // sortable
                        // showFilterMenu={false}
                        // filter
                        // filterElement={jobTitleFilterTemplate}
                        // filterPlaceholder="Search"
                      />
                      <Column
                        field="requirments"
                        header="Requirments"
                        body={requirmentButton}
                      />
                      <Column
                        field="trainingInProgress"
                        header="Training in Progress"
                        body={trainingInProgressButton}
                      />
                      <Column
                        field="certificate"
                        header="Certificate"
                        body={certificateButton}
                      />
                      <Column
                        field="transcript"
                        header="Transcript"
                        body={transcriptButton}
                      />
                      {/* <Column header="View" body={buttonTemplate} /> */}
                    </DataTable>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </div>
    </div>
  );
};
export default TeamCreditList;
