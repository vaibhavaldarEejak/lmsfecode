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
} from "@coreui/react";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import Player from "../Catalog/Player";
import CourseImageSample from "../../assets/images/sampleCourseImage.png";
const API_URL = process.env.REACT_APP_API_URL;
import { Skeleton } from "primereact/skeleton";
import "../../css/hideCloseBtn.css";
import { Dialog } from "primereact/dialog";
import { Rating } from "primereact/rating";
import { Toast } from "primereact/toast";
import { useNavigate } from "react-router-dom";
import getApiCall from "src/server/getApiCall";
import "../../css/table.css";
import postApiCall from "src/server/postApiCall";
import { Grid3x3GapFill, List, ThreeDotsVertical } from "react-bootstrap-icons";
import ReactPaginate from "react-paginate";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
const enrollments = () => {
  const [rating, setRating] = useState(null);
  const [comments, setComments] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseImg, setCourseImg] = useState();
  const [responseData, setResponseData] = useState();
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const toast = useRef(null);
  const navigate = useNavigate();
  const [courseId, setCourseId] = useState(null);

  const getEnrollmentListing = async () => {
    try {
      const res = await getApiCall("getEnrollmentList");
      //where progress 0 and 1
      setResponseData(res);
      //  setLoader(true);
    } catch (err) {
      // Handle errors
    }
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
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error Completing Course",
          life: 3000,
        });
      }
    } catch (error) {}
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
              field="contentType"
              header="Content Type"
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
  const globalCardSearch = (e) => {
    setCardSearch(e.target.value);
  };
  const globalCardCourseTypeSearch = (e) => {
    setCardCourseTypeSearch(e.target.value);
  };
  const globalCardCategorySearch = (e) => {
    setCardCategorySearch(e.target.value);
  };
  const [categoryListing, setcategoryListing] = useState([]);
  const paginate = ({ selected }) => {
    setCurrentPage(selected + 1);
  };
  const categoryList = async () => {
    try {
      const res = await getApiCall("getCategoryOptionList");
      setcategoryListing(res);
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
    // categoryList();
    // getEnrollmentListing();
  }, []);

  const [viewType, setViewType] = useState("card");
  const [cardSearch, setCardSearch] = useState("");
  const [cardCourseTypeSearch, setCardCourseTypeSearch] = useState("");
  const [cardCategorySearch, setCardCategorySearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(9);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  let currentPosts;
  if (cardSearch != "") {
    const filteredPersons = responseData?.filter((item) => {
      return item.courseTitle.toLowerCase().includes(cardSearch.toLowerCase());
    });
    currentPosts = filteredPersons?.slice(indexOfFirstPost, indexOfLastPost);
  } else if (cardCourseTypeSearch != "") {
    // courseType search
    const filteredPersons = responseData?.filter((item) => {
      return item.contentType
        .toLowerCase()
        .includes(cardCourseTypeSearch.toLowerCase());
    });
    currentPosts = filteredPersons?.slice(indexOfFirstPost, indexOfLastPost);
  }
  // else if (cardCategorySearch != "") {
  //   const filteredPersons = responseData?.filter((item) => {
  //     return item.categoryName?.some((category) => {
  //       return category
  //         .toLowerCase()
  //         .includes(cardCategorySearch.toLowerCase());
  //     });
  //   });

  //   currentPosts = filteredPersons?.slice(indexOfFirstPost, indexOfLastPost);
  // }
  else {
    const filteredPersons = responseData?.filter((item) => {
      return item.courseTitle.toLowerCase().includes(cardSearch.toLowerCase());
    });
    currentPosts = filteredPersons?.slice(indexOfFirstPost, indexOfLastPost);
  }

  const cardLayout = () => (
    //3 cards per row in catalog total 3 rows with pagination
    <>
      <div
        className=""
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1rem",
          margin: " 1rem",
          position: "relative",
        }}
      >
        {/* make it square */}

        {/* make card square with profile picture, course title in bold below profile picture and description below course title in semi bold*/}
        {/*3 cards next to each other in catalog total 3 rows with pagination, map data and make 3 cards per row total 3 rows*/}
        {currentPosts?.map((item, index) => {
          return (
            <div
              className=""
              style={{ border: "1px solid #939393", borderRadius: "0.5rem" }}
            >
              {/* 3 dots on right corner to show view and enroll button */}
              <div
                key={index}
                className="dropdown float-end"
                // style={{ position: "absolute", right: "0.03rem" }}
              >
                <button
                  style={{ position: "absolute", right: "0.03rem" }}
                  className="btn btn-light"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={() => {
                    localStorage.removeItem("courseLibraryId1");
                  }}
                >
                  <ThreeDotsVertical />
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li>
                    <a
                      style={{ cursor: "pointer" }}
                      className="dropdown-item"
                      href="#"
                      onClick={() => {
                        localStorage.setItem(
                          "courseLibraryId1",
                          item.courseLibraryId
                        );
                        navigate(`/student/view-detail?enrollments`);
                      }}
                    >
                      View
                    </a>
                  </li>
                  {item.isEnrollment === 1 ? (
                    <>
                      {item.progress === 1 && (
                        <li>
                          <a className="dropdown-item" href="#">
                            Completed
                          </a>
                        </li>
                      )}

                      {item.progress === 2 && (
                        <li>
                          <a className="dropdown-item" href="#">
                            In Progress
                          </a>
                        </li>
                      )}

                      {item.progress === 0 && (
                        <li>
                          <a className="dropdown-item" href="#">
                            Enrolled
                          </a>
                        </li>
                      )}

                      {item.progress === null && (
                        <li>
                          <a className="dropdown-item" href="#">
                            Enrolled
                          </a>
                        </li>
                      )}
                    </>
                  ) : (
                    <li>
                      {/* <a
                        className="dropdown-item"
                        userId
                        href="#"
                        onClick={() => {
                          // addAssignment({
                          //   trainingCatalogId: item.courseLibraryId,
                          // });
                          navigate(`/Player?${item?.courseLibraryId}`);
                        }}
                      >
                        Launch
                      </a> */}
                    </li>
                  )}
                </ul>
              </div>

              <div class="">
                <div
                  onClick={() => {
                    localStorage.removeItem("courseLibraryId");
                    localStorage.setItem(
                      "courseLibraryId1",
                      item.courseLibraryId
                    );
                    navigate(`/student/view-detail?enrollments`);
                  }}
                >
                  <img
                    style={{
                      width: "100%",
                      height: "12rem",
                      borderRadius: "0.5rem",
                      objectFit: "cover",
                      borderBottomRightRadius: 0,
                      borderBottomLeftRadius: 0,
                      cursor: "pointer",
                    }}
                    src={item.imageUrl ? item.imageUrl : CourseImageSample}
                    alt={item.courseTitle}
                    onClick={() => {
                      localStorage.setItem(
                        "courseLibraryId1",
                        item.courseLibraryId
                      );
                      navigate(`/student/view-detail?enrollments`);
                    }}
                  />
                </div>
                <div style={{ padding: "0.3rem 1rem 1rem" }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#565959ad",
                      textDecoration: "underline",
                    }}
                  >
                    {item?.contentType}
                  </div>
                  <div
                    onClick={() => {
                      localStorage.removeItem("courseLibraryId");
                      localStorage.setItem(
                        "courseLibraryId1",
                        item.courseLibraryId
                      );
                      navigate(`/student/view-detail?enrollments`);
                    }}
                    style={{
                      fontSize: "18px",
                      color: "#000",
                      cursor: "pointer",
                    }}
                  >
                    {item?.courseTitle}
                  </div>
                  <div style={{ marginLeft: "-0.1rem" }}>
                    <Rating
                      className="mx-auto"
                      id="rating"
                      value={3.5}
                      cancel={false}
                      stars={5}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#565959",
                    }}
                  >
                    200+ already enrolled
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {responseData?.length > 0 && (
        <div
          classname="pagination"
          style={{ justifyContent: "center", display: "flex" }}
        >
          <ReactPaginate
            breakLabel="..."
            onPageChange={paginate}
            pageRangeDisplayed={5}
            pageCount={Math.ceil(responseData.length / postsPerPage)}
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
  const [showModalP, setShowModalP] = useState(false);
  const [extension, setextension] = useState("");

  const [mediaUrl, setmediaUrl] = useState("");

  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [courseTypeFilter, setCourseTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
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
      categoryName: { value: null, matchMode: "contains" },
    });
    setGlobalFilterValue("");
    setCourseTypeFilter("");
    setCategoryFilter("");
  };
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const courseTypeFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setCourseTypeFilter(value);
  };
  const categoryFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setCategoryFilter(value);
  };
  return (
    <React.StrictMode>
      <div className="">
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
                          <CNavLink active style={{ cursor: "pointer" }}>
                            <strong>Enrollments</strong>
                          </CNavLink>
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
                                    <div
                                      style={{ display: "flex", gap: "1rem" }}
                                    >
                                      <InputText
                                        value={globalFilterValue}
                                        onChange={onGlobalFilterChange}
                                        style={{ height: "40px" }}
                                        className="p-input-sm"
                                        placeholder="       Search..."
                                      />
                                      {/* <CFormSelect
                                        required
                                        aria-label="select example"
                                        value={courseTypeFilter}
                                        isClearable
                                        style={{ width: "14rem" }}
                                        onChange={courseTypeFilterChange}
                                      >
                                        <option selected value={""}>
                                          All Course Type
                                        </option>
                                        <option value="eLearning">
                                          eLearning
                                        </option>
                                        <option value="Assessment">
                                          Assessment
                                        </option>
                                        <option value="Classroom">
                                          Classroom
                                        </option>
                                      </CFormSelect>
                                      <CFormSelect
                                        required
                                        aria-label="select example"
                                        value={categoryFilter}
                                        isClearable
                                        onChange={categoryFilterChange}
                                      >
                                        <option value={""}>
                                          Select Category
                                        </option>
                                        {categoryListing.map((e) => (
                                          <option
                                            key={e.categoryId}
                                            value={e.categoryName}
                                          >
                                            {e.categoryName}
                                          </option>
                                        ))}
                                      </CFormSelect> */}
                                    </div>
                                  )}
                                  {viewType === "card" && (
                                    <div
                                      style={{ display: "flex", gap: "1rem" }}
                                    >
                                      <InputText
                                        value={cardSearch}
                                        onChange={globalCardSearch}
                                        style={{ height: "40px" }}
                                        className="p-input-sm"
                                        placeholder="         Search..."
                                      />
                                      {/* <CFormSelect
                                        required
                                        aria-label="select example"
                                        style={{ width: "14rem" }}
                                        value={cardCourseTypeSearch}
                                        onChange={globalCardCourseTypeSearch}
                                      >
                                        <option selected value={""}>
                                          All Course Type
                                        </option>
                                        <option value="eLearning">
                                          eLearning
                                        </option>
                                        <option value="Assessment">
                                          Assessment
                                        </option>
                                        <option value="Classroom">
                                          Classroom
                                        </option>
                                      </CFormSelect>
                                      <CFormSelect
                                        required
                                        aria-label="select example"
                                        value={cardCategorySearch}
                                        isClearable
                                        onChange={globalCardCategorySearch}
                                      >
                                        <option value={""}>
                                          Select Category
                                        </option>
                                        {categoryListing.map((e) => (
                                          <option
                                            key={e.categoryId}
                                            value={e.categoryName}
                                          >
                                            {e.categoryName}
                                          </option>
                                        ))}
                                      </CFormSelect> */}
                                    </div>
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                              {/* list view and card view  button with icon*/}
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
                              // globalFilter={globalFilterValue}
                              emptyMessage="No records found"
                              filters={filters}
                            >
                              <Column
                                field="courseTitle"
                                header="Course Title"
                                sortable
                                filter
                                style={{ width: "20%" }}
                              />
                              <Column
                                field="description"
                                header="Description"
                                sortable
                                body={(rowData) => (
                                  <div className="col-sm-7 py-2">
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: rowData.description,
                                      }}
                                    />
                                  </div>
                                )}
                                filter
                              />
                              <Column
                                field="Rating"
                                header="Rating"
                                sortable
                                body={(rowData) =>
                                  rowData ? (
                                    <div>
                                      <Rating
                                        className="mx-auto"
                                        id="rating"
                                        value={3.5}
                                        cancel={false}
                                        stars={5}
                                      />
                                    </div>
                                  ) : (
                                    <div>-</div>
                                  )
                                }
                                filter
                              />
                              <Column
                                field="enrolled"
                                header="Enrolled"
                                sortable
                                body={(rowData) =>
                                  rowData ? (
                                    <div> 200+ already enrolled</div>
                                  ) : (
                                    <div>-</div>
                                  )
                                }
                                filter
                              />
                              {/* <Column
                                body={(rowData) =>
                                  rowData.categoryName != 0 ? (
                                    <>
                                      {rowData.categoryName.map((value, i) => (
                                        <Tag
                                          value={value}
                                          style={{
                                            marginRight: "0.5rem",
                                            marginBottom: "0.2rem",
                                            paddingBottom: "0.3rem",
                                            background: "#eceeef",
                                            color: "#000",
                                          }}
                                        ></Tag>
                                      ))}
                                    </>
                                  ) : (
                                    <div>-</div>
                                  )
                                }
                                field="categoryName"
                                header="Category"
                                showFilterMenu={false}
                              /> */}
                              <Column
                                field="courseLibraryId"
                                header="Action"
                                style={{ width: "25%" }}
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
                                        localStorage.setItem(
                                          "courseLibraryId1",
                                          rowData.courseLibraryId
                                        );

                                        navigate(
                                          `/student/view-detail?enrollments`
                                        );
                                      }}
                                    />

                                    {rowData.isEnrollment === 1 ? (
                                      <>
                                        {rowData.progress === 1 && (
                                          <Button
                                            style={{ minWidth: "20px" }}
                                            text
                                            raised
                                            size="sm"
                                            severity="info"
                                            className="btn btn-bg-secondary btn-active-color-primary mb-2"
                                            label="Completed"
                                            disabled
                                          />
                                        )}

                                        {rowData.progress === 2 && (
                                          <Button
                                            style={{ minWidth: "20px" }}
                                            text
                                            raised
                                            size="sm"
                                            severity="info"
                                            className="btn btn-bg-secondary btn-active-color-primary mb-2"
                                            label="In Progress"
                                            disabled
                                          />
                                        )}

                                        {rowData.progress === 0 && (
                                          <Button
                                            style={{ minWidth: "20px" }}
                                            text
                                            raised
                                            size="sm"
                                            severity="info"
                                            className="btn btn-bg-secondary btn-active-color-primary mb-2"
                                            label="Enrolled"
                                            disabled
                                          />
                                        )}

                                        {rowData.progress === null && (
                                          <Button
                                            style={{ minWidth: "20px" }}
                                            text
                                            raised
                                            size="sm"
                                            severity="info"
                                            className="btn btn-bg-secondary btn-active-color-primary mb-2"
                                            label="Enrolled"
                                            disabled
                                          />
                                        )}
                                      </>
                                    ) : (
                                      // <Button
                                      //   style={{ minWidth: "20px" }}
                                      //   text
                                      //   raised
                                      //   size="sm"
                                      //   severity="info"
                                      //   className="btn btn-bg-secondary btn-active-color-primary mb-2"
                                      //   label="Launch"
                                      //   // onClick={() => {
                                      //   //   addAssignment(
                                      //   //     rowData?.courseLibraryId
                                      //   //   );
                                      //   // }}
                                      // />
                                      <></>
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
        </div>
      </div>
    </React.StrictMode>
  );
};
export default enrollments;
