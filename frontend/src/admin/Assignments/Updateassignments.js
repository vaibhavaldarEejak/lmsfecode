import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import generalDeleteApiCall from "src/server/generalDeleteApiCall";

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
import generalUpdateApi from "src/server/generalUpdateApi";
const API_URL = process.env.REACT_APP_API_URL;

function Updateassignments() {
  const toast = useRef(null);
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const [rowClick, setRowClick] = useState(false);
  const [selectedCat, setSelectedCat] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [batData, setBatData] = useState(null);
  const [groupdata, setGroupData] = useState(null);
  const [selectedUser, setSelectedUser] = useState([]);
  const colorName = localStorage.getItem("ThemeColor");
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [filtersUsers, setFiltersUsers] = useState(null);
  const [filtersGroups, setFiltersGroups] = useState(null);
  const [filtersCourse, setFiltersCourse] = useState(null);
  const [globalFilterValueUsers, setGlobalFilterValueUsers] = useState("");
  const [globalFilterValueGroups, setGlobalFilterValueGroups] = useState("");
  const [globalFilterValueCourse, setGlobalFilterValueCourse] = useState("");
  const [groupList, setGroupList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [courseList, setCourseList] = useState();
  const [dueDate, setDueDate] = useState("");
  const [categoriesNames, setCategoriesNames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loader, setLoader] = useState(false);
  const [themes, setThemes] = useState(colorName);
  const [updatedDate, setUpdatedDate] = useState('');
  const [assignmentId, setAssignmentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [form, setForm] = useState({
    assignmentId: 0,
    assignmentName: "",
    group: [],
    user: [],
    category: [],
    course: [],
    dueDate: "",
  });

  const [assignmentDetail, setAssignmentDetail] = useState("");

  // let assignmentId1 = "";
  // useEffect(() => {
  //   assignmentId1 = localStorage.getItem("assignmentId");
  //   setAssignmentId(assignmentId1);
  // }, []);

  let assignmentId1 = "";
  useEffect(() => {
    assignmentId1 = localStorage.getItem("assignmentId");
    setAssignmentId(assignmentId1);
  }, []);

  useMemo(() => {
    setForm({
      assignmentId: assignmentDetail.assignmentId,
      assignmentName: assignmentDetail.assignmentName,
      dueDate: assignmentDetail.dueDate,
      groupId: assignmentDetail.groupId,
      userId: assignmentDetail.userId,
      courseId: assignmentDetail.courseId,
      credits: assignmentDetail.credits,
      training_name: assignmentDetail.training_name,
      training_type: assignmentDetail.training_type,
      trainingCategory: assignmentDetail.trainingCategory,

      user:
        assignmentDetail.user &&
        assignmentDetail.user.map((e) => ({
          label: e.fullName,
          value: e.userId,
        })),
      group:
        assignmentDetail.group &&
        assignmentDetail.group.map((e) => ({
          label: e.groupName,
          value: e.groupId,
        })),
      course:
        assignmentDetail.course &&
        assignmentDetail.course.map((e) => ({
          label: e.courseName,
          value: e.courseId,
        })),
    });

    // console.log("assignmentId",assignmentDetail.assignmentId)
    // console.log("courseId",assignmentDetail.courseId)


  }, [assignmentDetail]);


  useEffect(() => {
    if (form.assignmentId && form.courseId) {
      getActiveUserListing1();
      getActiveGroupListing();
    }
  }, [form.assignmentId, form.courseId]);


  const getActiveUserListing1 = async () => {
    try {
      const response = await getApiCall(
        `getUserListByAssignmentId/${form.assignmentId}/${form.courseId}`
      );
      setBatData(response);
      // Handle the response as needed
    } catch (error) {
      console.error(error);
    }
  };



  const getActiveGroupListing = async () => {
    try {
      const response = await getApiCall(
        `getGroupListByAssignmentId/${form.assignmentId}/${form.courseId}`
      );
      setGroupData(response);
    } catch (error) {
      console.log(error);
    }
  };

  const items3 = Array.from({ length: 3 }, (v, i) => i);
  const items4 = Array.from({ length: 4 }, (v, i) => i);

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
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

  const onGlobalFilterChangeCourse = (e) => {
    const value = e.target.value;
    let _filters = { ...filtersCourse };
    _filters["global"].value = value;

    setFiltersCourse(_filters);
    setGlobalFilterValueCourse(value);
  };






  // const getActiveGroupListing = async (assignmentId, courseId) => {
  //   try {
  //     const response = await getApiCall(
  //       `getGroupListByAssignmentId/${assignmentId}/${courseId}`
  //     );
  //     setGroupData(response);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };



  const buttonTemplate6 = (rowData) => (
    <div style={{ display: "flex" }}>
      <div>
        <div
          title="User View"
          style={{ cursor: "pointer" }}
          onClick={() => RemoveUserAssignment(rowData.assignmentId, rowData.userId)}
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


  const [courseData, setCourseData] = useState([]);

  const navigate = useNavigate();


  const assignmentGetByIdApi = async (assignmentId) => {
    try {
      const res = await getApiCall("getAssignmentById", assignmentId);
      setAssignmentDetail(res);

    } catch (err) {
      console.log(err);
    }
  };
  const apiDueDate = assignmentDetail.dueDate;

  const dateString = assignmentDetail.dueDate;
  const date = new Date(dateString);

  const formattedDate4 = date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  });
  console.log(formattedDate4)
  useEffect(() => {
    setDueDate(formattedDate4);
  }, [apiDueDate])


  const getGroupListing = async (groupIds) => {
    try {
      const response = await axios.get(`${API_URL}/getOrgGroupList`, {
        headers: { Authorization: token },
      });
      const updatedGroupList = response.data.data.map((item) => {
        if (groupIds?.includes(item.groupId)) {
          item.isChecked = true;
        }
        return item;
      });
      setGroupList(updatedGroupList);
    } catch (err) {
      console.error(err);
    }
  };

  const getActiveUserListing = async (userIds) => {
    try {
      const response = await axios.get(
        `${API_URL}/getUserList?userType=activeUser&sort=firstName&order=ASC`,
        {
          headers: { Authorization: token },
        }
      );
      const updatedUserList = response.data.data.map((item) => {
        if (userIds?.includes(item.userId)) {
          item.isChecked = true;
        }
        return item;
      });
      setUserList(updatedUserList);
    } catch (err) {
      console.error(err);
    }
  };


  const RemoveUserAssignment = async (assignmentId, userId) => {
    const data = {
      id: userId,
      type: 1,
    };

    try {
      const response = await generalDeleteApiCall(
        `deleteUserGroupAssignment/${form.assignmentId}`,
        data
      );


      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "User Removed Successfully!",
        life: 3000,
      });

      setBatData((prevData) =>
        prevData.filter((user) => user.assignmentId !== assignmentId)
      );


    } catch (error) {

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Removing User",
        life: 3000,
      });
    }
  };


  const RemoveGroupAssignment = async (assignmentId, groupId) => {
    const data = {
      id: groupId,
      type: 2,
    };

    try {
      const response = await generalDeleteApiCall(
        `deleteUserGroupAssignment/${form.assignmentId}`,
        data
      );


      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Group Removed Successfully!",
        life: 3000,
      });

      setGroupData((prevData) =>
        prevData.filter((group) => group.assignmentId !== assignmentId)
      );

    } catch (error) {

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Removing Group",
        life: 3000,
      });
    }
  };

  // const getCourseListing = async (courseIds) => {
  //   // courseLibraryId
  //   console.log({ courseIds });

  //   try {
  //     const response = await axios.get(`${API_URL}/getCourseCatalogList`, {
  //       headers: { Authorization: token },
  //     });
  //     console.log({ courseIds });
  //     const updatedCourseList = response.data.data.map((c) => {

  //       if (courseIds?.includes(c.courseLibraryId)) {
  //         console.log("res");
  //         c.isChecked = true;
  //       }
  //       return c;
  //     });
  //     console.log({ updatedCourseList });
  //     setCourseList(updatedCourseList);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // const getCategoryList = async () => {
  //   //axios await
  //   try {
  //     const response = await axios.get(
  //       `${API_URL}/getOrganizationCategoryOptionList`,
  //       {
  //         headers: { Authorization: token },
  //       }
  //     );
  //     setCategoriesNames(response.data.data.map((e) => e.categoryName));
  //     setCategories(response.data.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const updateAssignment = async (data) => {
    try {
      const res = await generalUpdateApi("updateAssignmentById", data);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Courses Assignment Done Successfully",
        life: 3000,
      });

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



  const handleSave2 = (e) => {
    e.preventDefault();

    let formData = new FormData();
    //User Functionality


    form.user = userList.map((e) => (e.isChecked ? e.userId : ""));
    var filtereduser = form.user.filter(function (el) {
      return el !== "";
    });
    formData.append("userId[]", filtereduser);
    //Group Functionality
    form.group = groupList.map((e) => (e.isChecked ? e.groupId : ""));
    var filteredgroup = form.group.filter(function (grp) {
      return grp != "";
    });
    formData.append("groupId[]", filteredgroup);

    console.log(courseList);

    //Course Functionality
    form.course = courseList.map((e) => (e.isChecked ? e.courseLibraryId : ""));
    const filteredCourseIds = form.course.filter((id) => id !== "");
    formData.append("courseId", filteredCourseIds);

    formData.append("assignmentId", form.assignmentId);

    formData.append("assignmentName", form.assignmentName);
    const date = new Date(form.dueDate);

    const formattedDate = date.toISOString()
    formData.append("dueDate", formattedDate);
    console.log(formattedDate);

    console.log({ formData });
    if (assignmentDetail) {
      updateAssignment(formData);
    }
  };



  const AssignmentName = (assignmentDetail) => (
    <>
      {assignmentDetail.assignmentName ? assignmentDetail.assignmentName : "-"}
    </>
  );
  const courseTitle = (courseData) => (
    <>{courseData.courseName ? courseData.courseName : "-"}</>
  );

  const dueDate1 = (assignmentDetail) => (
    <>{assignmentDetail.dueDate ? assignmentDetail.dueDate : "-"}</>
  );

  // useEffect(() => {
  //   setForm({
  //     ...form,
  //     category: categories
  //       .filter((c) => selectedCat.includes(c.categoryName))
  //       .map((c) => c.categoryId),
  //   });
  // }, [selectedCat]);

  useEffect(() => {
    if (token !== "Bearer null") {
      setTimeout(() => {
        setLoader(true);
      }, [2000]);

      initFiltersUsers();
      initFiltersGroups();
      initFiltersCourse();

      // getActiveGroupListing();

    }
  }, []);

  useEffect(() => {
    if (assignmentId) {
      assignmentGetByIdApi(Number(assignmentId));
    }
    // getCategoryList();
  }, [assignmentId]);

  // Users checkbox
  const handleChange = (e, userId) => {
    setUserList((prevUserList) =>
      prevUserList.map((item) =>
        item.userId === userId ? { ...item, isChecked: e.target.checked } : item
      )
    );
  };

  const checkbox1 = (user) => (
    <input
      className="form-check-input"
      type="checkbox"
      checked={user.isChecked}
      value={user.userId}
      onChange={(event) => handleChange(event, user.userId)}
      style={{ marginTop: "11px" }}
    />
  );

  //Group checkbox

  const handleGrpChange = (e, groupId) => {
    setGroupList((prevGroupList) =>
      prevGroupList.map((item) =>
        item.groupId === groupId
          ? { ...item, isChecked: e.target.checked }
          : item
      )
    );
  };

  const checkbox2 = (group) => (
    <input
      className="form-check-input"
      type="checkbox"
      defaultChecked={group.isChecked}
      value={group.groupId}
      onChange={(e) => handleGrpChange(e, group.groupId)}
      style={{ marginTop: "11px" }}
    />
  );
  //Couses Checkbox

  const handleCourseChange = (e, course) => {
    const newCourseList = courseList.map((item) =>
      item.courseLibraryId === course.courseLibraryId
        ? { ...item, isChecked: e.target.checked }
        : item
    )
    setCourseList(newCourseList)

    console.log({ newCourseList });
  };


  const checkbox3 = (course) => (
    <input
      className="form-check-input"
      type="checkbox"
      checked={course.isChecked}
      value={course.courseId}
      onChange={(event) => handleCourseChange(event, course)}
      style={{ marginTop: "11px" }}
    />
  );

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
                    <strong>View Assignment</strong>
                  </CNavLink>
                </CNavItem>
              </CNav>
              <CCardBody style={{ overflow: "auto", height: "60rem" }}>

                <CRow>

                  <CCol lg={12} className="mb-3">
                    <CCard className="h-100">
                      <CCardBody className="p-4">
                        <CForm className={`row g-15 needs-validation ps-4 InputThemeColor`}>
                          {/* First Row */}
                          <CRow className="mb-4">
                            {/* First Column - Assignment Name */}
                            <CCol md={6}>
                              <CRow className="mb-3">
                                <CFormLabel
                                  htmlFor=""
                                  className="col-sm-3 col-form-label fw-bolder fs-7"
                                >
                                  Assignment Name
                                </CFormLabel>
                                <div className="col-sm-8 col-md-9" style={{ marginTop: '5px' }}>
                                  {/* <CFormTextarea
                                      rows={3}
                                      type="text"
                                      id="validationCustom01"
                                      value={form.assignmentName}
                                      onChange={(e) => {
                                        setForm({
                                          ...form,
                                          assignmentName: e.target.value,
                                        });
                                      }}
                                      required
                                      placeholder="Assignment Name"
                                    /> */}
                                  {form.assignmentName}
                                </div>
                              </CRow>
                            </CCol>

                            {/* Second Column - Due Date */}
                            <CCol md={6}>
                              <CRow className="mb-3">
                                <CFormLabel
                                  htmlFor=""
                                  className="col-sm-3 col-form-label fw-bolder fs-7 "
                                >
                                  Due Date
                                </CFormLabel>
                                <div className="col-sm-8" style={{ marginTop: '5px' }}>
                                  {form.dueDate}
                                  {/* <Calendar
                  value={dueDate}
                  placeholder="Select a Date"
                  onChange={(e) => {
                    setDueDate(e.value);
                    console.log(e);
                    setForm({
                      ...form,
                      dueDate: e.value,
                    });
                  }}
                  showIcon
                /> */}
                                </div>
                              </CRow>
                            </CCol>
                          </CRow>

                          {/* Second Row */}
                          <CRow className="mb-4">
                            <CCol md={6}>
                              <CRow className="mb-3">
                                <CFormLabel
                                  htmlFor=""
                                  className="col-sm-3 col-form-label fw-bolder fs-7"
                                >
                                  Training Name
                                </CFormLabel>
                                <div className="col-sm-8 col-md-9" style={{ marginTop: '5px' }}>
                                  {form.training_name}
                                </div>
                              </CRow>
                            </CCol>
                            <CCol md={6}>
                              <CRow className="mb-3">
                                <CFormLabel
                                  htmlFor=""
                                  className="col-sm-3 col-form-label fw-bolder fs-7"
                                >
                                  Training Type
                                </CFormLabel>
                                <div className="col-sm-8 col-md-9" style={{ marginTop: '5px' }}>
                                  {/* <CFormTextarea
                                      rows={3}
                                      type="text"
                                      id="validationCustom01"
                                      value={form.assignmentName}
                                      onChange={(e) => {
                                        setForm({
                                          ...form,
                                          assignmentName: e.target.value,
                                        });
                                      }}
                                      required
                                      placeholder="Training Type"
                                    /> */}
                                  {form.training_type}
                                </div>
                              </CRow>
                            </CCol>
                            {/* Third Column - Content for Row 2 */}
                            {/* Add your content for the third column here */}
                          </CRow>

                          {/* Third Row */}
                          <CRow className="mb-4">
                            <CCol md={6}>
                              <CRow className="mb-3">
                                <CFormLabel
                                  htmlFor=""
                                  className="col-sm-3 col-form-label fw-bolder fs-7"
                                >
                                  Training Category
                                </CFormLabel>
                                <div className="col-sm-8 col-md-9" style={{ marginTop: '5px' }}>
                                  {form.trainingCategory && form.trainingCategory.length > 0 && (
                                    <div>
                                      {/* Render category names as a comma-separated string */}
                                      {form.trainingCategory.map(category => category.categoryName).join(', ')}
                                    </div>
                                  )}
                                </div>
                              </CRow>

                            </CCol>
                            <CCol md={6}>
                              <CRow className="mb-3">
                                <CFormLabel
                                  htmlFor=""
                                  className="col-sm-3 col-form-label fw-bolder fs-7"
                                >
                                  Credit
                                </CFormLabel>
                                <div className="col-sm-8 col-md-9" style={{ marginTop: '5px' }}>
                                  {form.credits}
                                </div>
                              </CRow>
                            </CCol>

                            {/* Fourth Column - Content for Row 3 */}
                            {/* Add your content for the fourth column here */}
                          </CRow>

                        </CForm>
                      </CCardBody>
                    </CCard>
                  </CCol>
                  <div className="row mt-0" style={{ maxwidth: '100%' }}>
                    <div className="col">
                      <CCard>

                        <CNav variant="tabs">
                          <CNavItem>
                            <CNavLink active style={{ cursor: "pointer" }}>
                              <strong>Users</strong>
                            </CNavLink>
                          </CNavItem>
                        </CNav>
                        <CTabContent className="rounded-bottom">
                          <CTabPane className=" preview" visible>
                            <div className="card-header border-0 d-flex justify-content-between">
                              <div className="d-flex row align-items-center">
                                {/* <div className="col-md-6 col-xxl-4">
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
                                    </div> */}
                              </div>
                            </div>
                          </CTabPane>
                        </CTabContent>

                        <CCardBody style={{ height: "23rem", overflow: "auto", maxwidth: '100%' }}>
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
                              isChecked="true"
                              onSelectionChange={(e) => {
                                setSelectedUser(e.value);

                                setForm({
                                  ...form,
                                  users: e.value.map((e) => e.userId),
                                });
                              }}
                              selection={selectedUser}
                              value={batData}
                              removableSort
                              showGridlines
                              rowHover
                              emptyMessage="-"
                              dataKey="userId"
                              filters={filtersUsers}
                              filterDisplay="menu"
                              globalFilterFields={["firstName"]}
                            >
                              {/* <Column
                                  // selectionMode="multiple"
                                  body={checkbox1}
                                  headerStyle={{ width: "3rem" }}
                                  style={{ maxWidth: "2.7rem" }}
                                ></Column> */}
                              <Column
                                field="Name"
                                header="Full Name"
                                sortable
                              ></Column>
                              <Column
                                field="jobTitle"
                                header="Job Title"
                              ></Column>
                              <Column
                                field="Action"
                                header="Action"
                                body={buttonTemplate6}
                              ></Column>
                            </DataTable>
                          )}
                        </CCardBody>
                      </CCard>
                    </div>
                    <div className="col">
                      <CCard>

                        <CNav variant="tabs">
                          <CNavItem>
                            <CNavLink active style={{ cursor: "pointer" }}>
                              <strong>Groups</strong>
                            </CNavLink>
                          </CNavItem>
                        </CNav>
                        <CTabContent className="rounded-bottom">
                          <CTabPane className=" preview" visible>
                            <div className="card-header border-0 d-flex justify-content-between">
                              <div className="d-flex row align-items-center">
                                {/* <div className="col-md-6 col-xxl-4">
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
                                    </div> */}
                              </div>
                            </div>
                          </CTabPane>
                        </CTabContent>

                        <CCardBody style={{ height: "23rem", overflow: "auto" }}>
                          {!loader ? (
                            <DataTable value={items3} removableSort showGridlines>
                              {/* <Column
                                  selectionMode="multiple"
                                  headerStyle={{ width: "2rem" }}
                                  style={{ fontSize: ".8rem" }}
                                  className="p-datatable-striped"
                                ></Column> */}
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
                              isChecked="true"
                              onSelectionChange={(e) => {
                                setSelectedGroup(e.value);
                                setForm({
                                  ...form,
                                  groups: e.value.map((e) => e.groupId),
                                });
                              }}
                              selection={selectedGroup}
                              value={groupdata}
                              removableSort
                              showGridlines
                              rowHover
                              emptyMessage="-"
                              dataKey="groupId"
                              filters={filtersGroups}
                              filterDisplay="menu"
                              globalFilterFields={["groupName"]}
                            >
                              {/* <Column
                                  body={checkbox2}
                                  headerStyle={{ width: "3rem" }}
                                ></Column> */}
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
                              <Column
                                field="Action"
                                header="Action"
                                body={buttonTemplate7}
                              ></Column>
                            </DataTable>
                          )}
                        </CCardBody>
                      </CCard>
                    </div>

                  </div>
                </CRow>
              </CCardBody>

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
                  {/* <CButton
                    className="me-md-2 btn btn-primary"
                    onClick={(e) => {
                      handleSave2(e);
                    }}
                  >
                    Assign
                  </CButton> */}
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

export default Updateassignments;