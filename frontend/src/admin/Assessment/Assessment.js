import React, { useState, useEffect, useRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CFormInput,
  CBadge,
} from "@coreui/react";
import { Toast } from "primereact/toast";
import "../../css/themes.css";
import { CImage } from "@coreui/react";
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Skeleton } from "primereact/skeleton";
import getApiCall from "src/server/getApiCall";
const Assessment = () => {
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [statuses] = useState(["Draft", "Published", "Unpublished"]);
  const [responseData, setResponseData] = useState([]);
  const [model, setModel] = useState(false);
  const token = "Bearer " + localStorage.getItem("ApiToken");
  useEffect(() => {
    if (token !== "Bearer null") {
      getAssementList();
      initFilters();
    }
  }, []);

  const getAssementList = async () => {
    try {
      const response = await getApiCall("getCourseCatalogList?trainingType=3");
      setResponseData(response);
      setLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  const statusShow2 = (responseData) => (
    <CBadge
      className={`badge badge-light-info text-info badgeColor${themes} `}
      color="light"
    >
      {responseData?.status}
    </CBadge>
  );
  const [backButtonUrl, setBackButtonUrl] = useState();
  const UrlBackButton = window.location.href.split("/").slice(-1)[0];

  useEffect(() => {
    setBackButtonUrl(UrlBackButton);
  }, [UrlBackButton]);
  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Link
        onClick={() => {
          localStorage.setItem("courseLibraryId", responseData.courseLibraryId);
          localStorage.setItem("assignId", responseData.assignId);
        }}
        to={`/admin/coursecataloglist/viewcoursecatalog`}
      >
        <CImage
          src="/custom_icon/eye.svg"
          style={{ height: "25px", cursor: "pointer" }}
          className="me-2"
          alt="eye_icon"
          title="View Catalog"
        />
      </Link>

      {/* {responseData.trainingMedia && (
        <CImage
          src="/media/icon/arr027.svg"
          alt="edit.svg"
          style={{ height: "25px", cursor: "pointer" }}
          className="me-2"
          onClick={() => {
            if (responseData.trainingMedia?.mediaType === "zip") {
              window.open(
                `/student/player?scormUrl=${responseData.trainingMedia?.mediaUrl}`,
                "_blank",
                "width=1080,height=700"
              );
            } else {
              setModel(true);
              setExtension(responseData.trainingMedia?.mediaType);
              setMediaUrl(responseData.trainingMedia?.mediaUrl);
            }
          }}
          title="Reset"
        />
      )} */}
    </div>
  );

  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const clearFilter = () => {
    initFilters();
  };

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
      courseTitle: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      trainingCode: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
        trainingCode: "global",
      },
      dateModified: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
        trainingCode: "global",
      },
      categoryName: { value: null, matchMode: "contains" },
      courseLibraryId: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      courseLibraryName: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },

      trainingType: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      status: { value: null, matchMode: FilterMatchMode.EQUALS },
      Action: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    setGlobalFilterValue("");
  };
  const items = Array.from({ length: 10 }, (v, i) => i);
  const dateModified = (responseData) => (
    <>{responseData.dateModified ? responseData.dateModified : "-"}</>
  );

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };

  const datemodifiedRowFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        editable
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search"
        className="p-column-filter"
        showClear
        style={{
          height: "2rem",
          maxWidth: "10rem",
          //padding: "0.25rem 1rem",
          lineHeight: "4px",
        }}
      />
    );
  };

  const statusRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.filterApplyCallback(e.value)}
        placeholder="Select One"
        className="p-column-filter"
        style={{
          height: "2rem",
          maxWidth: "10rem",
          lineHeight: "4px",
        }}
      />
    );
  };
  const refCodeRowFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search by name"
        className="p-column-filter"
        style={{
          height: "2rem",
          maxWidth: "10rem",
          paddingTop: "2px", // add padding to top
          lineHeight: "1.5", // reduce line height
        }}
      />
    );
  };
  const courseNameRowFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search by name"
        className="p-column-filter"
        style={{
          height: "2rem",
          maxWidth: "10rem",
          paddingTop: "2px", // add padding to top
          lineHeight: "1.5", // reduce line height
        }}
      />
    );
  };

  const handleClose = () => {
    setModel(false);
  };

  return (
    <div className="Subadminlisting">
      <CModal visible={model} onClose={handleClose} size="lg">
        <CModalHeader>
          <strong>Preview</strong>
        </CModalHeader>
        <CModalBody>
          <div id="divToPrint" className="ql-editor">
            <span className="fw-bold fs-6">
              {/* <Player extension={extension} mediaUrl={mediaUrl} /> */}
            </span>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleClose}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-6">
            <div>
              <CCardHeader>
                <CNav variant="tabs">
                  <CNavItem>
                    <CNavLink active style={{ cursor: "pointer" }}>
                      <strong>Assessment</strong>
                    </CNavLink>
                  </CNavItem>
                </CNav>
                <CTabContent className="rounded-bottom">
                  <CTabPane className="p-3 preview" visible>
                    <div className="buttons">
                      <div className="header">
                        <div className="col-lg-3-md-block">
                          <div className="d-grid gap-2 d-flex justify-evenly-col-sm-3">
                            <div className="input-group">
                              <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText
                                  value={globalFilterValue}
                                  style={{ height: "40px" }}
                                  onChange={onGlobalFilterChange}
                                  className="p-input-sm"
                                  placeholder="Search..."
                                />
                              </span>
                            </div>
                            <div className="d-grid gap-2 d-md-flex justify-content-col-sm-3-md-block-end">
                              <div className="input-group">
                                <span className="input-group-btn"></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CTabPane>
                </CTabContent>
              </CCardHeader>
            </div>
            <CCardBody>
              <Toast ref={toast} />

              {!loading ? (
                <div className="card">
                  <DataTable
                    value={items}
                    showGridlines
                    className="p-datatable-striped"
                  >
                    <Column
                      field="courseTitle"
                      header="Course"
                      style={{ width: "25%" }}
                      body={bodyTemplate}
                    ></Column>
                    <Column
                      field="courseLibraryId"
                      header="Course ID"
                      sortable
                      style={{ width: "20%" }}
                      body={bodyTemplate}
                    ></Column>
                    {/* <Column
                      field="TrainingType"
                      header="Training Type"
                      style={{ width: "25%" }}
                      body={bodyTemplate}
                    ></Column> */}
                    {/* <Column
                      field="categoryName"
                      header="Category Name"
                      style={{ width: "25%" }}
                      body={bodyTemplate}
                    ></Column> */}
                    <Column
                      field="Status"
                      header="Status"
                      style={{ width: "25%" }}
                      body={bodyTemplate}
                    ></Column>

                    <Column
                      field="dateModified"
                      body={bodyTemplate}
                      header="Date Modified"
                      style={{ width: "25%" }}
                    ></Column>
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
                  value={responseData}
                  paginator
                  showGridlines
                  rowHover
                  emptyMessage="No records found."
                  responsiveLayout="scroll"
                  paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                  currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                  rows={10}
                  rowsPerPageOptions={[10, 20, 50]}
                  filters={filters}
                  filterDisplay="row"
                  globalFilterFields={[
                    "courseTitle",
                    "trainingCode",
                    "courseLibraryName",
                    "categoryName",
                    "trainingType",
                    "status",
                    "dateModified",
                    "Action",
                  ]}
                >
                  <Column
                    filterMenuStyle={{ width: "14rem" }}
                    style={{ minWidth: "10rem" }}
                    showFilterMenu={false}
                    filter
                    sortable
                    filterElement={courseNameRowFilterTemplate}
                    field="courseTitle"
                    header="Course"
                  ></Column>
                  <Column
                    field="trainingCode"
                    header="Course ID"
                    showFilterMenu={false}
                    filter
                    sortable
                    filterElement={refCodeRowFilterTemplate}
                    style={{ minWidth: "8rem" }}
                  ></Column>
                  {/* <Column
                    field="trainingType"
                    header="Training Type"
                    showFilterMenu={false}
                    filterMenuStyle={{ width: "10rem" }}
                    style={{ minWidth: "8rem" }}
                    filter
                    filterElement={trainingTypeRowFilterTemplate}
                  ></Column> */}
                  {/* <Column
                    body={(rowData) => <>{rowData.categoryName.join(",")}</>}
                    field="categoryName"
                    header="Category Name"
                    showFilterMenu={false}
                    filterMenuStyle={{ width: "14rem" }}
                    style={{ minWidth: "14rem" }}
                    filter
                    filterElement={catergoryNameRowFilterTemplate}
                  ></Column> */}
                  {/* <Column
                    header="Assigned Status"
                    body={statusShow}
                    style={{ minWidth: "8rem" }}
                  ></Column>
                  <Column
                    header="Modified Status"
                    body={modified}
                    style={{ minWidth: "8rem" }}
                  ></Column> */}
                  <Column
                    field="dateModified"
                    body={dateModified}
                    header="Date Modified"
                    style={{ minWidth: "10rem" }}
                    showFilterMenu={false}
                    filterMenuStyle={{ width: "20rem", maxHeight: "2rem" }}
                    filter
                    sortable
                    filterElement={datemodifiedRowFilterTemplate}
                  ></Column>
                  <Column
                    body={statusShow2}
                    field="status"
                    header="Status"
                    showFilterMenu={false}
                    filterMenuStyle={{ width: "10rem", maxHeight: "2rem" }}
                    style={{ minWidth: "8rem" }}
                    filter
                    filterElement={statusRowFilterTemplate}
                  ></Column>
                  <Column
                    style={{ width: "8%" }}
                    field="Action"
                    header="Action"
                    body={buttonTemplate}
                  ></Column>
                </DataTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default Assessment;
