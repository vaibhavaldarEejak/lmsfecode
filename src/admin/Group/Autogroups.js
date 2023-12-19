import React, { useRef, useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CFormInput,
  CImage,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CNav,
  CFormCheck,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Skeleton } from "primereact/skeleton";
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";
import generalDeleteApiCall from "src/server/generalDeleteApiCall";
import "../../css/table.css";

const Autogroups = () => {
  const toast = useRef(null),
    [responseData, setResponseData] = useState([]),
    [loader, setLoader] = useState(false),
    [deleteProductsDialog, setDeleteProductsDialog] = useState(false),
    [batData, setBatData] = useState(null),
    [batvisible, setBatvisible] = useState(false),
    [resData, setResData] = useState([
      {
        groups: null,
        firstName: null,
        lastName: null,
        roleName: null,
        username: null,
        checked: 0,
      },
    ]),
    [visible, setVisible] = useState(false),
    [catvisible, setCatvisible] = useState(false),
    [globalFilterValue2, setGlobalFilterValue2] = useState(""),
    [agreement, setAgreement] = useState({ groups: [] }),
    [userslist, setUserslist] = useState([]),
    [catData, setCatData] = useState(null),
    [selectedGroups, setSelectedGroups] = useState([]),
    [rowClick, setRowClick] = useState(false),
    [filters2, setFilters2] = useState(null),
    [groupId, setGroupId] = useState(),
    [deleteProductDialog, setDeleteProductDialog] = useState(false),
    [selectedProduct, setSelectedProduct] = useState(null),
    [isButtonClicked, setIsButtonClicked] = useState(false),
    [testData, setTestData] = useState([]),
    [filters, setFilters] = useState(null),
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
    }),
    dt = useRef(null),
    dt1 = useRef(null);


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

  const exportCSV1 = () => {
    dt1.current.exportCSV();
  };
  const onGlobalFilterChange2 = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters2(_filters);
    setGlobalFilterValue2(value);
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

  const getUserassignList = async (id) => {
    try {
      const res = await getApiCall("getUserListByGroupId", id);
      setCatData(
        res.map((userData) => ({
          userId: userData.userId,
          fullName: userData.fullName,
          isChecked: userData.isChecked === 1 ? 1 : 0,
        }))
      );
    } catch (err) {}
  };

  useEffect(() => {
    if (isButtonClicked && groupId !== null) {
      getUserassignList(groupId);
    }
  }, [isButtonClicked, groupId]);

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
      getGroupListing();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error unassigning Group user",
        life: 3000,
      });
    }
  };

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
      getGroupListing();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Assigning Group To User",
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

  useEffect(() => {
    setTimeout(() => {
      setLoader(true);
    }, [2000]);
    const fetchData = async () => {
      await Promise.all([
        getActiveUserListing(),
        getGroupListing(),
        initFilters(),
      ]);
      userlist();
    };

    fetchData();
  }, []);

  const Deletegroup = async (groupId) => {
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
        onClick={() => Deletegroup(selectedProduct.groupId)}
      />
    </React.Fragment>
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

  const items = Array.from({ length: 10 }, (v, i) => i);

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
  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
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

  const getGroupListing = async () => {
    try {
      const res = await getApiCall("getOrgGroupList?isAuto=1");
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
    } catch (err) {}
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
        res.map((item) => ({
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

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <Link to={`/admin/grouplist/addeditgroup?${responseData?.groupId}`}>
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
      getGroupListing();
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
                        <CNavItem>
                          <Link
                            style={{
                              cursor: "pointer",
                              textDecoration: "none",
                            }}
                            to={`/admin/grouplist`}
                          >
                            <CNavLink style={{ cursor: "pointer" }}>
                              <strong> All Groups</strong>
                            </CNavLink>{" "}
                          </Link>
                        </CNavItem>
                      </CNavItem>
                      <CNavItem>
                        <Link
                          style={{ cursor: "pointer", textDecoration: "none" }}
                          to={`/admin/groupslist/autogroup`}
                        >
                          <CNavLink active style={{ cursor: "pointer" }}>
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
                            <strong> Manual Groups</strong>
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
                              to={`/admin/autogroup/organizegroup`}
                              className={`me-md-2 btn btn-info saveButtonTheme${themes}`}
                              title="Add Group"
                            >
                              + &nbsp; Organize Group
                            </Link>
                            <Link
                              to={`/admin/usermanagement/grouplist/importgroups`}
                            ></Link>

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
                        dataKey="userId"
                        filters={filters}
                        filterDisplay="menu"
                        globalFilterFields={[
                          "firstName",
                          "lastName",
                          "roleName",
                        ]}
                      >
                        <Column
                          body={(rowData) => (
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={rowData.checked === 1} // Use strict comparison for checked value
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
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="Users"
                          header="Users"
                          style={{ width: "20%" }}
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
                      ></Column>
                      <Column
                        field="groupCode"
                        header="Code"
                        showFilterMenu={false}
                        filter
                        filterElement={groupCodeFilterTemplate}
                        filterPlaceholder="Search"
                      ></Column>
                      <Column
                        field="usersAssiged"
                        header="Users"
                        body={buttonTemplate5}
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
export default Autogroups;
