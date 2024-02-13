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
  CFormInput,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilColorBorder, cilTrash } from "@coreui/icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import "../../css/table.css";
const API_URL = process.env.REACT_APP_API_URL;

const ArchivedCredentialList = () => {
  const toast = useRef(null);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const token = "Bearer " + localStorage.getItem("ApiToken");
  useEffect(() => {
    if (token !== "Bearer null") {
      getArchiveUserListing();
      initFilters();
    }
  }, []);

  const [responseData, setResponseData] = useState(null);
  const getArchiveUserListing = () => {
    axios
      .get(`${API_URL}/getCredentialList/?status=archived`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        setResponseData(response.data.data);
      });
  };
  const activeuser = (credentialId) => {
    const data = {
      credentialId: credentialId,
    };

    axios
      .post(`${API_URL}/activeCredential`, data, {
        headers: { Authorization: token },
      })
      .then((response) => {
        const filteredData = responseData.filter(
          (item) => item.credentialId !== credentialId
        );
        setResponseData(filteredData);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "User is Activated Successful!",
          life: 3000,
        });
        getArchiveUserListing();
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error Activating user",
          life: 3000,
        });
      });
  };

  const Deleteuser = (credentialId) => {
    const data = {
      credentialId: credentialId,
    };
    axios
      .post(`${API_URL}/deleteCredential/?_method=DELETE`, data, {
        headers: { Authorization: token },
      })
      .then((response) => {
        const filteredData = responseData.filter(
          (item) => item.credentialId !== credentialId
        );
        setResponseData(filteredData);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Archived User Deleted Successful!",
          life: 3000,
        });
        getArchiveUserListing();
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error Deleting Archived user",
          life: 3000,
        });
      });
    setDeleteProductDialog(false);
  };

  const active = (responseData) => (
    <>
      <CBadge className="badge badge-light-info text-primary" color="light">
        {responseData?.isActive === 1 ? "Active" : "Archived"}
      </CBadge>
    </>
  );

  const [agreement, setAgreement] = useState({ credentialIds: [] });

  const handleChange = (e) => {
    const { value, checked } = e.target;
    const { credentialIds } = agreement;
    if (checked) {
      setAgreement({ credentialIds: [...credentialIds, value] });
    } else {
      setAgreement({
        credentialIds: credentialIds.filter((e) => e !== value),
      });
    }
  };

  const checkbox1 =
    responseData &&
    ((e) => (
      <>
        <input
          type="checkbox"
          className="form-check-input"
          id="flexCheckDefault"
          onChange={(event) => handleChange(event)}
          value={e.credentialId}
          style={{ marginTop: "11px" }}
        />
      </>
    ));

  const statusShow = (responseData) =>
    responseData?.isActive === 1 ? (
      <CBadge className="badge badge-light-info text-info" color="light">
        {responseData?.isActive === 1 ? "Active" : "In-Active"}
      </CBadge>
    ) : (
      <CBadge className="badge badge-light-info text-secondary" color="light">
        {responseData?.isActive === 1 ? "Active" : "In-Active"}
      </CBadge>
    );

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <CImage
        src="/custom_icon/arr013.svg"
        className="me-3"
        alt="arr013.svg"
        style={{ height: "22px", cursor: "pointer" }}
        title="Activate User"
        onClick={() => activeuser(responseData.credentialId)}
      />
      <CImage
        src="/custom_icon/bin.svg"
        className="me-3"
        alt="bin.svg"
        style={{ height: "20px", cursor: "pointer" }}
        title="Delete User"
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
        onClick={() => Deleteuser(selectedProduct.credentialId)}
      />
    </React.Fragment>
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
      credentialTitle: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      credentialId: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
        credentialId: "global",
      },
    });
    setGlobalFilterValue("");
  };

  const credentialTitleRowFilterTemplate = (options) => {
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

  const credentialCodeRowFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search by ID"
        className="p-column-filter"
        style={{
          height: "2rem",
          maxWidth: "10rem",
          paddingTop: "2px", // add padding to top
          lineHeight: "1.5", // reduce line height
        }}
      />
    );
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
        <CCol xs={12} style={{padding: "1px"}}>
          <CCard className="mb-7 card-ric">
            <div>
              <CCardHeader className="p-0">
                <CNav variant="tabs">
                  <CNavItem>
                    <Link
                      style={{ cursor: "pointer", textDecoration: "none" }}
                      to={`/superadmin/credentiallist`}
                    >
                      <CNavLink style={{ cursor: "pointer" }}>
                        Credentials
                      </CNavLink>{" "}
                    </Link>
                  </CNavItem>
                  <CNavItem>
                    <Link
                      style={{ cursor: "pointer", textDecoration: "none" }}
                      to={`/superadmin/deletedlist`}
                    >
                      <CNavLink style={{ cursor: "pointer" }}>
                        Deleted Credentials
                      </CNavLink>{" "}
                    </Link>
                  </CNavItem>
                  <Link
                    style={{ cursor: "pointer", textDecoration: "none" }}
                    to={`/superadmin/archivedlist`}
                  >
                    <CNavLink active style={{ cursor: "pointer" }}>
                      <strong>Archived Credentials</strong>
                    </CNavLink>
                  </Link>
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
                        style={{ marginLeft: 794 }}
                      ></div>
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
                      field="credentialTitle"
                      header="Credential Title"
                      sortable
                      style={{ width: "25%" }}
                      body={bodyTemplate}
                    ></Column>
                    <Column
                      field="credentialId"
                      header="Credential ID"
                      style={{ width: "25%" }}
                      body={bodyTemplate}
                    ></Column>
                    <Column
                      field="categoryName"
                      header="Category"
                      style={{ width: "15%" }}
                      body={bodyTemplate}
                    ></Column>
                    <Column
                      field="expirationTime"
                      header="Expiration Time"
                      style={{ width: "15%" }}
                      body={bodyTemplate}
                    ></Column>

                    <Column
                      field="isActive"
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
                  dataKey="credentialId"
                  filters={filters}
                  filterDisplay="row"
                  globalFilterFields={[
                    "credentialTitle",
                    "credentialId",
                    "categoryName",
                    "expirationTime",
                    "isActive",
                    "Action",
                  ]}
                >
                  <Column
                    field="credentialTitle"
                    header="Credential Title"
                    style={{ minWidth: "14rem" }}
                    showFilterMenu={false}
                    filter
                    filterElement={credentialTitleRowFilterTemplate}
                    filterMenuStyle={{ width: "14rem" }}
                  ></Column>
                  <Column
                    field="credentialId"
                    header="Credential ID"
                    style={{ minWidth: "14rem" }}
                    showFilterMenu={false}
                    filter
                    filterElement={credentialCodeRowFilterTemplate}
                    filterMenuStyle={{ width: "14rem" }}
                  ></Column>
                  <Column field="categoryName" header="Category"></Column>
                  <Column
                    field="expirationTime"
                    header="Expiration Time"
                  ></Column>

                  <Column body={active} header="Status"></Column>
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
    </div>
    </div>
  );
};
export default ArchivedCredentialList;
