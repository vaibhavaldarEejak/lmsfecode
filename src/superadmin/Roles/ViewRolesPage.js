import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormLabel,
  CRow,
  CForm,
  CCardFooter,
  CBadge,
  CFormInput,
} from "@coreui/react";
import { Link } from "react-router-dom";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Skeleton } from "primereact/skeleton";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import getApiCall from "src/server/getApiCall";

const ViewRolesPage = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken"),
    colorName = localStorage.getItem("ThemeColor"),
    roleId = window.location.href.split("?")[1],
    [roleDetail, setroleDetail] = useState(""),
    [themes, setThemes] = useState(colorName),
    [filters, setFilters] = useState(null),
    [globalFilterValue, setGlobalFilterValue] = useState(""),
    [userlist, setUserList] = useState();

  const roleDetailApi = async (id) => {
    try {
      const res = await getApiCall("getRoleById", id);
      setroleDetail(res);
      setUserList(res.users);
    } catch (err) {}
  };
  const name = (userlist) => (
    <>
      <span className="me-2">{userlist?.firstName}</span>
      <span>{userlist?.lastName}</span>
      {userlist.firstName ? userlist.firstName : "-"}
    </>
  );

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };
  const items = Array.from({ length: 10 }, (v, i) => i);

  useEffect(() => {
    if (roleId) {
      roleDetailApi(Number(roleId));
    }
    initFilters();
  }, [roleId]);

  const org = (userlist) => (
    <>{userlist.organizationName ? userlist.organizationName : "-"}</>
  );
  const username = (userlist) => (
    <>{userlist.username ? userlist.username : "-"}</>
  );

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      firstName: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      email: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      phone: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      organizationName: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      username: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      roleName: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
    });
  };

  return (
    <div>
      <CRow>
        <CCol xs={12}>
          {roleDetail && (
            <CCard className="mb-4">
              <CCardHeader className={`saveButtonTheme${themes}`}>
                <strong>Role Details</strong>
              </CCardHeader>
              <CCardBody className="card-body border-top p-9">
                <CForm
                  className={`row g-15 needs-validation ps-4 InputThemeColor${themes}`}
                >
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          Role Name :
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          {roleDetail.roleName}
                        </div>
                      </CRow>
                    </CCol>

                    <CCol lg={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          Role Type :
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          {roleDetail.roleType}
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          Description :
                        </CFormLabel>
                        <div className="col-sm-8 py-2">
                          {roleDetail.description}
                        </div>
                      </CRow>
                    </CCol>

                    <CCol lg={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          Status :
                        </CFormLabel>
                        <div className="col-sm-4 py-2 fs-6">
                          {roleDetail?.isActive === 1 ? (
                            <CBadge
                              className={`badge badge-light-info saveButtonTheme${themes}`}
                              color="primary"
                            >
                              {roleDetail?.isActive === 1
                                ? "Active"
                                : "In-Active"}
                            </CBadge>
                          ) : (
                            <CBadge
                              className={`badge badge-light-info saveButtonTheme${themes}`}
                              color="secondary"
                            >
                              {roleDetail?.isActive === 1
                                ? "Active"
                                : "In-Active"}
                            </CBadge>
                          )}
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>

                  <CRow className="mb-3"></CRow>
                </CForm>
              </CCardBody>
              {!userlist ? (
                <div>
                  <DataTable
                    value={items}
                    showGridlines
                    className="p-datatable-striped"
                  >
                    <Column
                      field="firstName"
                      header="Name"
                      sortable
                      style={{ width: "25%" }}
                      body={bodyTemplate}
                    ></Column>
                    <Column
                      field="username"
                      header="User Name"
                      sortable
                      style={{ width: "25%" }}
                      body={bodyTemplate}
                    ></Column>
                    <Column
                      field="organizationName"
                      header="Organization"
                      style={{ width: "15%" }}
                      body={bodyTemplate}
                    ></Column>
                  </DataTable>
                </div>
              ) : (
                <div className={`InputThemeColor${themes}`}>
                  <DataTable
                    value={userlist}
                    removableSort
                    paginator
                    showGridlines
                    rowHover
                    emptyMessage="No records found."
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                    rows={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    dataKey="userId"
                    filters={filters}
                    filterDisplay="row"
                    globalFilterFields={[
                      "firstName",
                      "roleName",
                      "organizationName",
                      "username",
                    ]}
                  >
                    <Column
                      body={name}
                      field="firstName"
                      header="Name"
                      sortable
                      showFilterMenu={false}
                      filterPlaceholder="Search"
                      filter
                      // filterElement={firstNameRowFilterTemplate}
                      filterMenuStyle={{ width: "14rem" }}
                      style={{ minWidth: "7rem", maxWidth: "8rem" }}
                    ></Column>
                    <Column
                      body={username}
                      field="username"
                      header="User Name"
                      showFilterMenu={false}
                      filterPlaceholder="Search"
                      filter
                      style={{ minWidth: "7rem", maxWidth: "8rem" }}
                    ></Column>
                    <Column
                      body={org}
                      field="organizationName"
                      header="Organization"
                      showFilterMenu={false}
                      filter
                      filterPlaceholder="Search"
                      filterMenuStyle={{ width: "14rem" }}
                      style={{ minWidth: "7rem" }}
                      // filterElement={organizationNameRowFilterTemplate}
                    ></Column>
                  </DataTable>
                </div>
              )}
              <CCardFooter>
                <div className="d-flex justify-content-end">
                  <Link
                    to="/superadmin/roleslist"
                    className={`btn btn-primary saveButtonTheme${themes}`}
                  >
                    Back
                  </Link>
                </div>
              </CCardFooter>
            </CCard>
          )}
        </CCol>
      </CRow>
    </div>
  );
};

export default ViewRolesPage;
