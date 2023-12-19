import React, { useRef, useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
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
  CFormInput,
} from "@coreui/react";
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
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";
import generalDeleteApiCall from "src/server/generalDeleteApiCall";
import "../../css/table.css";

const API_URL = process.env.REACT_APP_API_URL;

const GenericCategoryListing = () => {
  const [selectedContent, setSelectedContent] = useState([]);
  const [selectedContent2, setSelectedContent2] = useState([]);
  const [courseLibraryIds, setCourseLibraryIds] = useState([]);
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  const [filters, setFilters] = useState(null);
  const [filters2, setFilters2] = useState(null);
  const [filters3, setFilters3] = useState(null);
  const [filters4, setFilters4] = useState(null);
  const [rowClick, setRowClick] = useState(false);
  const [grpvisible, setGrpvisible] = useState(false);
  const [coursevisible, setCoursevisible] = useState(false);
  const [coursevisible2, setCoursevisible2] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [categoryId, setCategoryId] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [globalFilterValue2, setGlobalFilterValue2] = useState("");
  const [globalFilterValue3, setGlobalFilterValue3] = useState("");
  const [globalFilterValue4, setGlobalFilterValue4] = useState("");
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [resData, setResData] = useState(null);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [categoryPayload, setCategoryPayload] = useState([
    {
      categoryId: null,
      groups: null,
    },
  ]);
  const [responseData, setResponseData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [categoryID, setCategoryID] = useState("");
  // const [groupByCategoryId, setgroupByCategoryId] = useState([]);
  const [courseListbyCat, setCourseListbyCat] = useState([]);
  const [unassignedcourseListbyCat, setUnassignedcourseListbyCat] = useState(
    []
  );

  const toast = useRef(null);

  useEffect(() => {
    if (token !== "Bearer null") {
      setTimeout(() => {
        setLoader(true);
      }, [2000]);
      getGenericCategory();
      initFilters2();
      initFilters();
      initFilters3();
      initFilters4();
      getOrgGroupList();
    }
  }, []);

  const getAssignedGroupById = async (id) => {
    try {
      const response = await getApiCall("getOrgGroupListByCategoryId", id);
      setResData(response);
    } catch (error) {
      getOrgGroupList();
    }
  };

  useEffect(() => {
    if (token !== "Bearer null") {
      initFilters();
      initFilters2();
      initFilters3();
      initFilters4();

      if (categoryID) {
        getAssignedGroupById(categoryID);
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

  const getCourseLibraryByCategoryId = async (id) => {
    const data = {
      categoryIds: [id],
    };
    try {
      const response = await postApiCall(
        "getOrgAssignCourseListByCategoryId",
        data
      );
      setCourseListbyCat(response);
    } catch (error) {}
  };

  const getUnassignedCourseLibraryByCategoryId = async (id) => {
    const data = {
      categoryIds: id,
    };

    if (data.categoryIds.length != 0) {
      try {
        const response = await postApiCall(
          "getOrgUnAssignCourseListByCategoryId",
          data
        );
        setUnassignedcourseListbyCat(response);
      } catch (error) {}
    }
  };

  // const assignGroupByCategoryId = (id) => {
  //   const data = {
  //     categoryIds: [id],
  //   };
  //   axios
  //     .post(`${API_URL}/getOrgCategoryAssignGroupList`, data, {
  //       headers: { Authorization: token },
  //     })
  //     .then((response) => {
  //       setgroupByCategoryId(response.data.data);
  //     });
  // };

  const assignCategorytoCourses = async (categoryIds, courseLibraryIds) => {
    const data = {
      categoryIds: categoryIds,
      courseLibraryIds: courseLibraryIds,
    };

    if (courseLibraryIds) {
      try {
        const response = await postApiCall("orgBulkCourseCategoryAssign", data);

        getUnassignedCourseLibraryByCategoryId(categoryIds);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Category Assigned to Courses successfully!",
          life: 3000,
        });
        setCoursevisible2(false);
      } catch (error) {
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

  const getGenericCategory = async () => {
    try {
      const response = await getApiCall(
        "getOrganizationCategoryList?suAssigned=0"
      );
      setResponseData(response);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteCategory1 = async (categoryId) => {
    const data = {
      categoryId: categoryId,
    };
    try {
      const response = await generalDeleteApiCall(
        "deleteOrganizationCategory",
        data
      );
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

    setDeleteProductsDialog(false);
  };

  const addContentToOrg = async () => {
    try {
      const response = await postApiCall(
        "orgCategoryGroupAssignment",
        categoryPayload[0]
      );
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Content Assigned To Organization Successfully!",
        life: 3000,
      });
      setGrpvisible(!grpvisible);
      getGenericCategory();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Assigning Content To Organizaton",
        life: 3000,
      });
    }
  };
  const unAssignCourse = async (catId, courseId) => {
    const data = { categoryId: catId, courseLibraryId: courseId };
    try {
      const response = await postApiCall("orgCourseCategoryUnassign", data);

      getCourseLibraryByCategoryId(categoryID);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Category Unassigned from the Course Successfully!",
        life: 3000,
      });

      getGenericCategory();
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

  const getOrgGroupList = async () => {
    try {
      const response = await getApiCall("getOrgGroupList");
      setResData(
        response.map((groupData) => ({
          groupId: groupData.groupId,
          groupName: groupData.groupName,
          isChecked: 0,
        }))
      );
    } catch (error) {}
  };

  const removeCategoryButton = (responseData) => (
    <>
      <CImage
        src="/media/icon/CloseIcon.svg"
        style={{ height: "28px", cursor: "pointer" }}
        onClick={() => {
          unAssignPopup(responseData.courseLibraryId);
          // console.log(responseData.courseLibraryId);
        }}
        alt="eye_icon"
        className="me-2"
        title="Remove Course"
      />
    </>
  );

  const unAssignPopup = (id) => {
    unAssignCourse(categoryID, id);
  };

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <CImage
        src="/custom_icon/eye.svg"
        style={{ height: "28px", cursor: "pointer" }}
        onClick={() => coursePopUp(responseData.categoryId)}
        alt="eye_icon"
        className="me-2"
        title="View Category"
      />

      <Link
        to={`/admin/categorylist/addeditcategory?${responseData.categoryId}`}
        title="Edit Category"
        onClick={() => {
          localStorage.setItem("categoryId", responseData.categoryId);
        }}
      >
        <CImage
          src="/custom_icon/edit.svg"
          alt="edit.svg"
          style={{ height: "25px", cursor: "pointer" }}
          className="me-2"
          title="Edit"
        />
      </Link>
      <div title="Delete Category">
        <CImage
          src="/custom_icon/bin.svg"
          className="me-3"
          alt="bin.svg"
          style={{ height: "25px", cursor: "pointer" }}
          onClick={() => confirmDeleteProducts(responseData)}
          title="Delete Category"
        />
      </div>
      <div
        title="Assign group"
        style={{ height: "25px", cursor: "pointer" }}
        // onClick={(e) => setGrpvisible(!grpvisible)}
        onClick={(e) => {
          setCategoryId(responseData.categoryId);
          getAssignedGroupById(responseData.categoryId);
          setCategoryPayload([
            {
              categoryId: categoryId,
              groups: null,
            },
          ]);
          setGrpvisible(!grpvisible);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          class={`bi bi-plus-circle-fill iconTheme${themes}`}
          viewBox="0 0 16 16"
        >
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
        </svg>
      </div>
    </div>
  );

  const coursePopUp = (id) => {
    setCategoryID(id);
    getCourseLibraryByCategoryId(id);
    setCoursevisible(true);
  };

  const bulkDeleteCredentials = async () => {
    const data = { categoryIds: categoryId };
    try {
      const response = await generalDeleteApiCall(
        "bulkDeleteOrganizationCategory",
        data
      );
      getGenericCategory();
      if (response) {
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Categories deleted successfully!",
          life: 3000,
        });
      }
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
        onClick={() => deleteCategory1(selectedProducts.categoryId)}
      />
    </React.Fragment>
  );

  const deleteProductsDialogFooter2 = () => (
    <React.Fragment>
      <Button
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
        onClick={() => bulkDeleteCredentials()}
      />
    </React.Fragment>
  );
  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };
  const hideDeleteProductDialog2 = () => {
    setDeleteProductDialog(false);
  };
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      categoryName: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      categoryCode: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
    });
    setGlobalFilterValue("");
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

  const assignedShow = (responseData) => (
    <>
      {responseData?.suAssigned === 1 ? (
        <CBadge
          className={`badge badge-light-info text-info badgeColor${themes} `}
          color="light"
        >
          Super Admin Assigned
        </CBadge>
      ) : (
        buttonTemplate(responseData)
      )}
    </>
  );

  const statusShow = (responseData) => (
    <CBadge
      className={`badge badge-light-info text-info badgeColor${themes} `}
      color="light"
    >
      {responseData?.isActive === 1 ? "Active" : "In-Active"}
    </CBadge>
  );

  const categoryNameFilterTemplate = (options) => {
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
  const categoryCodeFilterTemplate = (options) => {
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
      <div className="container">
        <div className="container-fluid">
          <CRow>
            <CCol xs={12} style={{ padding: "1px" }}>
              <CCard className="mb-7 card-ric">
                <div>
                  <CCardHeader className="p-0">
                    <CNav variant="tabs">
                      <CNavItem>
                        <Link
                          style={{ textDecoration: "none" }}
                          to="/admin/categorylist"
                        >
                          <CNavLink active style={{ cursor: "pointer" }}>
                            <strong>Category</strong>
                          </CNavLink>
                        </Link>
                      </CNavItem>
                      <CNavItem>
                        <Link
                          style={{ textDecoration: "none" }}
                          to="/admin/category/assignedcategory"
                        >
                          <CNavLink style={{ cursor: "pointer" }}>
                            Assigned Category
                          </CNavLink>
                        </Link>
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
                          <div className="d-flex justify-content-end">
                            <div className="d-grid gap-2 d-md-flex">
                              <Link
                                to={`/admin/categorylist/addeditcategory`}
                                className="me-md-2 btn btn-info"
                                title="Add New Category"
                                onClick={() => {
                                  localStorage.removeItem("categoryId");
                                }}
                              >
                                + &nbsp; Add New Category
                              </Link>
                            </div>
                            <div className="d-grid gap-2 d-md-flex">
                              <CDropdown>
                                <CDropdownToggle
                                  color="primary"
                                  className="me-md-2 btn btn-info"
                                >
                                  Bulk Option
                                </CDropdownToggle>
                                <CDropdownMenu>
                                  <CDropdownItem
                                    onClick={(e) => deletepopup()}
                                    style={{ cursor: "pointer" }}
                                  >
                                    Bulk Delete
                                  </CDropdownItem>
                                  <CDropdownItem
                                    onClick={(e) => catpopup()}
                                    style={{ cursor: "pointer" }}
                                  >
                                    Bulk Assign
                                  </CDropdownItem>
                                </CDropdownMenu>
                              </CDropdown>
                            </div>
                          </div>
                        </div>
                      </CTabPane>
                    </CTabContent>
                  </CCardHeader>

                  <CCardBody>
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
                                <div className="col-md-12 col-xxl-12">
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
                            console.log(e.value);
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
                      </CModalBody>
                      <CModalFooter>
                        <CButton
                          className={`btn btn-primary saveButtonTheme${themes}`}
                          onClick={() =>
                            assignCategorytoCourses(
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
                                <div className="col-md-12 col-xxl-12">
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
                        <DataTable
                          selectionMode={rowClick ? null : "checkbox"}
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
                      </CModalBody>
                      <CModalFooter>
                        <CButton
                          className="btn btn-primary"
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
                                <div className="col-md-12 col-xxl-12">
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
                      </CModalBody>
                      <CModalFooter>
                        <CButton
                          className="btn btn-primary"
                          onClick={() => addContentToOrg()}
                          type="button"
                          // disabled={checkUser}
                        >
                          Assign Category
                        </CButton>
                        <CButton
                          className="btn btn-primary"
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
                        <div className="card">
                          <DataTable
                            value={items}
                            showGridlines
                            className="p-datatable-striped"
                          >
                            <Column
                              field="categoryName"
                              header="Name"
                              style={{ width: "25%" }}
                              body={bodyTemplate}
                            ></Column>
                            <Column
                              field="categoryCode"
                              header="Code"
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
                        <div className="card responsiveClass">
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
                            filterDisplay="row"
                            onSelectionChange={(e) => {
                              setSelectedContent(e.value);
                              setCategoryId(e.value.map((e) => e.categoryId));
                              setCategoryPayload([
                                {
                                  categoryId: categoryId,
                                  groups: null,
                                },
                              ]);
                              console.log(categoryId);
                              getUnassignedCourseLibraryByCategoryId(
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
                              header="Name"
                              sortable
                              showFilterMenu={false}
                              filter
                              filterElement={categoryNameFilterTemplate}
                              filterPlaceholder="Search"
                            ></Column>
                            <Column
                              body={categoryCode}
                              field="categoryCode"
                              header="Code"
                              showFilterMenu={false}
                              filter
                              filterElement={categoryCodeFilterTemplate}
                              filterPlaceholder="Search"
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
                              body={assignedShow}
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
