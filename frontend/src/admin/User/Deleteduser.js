import React, { useRef, useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CImage,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CBadge,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Skeleton } from "primereact/skeleton";
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";
import generalDeleteApiCall from "src/server/generalDeleteApiCall";
import "../../css/table.css";

const Deleteduser = () => {
  const toast = useRef(null),
    [responseData, setResponseData] = useState(null),
    [deleteProductDialog, setDeleteProductDialog] = useState(false),
    [selectedProduct, setSelectedProduct] = useState(null),
    [filters, setFilters] = useState(null),
    [globalFilterValue, setGlobalFilterValue] = useState(""),
    [loading, setLoading] = useState(true),
    token = "Bearer " + localStorage.getItem("ApiToken");
  useEffect(() => {
    if (token !== "Bearer null") {
      getDeletedUserListing();
      initFilters();
    }
  }, []);

  const getDeletedUserListing = async () => {
    try {
      const res = await getApiCall(
        "getUserList?userType=deletedUser&sort=firstName&order=ASC"
      );
      setResponseData(res);
      setLoading(true);
    } catch (err) {
      setLoading(true);
    }
  };

  const Activeuser = async (userId) => {
    const data = {
      userId: userId,
    };
    try {
      const response = await postApiCall("activeUser", data);
      const filteredData = responseData.filter(
        (item) => item.userId !== userId
      );
      setResponseData(filteredData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "User is Activated Successful!",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Activating user",
        life: 3000,
      });
    }
  };

  const dt = useRef(null);

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const Permanentdeleteuser = async (userId) => {
    const data = {
      userId: userId,
    };

    try {
      const response = await generalDeleteApiCall("permanentDeleteUser", data);
      const filteredData = responseData.filter(
        (item) => item.userId !== userId
      );
      setResponseData(filteredData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Delete user permanently successfully!",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error deleting user permanently",
        life: 3000,
      });
    }
    setDeleteProductDialog(false);
  };

  const Archiveuser = async (userId) => {
    const data = {
      userId: userId,
    };
    try {
      const response = await postApiCall("archiveUser", data);
      const filteredData = responseData.filter(
        (item) => item.userId !== userId
      );
      setResponseData(filteredData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "User Archived successfully!",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Archiving user",
        life: 3000,
      });
    }
  };

  const active = (responseData) => (
    <>
      <CBadge className="badge badge-light-info text-danger" color="light">
        {responseData?.isActive === 1 ? "Active" : "Deleted"}
      </CBadge>
    </>
  );

  const name = (responseData) => (
    <>
      <span className="me-2">{responseData?.firstName}</span>
      <span>{responseData?.lastName}</span>
    </>
  );

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <CImage
        src="/custom_icon/arr013.svg"
        className="me-3"
        alt="arr013.svg"
        style={{ height: "22px", cursor: "pointer" }}
        title="Activate User"
        onClick={() => Activeuser(responseData.userId)}
      />
      <CImage
        src="/custom_icon/bin.svg"
        className="me-3"
        alt="bin.svg"
        style={{ height: "20px", cursor: "pointer" }}
        title="Delete User"
        onClick={() => confirmDeleteProduct(responseData)}
      />
      <CImage
        src="/custom_icon/arr086.svg"
        className="me-3"
        alt="arr086.svg"
        style={{ height: "22px", cursor: "pointer" }}
        title="Archive User"
        onClick={() => Archiveuser(responseData.userId)}
      />
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
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Yes"
        size="sm"
        icon="pi pi-check"
        severity="info"
        onClick={() => Permanentdeleteuser(selectedProduct.userId)}
      />
    </React.Fragment>
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
      firstName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      email: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      phone: { value: null, matchMode: FilterMatchMode.IN },
      organizationName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      roleName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      isActive: { value: null, matchMode: FilterMatchMode.EQUALS },
      Action: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    setGlobalFilterValue("");
  };
  const items = Array.from({ length: 10 }, (v, i) => i);

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };

  return (
    <div className="">
      <div className="container">
        <div className="container-fluid">
          <CRow>
            <CCol xs={12} style={{ padding: "1px" }}>
              <CCard className="mb-7 card-ric">
                <div>
                  <CCardHeader className="p-0">
                    <CNav variant="tabs">
                      <CNavItem>
                        <Link
                          style={{ cursor: "pointer", textDecoration: "none" }}
                          to={`/admin/userlist`}
                        >
                          <CNavLink style={{ cursor: "pointer" }}>
                            Active Users
                          </CNavLink>{" "}
                        </Link>
                      </CNavItem>
                      <CNavItem>
                        <Link
                          style={{ cursor: "pointer", textDecoration: "none" }}
                          to={`/admin/inactiveuserlist`}
                        >
                          <CNavLink style={{ cursor: "pointer" }}>
                            Inactive Users
                          </CNavLink>{" "}
                        </Link>
                      </CNavItem>
                      <CNavItem>
                        <Link
                          style={{ cursor: "pointer", textDecoration: "none" }}
                          to={`/admin/deleteduserlist`}
                        >
                          <CNavLink active style={{ cursor: "pointer" }}>
                            <strong>Deleted Users</strong>
                          </CNavLink>{" "}
                        </Link>
                      </CNavItem>
                      <CNavItem>
                        <Link
                          style={{ cursor: "pointer", textDecoration: "none" }}
                          to={`/admin/archiveduserlist`}
                        >
                          <CNavLink style={{ cursor: "pointer" }}>
                            Archived Users
                          </CNavLink>
                        </Link>
                      </CNavItem>
                    </CNav>
                    <CTabContent className="rounded-bottom">
                      <CTabPane className="p-3 preview" visible>
                        <div className="card-header border-0 d-flex align-items-center">
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
                          <div
                            className="d-grid gap-2 d-md-flex justify-content-md-end"
                            style={{ marginLeft: 750 }}
                          ></div>
                          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <Button
                              title="Export Users"
                              style={{ height: "40px" }}
                              icon="pi pi-upload"
                              className="btn btn-info"
                              onClick={exportCSV}
                            />
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
                          field="firstName"
                          header="Name"
                          sortable
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="email"
                          header="Email"
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="phone"
                          header="Contact"
                          style={{ width: "15%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="organizationName"
                          header="Organization"
                          style={{ width: "15%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="roleName"
                          header="User Role"
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="Status"
                          header="Status"
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
                    <DataTable
                      ref={dt}
                      value={responseData}
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
                      dataKey="userId"
                      filters={filters}
                      filterDisplay="menu"
                      globalFilterFields={[
                        "firstName",
                        "email",
                        "phone",
                        "roleName",
                        "organizationName",
                        "isActive",
                      ]}
                    >
                      <Column
                        body={name}
                        field="firstName"
                        header="Name"
                        sortable
                      ></Column>
                      <Column field="email" header="Email"></Column>
                      <Column field="phone" header="Contact"></Column>
                      <Column
                        field="organizationName"
                        header="Organization "
                        filterMenuStyle={{ width: "14rem" }}
                        style={{ minWidth: "7rem" }}
                      ></Column>
                      <Column field="roleName" header="User Role"></Column>
                      <Column
                        body={active}
                        field="isActive"
                        header="Status"
                      ></Column>
                      <Column header="Action" body={buttonTemplate}></Column>
                    </DataTable>
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
                      <span>Are you sure you want to delete Permanently ?</span>
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
export default Deleteduser;
