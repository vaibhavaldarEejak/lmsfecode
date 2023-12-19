import React, { useEffect, useState, useRef } from "react";
import {
  CCard,
  CFormInput,
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
  CButton,
} from "@coreui/react";
import { Link, useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Skeleton } from "primereact/skeleton";
import "./../../css/themes.css";
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";
import "../../css/table.css";

const manageOrganizationActiveListing = () => {
  const [url, setUrl] = useState(""),
    [loginToken, setLoginToken] = useState(""),
    [visible, setVisible] = useState(false),
    [statuses] = useState(["Active", "Inactive"]),
    [responseData, setResponseData] = useState(null),
    token = "Bearer " + localStorage.getItem("ApiToken"),
    colorName = localStorage.getItem("ThemeColor"),
    [loadOrg, setLoadOrg] = useState(false),
    [themes, setThemes] = useState(colorName),
    [filters, setFilters] = useState(null),
    [globalFilterValue, setGlobalFilterValue] = useState(""),
    [loading, setLoading] = useState(true),
    toast = useRef(null);

  const getOrgActiveListing = async () => {
    try {
      const res = await getApiCall("getCompanyList?type=active");
      setResponseData(res);
      setLoadOrg(true);
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
  const navigate = useNavigate();

  const autoLoginApi = async (data, domainName) => {
    try {
      const res = await postApiCall("previewOrganization", data);

      if (res) {
        setUrl(domainName);
        setLoginToken(res.api_token);
        setVisible(true);
      }
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
    if (token !== "Bearer null") {
      getOrgActiveListing();
      initFilters();
    }
  }, []);

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <div
        title="View Organization"
        style={{ cursor: "pointer" }}
        onClick={() =>
          autoLoginApi(
            {
              userId: 1,
              organizationId: responseData?.organizationId,
            },
            responseData?.domainName
          )
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          className={`bi bi-eye-fill iconTheme${themes}`}
          viewBox="0 0 16 16"
        >
          <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
          <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
        </svg>
      </div>
      <div
        title="Edit Organization"
        style={{ cursor: "pointer" }}
        onClick={() => {
          localStorage.setItem("organizationId", responseData.organizationId);
          navigate(`/superadmin/organizationlist/editorganization`);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          style={{ margin: "0 0.5rem" }}
          className={`bi bi-pencil-fill iconTheme${themes}`}
          viewBox="0 0 16 16"
        >
          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
        </svg>
      </div>
    </div>
  );

  const organizationName = (responseData) => (
    <>{responseData.organizationName ? responseData.organizationName : "-"}</>
  );

  const organizationCode = (responseData) => (
    <>{responseData.organizationCode ? responseData.organizationCode : "-"}</>
  );

  const isPrimary = (responseData) => (
    <>{responseData.isPrimary ? responseData.isPrimary : "-"}</>
  );

  const parentOrganizationName = (responseData) => (
    <>
      {responseData.parentOrganizationName
        ? responseData.parentOrganizationName
        : "-"}
    </>
  );

  const domainName = (responseData) => (
    <>{responseData.domainName ? responseData.domainName : "-"}</>
  );

  const adminName = (responseData) => (
    <>{responseData.adminName ? responseData.adminName : "-"}</>
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
      organizationName: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      organizationCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      organizationId: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      parentOrganizationName: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      isPrimary: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      adminName: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      domainName: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      adminName: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },

      status: { value: null, matchMode: FilterMatchMode.EQUALS },
      Action: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    setGlobalFilterValue("");
  };
  const items = Array.from({ length: 10 }, (v, i) => i);

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };
  return (
    <div className="container">
      <div className="container-fluid">
        <CModal visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader onClose={() => setVisible(false)}>
            <CModalTitle>Preview</CModalTitle>
          </CModalHeader>
          <CModalBody>{`Click Yes to visit ${url}.`}</CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              No
            </CButton>
            <CButton color="primary">
              <a
                href={`http://${url}/#/login?${loginToken}`}
                style={{ color: "white", textDecoration: "none" }}
                target="blank"
                onClick={() => {
                  setVisible(false);
                }}
              >
                Yes
              </a>
            </CButton>
          </CModalFooter>
        </CModal>
        <CRow>
          <CCol style={{ padding: "1px" }}>
            <CCard className="mb-7 card-ric">
              <Toast ref={toast}></Toast>
              <div>
                <CCardHeader className="p-0">
                  <CNav variant="tabs">
                    <CNavItem>
                      <Link
                        style={{ textDecoration: "none" }}
                        to="/superadmin/organizationlist"
                      >
                        <CNavLink active style={{ cursor: "pointer" }}>
                          <strong>Active Organization</strong>
                        </CNavLink>
                      </Link>
                    </CNavItem>
                    <CNavItem>
                      <Link
                        style={{ textDecoration: "none", color: "#8A93A2" }}
                        to="/superadmin/inactiveorganizationlist"
                      >
                        <CNavLink style={{ cursor: "pointer" }}>
                          Inactive Organization
                        </CNavLink>
                      </Link>
                    </CNavItem>
                  </CNav>
                  <CTabContent className="rounded-bottom">
                    <CTabPane className="p-3 preview" visible>
                      <div className="card-header border-0 d-flex justify-content-between">
                        <div className="d-flex row align-items-center">
                          <div
                            className={`col-md-12 col-xxl-12-lg-12 searchBarBox${themes}`}
                          >
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
                          </div>
                        </div>
                        <div className="d-grid gap-2 d-md-flex">
                          <Link
                            to={`/superadmin/organizationlist/addorganization`}
                            className={`me-md-2 btn d-flex align-items-center btn-info AddButton${themes}`}
                            title="Add New Organization"
                            onClick={() => {
                              localStorage.removeItem("organizationId");
                            }}
                          >
                            + &nbsp; Add New Organization
                          </Link>
                        </div>
                      </div>
                    </CTabPane>
                  </CTabContent>
                </CCardHeader>
              </div>
              <CCardBody className={`card tableTheme${themes}`}>
                {!loadOrg ? (
                  <div className="card responsiveClass">
                    <DataTable
                      value={items}
                      showGridlines
                      className="p-datatable-striped"
                    >
                      <Column
                        field="organizationName"
                        header="Name"
                        style={{ width: "25%" }}
                        body={bodyTemplate}
                      ></Column>
                      <Column
                        field="organizationCode"
                        header="Code"
                        sortable
                        style={{ width: "20%" }}
                        body={bodyTemplate}
                      ></Column>
                      <Column
                        field="isPrimary"
                        header="Primary Organization"
                        style={{ width: "25%" }}
                        body={bodyTemplate}
                      ></Column>
                      <Column
                        field="parentOrganizationName"
                        header="Organization Type"
                        style={{ width: "25%" }}
                        body={bodyTemplate}
                      ></Column>
                      <Column
                        field="domainName"
                        header="Domain"
                        style={{ width: "25%" }}
                        body={bodyTemplate}
                      ></Column>
                      <Column
                        field="adminName"
                        header="Admin"
                        style={{ width: "25%" }}
                        body={bodyTemplate}
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
                  <div className={`InputThemeColor${themes} ric `}>
                    <DataTable
                      value={responseData}
                      removableSort
                      paginator
                      showGridlines
                      rowHover
                      emptyMessage="No records found"
                      responsiveLayout="scroll"
                      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                      rows={10}
                      rowsPerPageOptions={[10, 20, 50]}
                      dataKey="organizationId"
                      filters={filters}
                      filterDisplay="row"
                      globalFilterFields={[
                        "organizationName",
                        "organizationCode",
                        "isPrimary",
                        "parentOrganizationName",
                        "domainName",
                        "adminName",
                        "isActive",
                      ]}
                    >
                      <Column
                        body={organizationName}
                        field="organizationName"
                        header="Name"
                        sortable
                        showFilterMenu={false}
                        filter
                        filterPlaceholder="Search"
                        // filterMenuStyle={{ width: "10rem" }}
                        style={{ maxWidth: "8rem", minWidth: "6rem" }}
                      ></Column>
                      <Column
                        body={organizationCode}
                        field="organizationCode"
                        header="Code"
                        sortable
                        showFilterMenu={false}
                        filter
                        filterPlaceholder="Search"
                        filterMenuStyle={{ width: "7rem" }}
                        style={{ maxWidth: "6rem", minWidth: "3rem" }}
                      ></Column>
                      <Column
                        body={parentOrganizationName}
                        header="Primary Organization"
                        field="parentOrganizationName"
                        showFilterMenu={false}
                        filter
                        filterPlaceholder="Search"
                        style={{ maxWidth: "10rem", minWidth: "7rem" }}
                        filterMenuStyle={{ width: "14rem" }}
                      ></Column>
                      <Column
                        body={isPrimary}
                        field="isPrimary"
                        header="Organization Type"
                        showFilterMenu={false}
                        filter
                        filterPlaceholder="Search"
                        filterMenuStyle={{ width: "10rem" }}
                        style={{ maxWidth: "10rem" }}
                      ></Column>
                      <Column
                        body={domainName}
                        field="domainName"
                        header="Domain"
                        showFilterMenu={false}
                        filter
                        filterPlaceholder="Search"
                        filterMenuStyle={{ width: "5rem" }}
                        style={{ maxWidth: "10rem" }}
                      ></Column>
                      <Column
                        body={adminName}
                        field="adminName"
                        header="Admin"
                        showFilterMenu={false}
                        filter
                        filterPlaceholder="Search"
                        filterMenuStyle={{ width: "10rem" }}
                        style={{ maxWidth: "6rem" }}
                      ></Column>
                      <Column
                        field="Action"
                        header="Action"
                        body={buttonTemplate}
                        style={{ maxWidth: "5rem" }}
                      ></Column>
                    </DataTable>
                  </div>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    </div>
  );
};
export default manageOrganizationActiveListing;
