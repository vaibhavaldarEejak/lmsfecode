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
  CFormInput,
  CBadge,
} from "@coreui/react";
import { Toast } from "primereact/toast";
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
import { FilterMatchMode } from "primereact/api";
import { Skeleton } from "primereact/skeleton";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import "../../css/themes.css";
import "./../../css/themes.css";
import postApiCall from "src/server/postApiCall";
import getApiCall from "src/server/getApiCall";
import generalDeleteApiCall from "src/server/generalDeleteApiCall";
import "../../css/table.css";

import { Divider } from "primereact/divider";
const API_URL = process.env.REACT_APP_API_URL;

const manageCourseLibraryListingWidget = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);

  const toast = useRef(null);
  const [selectAll, setSelectAll] = useState(false);
  const [filters, setFilters] = useState(null);
  const [filters2, setFilters2] = useState(null);
  const [categories, setCategories] = useState([]);
  const [trainingIds, setTrainingIds] = useState([]);
  const [trainingCode, setTrainingCode] = useState("");
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [globalFilterValue2, setGlobalFilterValue2] = useState("");
  const [selectedContent, setSelectedContent] = useState([]);
  const [selectedOrgs, setSelectedOrgs] = useState([]);
  const [orgOptionList, setOrgOptionList] = useState([]);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [courses, setCourses] = useState([]);
  const [contentPayload, setContentPayload] = useState([{ trainingIds: null, organizationIds: null }]);
  const [checkStatus, setCheckStatus] = useState(false);
  const [responseData, setResponseData] = useState([]);
  const [rowClick, setRowClick] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orgvisible, setOrgVisible] = useState(false);
  const [orgvisible2, setOrgVisible2] = useState(false);
  const [assignCourseStatus, setAssignCourseStatus] = useState(false);

  const navigate = useNavigate();
  const courseType = window.location.href.split("?")[1] || "";
  const optionalPara = window.location.href.split("?")[1];

  const [statuses] = useState(["Draft", "Published", "Unpublished"]);
  const [trainingTypes] = useState(["eLearning", "Classroom", "Assessments"]);

  // useEffect(() => {
  //   if (token !== "Bearer null") {
  //     getCertificateListing();
  //     getCategoryList();
  //     initFilters();
  //     initFilters2();

  //     if (trainingCode) {
  //       getAssignedOrganizationById(trainingCode);
  //     } else {
  //       getOrganizationOptionsList();
  //     }
  //   }

  //   if (optionalPara === "eLearning") {
  //     const filteredData = courses.filter(
  //       (items) => items.trainingTypeId === 1
  //     );
  //     setResponseData(filteredData);
  //   } else if (optionalPara === "Classroom") {
  //     const filteredData = courses.filter(
  //       (items) => items.trainingTypeId === 2
  //     );
  //     setResponseData(filteredData);
  //   } else if (optionalPara === "Assessments") {
  //     const filteredData = courses.filter(
  //       (items) => items.trainingTypeId === 3
  //     );
  //     setResponseData(filteredData);
  //   } else if (optionalPara === "All" || optionalPara === "") {
  //     const filteredData = courses;
  //     setResponseData(filteredData);
  //   } else if (optionalPara === "Archived") {
  //     const filteredData = courses.filter(
  //       (items) => items.status === "Archived"
  //     );
  //     setResponseData(filteredData);
  //   }
  // }, [trainingCode, optionalPara]);

  useEffect(() => {
    if (token !== "Bearer null") {
      getCertificateListing();
      getCategoryList();
      initFilters();
      initFilters2();

      if (trainingCode) {
        getAssignedOrganizationById(trainingCode);
      } else {
        getOrganizationOptionsList();
      }
    }

    let filteredData = [];
    if (optionalPara === "eLearning") {
      filteredData = courses.filter((items) => items.trainingTypeId === 1);
    } else if (optionalPara === "Classroom") {
      filteredData = courses.filter((items) => items.trainingTypeId === 2);
    } else if (optionalPara === "Assessments") {
      filteredData = courses.filter((items) => items.trainingTypeId === 3);
    } else if (optionalPara === "Archived") {
      filteredData = courses.filter((items) => items.status === "Archived");
    } else {
      filteredData = courses;
    }
    setResponseData(filteredData);
  }, [trainingCode, optionalPara]);

  const getCertificateListing = async () => {
    try {
      const res = await getApiCall("getCourseLibraryList");
      if (optionalPara === undefined) {
        setResponseData(res);
      }
      setCourses(res);
      setLoading(true);
    } catch (err) { }
  };

  function handleCheckboxChange(rowData, field, event) {
    const isChecked = event.target.checked ? 1 : 0;
    const updatedRow = { ...rowData, [field]: isChecked };
    const updatedData = orgOptionList.map(row =>
      row.organizationId === rowData.organizationId ? updatedRow : row
    );
  
    setOrgOptionList(updatedData);
    setContentPayload([{ trainingIds, organizationIds: updatedData }]);
  }
  

  // const statusShow = (responseData) => (
  //   <CBadge
  //     className={`badge badge-light-info text-info badgeColor${themes} `}
  //     color="light"
  //   >
  //     {responseData?.status}
  //   </CBadge>
  // );
  const statusShow = (responseData) => {
    const badgeColor = `badge badge-light-info text-info badgeColor${themes}`;
    return (
      <CBadge className={badgeColor} color="light">
        {responseData?.status}
      </CBadge>
    );
  };  

  // function handleSelectAll(event) {
  //   const isChecked = event.target.checked ? 1 : 0;
  //   const updatedData = orgOptionList.map((row) => ({
  //     ...row,
  //     isChecked: isChecked,
  //   }));
  //   setOrgOptionList(updatedData);
  //   setSelectAll(event.checked);

  //   setContentPayload([
  //     {
  //       trainingIds: trainingIds,
  //       organizationIds: updatedData,
  //     },
  //   ]);
  // }

  function handleSelectAll(event) {
    const isChecked = event.target.checked;
    const updatedData = orgOptionList.map((row) => ({ ...row, isChecked }));
    
    setOrgOptionList(updatedData);
    setSelectAll(isChecked);
    setContentPayload([{ trainingIds, organizationIds: updatedData }]);
  }
  
  const getOrganizationOptionsList = async () => {
    try {
      const res = await getApiCall("getOrganizationOptionsList");
      const updatedOrgOptionList = res.map((data) => ({
        organizationId: data.organizationId,
        organizationName: data.organizationName,
        domainName: data.domainName,
        isChecked: 0,
      }));
      setOrgOptionList(updatedOrgOptionList);
    } catch (err) {}
  };
  
  const getAssignedOrganizationById = async (id) => {
    try {
      const res = await getApiCall("getTrainingAssignedToOrganizationList", id);
      setOrgOptionList(res);
    } catch (err) {
      getOrganizationOptionsList();
      var errMsg = err?.response?.data?.error;

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
    }
  };

  const getCategoryList = async () => {
    try {
      const res = await getApiCall("getCategoryOptionList");
      setCategories(res.map((e) => e.categoryName));
    } catch (err) {
      var errMsg = err?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
    }
  };
  const deleteCourse = async (courseLibraryId) => {
    const data = {
      courseLibraryId: courseLibraryId,
    };
    try {
      const res = await generalDeleteApiCall("deleteCourseLibrary", data);
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

  // const editButtons = (responseData) => {
  //   if (responseData.trainingTypeId === 1) {
  //     return (
  //       <div
  //         title="Edit Course"
  //         onClick={() => {
  //           localStorage.setItem(
  //             "courseLibraryId",
  //             responseData.courseLibraryId
  //           );
  //           navigate(
  //             `/superadmin/courselibrarylist/editelearningcourselibrary`
  //           );
  //         }}
  //       >
  //         <svg
  //           xmlns="http://www.w3.org/2000/svg"
  //           width="20"
  //           height="20"
  //           fill="currentColor"
  //           style={{ margin: "0 0.5rem", cursor: "pointer" }}
  //           class={`bi bi-pencil-fill iconTheme${themes}`}
  //           viewBox="0 0 16 16"
  //         >
  //           <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
  //         </svg>
  //       </div>
  //     );
  //   } else if (responseData.trainingTypeId === 2) {
  //     return (
  //       <div
  //         title="Edit Course"
  //         onClick={() => {
  //           localStorage.setItem(
  //             "courseLibraryId",
  //             responseData.courseLibraryId
  //           );
  //           navigate(
  //             `/superadmin/courselibrarylist/editclassroomcourselibrary`
  //           );
  //         }}
  //       >
  //         <svg
  //           xmlns="http://www.w3.org/2000/svg"
  //           width="20"
  //           height="20"
  //           fill="currentColor"
  //           style={{ margin: "0 0.5rem", cursor: "pointer" }}
  //           class={`bi bi-pencil-fill iconTheme${themes}`}
  //           viewBox="0 0 16 16"
  //         >
  //           <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
  //         </svg>
  //       </div>
  //     );
  //   } else if (responseData.trainingTypeId === 3) {
  //     return (
  //       <div
  //         title="Edit Course"
  //         onClick={() => {
  //           localStorage.setItem(
  //             "courseLibraryId",
  //             responseData.courseLibraryId
  //           );
  //           navigate(
  //             `/superadmin/courselibrarylist/editassessmentcourselibrary`
  //           );
  //         }}
  //       >
  //         <svg
  //           xmlns="http://www.w3.org/2000/svg"
  //           width="20"
  //           height="20"
  //           fill="currentColor"
  //           style={{ margin: "0 0.5rem", cursor: "pointer" }}
  //           class={`bi bi-pencil-fill iconTheme${themes}`}
  //           viewBox="0 0 16 16"
  //         >
  //           <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
  //         </svg>
  //       </div>
  //     );
  //   }
  // };
  // const assignButton = (responseData) => {
  //   return (
  //     <div
  //       onClick={() => {
  //         setAssignCourseStatus(true);
  //         confirmAssignProduct(responseData);
  //       }}
  //       title="Assign Course"
  //     >
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         width="22"
  //         height="22"
  //         fill="currentColor"
  //         class={`bi bi-plus-circle-fill iconTheme${themes}`}
  //         style={{ margin: "0 0.5rem" }}
  //         viewBox="0 0 16 16"
  //       >
  //         <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
  //       </svg>
  //     </div>
  //   );
  // };
  // const buttonTemplate = (responseData) => (
  //   <div style={{ display: "flex" }}>
  //     <div
  //       title="View Course"
  //       onClick={() => {
  //         localStorage.setItem("courseLibraryId", responseData.courseLibraryId);
  //         navigate(`/superadmin/courselibrarylist/viewcourselibrary`);
  //       }}
  //     >
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         width="22"
  //         height="22"
  //         fill="currentColor"
  //         class={`bi bi-eye-fill iconTheme${themes}`}
  //         viewBox="0 0 16 16"
  //       >
  //         <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
  //         <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
  //       </svg>
  //     </div>
  //     {/* {responseData} */}
  //     {responseData.status === "Published" ? (
  //       <div
  //         title="Edit Course"
  //         onClick={() => confirmEditProduct(responseData)}
  //       >
  //         <svg
  //           xmlns="http://www.w3.org/2000/svg"
  //           width="20"
  //           height="20"
  //           fill="currentColor"
  //           style={{ margin: "0 0.5rem", cursor: "pointer" }}
  //           class={`bi bi-pencil-fill iconTheme${themes}`}
  //           viewBox="0 0 16 16"
  //         >
  //           <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
  //         </svg>
  //       </div>
  //     ) : (
  //       editButtons(responseData)
  //     )}
  //     {responseData.status === "Published" ? (
  //       <div
  //         onClick={(e) => {
  //           setTrainingCode(responseData.courseLibraryId);
  //           getAssignedOrganizationById(responseData.courseLibraryId);
  //           setTrainingIds([responseData.courseLibraryId]);
  //           setContentPayload([
  //             {
  //               trainingIds: trainingIds,
  //               organizationIds: null,
  //             },
  //           ]);
  //           setOrgVisible2(!orgvisible2);
  //         }}
  //         title="Assign Course"
  //       >
  //         <svg
  //           xmlns="http://www.w3.org/2000/svg"
  //           width="22"
  //           height="22"
  //           fill="currentColor"
  //           class={`bi bi-plus-circle-fill iconTheme${themes}`}
  //           style={{ margin: "0 0.5rem" }}
  //           viewBox="0 0 16 16"
  //         >
  //           <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
  //         </svg>
  //       </div>
  //     ) : (
  //       assignButton(responseData)
  //     )}
  //     <div
  //       title="Delete Course"
  //       onClick={() => confirmDeleteProduct(responseData)}
  //     >
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         width="22"
  //         height="22"
  //         fill="currentColor"
  //         class={`bi bi-trash-fill iconTheme${themes}`}
  //         viewBox="0 0 16 16"
  //       >
  //         <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
  //       </svg>
  //     </div>
  //   </div>
  // );
  const EditButton = ({ title, onClick }) => (
    <div title={title} onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        style={{ margin: "0 0.5rem", cursor: "pointer" }}
        className={`bi bi-pencil-fill iconTheme${themes}`}
        viewBox="0 0 16 16"
      >
        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
      </svg>
    </div>
  );
  
  const AssignButton = ({ title, onClick }) => (
    <div onClick={onClick} title={title}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        fill="currentColor"
        className={`bi bi-plus-circle-fill iconTheme${themes}`}
        style={{ margin: "0 0.5rem" }}
        viewBox="0 0 16 16"
      >
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
      </svg>
    </div>
  );
  
  const ViewButton = ({ title, onClick }) => (
    <div title={title} onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        fill="currentColor"
        className={`bi bi-eye-fill iconTheme${themes}`}
        viewBox="0 0 16 16"
      >
        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
      </svg>
    </div>
  );
  
  const DeleteButton = ({ title, onClick }) => (
    <div title={title} onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        fill="currentColor"
        className={`bi bi-trash-fill iconTheme${themes}`}
        viewBox="0 0 16 16"
      >
        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
      </svg>
    </div>
  );
  
  const editButtons = (responseData) => {
    switch (responseData.trainingTypeId) {
      case 1:
        return (
          <EditButton
            title="Edit Course"
            onClick={() => {
              localStorage.setItem("courseLibraryId", responseData.courseLibraryId);
              navigate(`/superadmin/courselibrarylist/editelearningcourselibrary`);
            }}
          />
        );
      case 2:
        return (
          <EditButton
            title="Edit Course"
            onClick={() => {
              localStorage.setItem("courseLibraryId", responseData.courseLibraryId);
              navigate(`/superadmin/courselibrarylist/editclassroomcourselibrary`);
            }}
          />
        );
      case 3:
        return (
          <EditButton
            title="Edit Course"
            onClick={() => {
              localStorage.setItem("courseLibraryId", responseData.courseLibraryId);
              navigate(`/superadmin/courselibrarylist/editassessmentcourselibrary`);
            }}
          />
        );
      default:
        return null;
    }
  };
  
  const assignButton = (responseData) => (
    <AssignButton
      title="Assign Course"
      onClick={() => {
        setAssignCourseStatus(true);
        confirmAssignProduct(responseData);
      }}
    />
  );
  
  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <ViewButton
        title="View Course"
        onClick={() => {
          localStorage.setItem("courseLibraryId", responseData.courseLibraryId);
          navigate(`/superadmin/courselibrarylist/viewcourselibrary`);
        }}
      />
      {responseData.status === "Published" ? (
        <EditButton
          title="Edit Course"
          onClick={() => confirmEditProduct(responseData)}
        />
      ) : (
        editButtons(responseData)
      )}
      {responseData.status === "Published" ? (
        <AssignButton
          title="Assign Course"
          onClick={() => {
            setTrainingCode(responseData.courseLibraryId);
            getAssignedOrganizationById(responseData.courseLibraryId);
            setTrainingIds([responseData.courseLibraryId]);
            setContentPayload([{ trainingIds: trainingIds, organizationIds: null }]);
            setOrgVisible2(!orgvisible2);
          }}
        />
      ) : (
        assignButton(responseData)
      )}
      <DeleteButton
        title="Delete Course"
        onClick={() => confirmDeleteProduct(responseData)}
      />
    </div>
  );
  
  const confirmDeleteProduct = (product) => {
    setSelectedProduct(product);
    setDeleteProductDialog(true);
  };

  const confirmEditProduct = (product) => {
    setSelectedProduct(product);
    setCheckStatus(true);
  };
  const confirmAssignProduct = (product) => {
    setSelectedProduct(product);
    // setCheckStatus(true);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideEditProductDialog = () => {
    setCheckStatus(false);
  };
  const hideAssignProductDialog = () => {
    setAssignCourseStatus(false);
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
        onClick={() => deleteCourse(selectedProduct.courseLibraryId)}
      />
    </React.Fragment>
  );

  const editProductDialogFooter = () => (
    <React.Fragment>
      <Button
        label="Cancel"
        size="sm"
        icon="pi pi-times"
        outlined
        onClick={hideEditProductDialog}
      />

      {selectedProduct.trainingTypeId &&
        selectedProduct.trainingTypeId === 1 && (
          <Link
            to={`/superadmin/courselibrarylist/editelearningcourselibrary`}
            onClick={() => {
              localStorage.setItem(
                "courseLibraryId",
                selectedProduct.courseLibraryId
              );
            }}
          >
            <Button
              label="Continue"
              size="sm"
              icon="pi pi-check"
              severity="info"
            />
          </Link>
        )}

      {selectedProduct.trainingTypeId &&
        selectedProduct.trainingTypeId === 2 && (
          <Link
            to={`/superadmin/courselibrarylist/editclassroomcourselibrary`}
            onClick={() => {
              localStorage.setItem(
                "courseLibraryId",
                selectedProduct.courseLibraryId
              );
            }}
          >
            <Button
              label="Continue"
              size="sm"
              icon="pi pi-check"
              severity="info"
            />
          </Link>
        )}

      {selectedProduct.trainingTypeId &&
        selectedProduct.trainingTypeId === 3 && (
          <Link
            to={`/superadmin/courselibrarylist/editassessmentcourselibrary`}
            onClick={() => {
              localStorage.setItem(
                "courseLibraryId",
                selectedProduct.courseLibraryId
              );
            }}
          >
            <Button
              label="Continue"
              size="sm"
              icon="pi pi-check"
              severity="info"
            />
          </Link>
        )}
    </React.Fragment>
  );
  const AssignProductDialogFooter = () => (
    <React.Fragment>
      <Button
        label="Cancel"
        size="sm"
        icon="pi pi-times"
        outlined
        onClick={() => {
          setAssignCourseStatus(false);
        }}
      />
      <Button
        onClick={(e) => {
          setTrainingCode(selectedProduct.courseLibraryId);
          getAssignedOrganizationById(selectedProduct.courseLibraryId);
          setTrainingIds([selectedProduct.courseLibraryId]);
          setContentPayload([
            {
              trainingIds: trainingIds,
              organizationIds: null,
            },
          ]);
          setAssignCourseStatus(false);
          setOrgVisible2(!orgvisible2);
        }}
        title="Assign Course"
      >
        Continue
      </Button>
    </React.Fragment>
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

  // const onGlobalFilterChange = (e) => {
  //   const value = e.target.value;
  //   let _filters = { ...filters };
  //   _filters["global"].value = value;

  //   setFilters(_filters);
  //   setGlobalFilterValue(value);
  // };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setFilters(prevFilters => ({
      ...prevFilters,
      global: {
        ...prevFilters.global,
        value: value
      }
    }));
    setGlobalFilterValue(value);
  };
  
  // const onGlobalFilterChange2 = (e) => {
  //   const value = e.target.value;
  //   let _filters2 = { ...filters2 };
  //   _filters2["global"].value = value;

  //   setFilters2(_filters2);
  //   setGlobalFilterValue2(value);
  // };

  const onGlobalFilterChange2 = (e) => {
    const value = e.target.value;
    setFilters2(prevFilters => ({
      ...prevFilters,
      global: {
        ...prevFilters.global,
        value: value
      }
    }));
    setGlobalFilterValue2(value);
  };
  
  const trainingTypeRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={trainingTypes}
        onChange={(e) => options.filterApplyCallback(e.value)}
        placeholder="Select One"
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

  const courseNameRowFilterTemplate = (options) => {
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

  const refCodeRowFilterTemplate = (options) => {
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
  const courseTitle = (responseData) => (
    <>{responseData.courseTitle ? responseData.courseTitle : "-"}</>
  );

  const dateModified = (responseData) => (
    <>{responseData.dateModified ? responseData.dateModified : "-"}</>
  );

  const code = (responseData) => (
    <>{responseData.trainingCode ? responseData.trainingCode : "-"}</>
  );

  const trainingType = (responseData) => (
    <>{responseData.trainingType ? responseData.trainingType : "-"}</>
  );

  const categoryName = (responseData) => (
    <>{responseData.categoryName ? responseData.categoryName : "-"}</>
  );
  const catergoryNameRowFilterTemplate = (options) => {
    return (
      <Dropdown
        editable
        value={options.value}
        options={categories}
        onChange={(e) => options.filterApplyCallback(e.value)}
        placeholder="Select"
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

  const statusRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.filterApplyCallback(e.value)}
        placeholder="Select"
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

  const initFilters2 = () => {
    setFilters2({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue2("");
  };

  // const initFilters = () => {
  //   setFilters({
  //     global: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  //     courseTitle: {
  //       value: null,
  //       matchMode: FilterMatchMode.CONTAINS,
  //     },
  //     trainingCode: {
  //       value: null,
  //       matchMode: FilterMatchMode.STARTS_WITH,
  //     },
  //     dateModified: {
  //       value: null,
  //       matchMode: FilterMatchMode.STARTS_WITH,
  //     },
  //     courseLibraryName: { value: null, matchMode: FilterMatchMode.IN },
  //     trainingType: {
  //       value: null,
  //       matchMode: FilterMatchMode.STARTS_WITH,
  //     },
  //     categoryName: { value: null, matchMode: "contains" },
  //     trainingCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  //     status: { value: null, matchMode: FilterMatchMode.EQUALS },
  //     Action: { value: null, matchMode: FilterMatchMode.EQUALS },
  //   });
  //   setGlobalFilterValue("");
  // };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      courseTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
      trainingCode: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      dateModified: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      courseLibraryName: { value: null, matchMode: FilterMatchMode.IN },
      trainingType: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      categoryName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      status: { value: null, matchMode: FilterMatchMode.EQUALS },
      Action: { value: null, matchMode: FilterMatchMode.EQUALS }
    });
    setGlobalFilterValue("");
  };
  
  const items = Array.from({ length: 10 }, (v, i) => i);

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };

  const addContentToOrg = async () => {
    try {
      const response = await postApiCall(
        "trainingAssignmentToOrganization",
        contentPayload[0]
      );

      setOrgVisible(false);

      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Content Assigned To Organization Successfully!",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Assigning Content To Organizaton",
        life: 3000,
      });
    }
  };

  // ASSIGNMENT
  const addContentToOrg2 = async () => {
    try {
      const response = await postApiCall(
        "trainingAssignmentToOrganization",
        contentPayload[0]
      );

      //setTrainingCode("");
      setOrgVisible2(false);
      getAssignedOrganizationById(trainingCode);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Content Assigned To Organization Successfully!",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Assigning Content To Organizaton",
        life: 3000,
      });
    }
  };

  return (
    <div className="">
      <div className="container">
        <div className="container-fluid">
          <CCardBody className={`card-richa tableTheme${themes}`}>
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
              <CModalBody>
                <div className={`InputThemeColor${themes}`}>
                  <DataTable
                    selectionMode={rowClick ? null : "checkbox"}
                    selection={selectedOrgs}
                    value={orgOptionList}
                    removableSort
                    showGridlines
                    rowHover
                    emptyMessage="No records found."
                    dataKey="organizationId"
                    filters={filters2}
                    filterDisplay="menu"
                    globalFilterFields2={["organizationName"]}
                  >
                    <Column
                      field="isChecked"
                      body={(rowData) => (
                        <input
                          type="checkbox"
                          className="form-check-input"
                          value={rowData.isChecked == 1 ? true : false}
                          onChange={(event) =>
                            handleCheckboxChange(rowData, "isChecked", event)
                          }
                        />
                      )}
                    />
                    <Column
                      field="organizationName"
                      header="Organization Name"
                      sortable
                    ></Column>
                    <Column
                      field="domainName"
                      header="Domain Name"
                      sortable
                    ></Column>
                  </DataTable>
                </div>
              </CModalBody>
              <CModalFooter>
                <CButton
                  className={`btn btn-primary saveButtonTheme${themes}`}
                  onClick={() => addContentToOrg()}
                  type="button"
                  // disabled={checkUser}
                  title="Assign Course"
                >
                  Assign Course
                </CButton>
                <CButton
                  className="btn btn-primary"
                  onClick={() => setOrgVisible(false)}
                >
                  Cancel
                </CButton>
              </CModalFooter>
            </CModal>
            {/*modal one ends*/}
            {/*modal two starts */}
            <CModal
              size="md"
              visible={orgvisible2}
              onClose={() => setOrgVisible2(false)}
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
              <CModalBody>
                <div className={`InputThemeColor${themes}`}>
                  <DataTable
                    selectionMode={rowClick ? null : "checkbox"}
                    selection={selectedOrgs}
                    value={orgOptionList}
                    removableSort
                    showGridlines
                    rowHover
                    emptyMessage="-"
                    dataKey="organizationId"
                    filters={filters2}
                    filterDisplay="menu"
                    globalFilterFields2={["organizationName"]}
                  >
                    <Column
                      field="isChecked"
                      header={checkboxHeader}
                      body={(rowData) => (
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value={rowData.isChecked == 1 ? true : false}
                          checked={rowData.isChecked == 1}
                          onChange={(event) => {
                            handleCheckboxChange(rowData, "isChecked", event);
                            console.log({ event });
                          }}
                        />
                      )}
                    />
                    <Column
                      field="organizationName"
                      header="Organization Name"
                      sortable
                    ></Column>
                    <Column
                      field="domainName"
                      header="Domain Name"
                      sortable
                    ></Column>
                  </DataTable>
                </div>
              </CModalBody>
              <CModalFooter>
                <CButton
                  className={`btn btn-primary saveButtonTheme${themes}`}
                  onClick={() => addContentToOrg2()}
                  type="button"
                // disabled={checkUser}
                >
                  Assign course
                </CButton>
                <CButton
                  className={`btn btn-primary saveButtonTheme${themes}`}
                  onClick={() => setOrgVisible2(false)}
                >
                  Cancel
                </CButton>
              </CModalFooter>
            </CModal>
            {/*modal two end*/}
          </CCardBody>
          <CModal size="lg" visible={visible} onClose={() => setVisible(false)}>
            <CModalHeader>
              <CModalTitle>Select Module Type</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <div className="module-outer">
                <Link
                  style={{ textDecoration: "none" }}
                  title="eLearning"
                  to={`/superadmin/courselibrarylist/addelearningcourselibrary`}
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
                        according to their own schedule at one's own pace. For
                        example, videos, prerecorded classroom lectures.
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
                  to={`/superadmin/courselibrarylist/addclassroomcourselibrary`}
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
                        according to their own schedule at one's own pace. For
                        example, videos, prerecorded classroom lectures.
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
                  to={`/superadmin/courselibrarylist/addassessmentcourselibrary`}
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
                        according to their own schedule at one's own pace. For
                        example, videos, prerecorded classroom lectures.
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
              <CButton
                color="info"
                onClick={() => {
                  localStorage.removeItem("trainingId");
                  setVisible(false);
                }}
                className={`saveButtonTheme${themes}`}
              >
                Close
              </CButton>
            </CModalFooter>
          </CModal>
          <CRow>
            <CCol xs={12} style={{ padding: "1px" }}>
              <CCard className="mb-7 card-ric">
                <div>
                  <CCardHeader className="p-0">
                    <CNav variant="tabs">
                      <CNavItem>
                        <Link
                          to={"/superadmin/courselibrarylist?All"}
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
                          to={"/superadmin/courselibrarylist?eLearning"}
                          style={{ textDecoration: "none" }}
                          onClick={() => {
                            localStorage.removeItem("courseLibraryId");
                          }}
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
                          to={"/superadmin/courselibrarylist?Classroom"}
                          onClick={() => {
                            localStorage.removeItem("courseLibraryId");
                          }}
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
                          to={"/superadmin/courselibrarylist?Assessments"}
                          style={{ textDecoration: "none" }}
                          onClick={() => {
                            localStorage.removeItem("courseLibraryId");
                          }}
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
                          to={"/superadmin/courselibrarylist?Archived"}
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
                          <div className="d-flex justify-content-end">
                            <div className="d-grid gap-2 d-md-flex">
                              <div className="ml-4">
                                <CButton
                                  className={`me-md-2 btn btn-info saveButtonTheme${themes}`}
                                  title="Assign Organisation"
                                  onClick={(e) => {
                                    if (
                                      selectedContent == null ||
                                      selectedContent == ""
                                    ) {
                                      alert("select content");
                                    } else {
                                      getOrganizationOptionsList();
                                      setOrgVisible(!orgvisible);
                                    }
                                  }}
                                >
                                  Assign
                                </CButton>
                              </div>
                              <div className=" ml-4 ">
                                <CButton
                                  className={`me-md-2 btn btn-info d-flex align-items-center saveButtonTheme${themes}`}
                                  title="Add New Course"
                                  onClick={() => {
                                    localStorage.removeItem("courseLibraryId");
                                    setVisible(!visible);
                                  }}
                                >
                                  +
                                </CButton>
                              </div>
                            </div>
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
                          header={<CFormCheck />}
                          body={bodyTemplate}
                          style={{ width: "1%" }}
                        ></Column>
                        <Column
                          field="courseTitle"
                          header="Course"
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="courseLibraryId"
                          header="Course ID"
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
                          field="dateModified"
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                          header="Date Modified"
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
                    <div
                      className={`card responsiveClass InputThemeColor${themes} tableThemeColor${themes}`}
                    >
                      <DataTable
                        selectionMode={rowClick ? null : "checkbox"}
                        selection={selectedContent}
                        value={responseData}
                        onSelectionChange={(e) => {
                          setSelectedContent(e.value);
                          setTrainingIds(e.value.map((e) => e.courseLibraryId));
                          setContentPayload([
                            {
                              trainingIds: trainingIds,
                              organizationIds: null,
                            },
                          ]);
                        }}
                        paginator
                        showGridlines
                        rowHover
                        emptyMessage="No records found."
                        responsiveLayout="scroll"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                        rows={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        dataKey="courseLibraryId"
                        filters={filters}
                        filterDisplay="row"
                        globalFilterFields={[
                          "courseTitle",
                          "trainingCode",
                          "courseLibraryName",
                          "trainingCode",
                          "categoryName",
                          "trainingType",
                          "dateModified",
                          "status",
                          "Action",
                        ]}
                      >
                        <Column
                          selectionMode="multiple"
                          headerStyle={{ width: "3rem" }}
                        ></Column>
                        <Column
                          body={courseTitle}
                          field="courseTitle"
                          header="Course"
                          showFilterMenu={false}
                          filter
                          filterElement={courseNameRowFilterTemplate}
                          filterMenuStyle={{ width: "14rem" }}
                        ></Column>
                        <Column
                          body={code}
                          header="Course ID"
                          field="trainingCode"
                          showFilterMenu={false}
                          filter
                          filterElement={refCodeRowFilterTemplate}
                          filterMenuStyle={{ width: "15rem" }}
                          style={{ minWidth: "8rem" }}
                        ></Column>
                        <Column
                          header="Training Type"
                          field="trainingType"
                          showFilterMenu={false}
                          filterMenuStyle={{ width: "14rem" }}
                          // style={{ minWidth: "8rem" }}
                          filter
                          filterElement={trainingTypeRowFilterTemplate}
                        ></Column>
                        <Column
                          body={(rowData) =>
                            rowData.categoryName != 0 ? (
                              <>{rowData.categoryName.join(",")}</>
                            ) : (
                              <div>-</div>
                            )
                          }
                          field="categoryName"
                          header="Category"
                          showFilterMenu={false}
                          filterMenuStyle={{ width: "14rem" }}
                          // style={{ minWidth: "14rem" }}
                          filter
                          filterElement={catergoryNameRowFilterTemplate}
                        ></Column>
                        <Column
                          field="status"
                          body={statusShow}
                          header="Status"
                          showFilterMenu={false}
                          filterMenuStyle={{
                            width: "14rem",
                            maxHeight: "2rem",
                          }}
                          filter
                          filterElement={statusRowFilterTemplate}
                        ></Column>
                        <Column
                          field="dateModified"
                          body={dateModified}
                          header="Date Modified"
                          style={{ minWidth: "10rem" }}
                          showFilterMenu={false}
                          filterMenuStyle={{
                            width: "14rem",
                            maxHeight: "2rem",
                          }}
                          filter
                          filterElement={datemodifiedRowFilterTemplate}
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
                  <Dialog
                    visible={checkStatus}
                    style={{ width: "32rem" }}
                    breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                    header="Confirm"
                    modal
                    footer={editProductDialogFooter}
                    onHide={hideEditProductDialog}
                  >
                    <div className="confirmation-content">
                      <i
                        className="pi pi-exclamation-triangle me-3 mt-2"
                        style={{ fontSize: "1.5rem" }}
                      />
                      <span>
                        The course is in published mode. Do you Still want to
                        continue editing it ?
                      </span>
                    </div>
                  </Dialog>
                  <Dialog
                    visible={assignCourseStatus}
                    style={{ width: "32rem" }}
                    breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                    header="Confirm"
                    modal
                    footer={AssignProductDialogFooter}
                    onHide={hideAssignProductDialog}
                  >
                    <div className="confirmation-content">
                      <i
                        className="pi pi-exclamation-triangle me-3 mt-2"
                        style={{ fontSize: "1.5rem" }}
                      />
                      <span>
                        Only the Publish course can be assigned to organisation.
                        Stil you want to continue?.
                      </span>
                    </div>
                  </Dialog>
                </CCardBody>
                <div className="card-header border-0 d-flex align-items-right flex-row-reverse">
                  <div className="d-flex row align-items-center">
                    <div className="col-md-6 col-xxl-6">
                      <Link to="/superadmin">
                        <CButton
                          className={`me-md-2 btn btn-info saveButtonTheme${themes}`}
                          onClick={(e) => {
                            localStorage.removeItem("courseLibraryId");
                          }}
                        >
                          Back
                        </CButton>
                      </Link>
                    </div>
                  </div>
                </div>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </div>
    </div>
  );
};
export default manageCourseLibraryListingWidget;
