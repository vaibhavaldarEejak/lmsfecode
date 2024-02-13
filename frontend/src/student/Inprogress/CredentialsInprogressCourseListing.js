import React, { useEffect, useState, useRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CTable,
  CTableRow,
  CFormLabel,
  CTableDataCell,
} from "@coreui/react";
import { ThreeDotsVertical, List, Grid3x3GapFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import Player from "../Catalog/Player";
import CourseImageSample from "../../assets/images/sampleCourseImage.png";
import { Skeleton } from "primereact/skeleton";
import "../../css/hideCloseBtn.css";
import { Dialog } from "primereact/dialog";
import { Rating } from "primereact/rating";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ReactPaginate from "react-paginate";
import "../../css/pagination.css";
import "../../css/table.css";
const inprogress = () => {
  const [rating, setRating] = useState(null);
  const [comments, setComments] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseImg, setCourseImg] = useState();
  const [responseData, setResponseData] = useState(null);
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const toast = useRef(null);
  const navigate = useNavigate();
  const [courseId, setCourseId] = useState(null);

  const getEnrollmentListing = async () => {
    try {
      const res = await getApiCall("getEnrollmentList");
      setResponseData(res?.filter((item) => item.progress === 2));
    } catch (err) {}
  };
  const addSuspend = async (form) => {
    try {
      const response = await postApiCall(
        "scormTracking",
        form,
        "multipart/form-data"
      );
      localStorage.removeItem("suspend");
      localStorage.removeItem("scormId");
      localStorage.removeItem("completionStatus");
    } catch (error) {}
  };

  const [suspendData, setSuspendData] = useState("");
  const [ScormId, setScormId] = useState("");
  const [completionStatus, setCompletionStatus] = useState("");

  useEffect(() => {
    let formData = new FormData();

    if (ScormId && suspendData) {
      formData.append("scormId", ScormId);
      formData.append("name", "cmi.suspend_data");
      formData.append("suspendData", suspendData);
      formData.append("completionStatus", completionStatus);
      addSuspend(formData);
    }
  }, [suspendData, ScormId]);

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    initFilters();
    setScormId(localStorage.getItem("scormId"));
    setSuspendData(
      localStorage.getItem("suspend") ? localStorage.getItem("suspend") : ""
    );
    setCompletionStatus(
      localStorage.getItem("completionStatus")
        ? localStorage.getItem("completionStatus")
        : "not attempted"
    );
    if (token !== "Bearer null") {
      getEnrollmentListing();
      setTimeout(() => {
        setLoader(true);
      }, [2000]);
    }
  }, []);

  const cardStyle = {
    boxShadow:
      "0 24px 24px -24px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.1)",
    width: "55vw",
  };

  const setCompleteCourseApi = async () => {
    const payLoad = {
      courseId: courseId,
      rating: rating,
      comment: comments,
      progress: 1,
    };

    try {
      const response = await postApiCall("studentCompletedCourse", payLoad);
      if (response) {
        getEnrollmentListing();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Course Completed Successfully",
          life: 3000,
        });
      }
    } catch (e) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Completing Course",
        life: 3000,
      });
    }
  };

  const [hideCompleteDialog, setHideCompleteDialog] = useState(false);
  const [rateCourseVisible, setRateCourseVisible] = useState(false);

  const completeDialogFooter = () => (
    <>
      <Button
        label="Yes"
        icon="pi pi-check"
        onClick={() => {
          showRateCourseDialog();
        }}
      />
      <Button
        label="No"
        icon="pi pi-times"
        onClick={() => {
          setHideCompleteDialog(false);
        }}
        className="p-button-secondary"
      />
    </>
  );

  const rateCourseDialogFooter = () => (
    <>
      {rating && rating > 0 ? (
        <Button
          label="Submit"
          icon="pi pi-check"
          onClick={() => {
            setRateCourseVisible(false);
            setCompleteCourseApi();
          }}
        />
      ) : (
        <Button
          label="Submit"
          disabled
          icon="pi pi-check"
          onClick={() => {
            setRateCourseVisible(false);
          }}
        />
      )}
    </>
  );

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

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);

    //search the card layout
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(9);

  // ...
  const [cardSearch, setCardSearch] = useState("");
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const filteredPersons = responseData?.filter((item) => {
    return item.courseTitle.toLowerCase().includes(cardSearch.toLowerCase());
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
      {viewType === "card" && (
        <div className="row row-cols-1 row-cols-md-3 g-4 ">
          {/* make it square */}
          {nineNumbers.map((item, index) => {
            return (
              <div className="col" key={index}>
                <div className="card  mb-3 me-4 ms-4 mt-3 ">
                  <div className="card-body">
                    {/* 3 dots on right corner to show view and enroll button */}
                    <div className="dropdown float-end">
                      <button
                        className="btn btn-light"
                        type="button"
                        id="dropdownMenuButton1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <ThreeDotsVertical />
                      </button>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton1"
                      >
                        <li>
                          <a className="dropdown-item" href="#">
                            View
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Completed
                          </a>
                        </li>
                      </ul>
                    </div>

                    <div class="card-body text-center">
                      <Skeleton shape="rectangle" />
                      <h5 className="mt-2">
                        <Skeleton />
                      </h5>
                      {/* <p
                    className="text-muted mb-1"
                    dangerouslySetInnerHTML={{ __html: item?.description }}
                  ></p> */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewType === "list" && (
        <div className={`card `}>
          <DataTable
            value={items}
            showGridlines
            className="p-datatable-striped"
          >
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
      )}
    </>
  );

  const cardLayout = () => (
    //3 cards per row in catalog total 3 rows with pagination
    <>
      <div className="row row-cols-1 row-cols-md-3 g-4 ">
        {/* make it square */}

        {/* make card square with profile picture, course title in bold below profile picture and description below course title in semi bold*/}
        {/*3 cards next to each other in catalog total 3 rows with pagination, map data and make 3 cards per row total 3 rows*/}
        {currentPosts?.map((item, index) => {
          return (
            <div className="col" key={index}>
              <div className="card h-100 mb-3 me-4 ms-4 mt-3 ">
                <div className="card-body">
                  {/* 3 dots on right corner to show view and enroll button */}
                  <div className="dropdown float-end">
                    <button
                      className="btn btn-light"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <ThreeDotsVertical />
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => {
                            navigate(`/student/view-detail?inprogress`);
                          }}
                        >
                          View
                        </a>
                      </li>

                      <>
                        {item.progress === 2 && (
                          <li>
                            <a
                              className="dropdown-item"
                              href="#"
                              onClick={() => {
                                setCourseId(item.courseLibraryId);
                                setCourseImg(item.imageUrl);
                                setCourseTitle(item.courseTitle);

                                if (item.contentType === "SCORM") {
                                  const newWindow = window.open(
                                    `/student/player?${item?.trainingMedias[0]?.mediaName}?${item.trainingMedias[0].scormId}?${item.trainingMedias[0].version}`,
                                    "_blank",
                                    "width=1080,height=700"
                                  );
                                  navigate("/student/blank-page");
                                  newWindow.opener = window;
                                } else if (item.contentType === "Video") {
                                  const newWindow = window.open(
                                    `/student/video-player?videoUrl=${item?.trainingMedias[0]?.mediaUrl}?${item.courseLibraryId}`,
                                    "_blank",
                                    "width=1080,height=700"
                                  );
                                  navigate("/student/blank-page");
                                  newWindow.opener = window;
                                } else {
                                  // getCatalogById(data.courseLibraryId);
                                  setmediaUrl(
                                    item?.trainingMedias[0]?.mediaUrl
                                  );
                                  setextension(
                                    item?.trainingMedias[0]?.mediaType
                                  );

                                  setShowModalP(true);
                                }
                              }}
                            >
                              In Progress
                            </a>
                          </li>
                        )}
                      </>
                    </ul>
                  </div>

                  <div class="card-body text-center">
                    <img
                      src={item?.imageUrl ? item?.imageUrl : CourseImageSample}
                      alt={item?.courseTitle}
                      className="img-fluid w-50 mb-3"
                    />
                    <h5>
                      <strong>{item?.courseTitle}</strong>
                    </h5>
                    {/* <p
                    className="text-muted mb-1"
                    dangerouslySetInnerHTML={{ __html: item?.description }}
                  ></p> */}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {responseData?.length > 0 && (
        <div classname="pagination">
          <ReactPaginate
            breakLabel="..."
            onPageChange={paginate}
            pageRangeDisplayed={5}
            pageCount={Math.ceil(responseData?.length / postsPerPage)}
            previousLabel={"Prev"}
            nextLabel={"Next"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            containerClassName={"pagination"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </div>
      )}
    </>
  );

  const [viewType, setViewType] = useState("card");

  const globalCardSearch = (e) => {
    setCardSearch(e.target.value);
  };

  const handleClose = () => {
    setShowModalP(false);
  };

  const showCompleteDialog = () => {
    setShowModalP(false);
    setHideCompleteDialog(true);
  };

  const showRateCourseDialog = () => {
    setHideCompleteDialog(false);
    setRateCourseVisible(true);
  };

  const [showModalP, setShowModalP] = useState(false);
  const [extension, setextension] = useState("");

  const [mediaUrl, setmediaUrl] = useState("");

  return (
    <div className="">
      <Toast ref={toast} />
      {/* Complete Course Dialog Start*/}
      <Dialog
        visible={hideCompleteDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={completeDialogFooter}
        onHide={() => setHideCompleteDialog(false)}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle me-3 mt-2"
            style={{ fontSize: "1.5rem" }}
          />
          <span>Mark Your Course as Completed?</span>
        </div>
      </Dialog>
      {/* Complete Course Dialog End*/}

      {/* Rate Course Dialog Start*/}
      <Dialog
        visible={rateCourseVisible}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Rate Course"
        modal
        footer={rateCourseDialogFooter}
      >
        <div className="confirmation-content">
          <div className="p-field p-col-12 p-md-12">
            <CRow className="mb-3">
              <CCol md={12}>
                <CRow className="mb-3">
                  <div className="col-sm-12 py-2">
                    {courseImg && (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <>
                          <img
                            style={{
                              objectFit: "contain",
                              width: "100px",
                              height: "100px",
                              marginTop: "10px",
                            }}
                            src={courseImg}
                            alt="Course Image"
                          />

                          <span
                            style={{
                              fontWeight: "bold",
                              fontSize: "24px",
                              marginTop: "10px",
                            }}
                            className="py-4 px-2"
                          >
                            {courseTitle}
                          </span>
                        </>
                      </div>
                    )}
                  </div>
                </CRow>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={12}>
                <CRow className="mb-3">
                  <CFormLabel
                    htmlFor=""
                    className="col-sm-4 col-form-label fw-bolder fs-7 required"
                  >
                    Rate This Course:
                  </CFormLabel>
                  <div className="col-sm-7 py-2">
                    <Rating
                      id="rating"
                      value={rating}
                      onChange={(e) => setRating(e.value)}
                      cancel={false}
                      stars={5}
                    />
                  </div>
                </CRow>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={12}>
                <CRow className="mb-3">
                  <CFormLabel
                    htmlFor=""
                    className="col-sm-4 col-form-label fw-bolder fs-7"
                  >
                    Comment (Optional):
                  </CFormLabel>
                  <div className="col-sm-7 py-2">
                    <textarea
                      className="form-control"
                      id="exampleFormControlTextarea1"
                      rows="4"
                      onChange={(e) => setComments(e.target.value)}
                    ></textarea>
                  </div>
                </CRow>
              </CCol>
            </CRow>
          </div>
        </div>
      </Dialog>

      <CRow>
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
              {/* <iframe
                src={mediaUrl && mediaUrl}
                style={{ height: "900px", width: "750px" }}
              /> */}

              <Player extension={extension} mediaUrl={mediaUrl} />
            </div>
          </CModalBody>
          <CModalFooter>
            {extension === "pdf" ||
            extension === "docx" ||
            extension === "doc" ||
            extension === "xlsx" ||
            extension === "xls" ||
            extension === "ppt" ||
            extension === "pptx" ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={showCompleteDialog}
              >
                Close
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleClose}
              >
                Close
              </button>
            )}
          </CModalFooter>
        </CModal>
        <CCol xs={12}>
          <CCard className="mb-7">
            <div>
              <CCardHeader className="p-0">
                <CNav variant="tabs">
                  <CNavItem>
                    <Link
                      to={"/student/inprogress"}
                      style={{ textDecoration: "none" }}
                    >
                      <CNavLink style={{ cursor: "pointer" }}>All</CNavLink>
                    </Link>
                  </CNavItem>
                  <CNavItem>
                    <Link
                      to={"/student/elearninginprogress"}
                      style={{ textDecoration: "none" }}
                    >
                      <CNavLink style={{ cursor: "pointer" }}>
                        Elearning
                      </CNavLink>
                    </Link>
                  </CNavItem>
                  <CNavItem>
                    <Link
                      to={"/student/classroominprogress"}
                      style={{ textDecoration: "none" }}
                    >
                      <CNavLink style={{ cursor: "pointer" }}>
                        Classroom
                      </CNavLink>
                    </Link>
                  </CNavItem>
                  <CNavItem>
                    <Link
                      to={"/student/assessmentinprogress"}
                      style={{ textDecoration: "none" }}
                    >
                      <CNavLink style={{ cursor: "pointer" }}>
                        Assessment
                      </CNavLink>
                    </Link>
                  </CNavItem>
                  <CNavItem>
                    <Link
                      to={"/student/credentialsinprogress"}
                      style={{ textDecoration: "none" }}
                    >
                      <CNavLink active style={{ cursor: "pointer" }}>
                        <strong>Credentials</strong>
                      </CNavLink>
                    </Link>
                  </CNavItem>
                  <CNavItem>
                    <Link
                      to={"/student/learningplaninprogress"}
                      style={{ textDecoration: "none" }}
                    >
                      <CNavLink style={{ cursor: "pointer" }}>
                        Learning Plan
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
                            {viewType === "list" && (
                              <InputText
                                value={globalFilterValue}
                                onChange={onGlobalFilterChange}
                                style={{ height: "40px" }}
                                className="p-input-sm"
                                placeholder="Search..."
                              />
                            )}
                            {viewType === "card" && (
                              <InputText
                                value={cardSearch}
                                onChange={globalCardSearch}
                                style={{ height: "40px" }}
                                className="p-input-sm"
                                placeholder="Search..."
                              />
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <button
                          className="btn btn-light"
                          type="button"
                          onClick={() => {
                            setViewType("card");
                          }}
                        >
                          <Grid3x3GapFill />
                        </button>
                        <button
                          className="btn btn-light"
                          type="button"
                          onClick={() => {
                            setViewType("list");
                          }}
                        >
                          <List />
                        </button>
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
                {viewType === "card" ? (
                  // bodyTemplate()
                  cardLayout()
                ) : (
                  // cardLayout()
                  <CCard>
                    <CCardBody>
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
                          field="courseTitle"
                          header="Course Title"
                          sortable
                          filter
                        />
                        <Column
                          field="description"
                          header="Description"
                          sortable
                          filter
                          body={(rowData) => (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: rowData.description,
                              }}
                            ></div>
                          )}
                        />
                        <Column
                          field="courseLibraryId"
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
                                label="View"
                                onClick={() => {
                                  navigate(`/student/view-detail?inprogress`);
                                }}
                              />

                              {rowData.progress === 2 && (
                                <Button
                                  style={{ minWidth: "80px" }}
                                  text
                                  raised
                                  size="sm"
                                  severity="info"
                                  className="btn btn-bg-secondary btn-active-color-primary mb-2"
                                  label="In Progress"
                                  onClick={() => {
                                    setCourseId(rowData.courseLibraryId);
                                    setCourseImg(rowData.imageUrl);
                                    setCourseTitle(rowData.courseTitle);

                                    if (rowData.contentType === "SCORM") {
                                      const newWindow = window.open(
                                        `/student/player?${rowData?.trainingMedias[0]?.mediaName}?${rowData.trainingMedias[0].scormId}?${rowData.trainingMedias[0].version}`,
                                        "_blank",
                                        "width=1080,height=700"
                                      );
                                      navigate("/student/blank-page");
                                      newWindow.opener = window;
                                    } else if (
                                      rowData.contentType === "Video"
                                    ) {
                                      const newWindow = window.open(
                                        `/student/video-player?videoUrl=${rowData?.trainingMedias[0]?.mediaUrl}?${rowData.courseLibraryId}`,
                                        "_blank",
                                        "width=1080,height=700"
                                      );
                                      navigate("/student/blank-page");
                                      newWindow.opener = window;
                                    } else {
                                      // getCatalogById(data.courseLibraryId);
                                      setmediaUrl(
                                        rowData?.trainingMedias[0]?.mediaUrl
                                      );
                                      setextension(
                                        rowData?.trainingMedias[0]?.mediaType
                                      );

                                      setShowModalP(true);
                                    }
                                  }}
                                />
                              )}
                            </div>
                          )}
                        />
                      </DataTable>
                    </CCardBody>
                  </CCard>
                )}
              </>
            )}
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};
export default inprogress;
