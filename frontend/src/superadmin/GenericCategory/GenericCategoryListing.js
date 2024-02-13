import React, { useRef, useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CFormCheck,
  CCardHeader,
  CCol,
  CRow,
  CModal,
  CButton,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CImage,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CBadge,
} from "@coreui/react";
import { Link, useNavigate } from "react-router-dom";
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
import postApiCall from "src/server/postApiCall";
import getApiCall from "src/server/getApiCall";
import generalDeleteApiCall from "src/server/generalDeleteApiCall";
import "../../css/table.css";

const GenericCategoryListing = () => {
  const [selectedContent, setSelectedContent] = useState([]),
    [selectedContent2, setSelectedContent2] = useState([]),
    [courseLibraryIds, setCourseLibraryIds] = useState([]),
    token = "Bearer " + localStorage.getItem("ApiToken"),
    colorName = localStorage.getItem("ThemeColor"),
    [themes, setThemes] = useState(colorName),
    [filters, setFilters] = useState(null),
    [filters2, setFilters2] = useState(null),
    [filters3, setFilters3] = useState(null),
    [filters4, setFilters4] = useState(null),
    [rowClick, setRowClick] = useState(false),
    [grpvisible, setGrpvisible] = useState(false),
    [coursevisible, setCoursevisible] = useState(false),
    [coursevisible2, setCoursevisible2] = useState(false),
    [selectAll, setSelectAll] = useState(false),
    [categoryId, setCategoryId] = useState([]),
    [globalFilterValue, setGlobalFilterValue] = useState(""),
    [globalFilterValue2, setGlobalFilterValue2] = useState(""),
    [globalFilterValue3, setGlobalFilterValue3] = useState(""),
    [globalFilterValue4, setGlobalFilterValue4] = useState(""),
    [deleteProductDialog, setDeleteProductDialog] = useState(false),
    [deleteProductsDialog, setDeleteProductsDialog] = useState(false),
    [selectedProducts, setSelectedProducts] = useState(null),
    [courseListbyCat, setCourseListbyCat] = useState(null),
    [resData, setResData] = useState(null),
    [selectedGroups, setSelectedGroups] = useState([]),
    [loader, setLoader] = useState(false),
    [categoryID, setCategoryID] = useState(""),
    [unassignedcourseListbyCat, setUnassignedcourseListbyCat] = useState([]),
    navigate = useNavigate(),
    toast = useRef(null),
    [responseData, setResponseData] = useState([]);

  const [categoryPayload, setCategoryPayload] = useState([
    {
      categoryId: null,
      groups: null,
    },
  ]);

  useEffect(() => {
    if (token !== "Bearer null") {
      setTimeout(() => {
        setLoader(true);
      }, [2000]);
      getGenericCategoryList();
      initFilters2();
      initFilters();
      initFilters3();
      initFilters4();
      getOrgGroupList();
    }
  }, []);

  useEffect(() => {
    if (token !== "Bearer null") {
      initFilters();
      initFilters2();
      initFilters3();
      initFilters4();

      if (categoryID) {
        getOrgGroupListByCategoryId(categoryID);
      } else {
        getOrgGroupList();
      }
    }
  }, [categoryID]);

  function handleSelectAll(event) {
    const isChecked = event.target.checked ? 1 : 0;
    const updatedData = resData.map((row) => ({
      ...row,
      isChecked: isChecked,
    }));
    setResData(updatedData);
    setSelectAll(event.checked);
    setCategoryPayload([
      {
        categoryId: categoryId,
        groups: updatedData,
      },
    ]);
  }

  const checkboxHeader = (
    <input
      class="form-check-input"
      type="checkbox"
      checked={selectAll}
      onChange={handleSelectAll}
    />
  );

  const categoryName = (responseData) => (
    <>{responseData.categoryName ? responseData.categoryName : "-"}</>
  );

  const categoryCode = (responseData) => (
    <>{responseData.categoryCode ? responseData.categoryCode : "-"}</>
  );

  const getAssignCourseListByCategoryId = async (id) => {
    const data = {
      categoryIds: [id],
    };

    try {
      const res = await postApiCall("getAssignCourseListByCategoryId", data);
      setCourseListbyCat(res);
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

  const getUnassignCourseListByCategoryId = async (id) => {
    const data = {
      categoryIds: id,
    };

    if (data.categoryIds.length != 0) {
      try {
        const res = await postApiCall(
          "getUnassignCourseListByCategoryId",
          data
        );
        setUnassignedcourseListbyCat(res);
      } catch (err) {
        var errMsg = err?.response?.data?.error;
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: errMsg,
          life: 3000,
        });
      }
    }
  };

  const bulkCourseCategoryAssign = async (categoryIds, courseLibraryIds) => {
    const data = {
      categoryIds: categoryIds,
      courseLibraryIds: courseLibraryIds,
    };

    if (courseLibraryIds) {
      try {
        const res = await postApiCall("bulkCourseCategoryAssign", data);
        getUnassignCourseListByCategoryId(categoryIds);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Category Assigned to Courses successfully!",
          life: 3000,
        });
        setCoursevisible2(false);
      } catch (err) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error Assigning to Category to Courses",
          life: 3000,
        });
      }
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Select Courses",
        life: 3000,
      });
    }
  };

  const getGenericCategoryList = async () => {
    try {
      const res = await getApiCall("getGenericCategoryList");
      setResponseData(res);
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
  const deleteCategory = async (categoryId) => {
    const data = {
      categoryId: categoryId,
    };
    try {
      const res = await generalDeleteApiCall("deleteCategory", data);
      const filteredData = responseData.filter(
        (item) => item.categoryId !== categoryId
      );
      setResponseData(filteredData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Category deleted successfully!",
        life: 3000,
      });
      setDeleteProductsDialog(false);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error deleting Category",
        life: 3000,
      });
    }
    setDeleteProductDialog(false);
  };

  const categoryGroupAssignment = async () => {
    try {
      const res = await postApiCall(
        "categoryGroupAssignment",
        categoryPayload[0]
      );
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Content Assigned To Organization Successfully!",
        life: 3000,
      });
      setGrpvisible(!grpvisible);
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Assigning Content To Organizaton",
        life: 3000,
      });
    }
  };

  const courseCategoryUnassign = async (catId, courseId) => {
    const data = {
      categoryId: catId,
      courseLibraryId: courseId,
    };
    try {
      const res = await postApiCall("courseCategoryUnassign", data);
      getAssignCourseListByCategoryId(categoryID);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Category Unassigned from the Course Successfully!",
        life: 3000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Unassigning Category from the Course",
        life: 3000,
      });
    }
  };

  function handleCheckboxChange(rowData, field, event) {
    const isChecked = event.target.checked ? 1 : 0;
    const updatedRow = { ...rowData, [field]: isChecked };
    const updatedData = resData.map((row) =>
      row.groupId === rowData.groupId ? updatedRow : row
    );
    setResData(updatedData);

    setCategoryPayload([
      {
        categoryId: categoryId,
        groups: updatedData,
      },
    ]);
  }

  const getOrgGroupListByCategoryId = async (id) => {
    try {
      const res = await getApiCall("getOrgGroupListByCategoryId", id);
      setResData(res);
    } catch (error) {
      getOrgGroupList();
    }
  };

  const getOrgGroupList = async () => {
    try {
      const res = await getApiCall("getOrgGroupList");
      setResData(
        res.map((groupData) => ({
          groupId: groupData.groupId,
          groupName: groupData.groupName,
          isChecked: 0,
        }))
      );
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

  const removeCategoryButton = (responseData) => (
    <>
      <CImage
        src="/media/icon/CloseIcon.svg"
        style={{ height: "28px", cursor: "pointer" }}
        onClick={() => {
          unAssignPopup(responseData.courseLibraryId);
        }}
        alt="eye_icon"
        className="me-2"
        title="Remove Course"
      />
    </>
  );

  const unAssignPopup = (id) => {
    courseCategoryUnassign(categoryID, id);
  };

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <div
        onClick={() => coursePopUp(responseData.categoryId)}
        title="View Category"
        style={{ cursor: "pointer" }}
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

      <div
        to={`/superadmin/genericcategorylist/editgenericcategory`}
        style={{ cursor: "pointer" }}
        title="Edit Category"
        onClick={() => {
          localStorage.setItem("categoryId", responseData.categoryId);

          navigate(`/superadmin/genericcategorylist/editgenericcategory`);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          style={{ margin: "0 0.5rem" }}
          class={`bi bi-pencil-fill iconTheme${themes}`}
          viewBox="0 0 16 16"
        >
          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
        </svg>
      </div>

      <div
        style={{ cursor: "pointer" }}
        onClick={() => confirmDeleteProducts(responseData)}
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
      <div
        onClick={(e) => {
          setCategoryId(responseData.categoryId);
          getOrgGroupListByCategoryId(responseData.categoryId);
          setCategoryPayload([
            {
              categoryId: categoryId,
              groups: null,
            },
          ]);
          setGrpvisible(!grpvisible);
        }}
        style={{ cursor: "pointer" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          class={`bi bi-plus-circle-fill iconTheme${themes}`}
          style={{ margin: "0 0.5rem" }}
          viewBox="0 0 16 16"
        >
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
        </svg>
      </div>
    </div>
  );

  const coursePopUp = (id) => {
    setCategoryID(id);
    getAssignCourseListByCategoryId(id);
    setCoursevisible(true);
  };

  const bulkDeleteGenericCategory = async () => {
    const data = { categoryIds: categoryId };

    try {
      const res = await generalDeleteApiCall("bulkDeleteGenericCategory", data);
      getGenericCategoryList();
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Categories deleted successfully!",
        life: 3000,
      });
      setDeleteProductDialog(false);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Deleting Categories",
        life: 3000,
      });
    }
    setDeleteProductDialog(false);
  };

  const confirmDeleteProducts = (products) => {
    setSelectedProducts(products);
    setDeleteProductsDialog(true);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const deleteProductsDialogFooter = () => (
    <React.Fragment>
      <Button
        className={`saveButtonTheme${themes}`}
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
        onClick={() => deleteCategory(selectedProducts.categoryId)}
      />
    </React.Fragment>
  );

  const deleteProductsDialogFooter2 = () => (
    <React.Fragment>
      <Button
        className={`saveButtonTheme${themes}`}
        label="No"
        size="sm"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductDialog2}
      />
      <Button
        label="Yes"
        size="sm"
        icon="pi pi-check"
        severity="info"
        onClick={() => bulkDeleteGenericCategory()}
      />
    </React.Fragment>
  );

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteProductDialog2 = () => {
    setDeleteProductDialog(false);
  };

  const deletepopup = () => {
    if (categoryId.length === 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Select Categories",
        life: 3000,
      });
    } else {
      setDeleteProductDialog(true);
    }
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters2 };
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

  const onGlobalFilterChange3 = (e) => {
    const value = e.target.value;
    let _filters3 = { ...filters3 };
    _filters3["global"].value = value;

    setFilters3(_filters3);
    setGlobalFilterValue3(value);
  };

  const onGlobalFilterChange4 = (e) => {
    const value = e.target.value;
    let _filters4 = { ...filters4 };
    _filters4["global"].value = value;

    setFilters4(_filters4);
    setGlobalFilterValue4(value);
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue("");
  };

  const initFilters2 = () => {
    setFilters2({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue2("");
  };

  const initFilters3 = () => {
    setFilters3({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue3("");
  };

  const initFilters4 = () => {
    setFilters4({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue4("");
  };

  const items = Array.from({ length: 10 }, (v, i) => i);

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };

  const catpopup = () => {
    if (categoryId.length > 0) {
      setCoursevisible2(true);
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Select Categories",
        life: 3000,
      });
    }
  };

  const statusShow = (responseData) => (
    <CBadge
      className={`badge badge-light-info text-info badgeColor${themes} `}
      color="light"
    >
      {responseData?.isActive === 1 ? "Active" : "In-Active"}
    </CBadge>
  );
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
                          <strong>Category</strong>
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
                                to={`/superadmin/genericcategorylist/addgenericcategory`}
                                className={`me-md-2 btn d-flex align-items-center btn-info saveButtonTheme${themes}`}
                                title="Add New Category"
                                onClick={() => {
                                  localStorage.removeItem("categoryId");
                                }}
                              >
                                +
                              </Link>
                            </div>
                            <div className="d-grid gap-2 d-md-flex">
                              <CDropdown>
                                <CDropdownToggle
                                  color="primary"
                                  className={`me-md-2 btn btn-info saveButtonTheme${themes}`}
                                >
                                  Bulk Action
                                </CDropdownToggle>
                                <CDropdownMenu>
                                  <CDropdownItem
                                    onClick={(e) => deletepopup()}
                                    style={{ cursor: "pointer" }}
                                  >
                                    Delete Categories
                                  </CDropdownItem>
                                  <CDropdownItem
                                    onClick={(e) => catpopup()}
                                    style={{ cursor: "pointer" }}
                                  >
                                    Assign Courses
                                  </CDropdownItem>
                                </CDropdownMenu>
                              </CDropdown>
                            </div>
                          </div>
                        </div>
                      </CTabPane>
                    </CTabContent>
                  </CCardHeader>

                  <CCardBody className={`card-richa tableTheme${themes}`}>
                    <Toast ref={toast} />

                    {/* Assign Course Model Start */}

                    <CModal
                      size="md"
                      visible={coursevisible2}
                      onClose={() => setCoursevisible2(false)}
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
                                      value={globalFilterValue4}
                                      onChange={onGlobalFilterChange4}
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
                        <div className={` InputThemeColor${themes}`}>
                          <DataTable
                            selectionMode={rowClick ? null : "checkbox"}
                            selection={selectedContent2}
                            value={unassignedcourseListbyCat}
                            removableSort
                            showGridlines
                            rowHover
                            emptyMessage="-"
                            dataKey="courseLibraryId"
                            filters={filters4}
                            filterDisplay="menu"
                            globalFilterFields={["courseTitle"]}
                            onSelectionChange={(e) => {
                              setSelectedContent2(e.value);
                              setCourseLibraryIds(
                                e.value.map((e) => e.courseLibraryId)
                              );
                            }}
                          >
                            <Column
                              selectionMode="multiple"
                              headerStyle={{ width: "3rem" }}
                            ></Column>
                            <Column
                              field="courseTitle"
                              header="Course Name"
                              sortable
                            ></Column>
                            <Column
                              field="trainingType"
                              header="Course Type"
                              sortable
                            ></Column>
                          </DataTable>
                        </div>
                      </CModalBody>
                      <CModalFooter>
                        <CButton
                          className={`btn btn-primary saveButtonTheme${themes}`}
                          onClick={() =>
                            bulkCourseCategoryAssign(
                              categoryId,
                              courseLibraryIds
                            )
                          }
                          type="button"
                        >
                          Assign Category to Courses
                        </CButton>
                        <CButton
                          className={`btn btn-primary saveButtonTheme${themes}`}
                          onClick={() => setCoursevisible2(false)}
                        >
                          Cancel
                        </CButton>
                      </CModalFooter>
                    </CModal>
                    {/*Assign Course Model End */}

                    {/* Course Model Start */}

                    <CModal
                      size="md"
                      visible={coursevisible}
                      onClose={() => setCoursevisible(false)}
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
                                      value={globalFilterValue3}
                                      onChange={onGlobalFilterChange3}
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
                        <div className={` InputThemeColor${themes}`}>
                          <DataTable
                            value={courseListbyCat}
                            removableSort
                            showGridlines
                            rowHover
                            emptyMessage="-"
                            dataKey="courseId"
                            filters={filters3}
                            filterDisplay="menu"
                            globalFilterFields2={["courseName"]}
                          >
                            <Column
                              field="courseTitle"
                              header="Course Name"
                              sortable
                            ></Column>
                            <Column
                              field="trainingType"
                              header="Course Type"
                              sortable
                            ></Column>
                            <Column
                              field="status"
                              header="Status"
                              sortable
                            ></Column>
                            <Column
                              header="Action"
                              body={removeCategoryButton}
                              sortable
                            ></Column>
                          </DataTable>
                        </div>
                      </CModalBody>
                      <CModalFooter>
                        <CButton
                          className={`btn btn-primary saveButtonTheme${themes}`}
                          onClick={() => setCoursevisible(false)}
                        >
                          Cancel
                        </CButton>
                      </CModalFooter>
                    </CModal>
                    {/* Course Model End */}

                    {/* Groups Model Start */}
                    <CModal
                      size="md"
                      visible={grpvisible}
                      onClose={() => setGrpvisible(false)}
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
                            selection={selectedGroups}
                            value={resData}
                            removableSort
                            showGridlines
                            rowHover
                            emptyMessage="-"
                            dataKey="groupId"
                            filters={filters2}
                            filterDisplay="menu"
                            globalFilterFields2={["groupName"]}
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
                                  onChange={(event) =>
                                    handleCheckboxChange(
                                      rowData,
                                      "isChecked",
                                      event
                                    )
                                  }
                                />
                              )}
                            />
                            <Column
                              field="groupName"
                              header="Group Name"
                              sortable
                            ></Column>
                          </DataTable>
                        </div>
                      </CModalBody>
                      <CModalFooter>
                        <CButton
                          className={`btn btn-primary saveButtonTheme${themes}`}
                          onClick={() => categoryGroupAssignment()}
                          type="button"
                          // disabled={checkUser}
                        >
                          Assign Category
                        </CButton>
                        <CButton
                          className={`btn btn-primary saveButtonTheme${themes}`}
                          onClick={() => setGrpvisible(false)}
                        >
                          Cancel
                        </CButton>
                      </CModalFooter>
                    </CModal>
                    {/* Groups Model End */}

                    <Dialog
                      visible={deleteProductDialog}
                      style={{ width: "32rem" }}
                      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                      header="Confirm"
                      modal
                      footer={deleteProductsDialogFooter2}
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
                      visible={deleteProductDialog}
                      style={{ width: "32rem" }}
                      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                      header="Confirm"
                      modal
                      footer={deleteProductsDialogFooter2}
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
                      visible={deleteProductsDialog}
                      style={{ width: "32rem" }}
                      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                      header="Confirm"
                      modal
                      footer={deleteProductsDialogFooter}
                      onHide={hideDeleteProductsDialog}
                    >
                      <div className="confirmation-content">
                        <i
                          className="pi pi-exclamation-triangle me-3 mt-2"
                          style={{ fontSize: "1.5rem" }}
                        />
                        <span>Are you sure you want to delete ?</span>
                      </div>
                    </Dialog>

                    <div className="">
                      {!loader ? (
                        <div
                          className={`card tableThemeColor${themes} InputThemeColor${themes}`}
                        >
                          <DataTable
                            value={items}
                            showGridlines
                            className="p-datatable-striped"
                          >
                            {/* <Column
                          body={checkbox1}
                          header={checkbox1}
                          style={{ width: "1%" }}
                        ></Column> */}
                            <Column
                              field="categoryName"
                              header="Category Name"
                              style={{ width: "25%" }}
                              body={bodyTemplate}
                            ></Column>
                            <Column
                              field="categoryCode"
                              header="Category Code"
                              style={{ width: "25%" }}
                              body={bodyTemplate}
                            ></Column>
                            <Column
                              field="isActive"
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
                          className={`card responsiveClass tableThemeColor${themes} InputThemeColor${themes}`}
                        >
                          <DataTable
                            selectionMode={rowClick ? null : "checkbox"}
                            selection={selectedContent}
                            value={responseData}
                            removableSort
                            paginator
                            showGridlines
                            rowHover
                            emptyMessage="No records found."
                            responsiveLayout="scroll"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                            rows={10}
                            rowsPerPageOptions={[10, 20, 50]}
                            dataKey="categoryId"
                            filters={filters}
                            filterDisplay="menu"
                            onSelectionChange={(e) => {
                              setSelectedContent(e.value);
                              setCategoryId(e.value.map((e) => e.categoryId));
                              setCategoryPayload([
                                {
                                  categoryId: categoryId,
                                  groups: null,
                                },
                              ]);
                              // console.log(categoryId);
                              getUnassignCourseListByCategoryId(
                                e.value.map((e) => e.categoryId)
                              );
                            }}
                            globalFilterFields={[
                              "categoryName",
                              "categoryId",
                              "categoryCode",
                              "isActive",
                            ]}
                          >
                            <Column
                              selectionMode="multiple"
                              headerStyle={{ width: "3rem" }}
                            ></Column>
                            <Column
                              body={categoryName}
                              field="categoryName"
                              header="Category Name"
                              sortable
                            ></Column>
                            <Column
                              body={categoryCode}
                              field="categoryCode"
                              header="Category Code"
                              sortable
                            ></Column>
                            <Column
                              body={statusShow}
                              field="isActive"
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
                    </div>
                  </CCardBody>
                </div>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </div>
    </div>
  );
};
export default GenericCategoryListing;
