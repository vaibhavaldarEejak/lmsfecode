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
  CBadge,
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
import postApiCall from "src/server/postApiCall";
const API_URL = process.env.REACT_APP_API_URL;

const manageNotificationsListingWidget = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken"),
    [activeInactiveProductDialog, setactiveInactiveProductDialog] =
      useState(false),
    [selectedProduct, setSelectedProduct] = useState(null),
    [resetProductDialog, setResetProductDialog] = useState(false),
    toast = useRef(null),
    colorName = localStorage.getItem("ThemeColor"),
    [themes, setThemes] = useState(colorName);

  useEffect(() => {
    if (token !== "Bearer null") {
      getNotificationListing();
      initFilters();
    }
  }, []);

  const [responseData, setResponseData] = useState(null);

  const getNotificationListing = async () => {
    try {
      const res = await getApiCall("getOrganizationNotificationList");
      setResponseData(res);
    } catch (err) {
      console.log(err);
    }
  };

  const notificationName = (responseData) => (
    <>{responseData.notificationName ? responseData.notificationName : "-"}</>
  );

  const notificationType = (responseData) => (
    <>{responseData.notificationType ? responseData.notificationType : "-"}</>
  );

  const notificationEventName = (responseData) => (
    <>
      {responseData.notificationEventName
        ? responseData.notificationEventName
        : "-"}
    </>
  );

  const subject = (responseData) => (
    <>{responseData.subject ? responseData.subject : "-"}</>
  );

  const dataReset = async (id) => {
    const data = {
      notificationId: id,
    };

    try {
      const res = await postApiCall("resetOrganizationNotification", data);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Notification Reset Successfully",
        life: 3000,
      });
      setResetProductDialog(false);
      setTimeout(() => {
        window.location.reload();
      }, [2000]);
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Resetting Notification",
        life: 3000,
      });
    }
  };

  const activeInactiveNotification = async (notificationId) => {
    const data = {
      notificationId: notificationId,
    };

    try {
      const res = await postApiCall("activeInactiveNotification", data);
      const filteredData = responseData.filter(
        (item) => item.notificationId !== notificationId
      );
      setResponseData(filteredData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Notification activated successfully!",
        life: 3000,
      });
      setactiveInactiveProductDialog(false);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error activating Notification",
        life: 3000,
      });
    }
  };

  const statusShow = (responseData) => (
    <>
      {responseData.isActive === 1 && (
        <>
          <CBadge
            className={`badge badge-light-info text-info badgeColor${themes} `}
            color="light"
            onClick={() => confirmActiveProduct(responseData)}
            style={{ cursor: "pointer" }}
          >
            Active
          </CBadge>
        </>
      )}

      {responseData.isActive === 2 && (
        <>
          <CBadge
            className={`badge badge-light-info text-info badgeColor${themes} `}
            color="light"
            onClick={() => confirmActiveProduct(responseData)}
            style={{ cursor: "pointer" }}
          >
            Inactive
          </CBadge>
        </>
      )}
    </>
  );

  const resetShow = (responseData) => (
    <>
      {responseData.isModified === 1 && (
        <>
          <CBadge
            className={`badge badge-light-info text-info badgeColor${themes} `}
            color="light"
            onClick={() => confirmResetProduct(responseData)}
            style={{ cursor: "pointer" }}
          >
            Reset to Default
          </CBadge>
        </>
      )}

      {responseData.isModified === 0 && (
        <>
          <CBadge
            className={`badge badge-light-info text-info badgeColor${themes} `}
            color="light"
          >
            Default
          </CBadge>
        </>
      )}
    </>
  );

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <Link
        to={`/admin/viewnotification`}
        onClick={() => {
          localStorage.setItem("notificationId1", responseData.notificationId);
        }}
      >
        <CImage
          src="/custom_icon/eye.svg"
          style={{ height: "28px" }}
          alt="eye_icon"
          className="me-2"
          title="View Notification"
        />
      </Link>

      <Link
        to={`/admin/addeditviewnotification?${responseData.notificationId}`}
        onClick={() => {
          localStorage.setItem("notificationId", responseData.notificationId);
        }}
      >
        <CImage
          src="/custom_icon/edit.svg"
          alt="edit.svg"
          style={{ height: "25px" }}
          className="me-2"
          title="Edit Notification"
        />
      </Link>
    </div>
  );

  const confirmResetProduct = (product) => {
    setSelectedProduct(product);
    setResetProductDialog(true);
  };
  const confirmActiveProduct = (product) => {
    setSelectedProduct(product);
    setactiveInactiveProductDialog(true);
  };
  const hideActiveInactiveProductDialog = () => {
    setactiveInactiveProductDialog(false);
  };
  const hideResetProductDialog = () => {
    setResetProductDialog(false);
  };

  const activeInactiveProductDialogFooter = () => (
    <React.Fragment>
      <Button
        label="No"
        size="sm"
        icon="pi pi-times"
        outlined
        onClick={hideActiveInactiveProductDialog}
      />
      <Button
        label="Yes"
        size="sm"
        icon="pi pi-check"
        severity="info"
        onClick={() =>
          activeInactiveNotification(selectedProduct.notificationId)
        }
      />
    </React.Fragment>
  );

  const resetProductDialogFooter = () => (
    <React.Fragment>
      <Button
        label="No"
        size="sm"
        icon="pi pi-times"
        outlined
        onClick={hideResetProductDialog}
      />
      <Button
        label="Yes"
        size="sm"
        icon="pi pi-check"
        severity="info"
        onClick={() => dataReset(selectedProduct.notificationId)}
      />
    </React.Fragment>
  );

  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

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
      notificationName: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      notificationType: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      notificationEventName: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      subject: {
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

  const notificationNameFilterTemplate = (options) => {
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
  const notificationTypeFilterTemplate = (options) => {
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
  const subjectFilterTemplate = (options) => {
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
                          <div className="d-flex justify-content-end">
                            <div className="d-grid gap-2 d-md-flex"></div>
                            <div className="d-grid gap-2 d-md-flex"></div>
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
                          field="notificationName"
                          header="Notification Name"
                          sortable
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="notificationType"
                          header="Notification Type"
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="notificationType"
                          header="Notification Event"
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="subject"
                          header="Notification Subject"
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="isActive"
                          header="Status"
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="Reset"
                          header="Reset"
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
                      dataKey="notificationId"
                      filters={filters}
                      filterDisplay="row"
                      globalFilterFields={[
                        "notificationName",
                        "notificationType",
                        "subject",
                        "Action",
                        "isActive",
                      ]}
                    >
                      <Column
                        body={notificationName}
                        header="Notification Name"
                        sortable
                        showFilterMenu={false}
                        filter
                        field="notificationName"
                        filterElement={notificationNameFilterTemplate}
                        filterPlaceholder="Search"
                      ></Column>
                      <Column
                        body={notificationType}
                        header="Notification Type"
                        showFilterMenu={false}
                        filter
                        field="notificationType"
                        filterElement={notificationTypeFilterTemplate}
                        filterPlaceholder="Search"
                      ></Column>
                      <Column
                        body={notificationEventName}
                        header="Notification Event"
                        showFilterMenu={false}
                        filter
                        field="notificationEventName"
                        filterElement={notificationTypeFilterTemplate}
                        filterPlaceholder="Search"
                      ></Column>
                      <Column
                        body={subject}
                        showFilterMenu={false}
                        filter
                        field="subject"
                        filterElement={subjectFilterTemplate}
                        filterPlaceholder="Search"
                        header="Notification Subject"
                      ></Column>
                      <Column body={statusShow} header="Status"></Column>
                      <Column body={resetShow} header="Reset"></Column>
                      <Column
                        field="Action"
                        header="Action"
                        body={buttonTemplate}
                      ></Column>
                    </DataTable>
                  )}

                  <Dialog
                    visible={activeInactiveProductDialog}
                    style={{ width: "32rem" }}
                    breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                    header="Confirm"
                    modal
                    footer={activeInactiveProductDialogFooter}
                    onHide={hideActiveInactiveProductDialog}
                  >
                    <div className="confirmation-content">
                      <i
                        className="pi pi-exclamation-triangle me-3 mt-2"
                        style={{ fontSize: "1.5rem" }}
                      />
                      <span>
                        Are you sure you want to activate/deactivate the
                        notification to default value?
                      </span>
                    </div>
                  </Dialog>

                  <Dialog
                    visible={resetProductDialog}
                    style={{ width: "32rem" }}
                    breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                    header="Confirm"
                    modal
                    footer={resetProductDialogFooter}
                    onHide={hideResetProductDialog}
                  >
                    <div className="confirmation-content">
                      <i
                        className="pi pi-exclamation-triangle me-3 mt-2"
                        style={{ fontSize: "1.5rem" }}
                      />
                      <span>
                        Are you sure you want to reset the notification to
                        default value?
                      </span>
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
export default manageNotificationsListingWidget;
