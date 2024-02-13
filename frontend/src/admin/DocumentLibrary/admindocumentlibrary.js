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
  CBadge,
  CNavLink,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CImage,
  CTabContent,
  CTabPane,
  CFormInput,
} from "@coreui/react";
import axios from "axios";
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
const API_URL = process.env.REACT_APP_API_URL;

const documentlibrarylist = () => {

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
      <Link to={`/admin/viewdocumentlibrary?${responseData.documentLibraryId}`}>

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


    </div>
  );


  const Deletedoc = (documentLibraryId) => {
    const token = "Bearer " + localStorage.getItem("ApiToken");

    const data = {
      documentLibraryId: documentLibraryId,
    };

    axios
      .delete(`${API_URL}/deleteDocumentLibraryById/${documentLibraryId}`, {
        headers: { Authorization: token },
        data: data,
      })
      .then((response) => {
        const filteredData = responseData.filter(
          (item) => item.documentLibraryId !== documentLibraryId
        );
        setResponseData(filteredData);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Document deleted successfully!",
          life: 3000,
        });
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error deleting Document",
          life: 3000,
        });
      });

    setDeleteProductDialog(false);
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

  const statusShow = (responseData) => (
    <CBadge
      className={`badge badge-light-info text-info badgeColor${themes} `}
      color="light"
    >
      {responseData?.isActive === 1 ? "Active" : "In-Active"}
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
                      <strong>Document Library</strong>
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
                      <div className="d-flex justify-content-end">


                      </div>
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
                        filters={filters}
                        filterDisplay="row"
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
                          sortable
                          showFilterMenu={false}
                          filter
                          filterElement={titleFilterTemplate}
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
                </div>
              </CCardBody>
            </div>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};
export default documentlibrarylist;
