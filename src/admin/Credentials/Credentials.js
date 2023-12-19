// import React from "react";
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
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CFormInput,
} from "@coreui/react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;
import { useNavigate } from "react-router-dom";
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
import "../../css/table.css";

const Credentials = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const navigate = useNavigate();
  useEffect(() => {
    if (token !== "Bearer null") {
      getCredentialListings();
      initFilters();
    }
  }, []);

  const [responseData, setResponseData] = useState(null);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const toast = useRef(null);

  const getCredentialListings = () => {
    axios
      .get(`${API_URL}/getCredentialList`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        setResponseData(response.data.data);
      });
  };

  const deleteCredentials = (credentialId) => {
    const data = {
      credentialId: credentialId,
    };

    axios
      .post(`${API_URL}/deleteCredential/?_method=DELETE`, data, {
        headers: { Authorization: token },
        "content-type": "multipart/form-data",
      })
      .then((response) => {
        const filteredData = responseData.filter(
          (item) => item.credentialId !== credentialId
        );
        setResponseData(filteredData);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Credentials deleted successfully!",
          life: 3000,
        });
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error Deleting Credentials",
          life: 3000,
        });
      });
    setDeleteProductDialog(false);
  };

  //Bulk Archieve Credentials
  const bulkArchieveCredentials = () => {
    const data = agreement;

    axios
      .post(`${API_URL}/bulkArchiveCredential`, data, {
        headers: { Authorization: token },
      })
      .then((response) => {
        getCredentialListings();

        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Credentials Archieved successfully!",
          life: 3000,
        });
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error Archieving Credentials",
          life: 3000,
        });
      });
  };

  //Bulk Delete Credentials
  const bulkDeleteCredentials = () => {
    console.log("inside bulk delete");

    const data = agreement;

    axios
      .post(`${API_URL}/bulkDeleteCredential/?_method=DELETE`, data, {
        headers: { Authorization: token },
        "content-type": "multipart/form-data",
      })
      .then((response) => {
        getCredentialListings();

        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Credentials deleted successfully!",
          life: 3000,
        });
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error Deleting Credentials",
          life: 3000,
        });
      });
  };

  const statusShow = (responseData) => {
    if (responseData?.status === "Draft") {
      return (
        <CBadge className="badge badge-light-info text-info" color="light">
          Draft
        </CBadge>
      );
    } else if (responseData?.status === "Published") {
      return (
        <CBadge className="badge badge-light-info text-info" color="light">
          Published
        </CBadge>
      );
    } else if (responseData?.status === "Unpublished") {
      return (
        <CBadge className="badge badge-light-info text-info" color="light">
          Unpublished
        </CBadge>
      );
    } else if (responseData?.status === "Archived") {
      return (
        <CBadge className="badge badge-light-info text-info" color="light">
          Archived
        </CBadge>
      );
    } else {
      return (
        <CBadge className="badge badge-light-info text-info" color="light">
          Deleted
        </CBadge>
      );
    }
  };

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <Link
        to={`/admin/viewcredentials`}
        onClick={() => {
          localStorage.setItem("credentialId", responseData.credentialId);
        }}
      >
        <CImage
          src="/custom_icon/eye.svg"
          className="me-1"
          alt="eye_icon"
          style={{ height: "28px", cursor: "pointer" }}
          title="View Credential"
        />
      </Link>
      <Link
        to={`/admin/editcredentials?${responseData.credentialId}`}
        onClick={() => {
          localStorage.setItem("credentialId", responseData.credentialId);
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
        style={{ height: "24px", cursor: "pointer" }}
        onClick={() => confirmDeleteProduct(responseData)}
        title="Delete Credential"
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
        onClick={() => deleteCredentials(selectedProduct.credentialId)}
      />
    </React.Fragment>
  );

  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [agreement, setAgreement] = useState({ credentialIds: [] });

  const clearFilter = () => {
    initFilters();
  };

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
      credentialCode: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
        credentialCode: "global",
      },
      categoryName: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
        categoryName: "global",
      },
    });
    setGlobalFilterValue("");
  };
  const items = Array.from({ length: 10 }, (v, i) => i);

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
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

  const credentialTitleRowFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search Title"
        className="p-column-filter"
        showClear
        style={{
          height: "2rem",
          maxWidth: "10rem",
          //padding: "0.25rem 1rem",
          lineHeight: "4px",
        }}
      />
    );
  };

  const credentialCodeRowFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        editable
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search Code"
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

  const categoryRowFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        editable
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search Category"
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

  return (
    <div>
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
                          to={`/admin/credentials`}
                        >
                          <CNavLink active style={{ cursor: "pointer" }}>
                            <strong>Credentials</strong>
                          </CNavLink>
                        </Link>
                      </CNavItem>
                      <CNavItem>
                        <Link
                          style={{ cursor: "pointer", textDecoration: "none" }}
                          to={`/admin/deletedlist`}
                        >
                          <CNavLink style={{ cursor: "pointer" }}>
                            Deleted Credentials
                          </CNavLink>{" "}
                        </Link>
                      </CNavItem>
                      <CNavItem>
                        <Link
                          style={{ cursor: "pointer", textDecoration: "none" }}
                          to={`/admin/archivedlist`}
                        >
                          <CNavLink style={{ cursor: "pointer" }}>
                            Archived Credentials
                          </CNavLink>{" "}
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
                          <div className="d-flex justify-content-end">
                            <div className="d-grid gap-2 d-md-flex">
                              <Link
                                to={`/admin/addcredentials`}
                                className="me-md-2 btn btn-info"
                                title="Add New Credential"
                              >
                                + &nbsp; Add Courses
                              </Link>
                            </div>
                            <div className="d-grid gap-2 d-md-flex">
                              <CDropdown>
                                <CDropdownToggle
                                  color="primary"
                                  className="me-md-2 btn btn-info"
                                  title=""
                                >
                                  Bulk Option
                                </CDropdownToggle>
                                <CDropdownMenu>
                                  <CDropdownItem
                                    onClick={(e) => bulkArchieveCredentials()}
                                  >
                                    Bulk Archive
                                  </CDropdownItem>
                                  <CDropdownItem
                                    onClick={(e) => bulkDeleteCredentials()}
                                  >
                                    Bulk Delete
                                  </CDropdownItem>
                                </CDropdownMenu>
                              </CDropdown>
                            </div>
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
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="expirationTime"
                          header="Expiration Time"
                          style={{ width: "10%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="isActive"
                          header="Status"
                          style={{ width: "10%" }}
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
                      emptyMessage="No records found"
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
                        "credentialCode",
                        "categoryName",
                        "expirationTime",
                        "isActive",
                        "Action",
                      ]}
                    >
                      <Column
                        // selectionMode="multiple"
                        // headerStyle={{ width: "3rem" }}
                        body={checkbox1}
                        style={{ maxWidth: "2.7rem" }}
                      ></Column>
                      <Column
                        // body={(rowData) => <>{rowData.credentialTitle.join(",")}</>}
                        field="credentialTitle"
                        header="Credential Title"
                        style={{ maxWidth: "11rem" }}
                        showFilterMenu={false}
                        filter
                        filterElement={credentialTitleRowFilterTemplate}
                        filterMenuStyle={{ width: "14rem" }}
                      ></Column>
                      <Column
                        field="credentialCode"
                        header="Credential Code"
                        style={{ maxWidth: "11rem" }}
                        showFilterMenu={false}
                        filter
                        filterElement={credentialCodeRowFilterTemplate}
                        filterMenuStyle={{ width: "14rem" }}
                      ></Column>
                      <Column
                        body={(rowData) => (
                          <>{rowData.categoryName.join(",")}</>
                        )}
                        field="categoryName"
                        header="Category"
                        style={{ minWidth: "7rem" }}
                        showFilterMenu={false}
                        filter
                        filterMenuStyle={{ width: "14rem" }}

                        filterElement={categoryRowFilterTemplate}
                        // filterMenuStyle={{ width: "14rem" }}
                      ></Column>
                      {/* <Column
                        field="expirationTime"
                        header="Expiration Time"
                        // style={{ maxWidth: "10rem" }}
                      ></Column> */}
                      <Column
                        field="status"
                        body={statusShow}
                        header="Status"
                      ></Column>
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

export default Credentials;
