import React, { useRef, useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CModal,
  CButton,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CImage,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CBadge,
  CFormInput,
} from "@coreui/react";
import { Link } from "react-router-dom";
import axios from "axios";
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
import "./../../css/themes.css";
import getApiCall from "src/server/getApiCall";

import "../../css/table.css";
const API_URL = process.env.REACT_APP_API_URL;

const GenericCategoryListing = () => {
  const [selectedContent, setSelectedContent] = useState([]);

  const token = "Bearer " + localStorage.getItem("ApiToken");
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  const [filters, setFilters] = useState(null);
  const [filters2, setFilters2] = useState(null);
  const [filters3, setFilters3] = useState(null);
  const [filters4, setFilters4] = useState(null);
  const [rowClick, setRowClick] = useState(false);

  const [selectAll, setSelectAll] = useState(false);
  const [categoryId, setCategoryId] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [globalFilterValue2, setGlobalFilterValue2] = useState("");
  const [globalFilterValue3, setGlobalFilterValue3] = useState("");
  const [globalFilterValue4, setGlobalFilterValue4] = useState("");
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [resData, setResData] = useState(null);

  const [categoryPayload, setCategoryPayload] = useState([
    {
      categoryId: null,
      groups: null,
    },
  ]);
  const [responseData, setResponseData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [categoryID, setCategoryID] = useState("");

  const toast = useRef(null);

  useEffect(() => {
    if (token !== "Bearer null") {
      setTimeout(() => {
        setLoader(true);
      }, [2000]);
      getGenericCategory();
      initFilters2();
      initFilters();
      initFilters3();
      initFilters4();
    }
  }, []);

  useEffect(() => {
    if (token !== "Bearer null") {
      initFilters();
      initFilters2();
      initFilters3();
      initFilters4();
    }
  }, []);

  const categoryName = (responseData) => (
    <>{responseData.categoryName ? responseData.categoryName : "-"}</>
  );

  const categoryCode = (responseData) => (
    <>{responseData.categoryCode ? responseData.categoryCode : "-"}</>
  );

  const getGenericCategory = async () => {
    try {
      const res = await getApiCall("getOrganizationCategoryList?suAssigned=1");
      setResponseData(res);
    } catch (err) {}
  };
  const deleteCategory1 = async (categoryId) => {
    const data = {
      categoryId: categoryId,
    };
    try {
      const response = await generalDeleteApiCall(
        "deleteOrganizationCategory",
        data
      );
      const filteredData = responseData.filter(
        (item) => item.categoryId !== categoryId
      );
      setResponseData(filteredData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Category deleted successfully!",
        life: 3000,
      });
      setDeleteProductsDialog(false);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error deleting Category",
        life: 3000,
      });
    }

    setDeleteProductsDialog(false);
  };

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <CImage
        src="/custom_icon/eye.svg"
        style={{ height: "28px", cursor: "pointer" }}
        onClick={() => coursePopUp(responseData.categoryId)}
        alt="eye_icon"
        className="me-2"
        title="View Category"
      />

      <Link
        to={`/admin/categorylist/addeditcategory?${responseData.categoryId}`}
        title="Edit Category"
      >
        <CImage
          src="/custom_icon/edit.svg"
          alt="edit.svg"
          style={{ height: "25px", cursor: "pointer" }}
          className="me-2"
          title="Edit"
        />
      </Link>
      <CImage
        src="/custom_icon/bin.svg"
        className="me-3"
        alt="bin.svg"
        style={{ height: "25px", cursor: "pointer" }}
        onClick={() => confirmDeleteProducts(responseData)}
        title="Delete Category"
      />
    </div>
  );

  const coursePopUp = (id) => {
    setCategoryID(id);

    setCoursevisible(true);
  };

  const bulkDeleteCredentials = async () => {
    const data = { categoryIds: categoryId };
    try {
      const response = await generalDeleteApiCall(
        "bulkDeleteOrganizationCategory",
        data
      );
      getGenericCategory();
      if (response) {
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Categories deleted successfully!",
          life: 3000,
        });
      }
      setDeleteProductDialog(false);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Deleting Categories",
        life: 3000,
      });
    }
  };
  const confirmDeleteProducts = (products) => {
    setSelectedProducts(products);
    setDeleteProductsDialog(true);
  };
  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };
  const deleteProductsDialogFooter = () => (
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
        onClick={() => deleteCategory1(selectedProducts.categoryId)}
      />
    </React.Fragment>
  );

  const deleteProductsDialogFooter2 = () => (
    <React.Fragment>
      <Button
        label="No"
        size="sm"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductDialog2}
      />
      <Button
        label="Yes"
        size="sm"
        icon="pi pi-check"
        severity="info"
        onClick={() => bulkDeleteCredentials()}
      />
    </React.Fragment>
  );
  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };
  const hideDeleteProductDialog2 = () => {
    setDeleteProductDialog(false);
  };
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      categoryName: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      categoryCode: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
    });
    setGlobalFilterValue("");
  };

  const deletepopup = () => {
    if (categoryId.length === 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Select Categories",
        life: 3000,
      });
    } else {
      setDeleteProductDialog(true);
    }
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters2 };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const onGlobalFilterChange2 = (e) => {
    const value = e.target.value;
    let _filters2 = { ...filters2 };
    _filters2["global"].value = value;

    setFilters2(_filters2);
    setGlobalFilterValue2(value);
  };

  const onGlobalFilterChange3 = (e) => {
    const value = e.target.value;
    let _filters3 = { ...filters3 };
    _filters3["global"].value = value;

    setFilters3(_filters3);
    setGlobalFilterValue3(value);
  };

  const onGlobalFilterChange4 = (e) => {
    const value = e.target.value;
    let _filters4 = { ...filters4 };
    _filters4["global"].value = value;

    setFilters4(_filters4);
    setGlobalFilterValue4(value);
  };

  const initFilters2 = () => {
    setFilters2({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue2("");
  };

  const initFilters3 = () => {
    setFilters3({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue3("");
  };

  const initFilters4 = () => {
    setFilters4({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue4("");
  };

  const items = Array.from({ length: 10 }, (v, i) => i);

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };

  const assignedShow = (responseData) => (
    <>
      {responseData?.suAssigned === 1 ? (
        <CBadge
          className={`badge badge-light-info text-info badgeColor${themes} `}
          color="light"
        >
          Super Admin Assigned
        </CBadge>
      ) : (
        buttonTemplate(responseData)
      )}
    </>
  );

  const statusShow = (responseData) => (
    <CBadge
      className={`badge badge-light-info text-info badgeColor${themes} `}
      color="light"
    >
      {responseData?.isActive === 1 ? "Active" : "In-Active"}
    </CBadge>
  );

  const categoryNameFilterTemplate = (options) => {
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
  const categoryCodeFilterTemplate = (options) => {
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
              <CCard className="mb-7 card-ric">
                <div>
                  <CCardHeader className="p-0">
                    <CNav variant="tabs">
                      <CNavItem>
                        <Link
                          style={{ textDecoration: "none" }}
                          to="/admin/categorylist"
                        >
                          <CNavLink style={{ cursor: "pointer" }}>
                            Category
                          </CNavLink>
                        </Link>
                      </CNavItem>
                      <CNavItem>
                        <Link
                          style={{ textDecoration: "none" }}
                          to="/admin/category/assignedcategory"
                        >
                          <CNavLink active style={{ cursor: "pointer" }}>
                            <strong>Assigned Category</strong>
                          </CNavLink>
                        </Link>
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
                        </div>
                      </CTabPane>
                    </CTabContent>
                  </CCardHeader>

                  <CCardBody>
                    <Toast ref={toast} />

                    <Dialog
                      visible={deleteProductDialog}
                      style={{ width: "32rem" }}
                      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                      header="Confirm"
                      modal
                      footer={deleteProductsDialogFooter2}
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

                    <Dialog
                      visible={deleteProductDialog}
                      style={{ width: "32rem" }}
                      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                      header="Confirm"
                      modal
                      footer={deleteProductsDialogFooter2}
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

                    <Dialog
                      visible={deleteProductsDialog}
                      style={{ width: "32rem" }}
                      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                      header="Confirm"
                      modal
                      footer={deleteProductsDialogFooter}
                      onHide={hideDeleteProductsDialog}
                    >
                      <div className="confirmation-content">
                        <i
                          className="pi pi-exclamation-triangle me-3 mt-2"
                          style={{ fontSize: "1.5rem" }}
                        />
                        <span>Are you sure you want to delete ?</span>
                      </div>
                    </Dialog>

                    <div className="">
                      {!loader ? (
                        <div className="card">
                          <DataTable
                            value={items}
                            showGridlines
                            className="p-datatable-striped"
                          >
                            <Column
                              field="categoryName"
                              header="Name"
                              style={{ width: "25%" }}
                              body={bodyTemplate}
                            ></Column>
                            <Column
                              field="categoryCode"
                              header="Code"
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
                              field="Action"
                              header="Action"
                              style={{ width: "25%" }}
                              body={bodyTemplate}
                            ></Column>
                          </DataTable>
                        </div>
                      ) : (
                        <div className="card responsiveClass">
                          <DataTable
                            selectionMode={rowClick ? null : "checkbox"}
                            selection={selectedContent}
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
                            dataKey="categoryId"
                            filters={filters}
                            filterDisplay="row"
                            globalFilterFields={[
                              "categoryName",
                              "categoryId",
                              "categoryCode",
                              "isActive",
                            ]}
                          >
                            <Column
                              body={categoryName}
                              field="categoryName"
                              header="Name"
                              sortable
                              showFilterMenu={false}
                              filter
                              filterElement={categoryNameFilterTemplate}
                              filterPlaceholder="Search"
                            ></Column>
                            <Column
                              body={categoryCode}
                              field="categoryCode"
                              header="Code"
                              showFilterMenu={false}
                              filter
                              filterElement={categoryCodeFilterTemplate}
                              filterPlaceholder="Search"
                              sortable
                            ></Column>
                            <Column
                              body={statusShow}
                              field="isActive"
                              header="Status"
                            ></Column>
                          </DataTable>
                        </div>
                      )}
                    </div>
                  </CCardBody>
                </div>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </div>
    </div>
  );
};
export default GenericCategoryListing;
