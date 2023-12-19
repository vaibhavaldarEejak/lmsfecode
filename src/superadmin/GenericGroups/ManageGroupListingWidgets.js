import React, { useRef, useEffect, useState } from "react";
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
  CImage,
  CFormInput,
} from "@coreui/react";
import { Link } from "react-router-dom";
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

const API_URL = process.env.REACT_APP_API_URL,
  domainURL = window.location.origin,
  pureDomainURL = domainURL.split("/"),
  urlData = {
    isHttps: pureDomainURL[0] === "http:" ? 0 : 1,
    domainName: pureDomainURL[2],
  };

const GenericGroupList = () => {
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const token = "Bearer " + localStorage.getItem("ApiToken");

  useEffect(() => {
    if (token !== "Bearer null") {
      getGenericGroups();
      initFilters();
    }
  }, []);
  const [responseData, setResponseData] = useState(null);
  const getGenericGroups = async () => {
    try {
      const res = await getApiCall("getGroupList");
      setResponseData(res);
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

  const deleteGroups = async (groupId) => {
    const data = {
      groupId: groupId,
    };
    try {
      const res = await generalDeleteApiCall("deleteGroup", data);
      const filteredData = responseData.filter(
        (item) => item.groupId !== groupId
      );
      setResponseData(filteredData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Group deleted successfully!",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Deleting Group",
        life: 3000,
      });
    }
    setDeleteProductDialog(false);
  };

  const groupName = (responseData) => (
    <>{responseData.groupName ? responseData.groupName : "-"}</>
  );

  const parentGroupName = (responseData) => (
    <>{responseData.parentGroupName ? responseData.parentGroupName : "-"}</>
  );

  const organizationName = (responseData) => (
    <>{responseData.organizationName ? responseData.organizationName : "-"}</>
  );

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <Link
        title="View Generic Group"
        to={`/superadmin/genericgrouplist/viewGenericGroup?${responseData.groupId}`}
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
      <Link
        to={`/superadmin/genericgrouplist/addeditgenericgroup?${responseData.groupId}`}
        title="Edit Generic Group"
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

      <div
        title="Delete Generic Group"
        onClick={() => confirmDeleteProduct(responseData)}
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
        className={`saveButtonTheme${themes}`}
        outlined
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Yes"
        size="sm"
        icon="pi pi-check"
        severity="info"
        onClick={() => deleteGroups(selectedProduct.groupId)}
      />
    </React.Fragment>
  );

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
      groupName: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      organizationName: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      parentGroupName: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
    });
    setGlobalFilterValue("");
  };
  const exportCSV = () => {
    dt.current.exportCSV();
  };
  const items = Array.from({ length: 10 }, (v, i) => i);

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);

  const groupNameFilterTemplate = (options) => {
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
  const parentGroupNameFilterTemplate = (options) => {
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
  const organizationNameFilterTemplate = (options) => {
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
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-7">
            <div>
              <CCardHeader>
                <CNav variant="tabs">
                  <CNavItem>
                    <CNavLink active style={{ cursor: "pointer" }}>
                      <strong>Groups</strong>
                    </CNavLink>
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
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <Link
                          to={`/superadmin/genericgrouplist/addeditgenericgroup`}
                          className={`me-md-2 btn d-flex align-items-center btn-info saveButtonTheme${themes}`}
                          title="Add Generic Group"
                        >
                          + &nbsp; Add Generic Group
                        </Link>

                        <Button
                          title="Export groups"
                          style={{ height: "40px" }}
                          icon="pi pi-upload"
                          className={`btn btn-info saveButtonTheme${themes}`}
                          onClick={exportCSV}
                        ></Button>

                        <Link
                          to={`/superadmin/GenericGroups/ImportOrgGroup`}
                          className={`me-md-2 btn btn-info saveButtonTheme${themes}`}
                          title="Import Groups"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-download"
                            viewBox="0 0 16 16"
                          >
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </CTabPane>
                </CTabContent>
              </CCardHeader>
            </div>
            <CCardBody>
              <Toast ref={toast} />
              {!responseData ? (
                <div className="card">
                  <DataTable
                    value={items}
                    showGridlines
                    className="p-datatable-striped"
                  >
                    <Column
                      field="groupName"
                      header="Name"
                      sortable
                      style={{ width: "25%" }}
                      body={bodyTemplate}
                    ></Column>
                    <Column
                      field="parentGroupName"
                      header="Parent Group"
                      style={{ width: "25%" }}
                      body={bodyTemplate}
                    ></Column>
                    <Column
                      field="organizationName"
                      header="Organization Name"
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
                    ref={dt}
                    value={responseData}
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
                    dataKey="groupId"
                    filters={filters}
                    filterDisplay="menu"
                    globalFilterFields={[
                      "groupName",
                      "parentGroupName",
                      "organizationName",
                      "Action",
                    ]}
                  >
                    <Column
                      body={groupName}
                      header="Name"
                      showFilterMenu={false}
                      filter
                      field="groupName"
                      filterElement={groupNameFilterTemplate}
                      filterPlaceholder="Search"
                      sortable
                    ></Column>
                    <Column
                      body={parentGroupName}
                      header="Parent Group"
                      field="parentGroupName"
                      showFilterMenu={false}
                      filter
                      filterElement={parentGroupNameFilterTemplate}
                      filterPlaceholder="Search"
                    ></Column>
                    <Column
                      body={organizationName}
                      field="organizationName"
                      header="Organization Name"
                      showFilterMenu={false}
                      filter
                      filterElement={organizationNameFilterTemplate}
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
  );
};
export default GenericGroupList;
