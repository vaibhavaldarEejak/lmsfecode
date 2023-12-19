import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { Calendar } from "primereact/calendar";

import {
  CCard,
  CRow,
  CCol,
  CForm,
  CCardHeader,
  CNav,
  CNavItem,
  CFormLabel,
  CFormTextarea,
  CCardFooter,
  CFormInput,
  CNavLink,
  CCardBody,
  CTabContent,
  CTabPane,
  CFormSelect,
  CButton,
} from "@coreui/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { MultiSelect } from "primereact/multiselect";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import postApiCall from "src/server/postApiCall";
import getApiCall from "src/server/getApiCall";

const API_URL = process.env.REACT_APP_API_URL;

function Addassignments() {
  const toast = useRef(null);
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const [rowClick, setRowClick] = useState(false);
  const [selectedCat, setSelectedCat] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const colorName = localStorage.getItem("ThemeColor");
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [filtersUsers, setFiltersUsers] = useState(null);
  const [filtersGroups, setFiltersGroups] = useState(null);
  const [filtersCourse, setFiltersCourse] = useState(null);
  const [globalFilterValueUsers, setGlobalFilterValueUsers] = useState("");
  const [globalFilterValueGroups, setGlobalFilterValueGroups] = useState("");
  const [globalFilterValueCourses, setGlobalFilterValueCourses] = useState("");
  const [globalFilterValueCourse, setGlobalFilterValueCourse] = useState("");
  const windLocation = window.location.href;
  const newLocation = windLocation.split("/");
  const arrayLength = newLocation.length - 1;
  const endPoint = windLocation.split("/")[arrayLength];
  const [date, setDate] = useState(null);

  const [groupList, setGroupList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [assignList, setAssignList] = useState([]);
  const [categoriesNames, setCategoriesNames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loader, setLoader] = useState(false);
  const [assignmentName, setAssignmentName] = useState("");
  const [themes, setThemes] = useState(colorName);
  const [assignmentPayload, setAssignmentPayload] = useState({
    assignmentName: assignmentName,
    groups: [],
    users: [],
    category: [],
    courses: [],
  });
  const [level, setLevel] = useState("1");
  const [assignmentId, setAssignmentId] = useState("");
  const [assignmentDetail, setAssignmentDetail] = useState("");

  const OrgDropdown = async () => {
    try {
      const res = await getApiCall("parentChildOrgList", id);
      setOrgList(res);
    } catch (err) { }
  };

  useEffect(() => {
    if (endPoint !== "login") {
      if (token !== "Bearer null") {
        const fetchData = async () => {
          await Promise.all([OrgDropdown()]);
        };
        fetchData();
      }
    }
    console.log("login", endPoint)
  }, []);
  const userRole = localStorage.getItem("role");
  const oldUserRole = localStorage.getItem("RoleType");

  let certificateId1 = "";
  useEffect(() => {
    certificateId1 = localStorage.getItem("assignmentId");
    setAssignmentId(certificateId1);
  }, []);

  useMemo(() => {
    if (assignmentDetail) {
      setAssignmentPayload({
        assignmentName: assignmentDetail.assignmentName,
        dueDate: assignmentDetail.dueDate,
        groupId: assignmentDetail.groupId,
        userId: assignmentDetail.userId,
        courseName: assignmentDetail.courseName,
        // isActive: certificateDetail.isActive,
      });
    }
  }, [assignmentDetail]);

  const items3 = Array.from({ length: 3 }, (v, i) => i);
  const items4 = Array.from({ length: 4 }, (v, i) => i);

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };

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
    // else if (assignmentPayload.groups.length <= 0) {
    //   toast.current.show({
    //     severity: "error",
    //     summary: "Error",
    //     detail: "Please Select Groups",
    //     life: 3000,
    //   });
    // }
    else {
      addAssignment();
    }
  };

  const initFiltersUsers = () => {
    setFiltersUsers({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValueUsers("");
  };

  const initFiltersGroups = () => {
    setFiltersGroups({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      groupName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValueGroups("");
  };

  const initFiltersCouerses = () => {
    setFiltersCourse({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      courseTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValueCourses("");
  };

  const initFiltersCourse = () => {
    setFiltersCourse({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValueCourse("");
  };

  const onGlobalFilterChangeUsers = (e) => {
    const value = e.target.value;
    let _filters = { ...filtersUsers };
    _filters["global"].value = value;

    setFiltersUsers(_filters);
    setGlobalFilterValueUsers(value);
  };

  const onGlobalFilterChangeGroups = (e) => {
    const value = e.target.value;
    let _filters = { ...filtersGroups };
    _filters["global"].value = value;

    setFiltersGroups(_filters);
    setGlobalFilterValueGroups(value);
  };

  const onGlobalFilterChangeCourses = (e) => {
    const value = e.target.value;
    let _filters = { ...filtersGroups };
    _filters["global"].value = value;

    setFiltersCourse(_filters);
    setGlobalFilterValueCourses(value);
  };

  const onGlobalFilterChangeCourse = (e) => {
    const value = e.target.value;
    let _filters = { ...filtersCourse };
    _filters["global"].value = value;

    setFiltersCourse(_filters);
    setGlobalFilterValueCourse(value);
  };

  const getGroupListing = () => {
    axios
      .get(`${API_URL}/getOrgGroupList`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        setGroupList(response.data.data);
      });
  };

  const assignmentGetByIdApi = async (assignmentId) => {
    try {
      const res = await getApiCall("getAssignmentById", assignmentId);
      setAssignmentDetail(res);

    } catch (err) {
      console.log(err);
    }
  };

  const navigate = useNavigate();
  const addAssignment = async () => {
    try {
      const payload = {
        assignmentName: assignmentName,
        dueDate: date,
        groupId: assignmentPayload.groups,
        userId: assignmentPayload.users,
        courseId: assignmentPayload.courses,
      };

      const res = await postApiCall("addNewAssignment", payload);

      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Courses Assignment Done Successfully",
        life: 3000,
      });

      // Reset the assignmentPayload and assignmentName
      setAssignmentPayload({
        groups: [],
        users: [],
        category: [],
        courses: [],
      });
      setAssignmentName(""); // Reset the assignmentName

      setSelectedGroup(false);
      setSelectedCourse(false);
      setSelectedUser(false);

      setTimeout(() => {
        navigate(`/admin/assigntraining`);
      }, 1505);
    } catch (err) {
      console.log({ err });
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Assigning Course to Groups",
        life: 3000,
      });
    }
  };
  const getUserByGroupsId = async (ids) => {
    // try {
    //   const response = await axios.post(
    //     `${API_URL}/getUserListByGroupId`,
    //     { groups: ids },
    //     {
    //       headers: { Authorization: token },
    //     }
    //   );
    //   if (response) {
    //     setUserList(response.data.data);
    //   }
    // } catch (error) {
    //   console.log(error);
    // toast.current.show({
    //   severity: "error",
    //   summary: "Error",
    //   detail: "Error Assigning Course to Groups",
    //   life: 3000,
    // });
    // }
  };

  const getActiveUserListing = () => {
    axios
      .get(
        `${API_URL}/getUserLevelList
      `,
        {
          headers: { Authorization: token },
        }
      )
      .then((response) => {
        setUserList(response.data.data);
      });
  };



  const getActiveUserListing1 = () => {
    axios
      .get(
        `${API_URL}/getUserLevelList?level=${level} `,
        {
          headers: { Authorization: token },
        }
      )
      .then((response) => {
        setUserList(response.data.data);
      });
  };

  const getCourseListing = () => {
    axios
      .get(`${API_URL}/getCourseCatalogList`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        setCourseList(response.data.data);
      });
  };

  const getCategoryList = async () => {
    //axios await
    try {
      const response = await axios.get(
        `${API_URL}/getOrganizationCategoryOptionList`,
        {
          headers: { Authorization: token },
        }
      );
      setCategoriesNames(response.data.data.map((e) => e.categoryName));
      setCategories(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const AssignmentName = (responseData) => (
    <>{responseData.assignmentName ? responseData.assignmentName : "-"}</>
  );
  const courseTitle = (responseData) => (
    <>{responseData.courseTitle ? responseData.courseTitle : "-"}</>
  );
  courseTitle;

  const dueDate = (responseData) => (
    <>{responseData.dueDate ? responseData.dueDate : "-"}</>
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

      initFiltersUsers();
      initFiltersGroups();
      initFiltersCourse();
      initFiltersCouerses();
    }
  }, []);

  useEffect(() => {
    if (assignmentId) {
      console.log(assignmentId);
      assignmentGetByIdApi(Number(assignmentId));
    }

    else
      if (assignmentId === null || assignmentId === undefined) {
        getGroupListing();
        // getActiveUserListing();
        getCourseListing();
        getCategoryList()
      }

  }, [assignmentId,]);



  useEffect(() => {
    if (endPoint !== "login" && token !== "Bearer null") {
      const fetchData = async () => {
        await Promise.all([OrgDropdown()]);
        // Check if the userRole is role_system_admin
        if (userRole === 'role_system_admin') {
          getActiveUserListing();
        } else {
          getActiveUserListing1();
        }
      };
      fetchData();
    }
    console.log("login", endPoint);
  }, [endPoint, token, userRole, level]);

  useEffect(() => {
    if (token !== "Bearer null") {
      // getActiveUserListing();
      // initFilters();
      // initFilters2();
      // initFilters3();
    }
  }, []);


  const onChangeRole = (evt) => {
    const value = evt.target.value;
    setLevel(value);
  };
  return (
    <>
      <Toast ref={toast} />
      <div className="container">
        <div className="row mt-4">
          <div className="col">
            <CCard>
              <CNav variant="tabs">
                <CNavItem>
                  <CNavLink active style={{ cursor: "pointer" }}>
                    <strong>Assignment</strong>
                  </CNavLink>
                </CNavItem>
              </CNav>
              <CRow>
                <CCol lg={12} className="mb-1">
                  <CCard className="h-100">
                    <CCardBody className="p-4">
                      <CForm className={`row g-15 needs-validation ps-4 InputThemeColor`}>
                        {/* First Column - Assignment Name */}
                        <CRow className="mb-4">
                          <CCol md={6}>
                            <CRow className="mb-1">
                              <CFormLabel
                                htmlFor=""
                                className="col-sm-3 col-form-label fw-bolder fs-7"
                              >
                                Assignment Name
                              </CFormLabel>
                              <div className="col-sm-8 col-md-9">
                                <CFormTextarea
                                  rows={3}
                                  type="text"
                                  id="validationCustom01"
                                  value={assignmentPayload.assignmentName}
                                  onChange={(e) => {
                                    setAssignmentPayload({
                                      ...assignmentPayload,
                                      assignmentName: e.target.value,
                                    });
                                    setAssignmentName(e.target.value);
                                  }}
                                  required
                                  placeholder="Assignment Name"
                                />
                              </div>
                            </CRow>
                          </CCol>

                          {/* Second Column - Due Date */}
                          <CCol md={6}>
                            <CRow className="mb-3 ms-6">
                              <CFormLabel
                                htmlFor=""
                                className="col-sm-3 col-form-label fw-bolder fs-7"
                              >
                                Due Date
                              </CFormLabel>
                              <div className="col-sm-9">
                                <Calendar
                                  value={assignmentPayload.dueDate}
                                  placeholder="Select a Date"
                                  onChange={(e) => {
                                    console.log(e);
                                    setAssignmentPayload({
                                      ...assignmentPayload,
                                      dueDate: e.target.value,
                                    });

                                    setDate(e.value);
                                  }}
                                  style={{ width: '400px' }}
                                  showIcon
                                  
                                />
                              </div>
                            </CRow>
                          </CCol>
                        </CRow>
                      </CForm>
                    </CCardBody>
                    <div className="col">

                      <CNav variant="tabs">
                        <CNavItem>
                          {/* <CNavLink
                                active
                                style={{ cursor: "pointer", marginTop: "-25px" }}
                              >
                                <strong>Courses</strong>
                              </CNavLink> */}
                        </CNavItem>
                      </CNav>
                      <div className="card-header border-0 d-flex justify-content-between">

                        <div className="d-flex row align-items-center">
                          <div className="col-md-6 col-xxl-4">
                            <CNavLink
                              active
                              style={{ cursor: "pointer", marginLeft: "20px" }}
                            >
                              <strong>Courses</strong>
                            </CNavLink>
                          </div>
                          <div className="col-md-6 col-xxl-4">
                            <span className="p-input-icon-left">
                              <i className="pi pi-search" />
                              <InputText
                                value={globalFilterValueCourses}
                                onChange={onGlobalFilterChangeCourses}
                                style={{ height: "20px" }}
                                className="p-input-sm"
                                placeholder="Search..."
                              />
                            </span>
                          </div>
                        </div>

                        <div
                          className="d-flex row align-items-center"
                        // style={{ flexWrap: "nowrap" }}
                        >
                          <div className="col-md-6 col-xxl-6">
                            {!loader ? (
                              <Skeleton
                                width="20rem"
                                height="2rem"
                              ></Skeleton>
                            ) : (
                              <MultiSelect
                                value={selectedCat}
                                options={categoriesNames}
                                onChange={(e) => {
                                  setSelectedCat(e.value);
                                  onGlobalFilterChangeCourse(e);
                                }}
                                placeholder="Categories"
                                className="p-column-filter"
                                style={{
                                  height: "2rem",
                                  lineHeight: "11px",
                                  width: "20rem",
                                }}
                                editable
                              />
                            )}
                          </div>


                        </div>
                        <div
                          className="col-md-6 col-xxl-6"
                          style={{
                            paddingLeft: "4rem",
                            width: "20rem",
                            marginRight: "40px"
                          }}
                        >
                          <CFormSelect
                            required
                            aria-label="select example"
                            value={globalFilterValueCourse}
                            onChange={onGlobalFilterChangeCourse}
                          >
                            <option selected value={""}>
                              All Course Type
                            </option>
                            <option value="eLearning">
                              eLearning
                            </option>
                            <option value="Assessment">
                              Assessment
                            </option>
                            <option value="Classroom">
                              Classroom
                            </option>
                          </CFormSelect>
                        </div>
                      </div>

                      <CCardBody
                        style={{ overflow: "auto", height: "18rem" }}
                      >
                        {!loader ? (
                          <DataTable
                            value={items4}
                            removableSort
                            showGridlines
                            className="p-datatable-striped"
                          >
                            <Column
                              selectionMode="multiple"
                              headerStyle={{ width: "3rem" }}
                            ></Column>
                            <Column
                              field="courseTitle"
                              header="Course Name"
                              body={bodyTemplate}
                            ></Column>
                            <Column
                              field="categoryName"
                              header="Category Name"
                              body={bodyTemplate}
                            ></Column>
                            <Column
                              field="trainingType"
                              header="Training Type"
                              body={bodyTemplate}
                            ></Column>
                          </DataTable>
                        ) : (
                          <DataTable
                            selectionMode={rowClick ? null : "checkbox"}
                            onSelectionChange={(e) => {
                              setSelectedCourse(e.value);
                              onGlobalFilterChangeCourse;

                              // setAssignmentPayload({
                              //     ...assignmentPayload,
                              //     courseName: e.target.value,
                              //   });

                              setAssignmentPayload({
                                ...assignmentPayload,
                                courses: e.value.map(
                                  (e) => e.courseLibraryId
                                ),
                              });
                            }}
                            selection={selectedCourse}
                            value={courseList}
                            removableSort
                            showGridlines
                            rowHover
                            emptyMessage="-"
                            dataKey="courseLibraryId"
                            filters={filtersCourse}
                            filterDisplay="menu"
                            globalFilterFields={[
                              "courseTitle",
                              "trainingCode",
                              "courseLibraryName",
                              "categoryName",
                              "trainingType",
                              "status",
                            ]}
                          >
                            <Column
                              selectionMode="multiple"
                              headerStyle={{ width: "3rem" }}
                            ></Column>
                            <Column
                              body={courseTitle}
                              field="courseTitle"
                              header="Course Name"
                              style={{ fontSize: ".8rem" }}
                              showFilterMenu={false}
                              filter
                              // filterElement={courseNameRowFilterTemplate}
                              filterMenuStyle={{ width: "14rem" }}
                            ></Column>
                            <Column
                              style={{ fontSize: ".8rem" }}
                              body={(rowData) =>
                                rowData.categoryName != 0 ? (
                                  <>{rowData.categoryName.join(",")}</>
                                ) : (
                                  <div>-</div>
                                )
                              }
                              field="categoryName"
                              header="Category Name"
                              showFilterMenu={false}
                              filterMenuStyle={{ width: "14rem" }}
                              // style={{ minWidth: "14rem" }}
                              filter
                            // filterElement={catergoryNameRowFilterTemplate}
                            ></Column>
                            <Column
                              header="Training Type"
                              style={{ fontSize: ".8rem" }}
                              field="trainingType"
                              showFilterMenu={false}
                              filterMenuStyle={{ width: "14rem" }}
                              // style={{ minWidth: "8rem" }}
                              filter
                            // filterElement={trainingTypeRowFilterTemplate}
                            ></Column>

                            <Column
                              field="credits"
                              header="Credit"
                            ></Column>
                          </DataTable>
                        )}
                      </CCardBody>

                    </div>
                  </CCard>
                </CCol>
              </CRow>

              <div className="row mt-3">
                <div className="col">
                  <CCard>
                    <CNav variant="tabs">
                      <CNavItem>
                        {/* <CNavLink active style={{ cursor: "pointer" }}>
                            <strong>Users</strong>
                          </CNavLink> */}
                      </CNavItem>
                    </CNav>
                    <CTabContent className="rounded-bottom">
                      <CTabPane className=" preview" visible>
                        <div className="card-header border-0 d-flex justify-content-between">
                          <div className="d-flex align-items-center">
                            <div style={{ marginLeft: '15px' }}>
                              <CNavLink active style={{ cursor: "pointer" }}>
                                <strong>Users</strong>
                              </CNavLink>
                            </div>
                            <div style={{ marginLeft: '90px', marginRight: '110px' }}>
                              <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText
                                  value={globalFilterValueUsers}
                                  onChange={onGlobalFilterChangeUsers}
                                  style={{ height: "30px" }}
                                  className="p-input-sm"
                                  placeholder="Search..."
                                />
                              </span>
                            </div>
                           
                              <div>
                                <CFormSelect
                                  required
                                  aria-label="select example"
                                  onChange={(e) => onChangeRole(e)}
                                >
                                  <option value="1">Level 1</option>
                                  <option value="2">Level 2</option>
                                  <option value="3">Level 3</option>
                                </CFormSelect>
                              </div>
                           
                          </div>
                        </div>
                      </CTabPane>
                    </CTabContent>
                    <CCardBody style={{ height: "23rem", overflow: "auto" }}>
                      {!loader ? (
                        <DataTable
                          value={items3}
                          removableSort
                          showGridlines
                          className="p-datatable-striped"
                        >
                          {/* <Column
                              selectionMode="multiple"
                              headerStyle={{ width: "3rem" }}
                            ></Column> */}
                          <Column
                            field="firstName"
                            header="Name"
                            body={bodyTemplate}
                          ></Column>
                        </DataTable>
                      ) : (
                        <DataTable
                          selectionMode={rowClick ? null : "checkbox"}
                          onSelectionChange={(e) => {
                            setSelectedUser(e.value);

                            setAssignmentPayload({
                              ...assignmentPayload,
                              users: e.value.map((e) => e.userId),
                            });
                          }}
                          selection={selectedUser}
                          value={userList}
                          removableSort
                          showGridlines
                          rowHover
                          emptyMessage="-"
                          dataKey="userId"
                          filters={filtersUsers}
                          filterDisplay="menu"
                          globalFilterFields={["firstName"]}
                        >
                          <Column
                            selectionMode="multiple"
                            headerStyle={{ width: "3rem" }}
                          ></Column>
                          <Column
                            field="userName"
                            header="Name"
                            style={{ fontSize: ".8rem" }}
                          ></Column>
                          <Column
                            field="JobTitle"
                            header="Job Title"
                            style={{ fontSize: ".8rem" }}
                          ></Column>
                        </DataTable>
                      )}
                    </CCardBody>
                  </CCard>
                </div>
                <div className="col">
                  <CCard>
                    <CNav variant="tabs">
                      {/* <CNavItem>
                        <CNavLink active style={{ cursor: "pointer" }}>
                          <strong>Groups</strong>
                        </CNavLink>
                      </CNavItem> */}
                    </CNav>
                    <CTabContent className="rounded-bottom">
                      <CTabPane className=" preview" visible>
                        <div className="card-header border-0 d-flex justify-content-between">
                          <div className="d-flex align-items-center">
                            <div style={{ marginLeft: '15px' }}>
                              <CNavLink active style={{ cursor: "pointer" }}>
                                <strong>Groups</strong>
                              </CNavLink>
                            </div>
                            <div style={{ marginLeft: '80px', marginRight: '90px' }}>
                              <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText
                                  value={globalFilterValueGroups}
                                  onChange={onGlobalFilterChangeGroups}
                                  style={{ height: "30px" }}
                                  className="p-input-sm"
                                  placeholder="Search..."
                                />
                              </span>
                            </div>
                            <div>
                              <CFormSelect
                                required
                                aria-label="select example"
                                // value={"level1"} // Set the default selected value here
                                onChange={onGlobalFilterChangeCourse}
                              >
                                <option value="level1">All Group</option>
                                <option value="level2">Assigned Group</option>
                              </CFormSelect>
                            </div>
                          </div>
                        </div>
                      </CTabPane>
                    </CTabContent>
                    <CCardBody style={{ height: "23rem", overflow: "auto" }}>
                      {!loader ? (
                        <DataTable value={items3} removableSort showGridlines>
                          <Column
                            selectionMode="multiple"
                            headerStyle={{ width: "2rem" }}
                            style={{ fontSize: ".8rem" }}
                            className="p-datatable-striped"
                          ></Column>
                          <Column
                            field="groupName"
                            header="Name"
                            body={bodyTemplate}
                            style={{ fontSize: ".8rem" }}
                          ></Column>
                        </DataTable>
                      ) : (
                        <DataTable
                          selectionMode={rowClick ? null : "checkbox"}
                          onSelectionChange={(e) => {
                            setSelectedGroup(e.value);
                            setAssignmentPayload({
                              ...assignmentPayload,
                              groups: e.value.map((e) => e.groupId),
                            });
                            getUserByGroupsId(e.value.map((e) => e.groupId));
                          }}
                          selection={selectedGroup}
                          value={groupList}
                          removableSort
                          showGridlines
                          rowHover
                          emptyMessage="-"
                          dataKey="groupId"
                          filters={filtersGroups}
                          filterDisplay="menu"
                          globalFilterFields={["groupName"]}
                        >
                          <Column
                            selectionMode="multiple"
                            headerStyle={{ width: "2rem" }}
                            style={{ fontSize: ".8rem" }}
                          ></Column>
                          <Column
                            field="groupName"
                            header="Name"
                            style={{ fontSize: ".8rem" }}
                          ></Column>
                          <Column
                            field="groupCode"
                            header="Group Code"
                            style={{ fontSize: ".8rem" }}
                          ></Column>
                        </DataTable>
                      )}
                    </CCardBody>
                  </CCard>
                </div>

              </div>


              <CCardFooter>
                <div
                  className="d-flex justify-content-end"
                  style={{ marginLeft: "-200px" }}
                >
                  <Link to="/admin/assigntraining">
                    <CButton
                      className="me-md-2 btn btn-primary"
                      onClick={(e) => { }}
                      style={{ marginRight: "20px" }}
                    >
                      Back
                    </CButton>
                  </Link>
                  <CButton
                    className="me-md-2 btn btn-primary"
                    onClick={(e) => {
                      validateForm(e);
                    }}
                  >
                    Assign
                  </CButton>
                </div>
              </CCardFooter>
            </CCard>
          </div>
        </div>
        <div className="row mt-4"></div>
      </div>
    </>
  );
}

export default Addassignments;
