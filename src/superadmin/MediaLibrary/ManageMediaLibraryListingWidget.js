import React, { useState, useEffect, useRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CFormInput,
  CBadge,
} from "@coreui/react";
import { Toast } from "primereact/toast";
import { Link, useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Skeleton } from "primereact/skeleton";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import "../../css/themes.css";
import "./../../css/themes.css";
import axios from "axios";
import getApiCall from "src/server/getApiCall";
import "../../css/table.css";

const API_URL = process.env.REACT_APP_API_URL,
  domainURL = window.location.origin,
  pureDomainURL = domainURL.split("/"),
  urlData = {
    isHttps: pureDomainURL[0] === "http:" ? 0 : 1,
    domainName: pureDomainURL[2],
  };
const token = "Bearer " + localStorage.getItem("ApiToken");

const manageMediaLibraryListing = () => {
  useEffect(() => {
    if (token !== "Bearer null") {
      getMediaLibraryListing();

      initFilters();
    }
  }, []);

  const colorName = localStorage.getItem("ThemeColor"),
    [themes, setThemes] = useState(colorName),
    token = "Bearer " + localStorage.getItem("ApiToken"),
    navigate = useNavigate(),
    toast = useRef(null),
    [filters, setFilters] = useState(null),
    [filters2, setFilters2] = useState(null),
    [globalFilterValue, setGlobalFilterValue] = useState(""),
    [globalFilterValue2, setGlobalFilterValue2] = useState(""),
    [statuses] = useState(["Active", "Inactive"]),
    [trainingTypes] = useState(["eLearning", "Classroom", "Assessments"]),
    [deleteProductDialog, setDeleteProductDialog] = useState(false),
    [selectedProduct, setSelectedProduct] = useState(null),
    [checkStatus, setCheckStatus] = useState(false),
    [responseData, setResponseData] = useState([]);

  const getMediaLibraryListing = async () => {
    try {
      const res = await getApiCall("getMediaList");
      setResponseData(res);
      setLoading(true);
    } catch (err) {
      setLoading(true);
      var errMsg = err?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
    }
  };
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orgvisible, setOrgVisible] = useState(false);

  const statusShow = (responseData) => (
    <CBadge
      className={`badge badge-light-info text-info badgeColor${themes} `}
      color="light"
    >
      {responseData?.isActive}
    </CBadge>
  );

  const deleteProductDialogFooter = () => (
    <React.Fragment>
      <Button
        label="No"
        size="sm"
        className={`saveButtonTheme${themes}`}
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

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <div
        onClick={() => {
          navigate(
            `/superadmin/medialibrarylist/viewmedialibrary?${responseData.contentId}`
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
      </div>
      <div onClick={() => confirmDeleteProduct(responseData)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          class={`bi bi-trash-fill iconTheme${themes}`}
          style={{ margin: "0 0.5rem" }}
          viewBox="0 0 16 16"
        >
          <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
        </svg>
      </div>
      {responseData.contentTypeId === 8 || responseData.contentTypeId === 5 ? null : (
      <div
        onClick={() => handleDownload(responseData)}
        style={{ cursor: "pointer" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          class={`bi bi-download iconTheme${themes}`}
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
    setSelectedProduct(product);
    setDeleteProductDialog(true);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const Deletemedia = (contentId) => {
    const data = {
      contentId: contentId,
    };
    axios
      .post(`${API_URL}/deleteMedia/?_method=DELETE`, data, {
        headers: { Authorization: token },
      })
      .then((response) => {
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
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error Deleting Media",
          life: 3000,
        });
      });
    setDeleteProductDialog(false);
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
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

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      mediaName: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      contentType: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      contentName: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      dateModified: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      contentVersion: { value: null, matchMode: FilterMatchMode.IN },
      trainingType: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      categoryName: { value: null, matchMode: "contains" },
      trainingCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      status: { value: null, matchMode: FilterMatchMode.EQUALS },
      Action: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    setGlobalFilterValue("");
  };

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };
  const mediaName = (responseData) => (
    <>{responseData.mediaName ? responseData.mediaName : "-"}</>
  );

  const contentName = (responseData) => (
    <>{responseData.contentName ? responseData.contentName : "-"}</>
  );

  const contentVersion = (responseData) => (
    <>{responseData.contentVersion ? responseData.contentVersion : "-"}</>
  );
  const dateModified = (responseData) => (
    <>{responseData.dateModified ? responseData.dateModified : "-"}</>
  );

  const contentType = (responseData) => (
    <>{responseData.contentType ? responseData.contentType : "-"}</>
  );

  const mediaNameFilterTemplate = (options) => {
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
  const contentNameFilterTemplate = (options) => {
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
  const contentTypeFilterTemplate = (options) => {
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
  const contentVersionFilterTemplate = (options) => {
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
    <div className="container">
      <div className="container-fluid">
        <CCardBody>
          <Toast ref={toast} />
          {/*modal one*/}
          <CModal
            size="md"
            visible={orgvisible}
            onClose={() => setOrgVisible(false)}
            scrollable
          >
            <CModalHeader closeButton={true}>
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
                            value={globalFilterValue2}
                            onChange={onGlobalFilterChange2}
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
            </CModalHeader>
          </CModal>
          {/*modal one ends*/}
          {/*modal two starts */}

          {/*modal two end*/}
        </CCardBody>

        <CRow>
          <CCol xs={12} style={{ padding: "1px" }}>
            <CCard className="mb-7 card-ric">
              <div>
                <CCardHeader className="p-0">
                  <CNav variant="tabs">
                    <CNavItem>
                      <CNavLink active style={{ cursor: "pointer" }}>
                        <strong>Media Library</strong>
                      </CNavLink>
                    </CNavItem>
                  </CNav>
                  <CTabContent className="rounded-bottom">
                    <CTabPane className="p-3 preview" visible>
                      <div className="card-header border-0 d-flex justify-content-between">
                        <div className="d-flex row align-items-center">
                          <div
                            className={`col-md-6 col-xxl-4 searchBarBox${themes}`}
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

                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                          <Link
                            to={`/superadmin/medialibrarylist/addmedialibrary`}
                            className={`me-md-2 btn d-flex align-items-center btn-info saveButtonTheme${themes}`}
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

              <CCardBody className={`card-richa tableTheme${themes}`}>
                {!loading ? (
                  <div className="card">
                    <DataTable
                      value={Array(10).fill({})}
                      showGridlines
                      className="p-datatable-striped"
                    >
                      <Column
                        field="contentName"
                        header="Content Name"
                        sortable
                        style={{ width: "20%" }}
                        body={bodyTemplate}
                      ></Column>
                      <Column
                        field="mediaName"
                        header="Media Name"
                        style={{ width: "20%" }}
                        body={bodyTemplate}
                      ></Column>

                      <Column
                        field="TrainingType"
                        header="Training Type"
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
                        field="dateModified"
                        header="Date Modified"
                        style={{ width: "25%" }}
                        body={bodyTemplate}
                      ></Column>
                      <Column
                        field="Status"
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
                  <div className={`InputThemeColor${themes}`}>
                    <DataTable
                      value={responseData}
                      paginator
                      showGridlines
                      rowHover
                      emptyMessage="No records found."
                      responsiveLayout="scroll"
                      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                      rows={10}
                      rowsPerPageOptions={[10, 20, 50]}
                      dataKey="contentId"
                      filters={filters}
                      filterDisplay="row"
                      globalFilterFields={[
                        "mediaName",
                        "contentName",
                        "contentVersion",
                        "contentType",
                        "dateModified",
                        "isActive",
                        "Action",
                      ]}
                    >
                      <Column
                        body={contentName}
                        header="Content Name"
                        showFilterMenu={false}
                        field="contentName"
                        filter
                        filterElement={contentNameFilterTemplate}
                        filterPlaceholder="Search"
                      ></Column>
                      <Column
                        body={mediaName}
                        field="mediaName"
                        header="Media Name"
                        sortable
                        showFilterMenu={false}
                        filter
                        filterElement={mediaNameFilterTemplate}
                        filterPlaceholder="Search"
                      ></Column>

                      <Column
                        showFilterMenu={false}
                        filter
                        field="contentType"
                        filterElement={contentTypeFilterTemplate}
                        filterPlaceholder="Search"
                        body={contentType}
                        header="Content Type"
                      ></Column>
                      <Column
                        body={contentVersion}
                        header="Content Version"
                        field="contentVersion"
                        showFilterMenu={false}
                        filter
                        filterElement={contentVersionFilterTemplate}
                        filterPlaceholder="Search"
                      ></Column>
                      <Column
                        body={dateModified}
                        header="Date Modified"
                        field="dateModified"
                        showFilterMenu={false}
                        filter
                        filterElement={contentVersionFilterTemplate}
                        filterPlaceholder="Search"
                      ></Column>
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
                  </div>
                )}
                <CModal visible={visible} onClose={() => setVisible(false)}>
                  <CModalHeader onClose={() => setVisible(false)}>
                    <CModalTitle>Delete</CModalTitle>
                  </CModalHeader>
                  <CModalBody>Are you sure you want to delete ?</CModalBody>
                  <CModalFooter>
                    <CButton
                      className={`saveButtonTheme${themes}`}
                      color="secondary"
                      onClick={() => setVisible(false)}
                    >
                      Close
                    </CButton>
                    <CButton
                      color="primary"
                      className={`saveButtonTheme${themes}`}
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
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    </div>
  );
};
export default manageMediaLibraryListing;
