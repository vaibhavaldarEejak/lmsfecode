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
import "../../css/themes.css";
import CIcon from "@coreui/icons-react";
import { cilArrowThickRight } from "@coreui/icons";
import { CImage } from "@coreui/react";
import { Link, useNavigate } from "react-router-dom";
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
import generalDeleteApiCall from "src/server/generalDeleteApiCall";
import getApiCall from "src/server/getApiCall";

const TrainingLibraryInternal = () => {
  const colorName = localStorage.getItem("ThemeColor");
  const [loading, setLoading] = useState(false);
  const [themes, setThemes] = useState(colorName);
  const toast = useRef(null);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [statuses] = useState(["Draft", "Published", "Unpublished"]);
  const [trainingTypes] = useState(["eLearning", "Classroom", "Assessments"]);
  const [responseData, setResponseData] = useState([]);
  const [visible, setVisible] = useState(false);
  const courseType = window.location.href.split("?")[1] || "";
  const [courses, setCourses] = useState([]);
  const [hasNavigated, setHasNavigated] = useState(false);
  const [classroom, setClassroom] = useState();

  useEffect(() => {
    if (token !== "Bearer null") {
      setTimeout(() => {
        setDataLoaded(true);
      }, [100]);
      getTrainingLibraryInternalList();
      initFilters();
      getCategoryList();
    }
  }, []);

  useEffect(() => {
    if (courseType === "eLearning") {
      getTrainingLibraryInternalList();
      const filteredData = courses.filter(
        (items) => items.trainingTypeId === 1
      );
      setResponseData(filteredData);
    } else if (courseType === "Classroom") {
      getTrainingLibraryInternalList();
      const filteredData = courses.filter(
        (items) => items.trainingTypeId === 2
      );
      setResponseData(filteredData);
    } else if (courseType === "Assessments") {
      getTrainingLibraryInternalList();
      const filteredData = courses.filter(
        (items) => items.trainingTypeId === 3
      );
      setResponseData(filteredData);
    } else if (courseType === "All" || courseType === "") {
      getTrainingLibraryInternalList();
      const filteredData = courses;
      setResponseData(filteredData);
    } else if (courseType === "Archived") {
      const filteredData = courses.filter(
        (items) => items.status === "Archived"
      );
      setResponseData(filteredData);
    }
  }, [courseType]);
  const token = "Bearer " + localStorage.getItem("ApiToken");

  // const getTrainingLibraryInternalList = async () => {
  //   const res = await getApiCall("getCourseCatalogList");
  //   if (res) {
  //     const filteredData = res.filter(
  //       (items) => items.trainingTypeId
  //     );
  //     setClassroom(filteredData)
  //     console.log({filteredData});
  //     setCourses(res);

  //     setLoading(true);
  //     navigate("/admin/trainingLibraryInternal?All");
  //   }
  // };

  const getTrainingLibraryInternalList = async () => {
    const res = await getApiCall("getCourseCatalogList");
    if (res) {
      const filteredData = res.filter((items) => items.trainingTypeId);
      setClassroom(filteredData);
      console.log({ filteredData });
      setCourses(res);
      setLoading(true);

      if (!hasNavigated) {
        navigate("/admin/trainingLibraryInternal?All");
        setHasNavigated(true);
      }
    }
  };

  const statusShow2 = (responseData) => (
    <CBadge
      className={`badge badge-light-info text-info badgeColor${themes} `}
      color="light"
    >
      {responseData?.status}
    </CBadge>
  );

  const getCategoryList = async () => {
    //axios await
    try {
      const response = await getApiCall("getOrganizationCategoryOptionList");
      setCategories(response.map((e) => e.categoryName));
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCourse = async (courseLibraryId) => {
    const data = {
      courseLibraryId: courseLibraryId,
    };
    try {
      const response = await generalDeleteApiCall("deleteCourseCatalog", data);

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
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Deleting Course",
        life: 3000,
      });
    }
    setDeleteProductDialog(false);
  };

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <Link
        to={`/admin/coursecataloglist/viewcoursecatalog?trainingLibraryInternal`}
        onClick={() => {
          localStorage.setItem("courseLibraryId", responseData.courseLibraryId);
          localStorage.setItem("assignId", responseData.assignId);
        }}
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
          to={`/admin/coursecataloglist/addeditviewelearningcoursecatalog`}
          onClick={() => {
            localStorage.setItem(
              "courseLibraryId",
              responseData.courseLibraryId
            );
            localStorage.setItem("assignId", responseData.suAssigned);
          }}
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
          to={`/admin/coursecataloglist/addeditviewclassroomcoursecatalog`}
          onClick={() => {
            localStorage.setItem(
              "courseLibraryId",
              responseData.courseLibraryId
            );
            localStorage.setItem("assignId", responseData.suAssigned);
          }}
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
          to={`/admin/coursecataloglist/addeditviewassessmentcoursecatalog`}
          onClick={() => {
            localStorage.setItem(
              "courseLibraryId",
              responseData.courseLibraryId
            );
            localStorage.setItem("assignId", responseData.suAssigned);
          }}
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

      {/* {responseData.suAssigned === 1 && responseData.isModified === 1 && (
        <CImage
          src="/media/icon/Reset.svg"
          alt="edit.svg"
          style={{ height: "25px", cursor: "pointer" }}
          className="me-2"
          onClick={() => confirmResetProduct(responseData)}
          title="Reset"
        />
      )} */}
    </div>
  );
  const confirmDeleteProduct = (product) => {
    setSelectedProduct(product);
    setDeleteProductDialog(true);
  };
  // const confirmResetProduct = (product) => {
  //   setSelectedProduct(product);
  //   setResetProductDialog(true);
  // };
  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };
  // const hideResetProductDialog = () => {
  //   setResetProductDialog(false);
  // };
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

  // const resetProductDialogFooter = () => (
  //   <React.Fragment>
  //     <Button
  //       label="No"
  //       size="sm"
  //       icon="pi pi-times"
  //       outlined
  //       onClick={hideResetProductDialog}
  //     />
  //     <Button
  //       label="Yes"
  //       size="sm"
  //       icon="pi pi-check"
  //       severity="info"
  //       onClick={() => dataReset(selectedProduct.courseLibraryId)}
  //     />
  //   </React.Fragment>
  // );
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
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-6">
            <div>
              <CCardHeader>
                <CNav variant="tabs">
                  <CNavItem>
                    <Link
                      to={"/admin/trainingLibraryInternal?All"}
                      style={{ textDecoration: "none" }}
                    >
                      <CNavLink
                        active={
                          courseType === "All" || courseType === ""
                            ? true
                            : false
                        }
                      >
                        <strong>All</strong>
                      </CNavLink>
                    </Link>
                  </CNavItem>
                  <CNavItem>
                    <Link
                      to={"/admin/trainingLibraryInternal?eLearning"}
                      style={{ textDecoration: "none" }}
                    >
                      <CNavLink
                        active={courseType === "eLearning" ? true : false}
                      >
                        <strong>eLearning</strong>
                      </CNavLink>
                    </Link>
                  </CNavItem>
                  <CNavItem>
                    <Link
                      to={"/admin/trainingLibraryInternal?Classroom"}
                      style={{ textDecoration: "none" }}
                    >
                      <CNavLink
                        active={courseType === "Classroom" ? true : false}
                      >
                        <strong>Classroom</strong>
                      </CNavLink>
                    </Link>
                  </CNavItem>
                  <CNavItem>
                    <Link
                      to={"/admin/trainingLibraryInternal?Assessments"}
                      style={{ textDecoration: "none" }}
                    >
                      <CNavLink
                        active={courseType === "Assessments" ? true : false}
                      >
                        <strong>Assessment</strong>
                      </CNavLink>
                    </Link>
                  </CNavItem>
                  <CNavItem>
                    <Link
                      to={"/admin/trainingLibraryInternal?Archived"}
                      style={{ textDecoration: "none" }}
                    >
                      <CNavLink
                        active={courseType === "Archived" ? true : false}
                      >
                        <strong>Archived</strong>
                      </CNavLink>
                    </Link>
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
                            onClick={() => setVisible(!visible)}
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
                      onClick={() => {
                        localStorage.removeItem("courseLibraryId");
                      }}
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
                            according to their own schedule at one's own pace.
                            For example, videos, prerecorded classroom lectures.
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
                      onClick={() => {
                        localStorage.removeItem("courseLibraryId");
                      }}
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
                            according to their own schedule at one's own pace.
                            For example, videos, prerecorded classroom lectures.
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
                      onClick={() => {
                        localStorage.removeItem("courseLibraryId");
                      }}
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
                        <div className="col-md-8">
                          <h4> Assessment </h4>
                          <p>
                            Learners can begin and complete a course module
                            according to their own schedule at one's own pace.
                            For example, videos, prerecorded classroom lectures.
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
              {!loading ? (
                <div className="card">
                  <DataTable
                    value={items}
                    showGridlines
                    className="p-datatable-striped"
                  >
                    <Column
                      field="courseTitle"
                      header="Training"
                      style={{ width: "25%" }}
                      body={bodyTemplate}
                    ></Column>
                    <Column
                      field="courseLibraryId"
                      header="Training ID"
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
                      header="Category"
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
                    sortable
                    filterElement={courseNameRowFilterTemplate}
                    field="courseTitle"
                    header="Training"
                  ></Column>
                  <Column
                    field="trainingCode"
                    header="Training ID"
                    sortable
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
                    body={(rowData) => <>{rowData.categoryName.join(",")}</>}
                    field="categoryName"
                    header="Category"
                    showFilterMenu={false}
                    filterMenuStyle={{ width: "14rem" }}
                    style={{ minWidth: "14rem" }}
                    filter
                    filterElement={catergoryNameRowFilterTemplate}
                  ></Column>
                  {/* <Column
                    header="Assigned Status"
                    body={statusShow}
                    style={{ minWidth: "8rem" }}
                  ></Column>
                  <Column
                    header="Modified Status"
                    body={modified}
                    style={{ minWidth: "8rem" }}
                  ></Column> */}
                  <Column
                    field="dateModified"
                    body={dateModified}
                    header="Date Modified"
                    style={{ minWidth: "10rem" }}
                    showFilterMenu={false}
                    filterMenuStyle={{ width: "20rem", maxHeight: "2rem" }}
                    filter
                    sortable
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

              {/* <Dialog
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
              </Dialog> */}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default TrainingLibraryInternal;
