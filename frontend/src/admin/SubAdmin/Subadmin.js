import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  CCard,
  CCardBody,
  CFormCheck,
  CCardHeader,
  CCol,
  CRow,
  CModal,
  CImage,
  CModalHeader,
  CModalBody,
  CTabPane,
  CModalFooter,
  CTabContent,
  CButton,
  CFormSelect,
  CFormInput,
} from "@coreui/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";
import "../../css/table.css";

const Subadmin = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken"),
    [visible, setVisible] = useState(false),
    [grpvisible, setGrpvisible] = useState(false),
    [catvisible, setCatvisible] = useState(false),
    [resData, setResData] = useState(null),
    [catData, setCatData] = useState(null),
    [reevisible, setReevisible] = useState(false),
    [subadminRoleList, setSubadminRoleList] = useState([]),
    [responseData, setResponseData] = useState(null),
    [filters, setFilters] = useState(null),
    [filters2, setFilters2] = useState(null),
    [filters3, setFilters3] = useState(null),
    [agreement, setAgreement] = useState({ userIds: [] }),
    [globalFilterValue, setGlobalFilterValue] = useState(""),
    [globalFilterValue2, setGlobalFilterValue2] = useState(""),
    [globalFilterValue3, setGlobalFilterValue3] = useState(""),
    [rData, setRData] = useState(null);

  const [userPayload, setUserPayload] = useState({
    userId: null,
    groupIds: [],
  });

  const [categoryPayload, setCategoryPayload] = useState({
    userId: null,
    categoryIds: [],
  });

  const [payload, setPayload] = useState({
    userId: null,
    roleId: null,
  });

  const dt = useRef(null);

  const toast = useRef(null);

  const getUserListing = async () => {
    try {
      const res = await getApiCall("getSubAdminUserList");
      setRData(res);
    } catch (err) {}
  };

  const getSubadminListing = async () => {
    try {
      const res = await getApiCall("getSubAdminList");
      setResponseData(res);
    } catch (err) {}
  };

  const getSubadminRoleListing = async () => {
    try {
      const res = await getApiCall("getRoleListForSubadmin");
      setSubadminRoleList(res);
    } catch (err) {}
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (agreement.userIds.length === 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Select The Users",
        life: 3000,
      });
    } else {
      adduserSubadmin(agreement);
    }
    setTimeout(() => {
      setReevisible(false);
    }, 3000);
  };

  const adduserSubadmin = async (data) => {
    try {
      const res = await postApiCall("userToSubAdmin", data);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "User Successfully Assigned as Subadmin",
        life: 3000,
      });

      getSubadminListing();
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error in User assigning",
        life: 3000,
      });
    }
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const UnassignInstructor = async (data) => {
    try {
      const res = await postApiCall("unAssignRole", data);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "User Successfully Unassigned",
        life: 3000,
      });

      getSubadminListing();
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error in User Unassigning",
        life: 3000,
      });
    }
  };

  const onSaveUnassigned = (e) => {
    e.preventDefault();
    if (payload.roleId === null) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Select The Role",
        life: 3000,
      });
    } else {
      UnassignInstructor(payload);
    }
    setTimeout(() => {
      setVisible(false);
    }, 3000);
    
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
    let _filters = { ...filters2 };
    _filters["global"].value = value;

    setFilters2(_filters);
    setGlobalFilterValue2(value);
  };

  const onGlobalFilterChange3 = (e) => {
    const value = e.target.value;
    let _filters = { ...filters3 };
    _filters["global"].value = value;

    setFilters3(_filters);
    setGlobalFilterValue3(value);
  };

  const initFilters3 = () => {
    setFilters3({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      categoryName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });
    setGlobalFilterValue3("");
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      firstName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      email: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue("");
  };

  const firstNameFilterTemplate = (options) => {
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

  const emailFilterTemplate = (options) => {
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

  const initFilters2 = () => {
    setFilters2({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      firstName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      lastName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });
    setGlobalFilterValue2("");
  };

  function handleCheckboxChange2(rowData, field, event) {
    const isChecked = event.target.checked;
    const updatedRow = { ...rowData, [field]: isChecked ? 1 : 0 };
    const updatedData = resData.map((row) =>
      row.groupId === rowData.groupId ? updatedRow : row
    );
    setResData(updatedData);

    setUserPayload((prevPayload) => ({
      ...prevPayload,
      groupIds: isChecked
        ? [...prevPayload.groupIds, rowData.groupId]
        : prevPayload.groupIds.filter((groupId) => groupId !== rowData.groupId),
    }));
  }

  const [testData, setTestData] = useState([]);

  function handleCheckboxChange4(rowData, field, event) {
    const isChecked = event.target.checked ? 1 : 0;
    // console.log(rowData.categoryId);

    setTestData((prevTestData) => [
      ...prevTestData,
      {
        id: rowData.categoryId,
      },
    ]);

    const updatedRow = { ...rowData, [field]: isChecked };
    const updatedData = catData.map((row) =>
      row.categoryId === rowData.categoryId ? updatedRow : row
    );
    setCatData(updatedData);
  }

  useEffect(() => {
    const categoryIds = testData.map((data) => data.id);
    setCategoryPayload((prevPayload) => ({
      ...prevPayload,
      categoryIds: categoryIds, // Updated field name
    }));
  }, [testData]);

  function handleCheckboxChange(event) {
    const { value, checked } = event.target;
    const { userIds } = agreement;
    if (checked) {
      setAgreement({ userIds: [...userIds, value] });
    } else {
      setAgreement({
        userIds: userIds.filter((e) => e !== value),
      });
    }
  }

  const items = Array.from({ length: 10 }, (v, i) => i);

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
    } catch (err) {}
  };

  const getCategoryList = async () => {
    try {
      const res = await getApiCall("getOrganizationCategoryList");
      setCatData(
        res.map((categoryData) => ({
          categoryId: categoryData.categoryId,
          categoryName: categoryData.categoryName,
          isChecked: 0,
        }))
      );
    } catch (err) {}
  };

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };

  const orgUserGroupAssignment = async () => {
    try {
      const res = await postApiCall("orgUserGroupAssignment", userPayload);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "User added to Group Successfully!",
        life: 3000,
      });
      setTimeout(() => {
        setGrpvisible(false);
      }, 3000);
      getSubadminListing();
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Adding User To Group",
        life: 3000,
      });
    }
  };

  const orgUserCategoryAssignment = async () => {
    try {
      const res = await postApiCall(
        "orgUserCategoryAssignment",
        categoryPayload
      );
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "User added to Category Successfully!",
        life: 3000,
      });
      setTimeout(() => {
        setCatvisible(false);
      }, 3000);
      getSubadminListing();
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Adding User To Category",
        life: 3000,
      });
    }
  };

  const fetchData = () => {
    getSubadminListing();
    getUserListing();
    getOrgGroupList();
    getCategoryList();
    getSubadminRoleListing();
    initFilters();
    initFilters2();
    initFilters3();
  };

  useMemo(() => {
    if (token !== "Bearer null") {
      fetchData();
    }
  }, [token]);

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <CButton
        color="light"
        className="me-3"
        onClick={(e) => {
          // console.log('ddddd',responseData.userId)
          setUserPayload((prevPayload) => ({
            ...prevPayload,
            userId: responseData.userId,
            groups: null,
          }));
          setGrpvisible(!grpvisible);
        }}
      >
        Group
      </CButton>

      <CButton
        color="light"
        className="me-3"
        onClick={(e) => {
          setCategoryPayload((prevPayload) => ({
            ...prevPayload,
            userId: responseData.userId,
            category: null,
          }));
          setCatvisible(!catvisible);
        }}
      >
        Category
      </CButton>
    </div>
  );

  return (
    <div className="Subadminlisting">
      <div className="container">
        <div className="container-fluid">
          <Toast ref={toast}></Toast>
          <CModal
            size="md"
            visible={visible}
            onClose={() => setVisible(false)}
            scrollable
          >
            <CModalHeader closeButton={true}>
              <h5>Role List</h5>
            </CModalHeader>
            <CModalBody>
              <CFormSelect
                onChange={(e) => {
                  setPayload({ ...payload, roleId: parseInt(e.target.value) });
                }}
              >
                <option value={0}>Select Role</option>
                {subadminRoleList &&
                  subadminRoleList.map((role) => (
                    <option value={role.roleId}>{role.roleName}</option>
                  ))}
              </CFormSelect>
            </CModalBody>
            <CModalFooter>
              <CButton
                className="btn btn-primary"
                onClick={(e) => onSaveUnassigned(e)}
                type="button"
                // disabled={checkUser}
              >
                Change Role
              </CButton>

              <CButton
                className="btn btn-primary"
                onClick={() => setVisible(false)}
              >
                Cancel
              </CButton>
            </CModalFooter>
          </CModal>
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
                  body={(rowData) => (
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value={rowData.isChecked == 1 ? true : false}
                      checked={rowData.isChecked == 1}
                      onChange={(event) =>
                        handleCheckboxChange2(rowData, "isChecked", event)
                      }
                    />
                  )}
                />
                <Column field="groupName" header="Group Name" sortable></Column>
              </DataTable>
            </CModalBody>
            <CModalFooter>
              <CButton
                className="btn btn-primary"
                onClick={() => orgUserGroupAssignment()}
                type="button"
              >
                + Assign
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

          {/* Category Model Start */}
          <CModal
            size="md"
            visible={catvisible}
            onClose={() => setCatvisible(false)}
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
                value={catData}
                removableSort
                showGridlines
                rowHover
                emptyMessage="-"
                dataKey="categoryId"
                filters={filters3}
                filterDisplay="menu"
                globalFilterFields2={["categoryName"]}
              >
                <Column
                  field="isChecked"
                  body={(rowData) => (
                    <input
                      class="form-check-input"
                      type="checkbox"
                      value={rowData.isChecked == 1 ? true : false}
                      checked={rowData.isChecked == 1}
                      onChange={(event) =>
                        handleCheckboxChange4(rowData, "isChecked", event)
                      }
                    />
                  )}
                />
                <Column
                  field="categoryName"
                  header="Category Name"
                  sortable
                ></Column>
              </DataTable>
            </CModalBody>
            <CModalFooter>
              <CButton
                className="btn btn-primary"
                onClick={() => orgUserCategoryAssignment()}
                type="button"
              >
                + Assign
              </CButton>
              <CButton
                className="btn btn-primary"
                onClick={() => setCatvisible(false)}
              >
                Cancel
              </CButton>
            </CModalFooter>
          </CModal>
          {/* Category Model End */}
          <CRow>
            <CCol xs={12} style={{ padding: "1px" }}>
              <CCard className="mb-6 card-ric">
                <div>
                  <CCardHeader>
                    <strong>Sub Admin List</strong>
                  </CCardHeader>
                  <CTabPane className="p-3 preview" visible>
                    <div className="card-header border-0 d-flex justify-content-between">
                      <div className="d-flex row align-items-center">
                        <div className="col-md-12 col-xxl-12">
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
                      </div>
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <CButton
                          className="btn btn-primary"
                          onClick={() => setReevisible(!reevisible)}
                          type="button"
                          title="Add User to Subadmin"
                        >
                          + &nbsp;Add Subadmin
                        </CButton>
                        <Button
                          title="Export Users"
                          style={{ height: "40px" }}
                          icon="pi pi-upload"
                          className="btn btn-info"
                          onClick={exportCSV}
                        />
                      </div>
                      <CModal
                        size="md"
                        visible={reevisible}
                        onClose={() => setReevisible(false)}
                        scrollable
                      >
                        <CModalHeader closeButton={false}>
                          <CTabContent className="rounded-bottom">
                            <CTabPane className="p-3 preview" visible>
                              <div className="card-header border-0 d-flex justify-content-between">
                                <div className="d-flex row align-items-center">
                                  <div className="col-md-12 col-xxl-12">
                                    <span className="p-input-icon-left">
                                      <i className="pi pi-search" />
                                      <InputText
                                        style={{ height: "40px" }}
                                        value={globalFilterValue2}
                                        onChange={onGlobalFilterChange2}
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

                        {/* Add user to Subadmin list Modal  */}
                        <CModalBody>
                          <DataTable
                            value={rData}
                            removableSort
                            showGridlines
                            rowHover
                            emptyMessage="-."
                            dataKey="userId"
                            filters={filters2}
                            filterDisplay="menu"
                            globalFilterFields={["firstName", "lastName"]}
                          >
                            <Column
                              body={(rowData) => (
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  value={rowData.userId}
                                  onChange={(event) =>
                                    handleCheckboxChange(event)
                                  }
                                />
                              )}
                              style={{ width: "1%" }}
                            ></Column>
                            <Column
                              field="firstName"
                              header="First Name"
                              sortable
                            ></Column>
                            <Column
                              field="lastName"
                              header="Last Name"
                              sortable
                            ></Column>
                          </DataTable>
                        </CModalBody>
                        <CModalFooter>
                          <CButton
                            className="btn btn-primary"
                            onClick={(e) => handleSave(e)}
                            type="button"
                            // disabled={checkUser}
                            title="Add User to Subadmin"
                          >
                            + Add User to Subadmin
                          </CButton>

                          <CButton
                            className="btn btn-primary"
                            onClick={() => setReevisible(false)}
                          >
                            Cancel
                          </CButton>
                        </CModalFooter>
                      </CModal>
                    </div>
                  </CTabPane>
                </div>

                <CCardBody>
                  {!responseData ? (
                    <DataTable
                      value={items}
                      showGridlines
                      className="p-datatable-striped"
                    >
                      <Column
                        field="firstName"
                        header="Name"
                        style={{ width: "20%" }}
                        body={bodyTemplate}
                      ></Column>
                      <Column
                        field="email"
                        header="Email"
                        style={{ width: "20%" }}
                        body={bodyTemplate}
                      ></Column>
                      <Column
                        field="groups"
                        header="Group"
                        style={{ width: "20%" }}
                        body={bodyTemplate}
                      ></Column>
                      <Column
                        field="Category"
                        header="Category"
                        style={{ width: "20%" }}
                        body={bodyTemplate}
                      ></Column>
                      <Column
                        field="Action"
                        header="Action"
                        style={{ width: "10%" }}
                        body={bodyTemplate}
                      ></Column>
                      <Column
                        field="Role"
                        header="Role"
                        style={{ width: "10%" }}
                        body={bodyTemplate}
                      ></Column>
                    </DataTable>
                  ) : (
                    <DataTable
                      ref={dt}
                      value={responseData}
                      removableSort
                      paginator
                      showGridlines
                      rowHover
                      emptyMessage="-"
                      responsiveLayout="scroll"
                      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                      rows={10}
                      rowsPerPageOptions={[10, 20, 50]}
                      dataKey="userId"
                      filters={filters}
                      filterDisplay="row"
                      globalFilterFields={["firstName", "email"]}
                    >
                      <Column
                        field="firstName"
                        header="Name"
                        showFilterMenu={false}
                        filter
                        filterElement={firstNameFilterTemplate}
                        filterPlaceholder="Search"
                        sortable
                      ></Column>
                      <Column
                        field="email"
                        header="Email"
                        showFilterMenu={false}
                        filter
                        filterElement={emailFilterTemplate}
                        filterPlaceholder="Search"
                      ></Column>
                      <Column
                        body={(rowData) =>
                          rowData.groups != 0 ? (
                            <div
                              style={{
                                maxWidth: "25vw",
                                wordWrap: "break-word",
                              }}
                            >
                              {rowData.groups?.join(",")}
                            </div>
                          ) : (
                            <div>-</div>
                          )
                        }
                        header="Groups"
                      ></Column>
                      <Column
                        body={(rowData) =>
                          rowData.categoryAssiged != 0 ? (
                            <div
                              style={{
                                maxWidth: "25vw",
                                wordWrap: "break-word",
                              }}
                            >
                              <>{rowData.categoryAssiged?.join(",")}</>
                            </div>
                          ) : (
                            <div>-</div>
                          )
                        }
                        header="Category"
                      ></Column>

                      <Column header="Action" body={buttonTemplate}></Column>
                      <Column
                        body={(rowData) => (
                          <CImage
                            src="/media/icon/arr014.svg"
                            className="me-3"
                            alt="add.svg"
                            style={{ cursor: "pointer" }}
                            title="Un-Assign"
                            onClick={() => {
                              setVisible(true),
                                setPayload({
                                  ...payload,
                                  userId: rowData.userId,
                                });
                            }}
                          />
                        )}
                        header="Role"
                      ></Column>
                    </DataTable>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </div>
    </div>
  );
};

export default Subadmin;
