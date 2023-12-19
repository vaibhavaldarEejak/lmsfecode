import React, { useEffect, useState } from "react";
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
  CImage,
  CModal,
} from "@coreui/react";
import { Link, useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Skeleton } from "primereact/skeleton";
import "./../../css/themes.css";
import getApiCall from "src/server/getApiCall";
import "../../css/table.css";

const manageOrganizationInactiveListing = () => {
  const [visible, setVisible] = useState(false),
    [responseData, setResponseData] = useState(null),
    [loadOrg, setLoadOrg] = useState(false),
    token = "Bearer " + localStorage.getItem("ApiToken"),
    colorName = localStorage.getItem("ThemeColor"),
    navigate = useNavigate(),
    [themes, setThemes] = useState(colorName),
    [filters, setFilters] = useState(null),
    [globalFilterValue, setGlobalFilterValue] = useState("");

  const getOrgActiveListing = async () => {
    try {
      const res = await getApiCall("getCompanyList?type=inactive");
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
  useEffect(() => {
    if (token !== "Bearer null") {
      getOrgActiveListing();
      initFilters();
    }
  }, []);

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <div
        style={{ cursor: "pointer" }}
        onClick={() => {
          localStorage.setItem("organizationId", responseData.organizationId);
          navigate(`/superadmin/organizationlist/editorganization`);
        }}
      >
        <CImage
          src="/custom_icon/edit.svg"
          className="me-2"
          alt="edit.svg"
          style={{ height: "22px" }}
          title="Edit Organization"
        />
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

  const orgNameRowFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        editable="true"
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search"
        className="p-column-filter"
        showclear="true"
        style={{
          height: "2rem",
          lineHeight: "4px",
        }}
      />
    );
  };

  const orgCodeRowFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        editable="true"
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search"
        className="p-column-filter"
        showclear="true"
        style={{
          height: "2rem",
          maxWidth: "10rem",
          lineHeight: "4px",
        }}
      />
    );
  };

  const orgTypeRowFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        editable="true"
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search"
        className="p-column-filter"
        showclear="true"
        style={{
          height: "2rem",
          maxWidth: "10rem",
          lineHeight: "4px",
        }}
      />
    );
  };

  const parentorgNameRowFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        editable="true"
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search"
        className="p-column-filter"
        showclear="true"
        style={{
          height: "2rem",
          maxWidth: "10rem",
          lineHeight: "4px",
        }}
      />
    );
  };

  const orgDomainRowFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        editable="true"
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search"
        className="p-column-filter"
        showclear="true"
        style={{
          height: "2rem",
          maxWidth: "10rem",
          lineHeight: "4px",
        }}
      />
    );
  };

  const orgAdminRowFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        editable="true"
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search"
        className="p-column-filter"
        showclear="true"
        style={{
          height: "2rem",
          maxWidth: "10rem",
          lineHeight: "4px",
        }}
      />
    );
  };

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };
  return (
    <div className="lg">
      <CModal visible={visible} onClose={() => setVisible(false)}>
        {/* Modal content */}
      </CModal>
      <CRow>
        <CCol style={{ padding: "1px" }}>
          <CCard className="mb-7 card-ric">
            <CCardHeader className="p-0">
              <CNav variant="tabs">
                <CNavItem>
                  <Link
                    style={{ textDecoration: "none" }}
                    to="/superadmin/organizationlist"
                  >
                    <CNavLink style={{ cursor: "pointer" }}>
                      Active Organization
                    </CNavLink>
                  </Link>
                </CNavItem>
                <CNavItem>
                  <Link
                    style={{ textDecoration: "none", color: "#8A93A2" }}
                    to="/superadmin/inactiveorganizationlist"
                  >
                    <CNavLink active style={{ cursor: "pointer" }}>
                      <strong>Inactive Organization</strong>
                    </CNavLink>
                  </Link>
                </CNavItem>
              </CNav>
            </CCardHeader>
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
                      body={bodyTemplate}
                      sortable
                    />
                    <Column
                      field="organizationCode"
                      header="Code"
                      body={bodyTemplate}
                      sortable
                    />
                    <Column
                      field="parentOrganizationName"
                      header="Primary Organization"
                      body={bodyTemplate}
                      sortable
                    />
                    <Column
                      field="isPrimary"
                      header="Organization Type"
                      body={bodyTemplate}
                      sortable
                    />
                    <Column
                      field="domainName"
                      header="Domain"
                      body={bodyTemplate}
                      sortable
                    />
                    <Column
                      field="adminName"
                      header="Admin"
                      body={bodyTemplate}
                      sortable
                    />

                    {/* DataTable columns */}
                  </DataTable>
                </div>
              ) : (
                <div className={`InputThemeColor${themes}`}>
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
                      filterElement={orgNameRowFilterTemplate}
                      filterMenuStyle={{ width: "10rem" }}
                      style={{ maxWidth: "8rem", minWidth: "6rem" }}
                    ></Column>
                    <Column
                      body={organizationCode}
                      field="organizationCode"
                      header="Code"
                      sortable
                      showFilterMenu={false}
                      filter
                      filterElement={orgCodeRowFilterTemplate}
                      filterMenuStyle={{ width: "7rem" }}
                      style={{ maxWidth: "6rem", minWidth: "3rem" }}
                    ></Column>
                    <Column
                      body={parentOrganizationName}
                      header="Primary Organization"
                      field="parentOrganizationName"
                      showFilterMenu={false}
                      filter
                      filterElement={parentorgNameRowFilterTemplate}
                      style={{ maxWidth: "10rem", minWidth: "7rem" }}
                      filterMenuStyle={{ width: "14rem" }}
                    ></Column>
                    <Column
                      body={isPrimary}
                      field="isPrimary"
                      header="Organization Type"
                      showFilterMenu={false}
                      filter
                      filterElement={orgTypeRowFilterTemplate}
                      filterMenuStyle={{ width: "10rem" }}
                      style={{ maxWidth: "10rem" }}
                    ></Column>
                    <Column
                      body={domainName}
                      field="domainName"
                      header="Domain"
                      showFilterMenu={false}
                      filter
                      filterElement={orgDomainRowFilterTemplate}
                      filterMenuStyle={{ width: "5rem" }}
                      style={{ maxWidth: "10rem" }}
                    ></Column>
                    <Column
                      body={adminName}
                      field="adminName"
                      header="Admin"
                      showFilterMenu={false}
                      filter
                      filterElement={orgAdminRowFilterTemplate}
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
  );
};
export default manageOrganizationInactiveListing;
