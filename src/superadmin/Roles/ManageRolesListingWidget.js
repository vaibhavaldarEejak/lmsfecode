import React, { useRef, useEffect, useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Skeleton } from "primereact/skeleton";
import getApiCall from "src/server/getApiCall";
import generalDeleteApiCall from "src/server/generalDeleteApiCall";
import "../../css/table.css";
import DatatableSketon from "./DatatableSketon";

const manageRolesListingWidget = () => {
  const [filters, setFilters] = useState(null),
    [globalFilterValue, setGlobalFilterValue] = useState(""),
    token = "Bearer " + localStorage.getItem("ApiToken"),
    [deleteProductDialog, setDeleteProductDialog] = useState(false),
    [selectedProduct, setSelectedProduct] = useState(null),
    [responseData, setResponseData] = useState(),
    toast = useRef(null),
    navigate = useNavigate();

  useEffect(() => {
    if (token !== "Bearer null") {
      getRolesListing();
      initFilters();
    }
  }, []);

  const getRolesListing = async () => {
    try {
      const res = await getApiCall("getRoleList");
      setResponseData(res);
    } catch (err) {}
  };

  const deleteRoles = async (roleId) => {
    const data = {
      roleId: roleId,
    };
    try {
      const res = await generalDeleteApiCall("deleteRole", data);
      const filteredData = responseData.filter(
        (item) => item.roleId !== roleId
      );
      setResponseData(filteredData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Role deleted successfully!",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Deleting Role",
        life: 3000,
      });
    }
    setDeleteProductDialog(false);
  };

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <div
        title="View Role"
        style={{ cursor: "pointer" }}
        onClick={() => {
          navigate(`/superadmin/roleslist/viewroles?${responseData?.roleId}`);
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
      </div>

      <div
        title="Edit Role"
        style={{ cursor: "pointer" }}
        onClick={() => {
          navigate(`/superadmin/roleslist/editroles?${responseData?.roleId}`);
        }}
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
      </div>
      <div
        title="Delete Role"
        onClick={() => confirmDeleteProduct(responseData)}
        style={{ cursor: "pointer" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          class={`bi bi-trash-fill iconTheme${themes}`}
          viewBox="0 0 16 16"
        >
          <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
        </svg>
      </div>
    </div>
  );
  const confirmDeleteProduct = (product) => {
    setSelectedProduct(product);
    setDeleteProductDialog(true);
  };
  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };
  const deleteProductDialogFooter = () => (
    <React.Fragment>
      <Button
        label="No"
        size="sm"
        icon="pi pi-times"
        outlined
        className={`saveButtonTheme${themes}`}
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Yes"
        size="sm"
        icon="pi pi-check"
        severity="info"
        onClick={() => deleteRoles(selectedProduct.roleId)}
      />
    </React.Fragment>
  );

  const roleName = (responseData) => (
    <div style={{ height: "5px" }}>
      {responseData.roleName ? responseData.roleName : "-"}
    </div>
  );

  const description = (responseData) => (
    <>{responseData.description ? responseData.description : "-"}</>
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
      roleName: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      description: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
    });
    setGlobalFilterValue("");
  };

  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);

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
                      <CNavItem>
                        <Link
                          style={{ cursor: "pointer", textDecoration: "none" }}
                          to={`/superadmin/activeinactiveroles`}
                        >
                          <CNavLink style={{ cursor: "pointer" }}>
                            Role Assignment
                          </CNavLink>
                        </Link>
                      </CNavItem>
                    </CNav>

                    <CTabContent className="rounded-bottom">
                      <CTabPane
                        className="p-3 preview"
                        visible
                        style={{ padding: "0rem !important" }}
                      >
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
                <CCardBody style={{ padding: "0" }}>
                  <Toast ref={toast} />
                  {!responseData ? (
                    <div className="card">
                      <DatatableSketon />
                    </div>
                  ) : (
                    <div className={` InputThemeColor${themes} tableContainer`}>
                      <DataTable
                        value={responseData}
                        removableSort
                        paginator
                        showGridlines
                        rowHover
                        emptyMessage="-"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                        rows={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        dataKey="roleId"
                        filters={filters}
                        size={"small"}
                        filterDisplay="row"
                        rowStyle={{ height: "10px" }}
                        globalFilterFields={[
                          "roleName",
                          "description",
                          "roleType",
                          "Action",
                        ]}
                      >
                        <Column
                          body={roleName}
                          header="Role Name"
                          field="roleName"
                          sortable
                          showFilterMenu={false}
                          filter
                          filterPlaceholder="Search"
                          style={{ maxWidth: "6rem", minWidth: "3rem" }}
                          filterMenuStyle={{ padding: " 0.2rem" }}
                          filterHeaderStyle={{ height: "2rem" }}
                        ></Column>
                        <Column
                          filterHeaderStyle={{ height: "1rem" }}
                          filterMenuStyle={{ padding: " 0.2rem" }}
                          field="description"
                          body={description}
                          header="Description"
                          showFilterMenu={false}
                          filter
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
                  <Dialog
                    visible={deleteProductDialog}
                    style={{ width: "32rem" }}
                    breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                    header="Confirm"
                    modal
                    footer={deleteProductDialogFooter}
                    onHide={hideDeleteProductDialog}
                  >
                    <div className="confirmation-content">
                      <i
                        className="pi pi-exclamation-triangle me-3 mt-2"
                        style={{ fontSize: "1.5rem" }}
                      />
                      <span>Are you sure you want to delete ?</span>
                    </div>
                  </Dialog>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </div>
    </div>
  );
};
export default manageRolesListingWidget;
