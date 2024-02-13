import React, { useRef, useEffect, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import {
  CCard,
  CCardBody,
  CFormCheck,
  CCardHeader,
  CCol,
  CRow,
  CNavItem,
  CNav,
  CNavLink,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CButton,
  CImage,
  CBadge,
  CTabContent,
  CTabPane,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
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
import deleteApiMethodDeleteAndId from "src/server/deleteApiMethodDeleteAndId";
import postApiCall from "src/server/postApiCall";
import generalDeleteApiCall from "src/server/generalDeleteApiCall";
import "../../css/table.css";
import { useNavigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;

const Grouplist = () => {
  const toast = useRef(null),
    navigate = useNavigate(),
    [responseData, setResponseData] = useState([]),
    [deleteProductsDialog, setDeleteProductsDialog] = useState(false),
    [resData, setResData] = useState([
      {
        userId: null,
        firstName: null,
        lastName: null,
        roleName: null,
        username: null,
        checked: 0,
      },
    ]),
    [loader, setLoader] = useState(false),
    [catvisible, setCatvisible] = useState(false),
    [batvisible, setBatvisible] = useState(false),
    [visible, setVisible] = useState(false),
    [agreement, setAgreement] = useState({ groups: [] }),
    [userslist, setUserslist] = useState([]),
    [deleteProductDialog, setDeleteProductDialog] = useState(false),
    [selectedProduct, setSelectedProduct] = useState(null),
    [catData, setCatData] = useState(null),
    [batData, setBatData] = useState(null),
    [filters2, setFilters2] = useState(null),
    [rowClick, setRowClick] = useState(false),
    [selectedGroups, setSelectedGroups] = useState([]),
    [groupId, setGroupId] = useState(),
    [globalFilterValue2, setGlobalFilterValue2] = useState(""),
    [globalFilterValue4, setGlobalFilterValue4] = useState(""),
    [isButtonClicked, setIsButtonClicked] = useState(false),
    [testData, setTestData] = useState([]),
    [filters, setFilters] = useState(null),
    [filters4, setFilters4] = useState(null),
    [globalFilterValue, setGlobalFilterValue] = useState(""),
    colorName = localStorage.getItem("ThemeColor"),
    [themes, setThemes] = useState(colorName),
    [payload, setPayload] = useState([
      {
        groups: [], // Initialize groups as an empty array
        users: [],
      },
    ]),
    [userPayload, setUserPayload] = useState({
      groupId: null,
      users: [
        {
          userId: null,
          isChecked: 1,
        },
        {
          userId: null,
          isChecked: 0,
        },
      ],
    });

  const tableRef = useRef(null);
  const dt = useRef(null);
  const dt1 = useRef(null);

  const handleChange = (e) => {
    const { value, checked } = e.target;
    const { groups } = agreement;
    if (checked) {
      setAgreement({ groups: [...groups, value] });
    } else {
      setAgreement({
        groups: groups.filter((e) => e !== value),
      });
    }
  };

  function handleCheckboxChange(rowData, field, event) {
    const isChecked = event.target.checked ? 1 : 0;
    const updatedRow = { ...rowData, [field]: isChecked };
    const updatedData = resData.map((row) =>
      row.userId === rowData.userId ? updatedRow : row
    );
    setResData(updatedData);

    const updatedUsers = updatedData
      .filter((row) => row.checked === 1)
      .map((row) => parseInt(row.userId, 10));
    setPayload([
      {
        groups: agreement.groups.length > 0 ? agreement.groups : [],
        users: updatedUsers,
      },
    ]);
  }

  function handleCheckboxChange4(rowData, field, event) {
    const isChecked = event.target.checked ? 1 : 0;
    console.log(rowData.userId);
    setTestData((prevTestData) => {
      const existingIds = prevTestData.map((data) => data.id);
      const updatedData = [...prevTestData];

      if (event.target.checked) {
        if (!existingIds.includes(rowData.userId)) {
          updatedData.push({
            id: rowData.userId,
            checked: isChecked,
          });
        }
      } else {
        const index = existingIds.indexOf(rowData.userId);
        if (index !== -1) {
          updatedData.splice(index, 1);
        }
      }

      return updatedData;
    });

    const updatedRow = { ...rowData, [field]: isChecked };
    const updatedData =
      catData &&
      catData.map((row) => (row.userId === rowData.userId ? updatedRow : row));
    setCatData(updatedData);

    const updatedUsers = updatedData
      .filter((row) => row.checked === 1)
      .map((row) => ({ userId: row.userId, isChecked: 1 }));

    setUserPayload((prevPayload) => ({
      ...prevPayload,
      users: updatedUsers,
    }));
  }

  useEffect(() => {
    setUserPayload((prevPayload) => ({
      ...prevPayload,
      groupId: prevPayload.groupId,
      users: testData.map((data) => ({ userId: data.id, isChecked: 1 })),
    }));
  }, [testData]);

  const UnassignGroupUser = async (id, userId) => {
    const data = {
      id: groupId,
      userId: userId,
    };
    try {
      const response = await deleteApiMethodDeleteAndId(
        "unassigendGroupUserById",
        id,
        data
      );
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Group user unassigned successfully!",
        life: 3000,
      });
      getActiveUserListing();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error unassigning Group user",
        life: 3000,
      });
    }
  };

  const onGlobalFilterChange2 = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters2(_filters);
    setGlobalFilterValue2(value);
  };

  const onGlobalFilterChange4 = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters4(_filters);
    setGlobalFilterValue4(value);
  };

  const getUserassignList = async (id) => {
    try {
      const response = await getApiCall("getUserListByGroupId", id);
      setCatData(
        response.map((userData) => ({
          userId: userData.userId,
          fullName: userData.fullName,
          isChecked: userData.isChecked === 1 ? 1 : 0,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (isButtonClicked && groupId !== null) {
      getUserassignList(groupId);
    }
  }, [isButtonClicked, groupId]);

  const addgroupuser = async (data) => {
    try {
      const response = await postApiCall("groupOrgUserAssign", data);
      getGroupListing();

      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Group Assigned to User",
        life: 3000,
      });

      getActiveUserListing();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Assigning Group To User",
        life: 3000,
      });
    }
  };

  const addCategoryToOrg = async () => {
    try {
      const response = await postApiCall("groupOrgUserAssign", userPayload);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Group added to User Successfully!",
        life: 3000,
      });
      setTimeout(() => {
        setCatvisible(false);
      }, 3000);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Adding User To Group",
        life: 3000,
      });
    }
  };

  const handleSave = () => {
    if (payload[0].users[0].userId === 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Select The Users",
        life: 3000,
      });
    } else {
      addgroupuser(payload[0]);
    }
    setTimeout(() => {
      setVisible(false);
    }, 3000);
   
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Users table",
    sheet: "Users",
  });

  useEffect(() => {
    setTimeout(() => {
      setLoader(true);
    }, [2000]);
    const fetchData = async () => {
      await Promise.all([
        getActiveUserListing(),
        getGroupListing(),

        initFilters(),
        initFilters2(),
        initFilters4(),
      ]);
      userlist();
    };

    fetchData();
  }, []);

  const getGroupListing = async () => {
    try {
      const res = await getApiCall("getOrgGroupList");
      setResponseData(res);
      then((response) => {
        const groupData = response.data.data;
        // Update the usersAssigned value for each group
        const updatedGroupData = groupData.map((group) => {
          const assignedUsers = group.usersAssiged.join(", ");
          return { ...group, usersAssigned: assignedUsers };
        });
        setResponseData(updatedGroupData);
      });
    } catch (err) { }
  };

  const userlist = async () => {
    try {
      const response = await getApiCall(
        "getUserList?userType=activeUser&sort=firstName&order=ASC"
      );
      setUserslist(response);
    } catch (error) {
      console.log(error);
    }
  };

  const getActiveUserListing = async () => {
    try {
      const response = await getApiCall(
        "getUserList?userType=activeUser&sort=firstName&order=ASC"
      );
      setResData(
        response.map((item) => ({
          userId: item.userId,
          firstName: item.firstName,
          lastName: item.lastName,
          roleName: item.roleName,
          username: item.username,
          checked: 0,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const statusShow = (responseData) =>
    responseData?.isAuto === 1 ? (
      <CBadge className="badge badge-light-info text-primary" color="light">
        Auto Group
      </CBadge>
    ) : (
      <CBadge className="badge badge-light-info text-info" color="light">
        Manual Group
      </CBadge>
    );

  const Autogroupshow = (responseData) => (
    <div>
      {responseData.groupType ? (
        <CBadge className="badge badge-light-info text-primary" color="light">
          {responseData.groupType}
        </CBadge>
      ) : (
        <CBadge className="badge badge-light-info text-primary" color="light">
          -
        </CBadge>
      )}
    </div>
  );

  const Deletgroup = async (groupId) => {
    const data = {
      groupId: groupId,
    };
    try {
      const response = await generalDeleteApiCall("deleteOrgGroup", data);
      const filteredData = responseData.filter(
        (item) => item.groupId !== groupId
      );
      setResponseData(filteredData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Group deleted successfully!",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error deleting Group",
        life: 3000,
      });
    }
    setDeleteProductDialog(false);
  };

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <Link
        to={`/admin/grouplist/addeditgroup`}
        onClick={() => {
          localStorage.setItem("groupId", responseData.groupId);
        }}
      >
        <CImage
          src="/custom_icon/edit.svg"
          className="me-2"
          alt="edit.svg"
          style={{ height: "22px" }}
          title="Edit Group"
        />
      </Link>
      <CImage
        src="/custom_icon/bin.svg"
        className="me-3"
        alt="bin.svg"
        style={{ height: "22px", cursor: "pointer" }}
        onClick={() => confirmDeleteProduct(responseData)}
        title="Delete Group"
      />
    </div>
  );

  const removeCategoryButton = (responseData) => (
    <>
      <CImage
        src="/media/icon/CloseIcon.svg"
        style={{ height: "28px", cursor: "pointer" }}
        onClick={() => {
          UnassignGroupUser(responseData.userId);
        }}
        alt="eye_icon"
        className="me-2"
        title="Remove Course"
      />
    </>
  );

  const confirmDeleteProduct = (product) => {
    setSelectedProduct(product);
    setDeleteProductDialog(true);
  };
  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
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
        onClick={() => Deletgroup(selectedProduct.groupId)}
      />
    </React.Fragment>
  );

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const exportCSV1 = () => {
    dt1.current.exportCSV();
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
      groupName: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      groupCode: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      parentGroupName: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
    });
    setGlobalFilterValue("");
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

  const initFilters4 = () => {
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
    setGlobalFilterValue4("");
  };

  const checkbox1 =
    responseData &&
    ((e) => (
      <>
        <input
          class="form-check-input"
          type="checkbox"
          onChange={(event) => handleChange(event)}
          value={e.groupId}
          style={{ marginTop: "11px" }}
        />
      </>
    ));

  const buttonTemplate5 = (responseData) => (
    <div style={{ display: "flex" }}>
      <CButton
        color="light"
        className="me-3"
        onClick={(e) => {
          setGroupId(responseData.groupId),
            setUserPayload((prevPayload) => ({
              ...prevPayload,
              groupId: responseData.groupId,
            }));
          setCatvisible(!catvisible);
          setIsButtonClicked(true);
        }}
      >
        Assign User
      </CButton>
    </div>
  );

  const parent = (responseData) => (
    <>{responseData.parentGroupName ? responseData.parentGroupName : "-"}</>
  );

  const items = Array.from({ length: 10 }, (v, i) => i);

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };

  const deleteProductsDialogFooter2 = () => (
    <React.Fragment>
      <Button
        label="No"
        size="sm"
        icon="pi pi-times"
        outlined
        onClick={() => setDeleteProductsDialog(false)}
      />
      <Button
        label="Yes"
        size="sm"
        icon="pi pi-check"
        severity="info"
        onClick={() => BulkDeletegroup(agreement.groups)}
      />
    </React.Fragment>
  );

  const BulkDeletegroup = async (groupId) => {
    const data = {
      groupIds: groupId,
    };
    try {
      const response = await generalDeleteApiCall("bulkDeleteOrgGroup", data);
      getGroupListing();
      setAgreement({ users: "" });
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Groups deleted successfully!",
        life: 3000,
      });
      setDeleteProductsDialog(false);
      window.location.reload();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error deleting user",
        life: 3000,
      });
    }
    setDeleteProductsDialog(false);
  };

  const groupNameFilterTemplate = (options) => {
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
  const groupCodeFilterTemplate = (options) => {
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
  const parentGroupNameFilterTemplate = (options) => {
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
    <div className="Grouplisting">
      <div className="container">
        <div className="container-fluid">
          <CRow>
            <CCol xs={12} style={{ padding: "1px" }}>
              <CCard className="mb-6 card-ric">
                <Toast ref={toast} />
                <div>
                  <CCardHeader className="p-0">
                    <CNav variant="tabs">
                      <CNavItem>
                        <CNavLink active style={{ cursor: "pointer" }}>
                          <strong>All Groups</strong>
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <Link
                          style={{ cursor: "pointer", textDecoration: "none" }}
                          to={`/admin/autogroup`}
                        >
                          <CNavLink style={{ cursor: "pointer" }}>
                            <strong>Auto Groups</strong>
                          </CNavLink>{" "}
                        </Link>
                      </CNavItem>
                      <CNavItem>
                        <Link
                          style={{ cursor: "pointer", textDecoration: "none" }}
                          to={`/admin/manualgroup`}
                        >
                          <CNavLink style={{ cursor: "pointer" }}>
                            <strong>Manual Groups</strong>
                          </CNavLink>{" "}
                        </Link>
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
                                  style={{ height: "40px" }}
                                  onChange={onGlobalFilterChange}
                                  className="p-input-sm"
                                  placeholder="Search..."
                                />
                              </span>
                            </div>
                          </div>
                          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <Link
                              to={`/admin/grouplist/addeditgroup`}
                              className={`me-md-2 btn btn-info saveButtonTheme${themes}`}
                              title="Add Group"
                              onClick={() => {
                                localStorage.removeItem("groupId");
                              }}
                            >
                              + &nbsp; Add Group
                            </Link>
                            <Button
                              title="Export Groups"
                              style={{ height: "40px" }}
                              icon="pi pi-upload"
                              className="btn btn-info"
                              onClick={exportCSV}
                            />

                            <Link to={`/admin/grouplist/importgroups`}>
                              <Button
                                title="Import Groups"
                                style={{ height: "40px" }}
                                icon="pi pi-download"
                                className="btn btn-info"
                              />
                            </Link>

                            <CDropdown>
                              <CDropdownToggle
                                color="primary"
                                className="me-md-2 btn btn-info"
                              >
                                Bulk Option
                              </CDropdownToggle>
                              <CDropdownMenu>
                                <CDropdownItem
                                  onClick={(e) => {
                                    if (agreement.groups.length > 0) {
                                      setDeleteProductsDialog(true);
                                    } else {
                                      toast.current.show({
                                        severity: "error",
                                        summary: "Error",
                                        detail: "Select the Users",
                                        life: 3000,
                                      });
                                    }
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  Bulk Delete
                                </CDropdownItem>
                                <CDropdownItem
                                  onClick={() => {
                                    if (agreement.groups.length === 0) {
                                      toast.current.show({
                                        severity: "error",
                                        summary: "Error",
                                        detail: "Select the groups",
                                        life: 3000,
                                      });
                                    } else {
                                      setVisible(!visible);
                                    }
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  Add User to Selected Group
                                </CDropdownItem>
                              </CDropdownMenu>
                            </CDropdown>
                          </div>
                        </div>
                      </CTabPane>
                    </CTabContent>
                  </CCardHeader>
                </div>

                <CCardBody>
                  <CModal
                    size="md"
                    visible={visible}
                    onClose={() => setVisible(false)}
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
                                    style={{ height: "40px" }}
                                    value={globalFilterValue4}
                                    onChange={onGlobalFilterChange4}
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
                        emptyMessage="No records found"
                        dataKey="userId"
                        filters={filters4}
                        filterDisplay="menu"
                        globalFilterFields4={
                          (["firstName"], ["lastName"], ["roleName"])
                        }
                      >
                        <Column
                          body={(rowData) => (
                            <input
                              class="form-check-input"
                              type="checkbox"
                              value={rowData.isChecked == 1 ? true : false}
                              onChange={(event) =>
                                handleCheckboxChange(rowData, "checked", event)
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
                        <Column field="roleName" header="Role"></Column>
                        <Column field="username" header="Username"></Column>
                      </DataTable>
                    </CModalBody>
                    <CModalFooter>
                      <CButton
                        className="btn btn-primary"
                        onClick={() => handleSave()}
                        type="button"
                      >
                        Add Group to User
                      </CButton>
                      <CButton
                        className="btn btn-primary"
                        onClick={() => setVisible(false)}
                      >
                        Cancel
                      </CButton>
                    </CModalFooter>
                  </CModal>
                  {/* User assign  Model Start */}
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
                      {/* User assign Model Start single assign */}
                    </CModalHeader>
                    <CModalBody>
                      <DataTable
                        selectionMode={rowClick ? null : "checkbox"}
                        selection={selectedGroups}
                        value={catData}
                        removableSort
                        showGridlines
                        rowHover
                        emptyMessage="-"
                        dataKey="userId"
                        filters={filters2}
                        filterDisplay="menu"
                        globalFilterFields2={["userName"]}
                      >
                        <Column
                          field="isChecked"
                          body={(rowData) => (
                            <input
                              class="form-check-input"
                              type="checkbox"
                              value={rowData.isChecked == 1 ? true : false}
                              checked={rowData.isChecked === 1}
                              onChange={(event) =>
                                handleCheckboxChange4(
                                  rowData,
                                  "isChecked",
                                  event
                                )
                              }
                            />
                          )}
                        />
                        <Column
                          field="fullName"
                          header="Full Name"
                          sortable
                        ></Column>
                      </DataTable>
                    </CModalBody>
                    <CModalFooter>
                      <CButton
                        className="btn btn-primary"
                        onClick={() => addCategoryToOrg()}
                        type="button"
                      >
                        Assign User
                      </CButton>
                      <CButton
                        className="btn btn-primary"
                        onClick={() => setCatvisible(false)}
                      >
                        Cancel
                      </CButton>
                    </CModalFooter>
                  </CModal>
                  {/* User assign Model End */}

                  {/* View User assigned Model End */}
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
                                  <Button
                                    title="Export Groups"
                                    style={{ height: "40px" }}
                                    icon="pi pi-upload"
                                    className="btn btn-info"
                                    onClick={exportCSV1}
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
                        selectionMode={rowClick ? null : "checkbox"}
                        selection={selectedGroups}
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
                          field="fullName"
                          header="Full Name"
                          sortable
                        ></Column>
                        <Column
                          field="Action"
                          header="Action"
                          body={removeCategoryButton}
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
                  <Toast ref={toast} />
                  {!loader ? (
                    <div className="card">
                      <DataTable
                        value={items}
                        showGridlines
                        className="p-datatable-striped"
                      >
                        <Column
                          field={<CFormCheck name="addusertogroup" />}
                          header={<CFormCheck name="addusertogroup" />}
                          style={{ width: "1%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="groupName"
                          header="Name"
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="groupCode"
                          header="Code"
                          style={{ width: "10%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="parentGroupName"
                          header="Parent Group Name"
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="Users"
                          header="Users"
                          style={{ width: "15%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="Group Type"
                          header="Group Type"
                          style={{ width: "15%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="Type"
                          header="Type"
                          style={{ width: "15%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="Action"
                          header="Action"
                          style={{ width: "10%" }}
                          body={bodyTemplate}
                        ></Column>
                      </DataTable>
                    </div>
                  ) : (
                    <DataTable
                      ref={dt}
                      value={responseData}
                      removableSort
                      paginator
                      showGridlines
                      rowHover
                      emptyMessage="No records found"
                      responsiveLayout="scroll"
                      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                      rows={10}
                      rowsPerPageOptions={[10, 20, 50]}
                      dataKey="groupId"
                      filters={filters}
                      filterDisplay="row"
                      globalFilterFields={[
                        "groupName",
                        "groupCode",
                        "parentGroupName",
                        "usersAssiged",
                        "categoryAssiged",
                      ]}
                    >
                      <Column body={checkbox1} style={{ width: "1%" }}></Column>
                      <Column
                        field="groupName"
                        header="Name"
                        sortable
                        showFilterMenu={false}
                        filter
                        filterElement={groupNameFilterTemplate}
                        filterPlaceholder="Search"
                        style={{ width: "20%" }}
                      ></Column>
                      <Column
                        field="groupCode"
                        header="Code"
                        showFilterMenu={false}
                        filter
                        filterElement={groupCodeFilterTemplate}
                        filterPlaceholder="Search"
                        style={{ width: "15%" }}
                      ></Column>
                      <Column
                        field="parentGroupName"
                        header="Parent Group Name"
                        body={parent}
                        showFilterMenu={false}
                        filter
                        filterElement={parentGroupNameFilterTemplate}
                        filterPlaceholder="Search"
                        style={{ width: "25%" }}
                      ></Column>
                      <Column
                        header="Users"
                        showFilterMenu={false}
                        body={buttonTemplate5}
                        style={{ width: "15%" }}
                      ></Column>
                      <Column
                        header="Group Type"
                        showFilterMenu={false}
                        body={statusShow}
                        style={{ width: "15%" }}
                      ></Column>
                      <Column
                        header="Type"
                        showFilterMenu={false}
                        field="groupType"
                        body={Autogroupshow}
                      ></Column>
                      <Column header="Action" body={buttonTemplate}></Column>
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
                    visible={deleteProductsDialog}
                    style={{ width: "32rem" }}
                    breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                    header="Confirm"
                    modal
                    footer={deleteProductsDialogFooter2}
                    onHide={() => setDeleteProductsDialog(false)}
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
    </div>
  );
};

export default Grouplist;
