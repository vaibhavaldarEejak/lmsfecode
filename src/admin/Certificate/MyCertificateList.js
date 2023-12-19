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
// import { Dropdown } from "@coreui/coreui";
import getApiCall from "src/server/getApiCall";
import generalDeleteApiCall from "src/server/generalDeleteApiCall";
import "../../css/table.css";
const API_URL = process.env.REACT_APP_API_URL,
  domainURL = window.location.origin,
  pureDomainURL = domainURL.split("/"),
  urlData = {
    isHttps: pureDomainURL[0] === "http:" ? 0 : 1,
    domainName: pureDomainURL[2],
  };

const MyCertificateListing = () => {
  const [responseData, setResponseData] = useState(null);
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const toast = useRef(null);
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const navigate = useNavigate();
  useEffect(() => {
    if (token !== "Bearer null") {
      getCertificateListing();
      initFilters();
    }
  }, []);

  const getCertificateListing = async () => {
    try {
      const response = await getApiCall("getOrgCertificateList");
      setResponseData(response);
    } catch (error) {
      console.log(error);
    }
  };

  const Deletecertificate = async (certificateId) => {
    const data = {
      certificateId: certificateId,
    };
    try {
      const response = await generalDeleteApiCall("deleteOrgCertificate", data);
      const filteredData = responseData.filter(
        (item) => item.certificateId !== certificateId
      );
      setResponseData(filteredData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Certificate deleted successfully!",
        life: 3000,
      });
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Deleting Certificate",
        life: 3000,
      });
    }

    setDeleteProductDialog(false);
  };
  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <div
        title="View Certificate"
        onClick={() => {
          localStorage.setItem("certificateId", responseData.certificateId);
          navigate(`/admin/certificatelist/viewcertificate`);
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
        title="Edit Certificate"
        to={`/admin/certificatelist/addcertificate`}
        onClick={() => {
          localStorage.setItem("certificateId", responseData.certificateId);
          navigate(`/admin/certificatelist/addcertificate`);
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
        title="Delete Certificate"
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
        outlined
        className={`saveButtonTheme${themes}`}
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Yes"
        size="sm"
        icon="pi pi-check"
        severity="info"
        onClick={() => Deletecertificate(selectedProduct.certificateId)}
      />
    </React.Fragment>
  );

  const certificate = (responseData) => (
    <>{responseData.certificateName ? responseData.certificateName : "-"}</>
  );

  const certificatecode = (responseData) => (
    <>{responseData.certificateCode ? responseData.certificateCode : "-"}</>
  );

  const description = (responseData) => (
    <>{responseData.description ? responseData.description : "-"}</>
  );

  const checkboxHeader = () => {
    return (
      <input
        class="form-check-input"
        type="checkbox"
        checked={selectAll}
        onChange={handleSelectAll}
      />
    );
  };

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
      certificateName: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      certificateCode: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },

      description: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
    });
    setGlobalFilterValue("");
  };
  const items = Array.from({ length: 10 }, (v, i) => i);

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };

  const [rowClick, setRowClick] = useState(false);
  const [selectedOrgs, setSelectedOrgs] = useState([]);

  const certificateNameFilterTemplate = (options) => {
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

  const certificateCodeFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        editable
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search "
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
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  return (
    <div className={`parentClass${themes}`}>
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
                          to="/admin/certificatelist"
                        >
                          <CNavLink style={{ cursor: "pointer" }}>
                            {/* <CIcon icon={cilMediaPlay} className="me-2" /> */}
                            Assigned Certificates
                          </CNavLink>
                        </Link>
                      </CNavItem>
                      <CNavItem>
                        <Link
                          style={{ textDecoration: "none" }}
                          to="/admin/certificatelist/mycertificatelist"
                        >
                          <CNavLink active style={{ cursor: "pointer" }}>
                            {/* <CIcon icon={cilMediaPlay} className="me-2" /> */}
                            <strong>My Certificates</strong>
                          </CNavLink>
                        </Link>
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
                          <div className="d-grid gap-2 d-md-flex justify-content-md-end align-items-center">
                            <Link
                              to={`/admin/certificatelist/addcertificate`}
                              className={`me-md-2 btn btn-info saveButtonTheme${themes}`}
                              title="Add New Certificate"
                            >
                              + &nbsp; Add New Certificate
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
                          field="certificateName"
                          header="Certificate Name"
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="certificateCode"
                          header="Certificate Code"
                          sortable
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="description"
                          header="Description"
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
                          "certificateName",
                          "certificateCode",
                          "description",
                          "Action",
                        ]}
                        selectionMode={rowClick ? null : "checkbox"}
                        selection={selectedOrgs}
                        onSelectionChange={(e) => {
                          setSelectedOrgs(e.value);
                        }}
                      >
                        <Column
                          body={certificate}
                          field="certificateName"
                          header="Certificate Name"
                          sortable
                          showFilterMenu={false}
                          filter
                          filterElement={certificateNameFilterTemplate}
                          filterPlaceholder="Search"
                          style={{ maxWidth: "9rem" }}
                        ></Column>
                        <Column
                          body={certificatecode}
                          header="Certificate Code"
                          field="certificateCode"
                          sortable
                          showFilterMenu={false}
                          filter
                          filterElement={certificateCodeFilterTemplate}
                          filterPlaceholder="Search by Code"
                          style={{ maxWidth: "7rem" }}
                        ></Column>
                        <Column
                          field="description"
                          body={description}
                          sortable
                          showFilterMenu={false}
                          filter
                          filterElement={certificateCodeFilterTemplate}
                          filterPlaceholder="Search by Description"
                          style={{ maxWidth: "7rem" }}
                          header="Description"
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
                      <span>
                        Are you sure you want to delete Are you sure you want to
                        delete this Certificate?
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
export default MyCertificateListing;
