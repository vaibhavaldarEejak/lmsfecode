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
  CImage,
  CFormCheck,
  CBadge,
} from "@coreui/react";
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
import generalDeleteApiCall from "src/server/generalDeleteApiCall";
import getApiCall from "src/server/getApiCall";

const API_URL = process.env.REACT_APP_API_URL;

const manageNotificationsListingWidget = () => {
  const [agreement, setAgreement] = useState({ notificationIds: [] });
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const toast = useRef(null);

  useEffect(() => {
    getNotificationListing();
    initFilters();
  }, []);

  const [responseData, setResponseData] = useState(null);
  const [payload, setPayload] = useState([
    {
      groups: [],
      users: [
        {
          userId: 0,
          checked: 0,
        },
      ],
    },
  ]);

  const getNotificationListing = async () => {
    try {
      const res = await getApiCall("getNotificationList");
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

  const deleteNotifications = async (notificationId) => {
    const data = {
      notificationId: notificationId,
    };

    try {
      const res = await generalDeleteApiCall("deleteNotification", data);
      const filteredData = responseData.filter(
        (item) => item.notificationId !== notificationId
      );
      setResponseData(filteredData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Notification deleted successfully!",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Deleting Notification",
        life: 3000,
      });
    }
    setDeleteProductDialog(false);
  };

  function handleCheckboxChange(rowData, field, event) {
    const isChecked = event.target.checked ? 1 : 0;

    setPayload([
      {
        groups: agreement.groups,
      },
    ]);
  }

  const statusShow = (responseData) =>
    responseData?.isActive === 1 ? "Active" : "In-Active";

  const notificationName = (responseData) => (
    <>{responseData.notificationName ? responseData.notificationName : "-"}</>
  );

  const notificationType = (responseData) => (
    <>{responseData.notificationType ? responseData.notificationType : "-"}</>
  );

  const emailUsers = () => (
    <>
      <Button>Notify Incomplete Users</Button>
      {/* {responseData.subject ? responseData.subject : "-"} */}
    </>
  );

  const subject = (responseData) => (
    <>{responseData.subject ? responseData.subject : "-"}</>
  );
  const status = (responseData) => (
    <>
      <CBadge className="badge badge-light-info text-info" color="light">
        {responseData.subject ? responseData.subject : "-"}
      </CBadge>
    </>
  );

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <CImage
        src="/custom_icon/bin.svg"
        className="me-3"
        alt="bin.svg"
        style={{ height: "25px", cursor: "pointer" }}
        title="Delete"
        onClick={() => confirmDeleteProduct(responseData)}
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
        onClick={() => deleteNotifications(selectedProduct.notificationId)}
      />
    </React.Fragment>
  );

  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [loading, setLoading] = useState(true);

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
    });
    setGlobalFilterValue("");
  };
  const items = Array.from({ length: 10 }, (v, i) => i);

  const handleChange = (e) => {
    const { value, checked } = e.target;
    const { notificationIds } = agreement;

    if (checked) {
      setAgreement({ notificationIds: [...notificationIds, value] });
    } else {
      setAgreement({
        notificationIds: notificationIds.filter((e) => e !== value),
      });
    }
  };

  const checkbox1 =
    responseData &&
    ((e) => (
      <>
        <input
          class="form-check-input"
          type="checkbox"
          value={e.notificationId}
          onChange={(event) => handleChange(event)}
          style={{ marginTop: "11px" }}
        />
      </>
    ));

  const bulkDeleteCredentials = async () => {
    try {
      const res = await generalDeleteApiCall(
        "bulkDeleteNotification",
        agreement
      );
      const filteredData = responseData.filter(
        (item) => item.roleId !== roleId
      );
      setResponseData(filteredData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Notification  deleted successfully!",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Deleting Notification",
        life: 3000,
      });
    }
  };

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
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
                      {/* <CIcon icon={cilMediaPlay} className="me-2" /> */}
                      <strong>Notifications</strong>
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
              <Toast ref={toast} />
              {!responseData ? (
                <div className="card">
                  <DataTable
                    value={items}
                    showGridlines
                    className="p-datatable-striped"
                  >
                    <Column
                      body={notificationName}
                      header="Assignment Name"
                      sortable
                    ></Column>
                    <Column body={notificationType} header="Users"></Column>
                    <Column body={subject} header="Due Date" field=""></Column>
                    <Column
                      body={notificationType}
                      header="Created Date"
                    ></Column>
                    <Column body={subject} header="Created By"></Column>
                    <Column
                      body={notificationType}
                      header="User Progress"
                    ></Column>
                    <Column body={subject} header="Status"></Column>
                    <Column body={emailUsers} header="Email Users"></Column>
                    <Column
                      field="Action"
                      header="Action"
                      body={buttonTemplate}
                    ></Column>
                  </DataTable>
                </div>
              ) : (
                <DataTable
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
                  dataKey="notificationId"
                  filters={filters}
                  filterDisplay="menu"
                  globalFilterFields={[
                    "Assignment",
                    "Users",
                    "Due Date",
                    "Created Date",
                    "Created By",
                    "User Progress",
                    "Status",
                    "Email Users",
                    "Delete",
                  ]}
                >
                  <Column
                    body={checkbox1}
                    style={{ maxWidth: "2.7rem" }}
                  ></Column>
                  <Column
                    body={notificationName}
                    header="Assignment Name"
                    sortable
                  ></Column>
                  <Column body={notificationType} header="Users"></Column>
                  <Column body={subject} header="Due Date"></Column>
                  <Column
                    body={notificationType}
                    header="Created Date"
                  ></Column>
                  <Column body={subject} header="Created By"></Column>
                  <Column
                    body={notificationType}
                    header="User Progress"
                  ></Column>
                  <Column body={status} header="Status"></Column>
                  <Column body={emailUsers} header="Email Users"></Column>
                  <Column
                    field="Action"
                    header="Action"
                    body={buttonTemplate}
                  ></Column>
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
export default manageNotificationsListingWidget;
