import React, { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CNav,
  CRow,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from "@coreui/react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Link, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import getApiCall from "src/server/getApiCall";
import "../../css/table.css";
import "../../css/pagination.css";
import { Panel } from "primereact/panel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const StudentLearningPlan = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const toast = useRef(null);
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

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const [response, setResponse] = useState("");

  const learningPlanListAPI = async () => {
    try {
      const res = await getApiCall("getStudentLearningPlanList");
      setResponse(res);
      setLoader(true);
    } catch (err) {}
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
    return item.learningPlanName
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

  const [viewType, setViewType] = useState("card");

  const globalCardSearch = (e) => {
    setCardSearch(e.target.value);
  };
  const ref = useRef(null);
  return (
    <React.StrictMode>
      <div className="">
        <div className="container">
          <div className="container-fluid">
            <Toast ref={toast} />
            <CRow>
              <CCol xs={12} style={{ padding: "1px" }}>
                <CCard className="mb-7 card-ric " style={{ height: "0rem" }}>
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
                            <CNavLink active style={{ cursor: "pointer" }}>
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
                  </div>

                  {!loader ? (
                    <></>
                  ) : (
                    <>
                      {response.map((item, i) => (
                        <div className="studentReq">
                          <Panel
                            header={item.learningPlanName}
                            toggleable
                            collapsed
                            style={{
                              marginTop: "1rem",
                              background: "#0d6efda3",
                            }}
                          >
                            <DataTable
                              value={item.learningPlanRequirements}
                              className="p-datatable-gridlines p-datatable-sm"
                              globalFilter={globalFilterValue}
                              emptyMessage="No records found"
                              filters={filters}
                            >
                              <Column
                                field="trainingName"
                                header="Training Name"
                              />
                              <Column
                                field="trainingType"
                                header="Training Type"
                              />
                              <Column field="" header="Assign Date" />
                              <Column field="dueDateValue" header="Due Date" />
                              <Column
                                field="expirationDateValue"
                                header="Completion Date"
                              />
                              <Column
                                field="courseLibraryId"
                                header="Expiration Date"
                              />
                              <Column
                                field="requirementId"
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
                                      label="view"
                                      onClick={() => {
                                        localStorage.setItem(
                                          "courseLibraryId1",
                                          rowData.requirementId
                                        );
                                        navigate(`/student/view-detail?`);
                                      }}
                                    />
                                    <Button
                                      style={{ minWidth: "20px" }}
                                      text
                                      raised
                                      size="sm"
                                      severity="info"
                                      className="btn btn-bg-secondary btn-active-color-primary mb-2"
                                      label="launch"
                                      onClick={() => {
                                        console.log("dasdasd");
                                        // addAssignment(rowData?.courseLibraryId);
                                      }}
                                    />
                                  </div>
                                )}
                              />
                            </DataTable>
                          </Panel>
                        </div>
                      ))}
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
export default StudentLearningPlan;
