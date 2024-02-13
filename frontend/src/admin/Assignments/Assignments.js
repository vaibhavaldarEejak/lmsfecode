import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Calendar } from 'primereact/calendar';
import { ProgressBar } from 'primereact/progressbar';

import {
  CCard,
  CRow,
  CCol,
  CForm,
  CCardHeader,
  CNav,
  CModalFooter,
  CModalBody,
  CModalHeader,
  CModal,
  CNavItem,
  CFormLabel,
  CFormTextarea,
  CFormInput,
  CNavLink,
  CCardBody,
  CBadge,
  CTabContent,
  CTabPane,
  CFormSelect,
  CButton,
} from "@coreui/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import getApiCall from "src/server/getApiCall";
import "../../css/table.css";
import "./../../css/themes.css";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import generalDeleteApiCall from "src/server/generalDeleteApiCall";


const API_URL = process.env.REACT_APP_API_URL;
function Assignments() {
  const toast = useRef(null);
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const [selectedCat, setSelectedCat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState(null);
  const [batData, setBatData] = useState(null);
  const [groupdata, setGroupData] = useState(null);
  const [date, setDate] = useState(null);
  const colorName = localStorage.getItem("ThemeColor");
  const [responseData, setResponseData] = useState([])
  const [globalFilterValue2, setGlobalFilterValue2] = useState("");
  const [categories, setCategories] = useState([]);
  const [batvisible, setBatvisible] = useState(false);
  const [progressvisible, setProgressvisible] = useState(false);
  const [groupvisible, setGroupvisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [themes, setThemes] = useState(colorName);
  const [level, setLevel] = useState("1");
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);

  const dt = useRef(null);
  const dt1 = useRef(null);
  const [assignmentName, setAssignmentName] = useState('');
  const [filters2, setFilters2] = useState(null);
  const [assignmentPayload, setAssignmentPayload] = useState({
    assignmentName: assignmentName,
    groups: [],
    users: [],
    category: [],
    courses: [],
  });
  const [selectedProduct, setSelectedProduct] = useState(null);


  const items3 = Array.from({ length: 3 }, (v, i) => i);
  const items4 = Array.from({ length: 4 }, (v, i) => i);

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };
  const items = Array.from({ length: 10 }, (v, i) => i);
  const validateForm = (e) => {
    e.preventDefault();
    if (assignmentPayload.courses.length <= 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please Select Course",
        life: 3000,
      });
    } else if (
      assignmentPayload.users.length === 0 &&
      assignmentPayload.groups.length === 0
    ) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Please Select User or Group",
        life: 3000,
      });
    }

    else {
      addAssignment();
    }
  };

  const DeleteAssignment = async (assignmentId) => {
    const data = {
      assignmentId: assignmentId,
    };
    try {
      const response = await generalDeleteApiCall("deleteAssignment", data);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Assignment Deleted Successfully!",
        life: 3000,
      });
      setDeleteProductDialog(false);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Deleting Assignment",
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



  const onGlobalFilterChange2 = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters2(_filters);
    setGlobalFilterValue2(value);
  };



  const buttonTemplate2 = (responseData) => (
    <div style={{ display: "flex" }}>
      <div
        title="View Assignment"
        style={{ cursor: "pointer", marginRight: "10px" }}
        onClick={() => {
          localStorage.setItem("assignmentId", responseData.assignmentId);
          navigate(`/admin/assigntraining/viewassignment`);
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
      <div></div>
      <div

        title="Delete Certificate"
        style={{ marginRight: "15px", cursor: "pointer" }}
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
  const buttonTemplate4 = (responseData) => (
    <div style={{ display: "flex", alignItems: "center",justifyContent: "center"  }}>
      <div>
        <div
          title="User View"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setProgressvisible(true)
            getActiveUserListing(responseData.assignmentId, responseData.courseId)
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg"
            width="23" height="23"
            fill="currentColor"
            style={{ margin: "0 0.5rem" }}
            className={`bi bi-person-circle iconTheme${themes}`} viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
          </svg>
        </div>
      </div>
    </div>
  );


  const progressBarTemplate = (responseData) => {
    return (
      <div style={{ position: "relative" }}>
        <ProgressBar
          value={responseData.progress === 0 ? 1 : responseData.progress}
          className="p-progress-rounded"
          displayValueTemplate={() => { }}
        />
        <div
          style={{ top: 0, position: "absolute", left: "50%", fontWeight: 800 }}
        >
          {responseData.progress}%
        </div>
      </div>
    );
  };




  const buttonTemplate6 = (rowData) => (
    <div style={{ display: "flex" }}>
      <div>
        <div
          title="Remove User"
          style={{ cursor: "pointer" }}
          onClick={() => RemoveUserAssignment(rowData.assignmentId, rowData.userId)}
        >
          {/* Your icon/svg */}
          <svg xmlns="http://www.w3.org/2000/svg"
            width="23" height="23"
            fill="currentColor"
            style={{ margin: "0 0.5rem" }}
            class={`bi bi-x-circle-fill iconTheme${themes}`} viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
            <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
          </svg>
        </div>
      </div>
      <div>
      </div>
      <div></div>
    </div>
  );



  const buttonTemplate7 = (rowData) => (
    <div style={{ display: "flex" }}>
      <div>
        <div
          title="Remove Group"
          style={{ cursor: "pointer" }}
          onClick={() => RemoveGroupAssignment(rowData.assignmentId, rowData.groupId)}
        >

          <svg xmlns="http://www.w3.org/2000/svg"
            width="23" height="23"
            fill="currentColor"
            style={{ margin: "0 0.5rem" }}
            class={`bi bi-x-circle-fill iconTheme${themes}`} viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
            <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
          </svg>
        </div>
      </div>
      <div>
      </div>
      <div></div>
    </div>
  );
  
  

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
        onClick={() => DeleteAssignment(selectedProduct.assignmentId)}
      />
    </React.Fragment>
  );



  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      assignmentName: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      courseName: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      courseTypeName: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      dueDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
      createdDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue("");
  };


  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const navigate = useNavigate();


  const getAssignmentListing = async () => {
    try {
      const res = await getApiCall("getAssignmentsList");
      setResponseData(res);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  const getActiveUserListing = async (assignmentId, courseId) => {
    try {
      const response = await getApiCall(
        `getUserListByAssignmentId/${assignmentId}/${courseId}`
      );
      setBatData(response);

      // Handle the response as needed
    } catch (error) {
      console.error(error);
    }
  };




  const AssignmentName = (responseData) => (
    <>{responseData.assignmentName ? responseData.assignmentName : "-"}</>
  );


  const createdDate = (responseData) => (
    <>{responseData.createdDate ? responseData.createdDate : "-"}</>
  );
  const courseTypeName = (responseData) => (
    <>{responseData.courseTypeName ? responseData.courseTypeName : "-"}</>
  );

  const courseName = (responseData) => (
    <>{responseData.courseName ? responseData.courseName : "-"}</>
  );
  const courseTitle = (responseData) => (
    <>{responseData.courseTitle ? responseData.courseTitle : "-"}</>
  ); courseTitle

  const dueDate = (responseData) => (
    <>{responseData.dueDate ? responseData.dueDate : "-"}</>
  );
  const Email = (batData) => (
    <>{batData.Email ? batData.Email : "-"}</>
  );


  const jobTitle = (batData) => (
    <>{batData.jobTitle ? batData.jobTitle : "-"}</>
  );



  const progressStatus = (batData) => (
    batData?.progressStatus === 'Incomplete' ? (
      <CBadge className="badge badge-light-info text-primary" color="light">
        Incomplete
      </CBadge>
    ) : (
      batData?.progressStatus === 'Inprogress' ? (
        <CBadge className="badge badge-light-info text-info" color="light">
          Inprogress
        </CBadge>
      ) : 
      <CBadge className="badge badge-light-info text-success" color="light">
          Completed
        </CBadge>
    )
  );


  useEffect(() => {
    setAssignmentPayload({
      ...assignmentPayload,
      category: categories
        .filter((c) => selectedCat.includes(c.categoryName))
        .map((c) => c.categoryId),
    });
  }, [selectedCat]);

  useEffect(() => {
    if (token !== "Bearer null") {
      setTimeout(() => {
        setLoader(true);
      }, [2000]);

      const fetchData = async () => {
        await Promise.all([
          initFilters(),
          getAssignmentListing(),

        ]);
      };
      fetchData();
    }
  }, []);

  return (
    <div className="">
      <CRow>
        <CCol xs={12} style={{ padding: "1px" }}>
          <CCard className="mb-7 card-ric">
            <div>
              <CCardHeader className="p-0">
                <CNav variant="tabs">
                  <CNavItem>
                    <CNavLink active style={{ cursor: "pointer" }}>
                      <strong>Assignment Listing</strong>
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
                        <div className="d-grid gap-2 d-md-flex">
                          <Link
                            to={`/admin/assigntraining/addassignment`}
                            className={`me-md-2 btn btn-info saveButtonTheme${themes}`}
                            title="Assign"
                            onClick={() => {
                              localStorage.removeItem("assignmentId");
                            }}
                          >
                            + Add Assignment
                          </Link>
                        </div>
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
                      className={`InputThemeColor${themes}`}
                    >
                      <DataTable
                        value={items}
                        showGridlines
                        className="p-datatable-striped"
                        scrollable={false}
                      >
                        <Column
                          field="assignmentName"
                          header="Assignment Name"
                          style={{ width: "15%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column

                          field="courseName"
                          header="Training Name"
                          style={{ width: "15%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column

                          field="createdDate"
                          header="Created Date"
                          style={{ width: "10%" }}
                          body={bodyTemplate}
                        ></Column>

                        <Column

                          field="courseName"
                          header="Course Name"
                          style={{ width: "15%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="courseTypeName"
                          header="Training Type"
                          style={{ width: "20%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="dueDate"
                          header="Due Date"
                          style={{ width: "15%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="progress"
                          header="Progress"
                          style={{ width: "15%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="Assign"
                          header="Assign"
                          style={{ width: "15%" }}
                          body={bodyTemplate}
                        ></Column>
                      </DataTable>
                    </div>
                  ) : (
                    <div
                      className={`InputThemeColor${themes} ric`}
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
                        dataKey="assignmentId"
                        filters={filters}
                        filterDisplay="row"
                        globalFilterFields={[
                          "assignmentName",
                          "assignmentId",
                          "courseName",
                          "courseTypeName",
                          "courseType",
                          "dueDate",
                          "isActive",
                        ]}
                        scrollable={false}
                      >
                        <Column
                          body={AssignmentName}
                          field="assignmentName"
                          header="Assignment Name"
                          sortable
                          showFilterMenu={false}
                          filter
                          filterPlaceholder="Search"
                          style={{ width: "15%" }}
                        ></Column>

                        <Column
                          body={createdDate}
                          field="createdDate"
                          header="Created Date"
                          sortable
                          showFilterMenu={false}
                          filter
                          filterPlaceholder="Search"
                          style={{ width: "15%" }}
                        ></Column>
                        <Column
                          body={courseName}
                          field="courseName"
                          header="Training Name"
                          sortable
                          showFilterMenu={false}
                          filter
                          filterPlaceholder="Search"
                          style={{ width: "15%" }}
                        ></Column>
                        <Column
                          body={courseTypeName}
                          field="courseTypeName"
                          header="Training Type"
                          sortable
                          showFilterMenu={false}
                          filter
                          filterPlaceholder="Search"
                          style={{ width: "15%" }}
                        ></Column>

                        <Column
                          body={dueDate}
                          field="dueDate"
                          header="Due Date"
                          sortable
                          showFilterMenu={false}
                          filter
                          filterPlaceholder="Search"
                          style={{ width: "15%" }}
                        ></Column>
                        <Column
                          field="progress"
                          header="Progress"
                          body={progressBarTemplate}
                          style={{ width: "15%", textAlign: "center" }}
                        ></Column>
                        <Column
                          field="UsersProgress"
                          header="Users Progress"
                          body={buttonTemplate4}
                          style={{ width: "5%"}}
                           ></Column>
                        <Column
                          field="Assign"
                          header="Assign"
                          body={buttonTemplate2}
                          style={{ width: "25%" }}
                        ></Column>
                      </DataTable>


                    </div>
                  )}

                  {/* User Visible Modal*/}

                  <CModal
                    size="md"
                    visible={batvisible}
                    onClose={() => setBatvisible(false)}
                    scrollable
                  >
                    <CModalHeader closeButton={true}>
                      <CTabContent className="rounded-bottom">
                        <CTabPane className="p-3 preview" visible>
                          <div className="card-header border-0 d-flex justify-content-between">
                            <div className="d-flex row align-items-center">
                              <div className="col-md-12 col-xxl-12">
                                <span className="p-input-icon-left">
                                  <i className="pi pi-search" />
                                  <InputText
                                    value={globalFilterValue2}
                                    onChange={onGlobalFilterChange2}
                                    style={{
                                      height: "40px",
                                      marginRight: "40px",
                                    }}
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
                      {/* View User assign Model Start single assign */}
                    </CModalHeader>
                    <CModalBody>
                      <DataTable
                        ref={dt1}
                        value={batData}
                        removableSort
                        showGridlines
                        rowHover
                        emptyMessage="No Records found"
                        dataKey="userId"
                        filters={filters2}
                        filterDisplay="menu"
                        globalFilterFields2={["userName"]}
                      >
                        <Column
                          field="Name"
                          header="Full Name"
                          sortable
                        ></Column>
                        <Column
                          field="roleName"
                          header="Role Name"
                        ></Column>
                        <Column
                          field="Action"
                          header="Action"
                          body={buttonTemplate6}
                        ></Column>
                      </DataTable>
                    </CModalBody>
                    <CModalFooter>
                      <CButton
                        className="btn btn-primary"
                        onClick={() => setBatvisible(false)}
                      >
                        Cancel
                      </CButton>
                    </CModalFooter>
                  </CModal>



                  {/* Progress Visible Modal*/}

                  <CModal
                    size="lg"
                    visible={progressvisible}
                    onClose={() => setProgressvisible(false)}
                    scrollable
                  >
                    <CModalHeader closeButton={true}>
                      <CTabContent className="rounded-bottom">
                        <CTabPane className="p-3 preview" visible>
                          <div className="card-header border-0 d-flex justify-content-between">
                            <div className="d-flex row align-items-center">
                              <div className="col-md-12 col-xxl-12">
                                <span className="p-input-icon-left">
                                  <i className="pi pi-search" />
                                  <InputText
                                    value={globalFilterValue2}
                                    onChange={onGlobalFilterChange2}
                                    style={{
                                      height: "40px",
                                      marginRight: "40px",
                                    }}
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
                      {/* View User assign Model Start single assign */}
                    </CModalHeader>
                    <CModalBody>
                      <DataTable
                        ref={dt1}
                        value={batData}
                        removableSort
                        showGridlines
                        rowHover
                        emptyMessage="No Records found"
                        dataKey="userId"
                        filters={filters2}
                        filterDisplay="menu"
                        globalFilterFields2={["userName"]}
                      >
                        <Column
                          field="Name"
                          header="User Name"
                          sortable
                        ></Column>
                        <Column
                          field="Email"
                          header="Email"
                          body = {Email}
                        ></Column>
                        <Column
                          field="jobTitle"
                          header="Job Title"
                          body = {jobTitle}
                        ></Column>
                        <Column
                          field="supervisorName"
                          header="Supervisor Name"
                        ></Column>
                        <Column
                          field="progressStatus"
                          header="Status"
                          body = {progressStatus}

                        ></Column>
                      </DataTable>
                    </CModalBody>
                    <CModalFooter>
                      <CButton
                        className="btn btn-primary"
                        onClick={() => setProgressvisible(false)}
                      >
                        Cancel
                      </CButton>
                    </CModalFooter>
                  </CModal>





                  {/* Group Visible Modal*/}



                  <CModal
                    size="md"
                    visible={groupvisible}
                    onClose={() => setGroupvisible(false)}
                    scrollable
                  >
                    <CModalHeader closeButton={true}>
                      <CTabContent className="rounded-bottom">
                        <CTabPane className="p-3 preview" visible>
                          <div className="card-header border-0 d-flex justify-content-between">
                            <div className="d-flex row align-items-center">
                              <div className="col-md-12 col-xxl-12">
                                <span className="p-input-icon-left">
                                  <i className="pi pi-search" />
                                  <InputText
                                    value={globalFilterValue2}
                                    onChange={onGlobalFilterChange2}
                                    style={{
                                      height: "40px",
                                      marginRight: "40px",
                                    }}
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
                      {/* View User assign Model Start single assign */}
                    </CModalHeader>
                    <CModalBody>
                      <DataTable
                        ref={dt1}
                        value={groupdata}
                        removableSort
                        showGridlines
                        rowHover
                        emptyMessage="No Records found"
                        dataKey="groupId"
                        filters={filters2}
                        filterDisplay="menu"
                        globalFilterFields2={["userName"]}
                      >
                        <Column
                          field="groupName"
                          header="Group Name"
                          sortable
                        ></Column>
                        <Column
                          field="groupCode"
                          header="Group Code"
                        ></Column>
                        <Column
                          field="Action"
                          header="Action"
                          body = {buttonTemplate7}
                        ></Column>
                      </DataTable>
                    </CModalBody>
                    <CModalFooter>
                      <CButton
                        className="btn btn-primary"
                        onClick={() => setGroupvisible(false)}
                      >
                        Cancel
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
                      <span>
                        Are you sure you want to delete Are you sure you want to
                        delete this Certificate?
                      </span>
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
}

export default Assignments;
