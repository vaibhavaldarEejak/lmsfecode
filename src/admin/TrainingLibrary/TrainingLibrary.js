import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CNavItem,
  CNav,
  CNavLink,
  CButton,
  CImage,
  CTabContent,
  CTabPane,
  CFormInput,
} from "@coreui/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const Subadmin = () => {
  const [visible, setVisible] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const getOrgActiveListing = () => {
    axios
      .get(`${API_URL}/getCompanyList?type=active`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        setResponseData(response.data.data);
      });
  };

  useEffect(() => {
    if (token !== "Bearer null") {
      getOrgActiveListing();
      initFilters();
    }
  }, []);

  const data = [
    {
      id: 1,
      libraryName: "Django",
      libraryType: "python",
      courseCount: "1",
    },
    {
      id: 2,
      libraryName: "Django",
      libraryType: "python",
      courseCount: "2",
    },
    {
      id: 3,
      libraryName: "Django",
      libraryType: "python",
      courseCount: "3",
    },
    {
      id: 4,
      libraryName: "Django",
      libraryType: "python",
      courseCount: "4",
    },
  ];

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <CImage
        src="/custom_icon/eye.svg"
        style={{ height: "25px", cursor: "pointer" }}
        className="me-2"
        alt="eye_icon"
        title="View"
      />
      <Link to={``}>
        <CImage
          src="/custom_icon/edit.svg"
          className="me-2"
          alt="edit.svg"
          style={{ height: "22px" }}
          title="Edit"
        />
      </Link>
      <CImage
        src="/custom_icon/bin.svg"
        className="me-3"
        alt="bin.svg"
        style={{ height: "22px", cursor: "pointer" }}
        title="Delete"
      />
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
      libraryName: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      libraryType: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      courseCount: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
    });
    setGlobalFilterValue("");
  };

  const libraryNameFilterTemplate = (options) => {
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
  const libraryTypeFilterTemplate = (options) => {
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
  const courseCountFilterTemplate = (options) => {
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
  return (
    <div className="Subadminlisting">
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <div>
              <CCardHeader>
                <CNav variant="tabs">
                  <CNavItem>
                    <CNavLink active style={{ cursor: "pointer" }}>
                      <strong>Training Library</strong>
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
                            <InputText
                              value={globalFilterValue}
                              style={{ height: "40px" }}
                              onChange={onGlobalFilterChange}
                              className="p-input-sm"
                              placeholder="Search..."
                            />
                          </span>
                        </div>
                      </div>
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <CButton color="light">Add / Remove User</CButton>
                        <div className="d-grid gap-2 d-md-flex">
                          <Link
                            to={`/admin/addcredentials`}
                            className="me-md-2 btn btn-info"
                            title="Add User as Subadmin"
                          >
                            +
                          </Link>
                        </div>
                        {/* <CButton color="light">Add User as Subadmin</CButton> */}
                      </div>
                    </div>
                  </CTabPane>
                </CTabContent>
              </CCardHeader>
            </div>
            <CCardBody>
              <DataTable
                value={data}
                removableSort
                paginator
                showGridlines
                rowHover
                emptyMessage="No records found."
                responsiveLayout="scroll"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                rows={10}
                rowsPerPageOptions={[10, 20, 50]}
                dataKey="id"
                filters={filters}
                filterDisplay="row"
                globalFilterFields={[
                  "libraryName",
                  "libraryType",
                  "courseCount",
                ]}
              >
                <Column
                  field="libraryName"
                  header="Library Name"
                  sortable
                  showFilterMenu={false}
                  filter
                  filterElement={libraryNameFilterTemplate}
                  filterPlaceholder="Search"
                ></Column>
                <Column
                  field="libraryType"
                  header="Library Type"
                  showFilterMenu={false}
                  filter
                  filterElement={libraryTypeFilterTemplate}
                  filterPlaceholder="Search"
                ></Column>
                <Column
                  field="courseCount"
                  header="Course Count"
                  sortable
                  showFilterMenu={false}
                  filter
                  filterElement={courseCountFilterTemplate}
                  filterPlaceholder="Search"
                ></Column>
                <Column
                  field="Action"
                  header="Action"
                  body={buttonTemplate}
                ></Column>
              </DataTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default Subadmin;
