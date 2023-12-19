import React, { useRef, useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CFormCheck,
  CCardHeader,
  CCol,
  CRow,
  CNavItem,
  CNav,
  CNavLink,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CImage,
  CBadge,
  CTabContent,
  CTabPane,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
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
import "./../../css/themes.css";
import getApiCall from "src/server/getApiCall";
import "../../css/table.css";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

const Document = () => {
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const toast = useRef(null);
  const [loading, setLoading] = useState(true);
  const tableRef = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    getDocumentList();
    initFilters();
  }, []);

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      title: { value: null, matchMode: FilterMatchMode.CONTAINS },
      category: { value: null, matchMode: FilterMatchMode.CONTAINS },
      documentLink: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });
    setGlobalFilterValue("");
  };

  const [responseData, setResponseData] = useState([]);

  const getDocumentList = () => {
    axios
      .get(`${API_URL}/getOrgDocumentLibraryList`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        setResponseData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching Document list:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <Link
        to={`/student/viewdocument?`}
        onClick={() => {
          localStorage.setItem(
            "documentLibraryId",
            responseData.documentLibraryId
          );
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
      </Link>
      <div style={{ marginRight: "10px" }}></div>
      {responseData.allowDownload === 1 && (
        <div
          onClick={() => handleDownload(responseData)}
          style={{ cursor: "pointer" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
            className={`bi bi-download iconTheme${themes}`}
            viewBox="0 0 16 16"
          >
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
          </svg>
        </div>
      )}
    </div>
  );
  const handleDownload = async (value) => {
    try {
      const response = await fetch(value.documentLibraryLink);
      const contentDisposition = response.headers.get("content-disposition");
      let filename = "file";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=(['"]?)([^"';\n]*)\1?/
        );
        if (filenameMatch && filenameMatch.length >= 3) {
          filename = filenameMatch[2];
        }
      }

      const fileBlob = await response.blob();
      const blobUrl = URL.createObjectURL(fileBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
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
        onClick={() => Deletedoc(selectedProduct.documentLibraryId)}
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

  const items = Array.from({ length: 10 }, (v, i) => i);

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };

  const category = (responseData) => (
    <CBadge
      className={`badge badge-light-info text-info badgeColor${themes} `}
      color="light"
    >
      {responseData.category ? responseData.category : "-"}
    </CBadge>
  );

  const titleFilterTemplate = (options) => {
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
  const categoryFilterTemplate = (options) => {
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
  const documentLinkFilterTemplate = (options) => {
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
                      <strong>My Documents</strong>
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <Link
                      style={{ cursor: "pointer", textDecoration: "none" }}
                      to={`/student/faq`}
                    >
                      <CNavLink
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          localStorage.removeItem("documentLibraryId");
                        }}
                      >
                        <strong>FAQ</strong>
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
                      <div className="d-flex justify-content-end"></div>
                    </div>
                  </CTabPane>
                </CTabContent>
              </CCardHeader>

              <CCardBody>
                <Toast ref={toast} />

                <div className="">
                  {loading ? (
                    <div
                      className={`card tableThemeColor${themes} InputThemeColor${themes}`}
                    >
                      <DataTable
                        value={items}
                        showGridlines
                        className="p-datatable-striped"
                      >
                        <Column
                          field="documentLibraryTitle"
                          header="Title"
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="category"
                          header="Category"
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="isActive"
                          header="Status"
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                      </DataTable>
                    </div>
                  ) : (
                    <div
                      className={`card responsiveClass tableThemeColor${themes} InputThemeColor${themes}`}
                    >
                      <DataTable
                        ref={dt}
                        value={responseData}
                        removableSort
                        paginator
                        showGridlines
                        rowHover
                        emptyMessage="No records found."
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                        rows={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        dataKey="documentLibraryId"
                        globalFilterFields={[
                          "documentLibraryTitle",
                          "documentLibraryId",
                          "category",
                          "documentLibraryLink",
                          "isActive",
                        ]}
                      >
                        <Column
                          field="documentLibraryTitle"
                          header="Title"
                        ></Column>
                        <Column
                          body={category}
                          field="category"
                          header="Category"
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
                </div>
              </CCardBody>
            </div>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};
export default Document;
