import React, { useRef, useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CNav,
  CImage,
  CModal,
  CNavItem,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
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
import { Skeleton } from "primereact/skeleton";
import getApiCall from "src/server/getApiCall";
import generalDeleteApiCall from "src/server/generalDeleteApiCall";
import downloadApi from "src/server/downloadApi";
import "../../css/table.css";

const TrainingMediaLibraryList = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  useEffect(() => {
    if (token !== "Bearer null") {
      getMediaLibraryListing();
      initFilters();
    }
  }, []);

  const [responseData, setResponseData] = useState(null);
  const [visible, setVisible] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [aleartDialog, setAleartDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  const toast = useRef(null);
  const [loading, setLoading] = useState(false);

  const getMediaLibraryListing = async () => {
    try {
      const response = await getApiCall("getMediaList");
      setResponseData(response);
      setLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  const Deletemedia = async (contentId) => {
    const data = {
      mediaId: contentId,
    };

    try {
      const response = await generalDeleteApiCall(
        "deleteOrgMediaCourseLibrary",
        data
      );

      const filteredData = responseData.filter(
        (item) => item.contentId !== contentId
      );
      setResponseData(filteredData);

      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Media deleted successfully!",
        life: 3000,
      });
    } catch (error) {
      console.log(error);

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Deleting Media",
        life: 3000,
      });
    }

    setDeleteProductDialog(false);
  };

  const statusShow = (responseData) => (
    <CBadge
      className={`badge badge-light-info text-info badgeColor${themes} `}
      color="light"
    >
      {responseData?.isActive}
    </CBadge>
  );
  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <Link
        onClick={() => {
          localStorage.setItem("contentId", responseData.contentId);
        }}
        to={`/admin/viewtrainingmedialibrary`}
      >
        <CImage
          src="/custom_icon/eye.svg"
          style={{ height: "25px" }}
          className="me-2"
          alt="eye.svg"
          title="View"
        />
      </Link>
      <CImage
        src="/custom_icon/bin.svg"
        className="me-3"
        alt="bin.svg"
        style={{ height: "22px", cursor: "pointer" }}
        onClick={() => confirmDeleteProduct(responseData)}
        title="Delete"
      />
      {responseData.contentType === "Link(URL)" ||
      responseData.contentType === "Embedded Code" ? null : (
        <div
          onClick={() => handleDownload(responseData)}
          style={{ cursor: "pointer" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
            class={`bi bi-download iconTheme`}
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
      const response = await fetch(value.mediaUrl);
      const contentDisposition = response.headers.get("content-disposition");
      let filename = "file"; // Default filename
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
      var errMsg = err?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
    }
  };

  const confirmDeleteProduct = (product) => {
    if (product?.mediaAssigned === 1) {
      setAleartDialog(true);
    } else {
      setSelectedProduct(product);
      setDeleteProductDialog(true);
    }
  };
  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };
  const hideAlearttDialog = () => {
    setAleartDialog(false);
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
        onClick={() => Deletemedia(selectedProduct.contentId)}
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
                        <CNavLink active style={{ cursor: "pointer" }}>
                          {/* <CIcon icon={cilMediaPlay} className="me-2" /> */}
                          <strong>Training Media Library</strong>
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
                              to={`/admin/addedittrainingmedialibrary`}
                              className="me-md-2 btn btn-info"
                              title="Add New Media"
                            >
                              Manage Media
                            </Link>
                          </div>
                        </div>
                      </CTabPane>
                    </CTabContent>
                  </CCardHeader>
                </div>
                <CCardBody>
                  <Toast ref={toast} />
                  {!loading ? (
                    <div className="card">
                      <DataTable
                        value={items}
                        showGridlines
                        className="p-datatable-striped"
                      >
                        <Column
                          field="mediaName"
                          header="Media Name"
                          sortable
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="contentName"
                          header="Content Name"
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="contentType"
                          header="Content Type"
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="contentVersion"
                          header="Content Version"
                          style={{ width: "25%" }}
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
                      emptyMessage="-"
                      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                      rows={10}
                      rowsPerPageOptions={[10, 20, 50]}
                      dataKey="contentId"
                      filters={filters}
                      filterDisplay="menu"
                      globalFilterFields={[
                        "mediaName",
                        "contentName",
                        "contentType",
                        "contentVersion",
                        "isActive",
                        "Action",
                      ]}
                    >
                      <Column
                        field="mediaName"
                        header="Media Name"
                        sortable
                      ></Column>
                      <Column
                        field="contentName"
                        header="Content Name"
                      ></Column>
                      <Column
                        field="contentType"
                        header="Content Type"
                      ></Column>
                      <Column
                        field="contentVersion"
                        header="Content Version"
                      ></Column>
                      <Column body={statusShow} header="Status"></Column>
                      <Column
                        field="Action"
                        header="Action"
                        body={buttonTemplate}
                      ></Column>
                    </DataTable>
                  )}
                  <CModal visible={visible} onClose={() => setVisible(false)}>
                    <CModalHeader onClose={() => setVisible(false)}>
                      <CModalTitle>Delete</CModalTitle>
                    </CModalHeader>
                    <CModalBody>Are you sure you want to delete ?</CModalBody>
                    <CModalFooter>
                      <CButton
                        color="secondary"
                        onClick={() => setVisible(false)}
                      >
                        Close
                      </CButton>
                      <CButton
                        color="primary"
                        onClick={(event) => Deletemedia(e.contentId)}
                      >
                        Delete
                      </CButton>
                    </CModalFooter>
                  </CModal>
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
                  <Dialog
                    visible={aleartDialog}
                    style={{ width: "32rem" }}
                    breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                    header="Alert"
                    modal
                    onHide={() => hideAlearttDialog()}
                  >
                    <div className="confirmation-content">
                      <i
                        className="pi pi-exclamation-triangle me-3 mt-2"
                        style={{ fontSize: "1.5rem" }}
                      />
                      <span>
                        This media is already linked to a Course. Please remove
                        the linkage of media from the course to delete it.
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
export default TrainingMediaLibraryList;
