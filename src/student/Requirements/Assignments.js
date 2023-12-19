import React, { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModal,
  CCol,
  CNav,
  CRow,
  CNavItem,
  CModalFooter,
  CNavLink,
  CTabContent,
  CTabPane,
} from "@coreui/react";
import { ThreeDotsVertical, List, Grid3x3GapFill } from "react-bootstrap-icons";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Link, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import getApiCall from "src/server/getApiCall";
import CourseImageSample from "../../assets/images/sampleCourseImage.png";
import "../../css/table.css";
import postApiCall from "src/server/postApiCall";
import Player from "./Player";
import ReactPaginate from "react-paginate";
import "../../css/pagination.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AssignmentListingCard from "./AssignmentCards";

const StudentAssignment = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const toast = useRef(null);
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  const navigate = useNavigate();
  const [mediaUrl, setmediaUrl] = useState("");
  const [mediaName, setMediaName] = useState("");
  const [extension, setextension] = useState("");
  const [showModalP, setShowModalP] = useState(false);

  const [responseData, setResponseData] = useState([]);
  // getCatalogById;

  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (token !== "Bearer null") {
      learningPlanListAPI();
    }
  }, []);
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      courseTitle: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      description: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
    });
    setGlobalFilterValue("");
  };

  const handleClose = () => {
    setShowModalP(false);
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const learningPlanListAPI = async () => {
    try {
      const res = await getApiCall("getStudentAssignmentList");
      setResponseData(res);
      setLoader(true);
    } catch (err) {}
  };


  const addAssignment = async (payload) => {
    try {
      const response = await postApiCall("addInProgressCourse", payload);
      catalogListAPI();
      // toast.current.show({
      //   severity: "success",
      //   summary: "Successful",
      //   detail: "Course Launched Successfully",
      //   life: 3000,
      // });
    } catch (error) {
      var errMsg = error?.response?.data?.error;
      console.log({ errMsg });
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail:
          errMsg === "Enrollment is already exist."
            ? "Course already Launched"
            : "Error Launching Course",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    initFilters();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(9);
  const [cardSearch, setCardSearch] = useState("");
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const filteredPersons = responseData?.filter((item) => {
    return item.assignmentName
      .toLowerCase()
      ?.includes(cardSearch.toLowerCase());
  });
  const currentPosts = filteredPersons?.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  const paginate = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const [nineNumbers] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const items = Array.from({ length: 10 }, (v, i) => i);
  const bodyTemplate = () => (
    <>
      <div className={`card tableThemeColor${themes} InputThemeColor${themes}`}>
        <DataTable value={items} showGridlines className="p-datatable-striped">
          <Column
            field="courseTitle"
            header="Course Title"
            style={{ width: "25%" }}
            body={<Skeleton />}
          ></Column>
          <Column
            field="description"
            header="Description"
            style={{ width: "25%" }}
            body={<Skeleton />}
          ></Column>

          <Column
            field="Action"
            header="Action"
            style={{ width: "25%" }}
            body={<Skeleton />}
          ></Column>
        </DataTable>
      </div>
    </>
  );

  const Name = (responseData) => (
    <>
      {responseData.assignedTraining.map((item) => (
        <div>{item.trainingName}</div>
      ))}
    </>
  );

  const TrainingType = (responseData) => (
    <>
      {responseData.assignedTraining.map((item) => (
        <div>{item.trainingType === "1" ? "Assessment" : "Elearning"}</div>
      ))}
    </>
  );

  // const [viewType, setViewType] = useState("card");

  const globalCardSearch = (e) => {
    setCardSearch(e.target.value);
  };

  return (
    <React.StrictMode>
      <div className="">
      <CModal
          visible={showModalP}
          onClose={handleClose}
          alignment="center"
          size="lg"
        >
          <CModalHeader>
            <CModalTitle>Play</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div id="divToPrint" className="ql-editor">
              <Player
                extension={extension}
                mediaUrl={mediaUrl}
                mediaName={mediaName}
              />
            </div>
          </CModalBody>
          <CModalFooter>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleClose}
            >
              Close
            </button>
          </CModalFooter>
        </CModal>
        <div className="container">
          <div className="container-fluid">
            <Toast ref={toast} />
            <CRow>
              <CCol xs={12} style={{ padding: "1px" }}>
                <CCard className="mb-7 card-ric">
                  <div>
                    <CCardHeader className="p-0">
                      <CNav variant="tabs">
                        <CNavItem>
                          <Link
                            to={"/student/requirements?All"}
                            style={{ textDecoration: "none" }}
                          >
                            <CNavLink style={{ cursor: "pointer" }}>
                              <strong>Requirements</strong>
                            </CNavLink>
                          </Link>
                        </CNavItem>

                        <CNavItem>
                          <Link
                            to={"/student/studentlearningplan"}
                            style={{ textDecoration: "none" }}
                          >
                            <CNavLink style={{ cursor: "pointer" }}>
                              <strong>Learning Plan</strong>
                            </CNavLink>
                          </Link>
                        </CNavItem>
                        <CNavItem>
                          <Link
                            to={"/student/studentassignments"}
                            style={{ textDecoration: "none" }}
                          >
                            <CNavLink active style={{ cursor: "pointer" }}>
                              <strong>Assignments</strong>
                            </CNavLink>
                          </Link>
                        </CNavItem>
                      </CNav>
                      <CTabContent className="rounded-bottom">
                        <CTabPane className="p-3 preview" visible>
                          <div className="card-header border-0 d-flex justify-content-between">
                            <div className="d-flex row align-items-center">
                              <div className="col-md-12 col-xxl-12">
                                <span className="p-input-icon-left">
                                  <i className="pi pi-search" />
                                  <div style={{ display: "flex", gap: "1rem" }}>
                                    <InputText
                                      value={globalFilterValue}
                                      onChange={onGlobalFilterChange}
                                      style={{ height: "40px" }}
                                      className="p-input-sm"
                                      placeholder="       Search..."
                                    />
                                  </div>
                                </span>
                              </div>
                            </div>
                          </div>
                        </CTabPane>
                      </CTabContent>
                    </CCardHeader>
                  </div>

                  {!loader ? (
                    bodyTemplate()
                  ) : (
                    <>
                      <DataTable
                        value={responseData}
                        className="p-datatable-gridlines p-datatable-sm"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        globalFilter={globalFilterValue}
                        emptyMessage="No records found"
                        filters={filters}
                      >
                        <Column
                          // field="trainingName"
                          header="Training Name"
                          sortable
                          filter
                          body={Name}
                        />

                        <Column
                          field="trainingType"
                          header="Training Type"
                          sortable
                          filter
                          body={TrainingType}
                        />

                        <Column
                          field="assignmentDueDate"
                          header="Assign Date"
                          sortable
                          filter
                        />

                        <Column
                          field="dueDate"
                          header="Due Date"
                          sortable
                          filter
                        />

                        <Column
                          field="completionDate"
                          header="Completion Date"
                          sortable
                          filter
                        />

                        <Column
                          field="assignmentId"
                          header="Action"
                          body={(rowData) => (
                            <div className="button-container ">
                              <Button
                                style={{ minWidth: "20px" }}
                                text
                                raised
                                size="sm"
                                severity="success"
                                className="btn btn-bg-secondary btn-active-color-primary mb-2"
                                label="Launch"
                                onClick={() => {
                                  if (
                                    rowData.trainingType === "SCORM"
                                  ) {
                                    window.open(
                                      `/student/player?scormUrl=${rowData?.trainingMedia?.mediaUrl}?scormId=${rowData.trainingMedias?.scormId}`,
                                      "_blank",
                                      "width=1080,height=700"
                                    );
                                  } else if (
                                    rowData.trainingType === "Video"
                                  ) {
                                    window.open(
                                      `/student/video-player?scormUrl=${rowData?.trainingMedia?.mediaUrl}`,
                                      "_blank",
                                      "width=1080,height=700"
                                    );
                                  } else {
                                    setmediaUrl(
                                      rowData?.trainingMedia?.mediaUrl
                                    );
                                    setMediaName(
                                      rowData?.trainingMedia?.mediaName
                                    );
                                    setextension(
                                      rowData?.trainingMedia?.mediaType
                                    );
                                    setShowModalP(true);
                                  }

                                  // oldcode
                                  addAssignment({
                                    trainingCatalogId:
                                      rowData.courseLibraryId,
                                  });
                                }}
                              />
                              <Button
                                style={{ minWidth: "20px" }}
                                text
                                raised
                                size="sm"
                                severity="info"
                                className="btn btn-bg-secondary btn-active-color-primary mb-2"
                                label="View"
                                onClick={() => {
                                  addAssignment(rowData?.courseLibraryId);
                                }}
                              />
                            </div>
                          )}
                        />
                      </DataTable>
                    </>
                  )}
                </CCard>
              </CCol>
            </CRow>
          </div>
        </div>
      </div>
    </React.StrictMode>
  );
};
export default StudentAssignment;
