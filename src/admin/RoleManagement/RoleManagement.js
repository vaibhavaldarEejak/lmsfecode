import React, { useState, useEffect } from "react";
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
  CFormInput,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Skeleton } from "primereact/skeleton";

function RoleManagement() {
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  const [RolesList, setRolesList] = useState([]);

  const getRolesListByOrgId = async () => {
    try {
      const res = await getApiCall("getOrgRoleList");
      setRolesList(res);
    } catch (err) {}
  };

  useEffect(() => {
    if (token !== "Bearer null") {
      getRolesListByOrgId();
      initFilters();
    }
  }, []);

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
      roleName: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      description: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      roleType: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      superAdminRoleName: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
    });
    setGlobalFilterValue("");
  };
  const items = Array.from({ length: 10 }, (v, i) => i);

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <Link
        title="Edit Role"
        to={`/admin/editrolemanagement?${responseData?.roleId}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          style={{ margin: "0 0.5rem" }}
          class={`bi bi-pencil-fill iconTheme${themes}`}
          viewBox="0 0 16 16"
        >
          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
        </svg>
      </Link>
    </div>
  );
  const roleNameFilterTemplate = (options) => {
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
  const descriptionFilterTemplate = (options) => {
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

  const roleName = (responseData) => (
    <>{responseData.roleName ? responseData.roleName : "-"}</>
  );

  const description = (responseData) => (
    <>{responseData.description ? responseData.description : "-"}</>
  );

  return (
    <div className="">
      <div className="container">
        <div className="container-fluid">
          <CRow>
            <CCol xs={12} style={{ padding: "1px" }}>
              <CCard className="mb-lg-0 card-ric">
                <div>
                  <CCardHeader className="p-0">
                    <CNav variant="tabs">
                      <CNavItem>
                        <Link
                          style={{ cursor: "pointer", textDecoration: "none" }}
                          to={`/superadmin/roleslist`}
                        >
                          <CNavLink active style={{ cursor: "pointer" }}>
                            <strong>Roles</strong>
                          </CNavLink>{" "}
                        </Link>
                      </CNavItem>
                    </CNav>

                    <CTabContent className="rounded-bottom">
                      <CTabPane className="p-3 preview" visible>
                        <div className="card-header border-0 d-flex justify-content-between">
                          <div className="d-flex row align-items-center">
                            <div
                              className={`col-md-12 col-xxl-12 searchBarBox${themes}`}
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
                          <div className="d-grid gap-2 d-md-flex justify-content-md-end"></div>
                        </div>
                      </CTabPane>
                    </CTabContent>
                  </CCardHeader>
                </div>
                <CCardBody>
                  {!RolesList ? (
                    <div className="card">
                      <DataTable
                        value={items}
                        showGridlines
                        className="p-datatable-striped"
                      >
                        <Column
                          field="roleName"
                          header="Display Name"
                          sortable
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>

                        <Column
                          field="description"
                          header="Description"
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
                    <div className={` InputThemeColor${themes}`}>
                      <DataTable
                        value={RolesList}
                        removableSort
                        paginator
                        showGridlines
                        rowHover
                        emptyMessage="-"
                        responsiveLayout="scroll"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                        rows={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        dataKey="roleId"
                        filters={filters}
                        filterDisplay="row"
                        globalFilterFields={[
                          "roleName",
                          "description",
                          "roleType",
                          "Action",
                        ]}
                      >
                        <Column
                          body={roleName}
                          header="Display Name"
                          field="roleName"
                          sortable
                          showFilterMenu={false}
                          filter
                          filterElement={roleNameFilterTemplate}
                          filterPlaceholder="Search"
                        ></Column>
                        <Column
                          field="description"
                          body={description}
                          header="Description"
                          showFilterMenu={false}
                          filter
                          filterElement={descriptionFilterTemplate}
                          filterPlaceholder="Search"
                        ></Column>
                        <Column
                          field="Action"
                          header="Action"
                          body={buttonTemplate}
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
    </div>
  );
}

export default RoleManagement;
