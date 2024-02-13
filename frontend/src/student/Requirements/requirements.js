import React, { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CCol,
  CNav,
  CRow,
  CNavItem,
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
import ReactPaginate from "react-paginate";
import "../../css/pagination.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import StudentLearningPlan from "./StudentLearningPlan";

const requirements = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const colorName = localStorage.getItem("ThemeColor");
  const toast = useRef(null);
  const dt = useRef(null);
  const cardStyle = {
    boxShadow:
      "0 24px 24px -24px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 0, 0, 0.1)",
    width: "55vw",
  };
  const navigate = useNavigate();
  const courseType = window.location.href.split("?")[1] || "";
  const [responseData, setResponseData] = useState([]);
  // getCatalogById;

  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (token !== "Bearer null") {
      // catalogListAPI();
    }
  }, []);
  const [filters, setFilters] = useState(null);
  const [themes, setThemes] = useState(colorName);
  const [loading, setLoading] = useState(true);
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

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <Link
        to={`/student/view-detail?requirements`}
        onClick={() => {
          localStorage.setItem(
            "courseLibraryId1",
            responseData.documentLibraryId
          );
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          class={`bi bi-eye-fill iconTheme${themes}`}
          viewBox="0 0 16 16"
        >
          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
        </svg>
      </Link>
    </div>
  );

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  // const catalogListAPI = async () => {
  //   try {
  //     const res = await getApiCall("getRequirementList");
  //     setResponseData(res);
  //     setLoader(true);
  //   } catch (err) {}
  // };

  const bodyTemplate1 = () => {
    return <Skeleton></Skeleton>;
  };

  const getRequirementList = async () => {
    try {
      const res = await getApiCall("getStudentAllList");
      setResponseData(res);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const addAssignment = async (id) => {
    const data = {
      courseLibraryId: id,
    };
    try {
      const response = await postApiCall("addEnrollment", data);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Course Enrolled Successfully",
        life: 3000,
      });
      // catalogListAPI();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Enrolling Course",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    getRequirementList();
    initFilters();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(9);
  const [cardSearch, setCardSearch] = useState("");
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  // const filteredPersons = responseData?.filter((item) => {
  //   return item.courseName.toLowerCase()?.includes(cardSearch.toLowerCase());
  // });
  // const currentPosts = filteredPersons?.slice(
  //   indexOfFirstPost,
  //   indexOfLastPost
  // );

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

  const titleFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search"
        className="p-column-filter"
        showClear
        style={{
          height: "2rem",
          maxWidth: "10rem",
          lineHeight: "4px",
        }}
      />
    );
  };
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
                            localStorage.setItem(
                              "courseLibraryId1",
                              item.courseLibraryId
                            );
                            navigate(`/student/view-detail`);
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
                          <a
                            className="dropdown-item"
                            href="#"
                            onClick={() => {
                              addAssignment(item?.courseLibraryId);
                            }}
                          >
                            Enroll
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>

                  <div class="card-body text-center">
                    <img
                      src={item?.imageUrl ? item?.imageUrl : CourseImageSample}
                      alt={item?.courseName}
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
      {responseData.length > 0 && (
        <div classname="pagination">
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

  const [viewType, setViewType] = useState("card");

  const globalCardSearch = (e) => {
    setCardSearch(e.target.value);
  };

  return (
    <>
    <React.StrictMode>
      <div className="">
        <div className="container">
          <div className="container-fluid">
            <Toast ref={toast} />
            {/* <CRow> */}
            {/* <CCol xs={12} style={{ padding: "1px" }}> */}
            <CCard className="mb-7 card-ric">
              <CCardHeader className="p-0">
                <CNav variant="tabs">
                  <CNavItem>
                    <Link
                      to={"/student/requirements?All"}
                      style={{ textDecoration: "none" }}
                    >
                      <CNavLink active style={{ cursor: "pointer" }}>
                        <strong>Requirements </strong>
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
                      <CNavLink>
                        <strong>Assignments</strong>
                      </CNavLink>
                    </Link>
                  </CNavItem>
                </CNav>
              </CCardHeader>
              <CCardBody>
                <Toast ref={toast} />
                <div className="">
                  {loading ? (
                    <div
                      className={`card tableThemeColor${themes} InputThemeColor${themes}`}
                    >
                      <DataTable
                        value={items}
                        showGridlines
                        className="p-datatable-striped"
                      >
                        <Column
                          field="requirementName"
                          header="Requirement Name"
                          body={bodyTemplate1}
                        ></Column>
                        <Column
                          field="trainingName"
                          body={bodyTemplate1}
                          header="Training Name"
                          sortable
                          showFilterMenu={false}
                          filter
                          // filterElement={categoryFilterTemplate}
                          filterPlaceholder="Search"
                        ></Column>

                        <Column
                          field="trainingType"
                          body={bodyTemplate1}
                          header="Training Type"
                        ></Column>
                        <Column
                          field="requirementType"
                          body={bodyTemplate1}
                          header="Requirement Type"
                        ></Column>

                        <Column
                          field="dueDate"
                          body={bodyTemplate1}
                          header="Due Date"
                        ></Column>
                        <Column
                          field="assignDate"
                          body={bodyTemplate1}
                          header="Assign Date"
                        ></Column>

                        <Column
                          field="Action"
                          header="Action"
                          body={bodyTemplate1}
                        ></Column>
                      </DataTable>
                    </div>
                  ) : (
                    <div
                      className={`card responsiveClass tableThemeColor${themes} InputThemeColor${themes}`}
                    >
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
                        dataKey="requirementId"
                        filters={filters}
                        filterDisplay="row"
                        globalFilterFields={[
                          "requirementName",
                          "trainingName",
                          "requirementId",
                          "requirementType",
                          "trainingType",
                          "dueDate",
                          "assignDate",
                          "isActive",
                        ]}
                      >
                        <Column
                          field="requirementName"
                          header="Requirement Name"
                          // sortable
                          // showFilterMenu={false}
                          // filter
                          // filterElement={titleFilterTemplate}
                          // filterPlaceholder="Search"
                          style={{ width: "20%" }}
                        ></Column>
                        <Column
                          field="trainingName"
                          header="Training Name"
                          // sortable
                          // showFilterMenu={false}
                          style={{ width: "15%" }}
                        // filter
                        // filterElement={categoryFilterTemplate}
                        // filterPlaceholder="Search"
                        ></Column>

                        <Column
                          field="trainingType"
                          header="Training Type"
                          style={{ width: "15%" }}
                        ></Column>
                        <Column
                          field="requirementType"
                          header="Requirement Type"
                          style={{ width: "15%" }}
                        ></Column>

                        <Column
                          field="dueDate"
                          header="Due Date"
                          style={{ width: "10%" }}
                        ></Column>
                        <Column
                          field="assignDate"
                          header="Assign Date"
                          style={{ width: "10%" }}
                        ></Column>

                        <Column
                          field="Action"
                          header="Action"
                          style={{ width: "15%" }}
                          body={buttonTemplate}
                        ></Column>
                      </DataTable>
                    </div>
                  )}
                </div>
              </CCardBody>
            </CCard>
            {/* </CCol> */}
            {/* </CRow> */}
          </div>
        </div>
      </div>
    </React.StrictMode>
    </>
  );
};
export default requirements;
