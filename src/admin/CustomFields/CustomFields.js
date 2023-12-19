import React, { useRef, useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CNav,
  CImage,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CBadge,
} from "@coreui/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import TableSkeletonLoader from "./TableSkeletonLoader";
import axios from "axios";
import getApiCall from "src/server/getApiCall";
import generalDeleteApiCall from "src/server/generalDeleteApiCall";

const API_URL = process.env.REACT_APP_API_URL;
function CustomFields() {
  useEffect(() => {
    initFilters();
  }, []);

  const [responseData, setResponseData] = useState(null);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  const toast = useRef(null);

  const token = "Bearer " + localStorage.getItem("ApiToken");

  useEffect(() => {
    getCustomFieldListing();
  }, []);

  const getCustomFieldListing = async () => {
    try {
      const res = await getApiCall("getOrgCustomFieldList");
      setResponseData(res);
    } catch (err) {}
  };

  const statusShow = (responseData) => (
    <CBadge
      className={`badge badge-light-info text-info badgeColor${themes} `}
      color="light"
    >
      {responseData?.isActive === 1 ? "Active" : "In-Active"}
    </CBadge>
  );

  const Deletemedia = async (fieldId) => {
    try {
      const res = await generalDeleteApiCall(
        "deleteOrgCustomFieldById",
        {},
        fieldId
      );
      const filteredData = responseData.filter((item) => item.id !== fieldId);
      setResponseData(filteredData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Custom field deleted successfully!",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Deleting Custom field",
        life: 3000,
      });
    }

    setDeleteProductDialog(false);
  };

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <Link
        to={`/admin/customfieldview`}
        onClick={() => {
          localStorage.setItem("FieldID", responseData.id);
        }}
      >
        <CImage
          src="/custom_icon/eye.svg"
          style={{ height: "25px" }}
          className="me-2"
          alt="eye.svg"
          title="View"
        />
      </Link>
      <Link
        to={`/admin/editcustomfield`}
        onClick={() => {
          localStorage.setItem("FieldID", responseData.id);
        }}
      >
        <CImage
          src="/custom_icon/edit.svg"
          className="me-2"
          alt="edit.svg"
          style={{ height: "24px" }}
          title="Edit Credential"
        />
      </Link>
      <CImage
        src="/custom_icon/bin.svg"
        className="me-3"
        alt="bin.svg"
        style={{ height: "22px", cursor: "pointer" }}
        onClick={() => confirmDeleteProduct(responseData.id)}
        title="Delete"
      />
    </div>
  );

  const confirmDeleteProduct = (product) => {
    console.log({ confirm: product });
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
        onClick={() => {
          console.log({ selectedProduct }), Deletemedia(selectedProduct);
        }}
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
    });
    setGlobalFilterValue("");
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
                      <strong>Custom Fields</strong>
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
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <Link
                          to={`/admin/addeditcustomfield`}
                          className="me-md-2 btn btn-info"
                          title="Add New Custom Fields"
                        >
                          +
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
                  <TableSkeletonLoader />
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
                  dataKey="contentId"
                  filters={filters}
                  filterDisplay="menu"
                >
                  <Column
                    field="fieldName"
                    header="Field Name"
                    sortable
                  ></Column>
                  <Column field="labelName" header="Field Label"></Column>
                  <Column field="customFieldType" header="Field Type"></Column>
                  <Column body={statusShow} header="Status"></Column>
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
}

export default CustomFields;
