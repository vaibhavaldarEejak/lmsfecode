import React, { useState, useEffect, useRef } from "react";
import {
  CCard,
  CCardBody,
  CFormCheck,
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
  CFormSelect,
  CFormInput,
  CBadge,
} from "@coreui/react";
import { Toast } from "primereact/toast";
import "../../css/themes.css";
import CIcon from "@coreui/icons-react";
import { cilArrowThickRight } from "@coreui/icons";
import { CImage } from "@coreui/react";
import { Link } from "react-router-dom";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Skeleton } from "primereact/skeleton";
import { Divider } from "primereact/divider";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import "../../css/table.css";
const API_URL = process.env.REACT_APP_API_URL;

const CourseCatalog = () => {
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  const toast = useRef(null);
  const [orgCheck, setorgCheck] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [filters2, setFilters2] = useState(null);
  const [categories, setCategories] = useState([]);
  const assignid = window.location.href.split("?")[2];
  const [trainingIds, setTrainingIds] = useState([]);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [resetProductDialog, setResetProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [organizationIds, setorganizationIds] = useState([
    {
      organizationId: 0,
      isChecked: 0,
    },
  ]);
  const [globalFilterValue2, setGlobalFilterValue2] = useState("");
  const [selectedContent, setSelectedContent] = useState([]);
  const [selectedOrgs, setSelectedOrgs] = useState([]);
  const [statuses] = useState(["Draft", "Published", "Unpublished"]);
  const [trainingTypes] = useState(["eLearning", "Classroom", "Assessments"]);
  const [orgOptionList, setOrgOptionList] = useState([]);
  const [responseData, setResponseData] = useState("");
  const [visible, setVisible] = useState(false);
  const [contentPayload, setContentPayload] = useState([
    {
      trainingIds: null,
      organizationIds: null,
    },
  ]);

  useEffect(() => {
    if (token !== "Bearer null") {
      getCourseCatalogListing();
      initFilters();
      getCategoryList();
      getOrganizationOptionsList();
    }
  }, []);
  const [rowClick, setRowClick] = useState(false);
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const getCourseCatalogListing = () => {
    axios
      .get(`${API_URL}/getCourseCatalogList`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        setResponseData(response.data.data);
        console.log(response.data.data);
      });
  };
  const [orgvisible, setOrgVisible] = useState(false);

  function handleCheckboxChange(rowData, field, event) {
    const isChecked = event.target.checked ? 1 : 0;
    const updatedRow = { ...rowData, [field]: isChecked };
    const updatedData = orgOptionList.map((row) =>
      row.organizationId === rowData.organizationId ? updatedRow : row
    );
    setOrgOptionList(updatedData);

    setContentPayload([
      {
        trainingIds: trainingIds,
        organizationIds: updatedData,
      },
    ]);
  }

  const statusShow = (responseData) => (
    <CBadge
      className={`badge badge-light-info text-info badgeColor${themes} `}
      color="light"
    >
      {responseData?.suAssigned === 1
        ? "Super Admin Assigned"
        : "Admin Created"}
    </CBadge>
  );

  const modified = (responseData) => (
    <CBadge
      className={`badge badge-light-info text-info badgeColor${themes} `}
      color="light"
    >
      {responseData?.isModified === 1 ? "Modified by Admin" : "Not Modified"}
    </CBadge>
  );

  const statusShow2 = (responseData) => (
    <CBadge
      className={`badge badge-light-info text-info badgeColor${themes} `}
      color="light"
    >
      {responseData?.status}
    </CBadge>
  );

  function handleSelectAll(event) {
    const isChecked = event.target.checked ? 1 : 0;
    const updatedData = orgOptionList.map((row) => ({
      ...row,
      isChecked: isChecked,
    }));
    setOrgOptionList(updatedData);
    setSelectAll(event.checked);

    setContentPayload([
      {
        trainingIds: trainingIds,
        organizationIds: updatedData,
      },
    ]);
  }

  const getOrganizationOptionsList = async () => {
    //axios await
    try {
      const response = await axios.get(
        `${API_URL}/getOrganizationOptionsList`,
        {
          headers: { Authorization: token },
        }
      );
      setOrgOptionList(
        response.data.data.map((data) => ({
          organizationId: data.organizationId,
          organizationName: data.organizationName,
          isChecked: 0,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {}, [organizationIds]);

  const getCategoryList = async () => {
    //axios await
    try {
      const response = await axios.get(
        `${API_URL}/getOrganizationCategoryOptionList`,
        {
          headers: { Authorization: token },
        }
      );
      setCategories(response.data.data.map((e) => e.categoryName));
    } catch (error) {
      console.log(error);
    }
  };

  const dataReset = (id) => {
    const data = {
      trainingId: id,
    };
    axios
      .post(`${API_URL}/courseCatalogReset`, data, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response) {
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Course Reset Successfully",
            life: 3000,
          });
        }
        setResetProductDialog(false);
        setTimeout(() => {
          window.location.reload();
        }, [2000]);
      })
      .catch((errors) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error Resetting Course",
          life: 3000,
        });
      });
  };

  const deleteCourse = (courseLibraryId) => {
    const data = {
      courseLibraryId: courseLibraryId,
    };
    axios
      .post(`${API_URL}/deleteCourseCatalog/?_method=DELETE`, data, {
        headers: { Authorization: token },
      })
      .then((response) => {
        const filteredData = responseData.filter(
          (item) => item.courseLibraryId !== courseLibraryId
        );
        setResponseData(filteredData);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Course deleted successfully!",
          life: 3000,
        });
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error Deleting Course",
          life: 3000,
        });
      });
    setDeleteProductDialog(false);
  };

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <Link
        to={`/admin/coursecataloglist/viewcoursecatalog?${responseData?.courseLibraryId}?${responseData.assignId}`}
      >
        <CImage
          src="/custom_icon/eye.svg"
          style={{ height: "25px", cursor: "pointer" }}
          className="me-2"
          alt="eye_icon"
          title="View Catalog"
        />
      </Link>
      {responseData.trainingTypeId == 1 && (
        <Link
          to={`/admin/coursecataloglist/addeditviewelearningcoursecatalog?${responseData.courseLibraryId}?${responseData.suAssigned}`}
        >
          <CImage
            src="/custom_icon/edit.svg"
            alt="edit.svg"
            style={{ height: "25px", cursor: "pointer" }}
            className="me-2"
            title="Edit Catalog"
          />
        </Link>
      )}

      {responseData.trainingTypeId == 2 && (
        <Link
          to={`/admin/coursecataloglist/addeditviewclassroomcoursecatalog?${responseData.courseLibraryId}?${responseData.suAssigned}`}
        >
          <CImage
            src="/custom_icon/edit.svg"
            alt="edit.svg"
            style={{ height: "25px", cursor: "pointer" }}
            className="me-2"
            title="Edit Catalog"
          />
        </Link>
      )}

      {responseData.trainingTypeId == 3 && (
        <Link
          to={`/admin/coursecataloglist/addeditviewassessmentcoursecatalog?${responseData.courseLibraryId}?${responseData.suAssigned}`}
        >
          <CImage
            src="/custom_icon/edit.svg"
            alt="edit.svg"
            style={{ height: "25px", cursor: "pointer" }}
            className="me-2"
            title="Edit catalog"
          />
        </Link>
      )}
      <CImage
        src="/custom_icon/bin.svg"
        className="me-3"
        alt="bin.svg"
        style={{ height: "22px", cursor: "pointer" }}
        onClick={() => confirmDeleteProduct(responseData)}
        title="Delete Catalog"
      />

      {responseData.suAssigned === 1 && responseData.isModified === 1 && (
        <CImage
          src="/media/icon/Reset.svg"
          alt="edit.svg"
          style={{ height: "25px", cursor: "pointer" }}
          className="me-2"
          onClick={() => confirmResetProduct(responseData)}
          title="Reset"
        />
      )}
    </div>
  );
  const confirmDeleteProduct = (product) => {
    setSelectedProduct(product);
    setDeleteProductDialog(true);
  };
  const confirmResetProduct = (product) => {
    setSelectedProduct(product);
    setResetProductDialog(true);
  };
  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };
  const hideResetProductDialog = () => {
    setResetProductDialog(false);
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
        onClick={() => deleteCourse(selectedProduct.courseLibraryId)}
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
        onClick={() => dataReset(selectedProduct.courseLibraryId)}
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
      courseTitle: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      trainingCode: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
        trainingCode: "global",
      },
      dateModified: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
        trainingCode: "global",
      },
      categoryName: { value: null, matchMode: "contains" },
      courseLibraryId: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      courseLibraryName: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },

      trainingType: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      status: { value: null, matchMode: FilterMatchMode.EQUALS },
      Action: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    setGlobalFilterValue("");
  };
  const items = Array.from({ length: 10 }, (v, i) => i);
  const dateModified = (responseData) => (
    <>{responseData.dateModified ? responseData.dateModified : "-"}</>
  );

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };
  const trainingTypeRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={trainingTypes}
        onChange={(e) => options.filterApplyCallback(e.value)}
        placeholder="Select One"
        className="p-column-filter"
        style={{
          height: "2rem",
          maxWidth: "10rem",
          lineHeight: "4px",
        }}
      />
    );
  };

  const datemodifiedRowFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        editable
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search"
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

  const catergoryNameRowFilterTemplate = (options) => {
    return (
      <Dropdown
        editable
        value={options.value}
        options={categories}
        onChange={(e) => options.filterApplyCallback(e.value)}
        placeholder="Select"
        className="p-column-filter"
        style={{
          height: "2rem",
          maxWidth: "10rem",
          //padding: "0.25rem 1rem",
          lineHeight: "4px",
        }}
      />
    );
  };
  const statusRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.filterApplyCallback(e.value)}
        placeholder="Select One"
        className="p-column-filter"
        style={{
          height: "2rem",
          maxWidth: "10rem",
          lineHeight: "4px",
        }}
      />
    );
  };
  const refCodeRowFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search by name"
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
  const courseNameRowFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search by name"
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
    <div className="Subadminlisting">
      <div className="container">
        <div className="container-fluid">
          <CRow>
            <CCol xs={12} style={{ padding: "1px" }}>
              <CCard className="mb-6 card-ric">
                <div>
                  <CCardHeader className="p-0">
                    <CNav variant="tabs">
                      <CNavItem>
                        <CNavLink active style={{ cursor: "pointer" }}>
                          <strong>Course Catalog</strong>
                        </CNavLink>
                      </CNavItem>
                    </CNav>
                    <CTabContent className="rounded-bottom">
                      <CTabPane className="p-3 preview" visible>
                        <div className="buttons">
                          <div className="header">
                            <div className="col-lg-3-md-block">
                              <div className="d-grid gap-2 d-flex justify-evenly-col-sm-3">
                                <div className="input-group">
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
                                <div className="d-grid gap-2 d-md-flex justify-content-col-sm-3-md-block-end">
                                  <div className="input-group">
                                    <span className="input-group-btn"></span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                              <CButton
                                className="me-md-2 btn btn-info"
                                title="Add Courses"
                                onClick={() => {
                                  localStorage.removeItem("courseLibraryId");
                                  setVisible(!visible);
                                }}
                              >
                                + &nbsp; Add Courses
                              </CButton>
                            </div>
                          </div>
                        </div>
                      </CTabPane>
                    </CTabContent>
                  </CCardHeader>
                </div>
                <CCardBody>
                  <Toast ref={toast} />
                  <CModal
                    size="lg"
                    visible={visible}
                    onClose={() => setVisible(false)}
                  >
                    <CModalHeader>
                      <CModalTitle>Select Module Type</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                      <div className="module-outer">
                        <Link
                          style={{ textDecoration: "none" }}
                          title="eLearning"
                          to={`/admin/coursecataloglist/addeditviewelearningcoursecatalog`}
                        >
                          <div className="d-flex align-items-center">
                            <div className="col-md-2">
                              <CImage
                                rounded
                                src="/media/module/1.png"
                                width={100}
                                height={100}
                              />
                            </div>
                            <div className="col-md-8">
                              <h4>eLearning</h4>
                              <p>
                                Learners can begin and complete a course module
                                according to their own schedule at one's own
                                pace. For example, videos, prerecorded classroom
                                lectures.
                              </p>
                            </div>
                            <div className="col-md-2 module-arrow">
                              <CIcon
                                icon={cilArrowThickRight}
                                size="xxl"
                                style={{ cursor: "pointer" }}
                                className="me-2"
                              />
                            </div>
                          </div>
                        </Link>
                        <Divider layout="horizontal" />
                        <Link
                          title="Virtual Classroom/Classroom"
                          style={{ textDecoration: "none" }}
                          to={`/admin/coursecataloglist/addeditviewclassroomcoursecatalog`}
                        >
                          <div className="d-flex align-items-center">
                            <div className="col-md-2">
                              <CImage
                                rounded
                                src="/media/module/2.png"
                                width={100}
                                height={100}
                              />
                            </div>
                            <div className="col-md-8">
                              <h4> Virtual Classroom/Classroom </h4>
                              <p>
                                Learners can begin and complete a course module
                                according to their own schedule at one's own
                                pace. For example, videos, prerecorded classroom
                                lectures.
                              </p>
                            </div>
                            <div className="col-md-2 module-arrow">
                              <CIcon
                                icon={cilArrowThickRight}
                                size="xxl"
                                style={{ cursor: "pointer" }}
                                className="me-2"
                              />
                            </div>
                          </div>
                        </Link>
                        <Divider layout="horizontal" />
                        <Link
                          title="Assessment"
                          style={{ textDecoration: "none" }}
                          to={`/admin/coursecataloglist/addeditviewassessmentcoursecatalog`}
                        >
                          <div className="d-flex align-items-center">
                            <div className="col-md-2">
                              <CImage
                                rounded
                                src="/media/module/3.png"
                                width={100}
                                height={100}
                              />
                            </div>
                            <div
                              className="col-md-8"
                              onClick={() => {
                                localStorage.removeItem("courseLibraryId");
                              }}
                            >
                              <h4> Assessment </h4>
                              <p>
                                Learners can begin and complete a course module
                                according to their own schedule at one's own
                                pace. For example, videos, prerecorded classroom
                                lectures.
                              </p>
                            </div>
                            <div className="col-md-2 module-arrow">
                              <CIcon
                                icon={cilArrowThickRight}
                                size="xxl"
                                style={{ cursor: "pointer" }}
                                className="me-2"
                              />
                            </div>
                          </div>
                        </Link>
                      </div>
                    </CModalBody>
                    <CModalFooter>
                      <CButton color="info" onClick={() => setVisible(false)}>
                        Close
                      </CButton>
                    </CModalFooter>
                  </CModal>
                  {!responseData ? (
                    <div className="card">
                      <DataTable
                        value={items}
                        showGridlines
                        className="p-datatable-striped"
                      >
                        <Column
                          field="courseTitle"
                          header="Course Name"
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="courseLibraryId"
                          header="Reference Code"
                          sortable
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
                          field="categoryName"
                          header="Category Name"
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
                          field="dateModified"
                          body={bodyTemplate}
                          header="Date Modified"
                          style={{ width: "25%" }}
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
                      paginator
                      showGridlines
                      rowHover
                      emptyMessage="No records found."
                      responsiveLayout="scroll"
                      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                      rows={10}
                      rowsPerPageOptions={[10, 20, 50]}
                      filters={filters}
                      filterDisplay="row"
                      globalFilterFields={[
                        "courseTitle",
                        "trainingCode",
                        "courseLibraryName",
                        "categoryName",
                        "trainingType",
                        "status",
                        "dateModified",
                        "Action",
                      ]}
                    >
                      <Column
                        filterMenuStyle={{ width: "14rem" }}
                        style={{ minWidth: "10rem" }}
                        showFilterMenu={false}
                        filter
                        filterElement={courseNameRowFilterTemplate}
                        field="courseTitle"
                        header="Course Name"
                      ></Column>
                      <Column
                        field="trainingCode"
                        header="Reference Code"
                        showFilterMenu={false}
                        filter
                        filterElement={refCodeRowFilterTemplate}
                        style={{ minWidth: "8rem" }}
                      ></Column>
                      <Column
                        field="trainingType"
                        header="Training Type"
                        showFilterMenu={false}
                        filterMenuStyle={{ width: "10rem" }}
                        style={{ minWidth: "8rem" }}
                        filter
                        filterElement={trainingTypeRowFilterTemplate}
                      ></Column>
                      <Column
                        body={(rowData) => (
                          <>{rowData.categoryName.join(",")}</>
                        )}
                        field="categoryName"
                        header="Category Name"
                        showFilterMenu={false}
                        filterMenuStyle={{ width: "14rem" }}
                        style={{ minWidth: "14rem" }}
                        filter
                        filterElement={catergoryNameRowFilterTemplate}
                      ></Column>
                      <Column
                        header="Assigned Status"
                        body={statusShow}
                        style={{ minWidth: "8rem" }}
                      ></Column>
                      <Column
                        header="Modified Status"
                        body={modified}
                        style={{ minWidth: "8rem" }}
                      ></Column>
                      <Column
                        field="dateModified"
                        body={dateModified}
                        header="Date Modified"
                        style={{ minWidth: "10rem" }}
                        showFilterMenu={false}
                        filterMenuStyle={{ width: "20rem", maxHeight: "2rem" }}
                        filter
                        filterElement={datemodifiedRowFilterTemplate}
                      ></Column>
                      <Column
                        body={statusShow2}
                        field="status"
                        header="Status"
                        showFilterMenu={false}
                        filterMenuStyle={{ width: "10rem", maxHeight: "2rem" }}
                        style={{ minWidth: "8rem" }}
                        filter
                        filterElement={statusRowFilterTemplate}
                      ></Column>
                      <Column
                        style={{ width: "8%" }}
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
                      <span>Are you sure you want to Reset ?</span>
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

export default CourseCatalog;
