import React, { useRef, useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CFormCheck,
  CCardHeader,
  CFormInput,
  CCol,
  CRow,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CImage,
  CBadge,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Skeleton } from "primereact/skeleton";
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";
import generalDeleteApiCall from "src/server/generalDeleteApiCall";
import "../../css/table.css";

const UserList = () => {
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false),
    [inactiveProductsDialog, setInactiveProductsDialog] = useState(false),
    token = "Bearer " + localStorage.getItem("ApiToken"),
    [visible, setVisible] = useState(false),
    [globalFilterValue2, setGlobalFilterValue2] = useState(""),
    dt = useRef(null),
    toast = useRef(null),
    [deleteProductDialog, setDeleteProductDialog] = useState(false),
    [selectedProduct, setSelectedProduct] = useState(null),
    [responseData, setResponseData] = useState(null),
    [agreement, setAgreement] = useState({ users: [] }),
    [filters, setFilters] = useState(null),
    [filters2, setFilters2] = useState(null),
    [globalFilterValue, setGlobalFilterValue] = useState(""),
    [resData, setResData] = useState([
      {
        groupId: null,
        groupName: null,
        groupCode: 0,
        checked: 0,
      },
    ]),
    [payload, setPayload] = useState([
      {
        users: [],
        groups: [
          {
            groupId: 0,
            checked: 0,
          },
        ],
      },
    ]);

  useEffect(() => {
    if (token !== "Bearer null") {
      getActiveUserListing();
      getActiveGroupListing();
      initFilters();
      initFilters2();
    }
  }, []);

  const BulkInactiveuser = async (userId) => {
    const data = {
      userIds: userId,
    };
    try {
      const response = await postApiCall("bulkInactiveUser", data);
      getActiveUserListing();
      setAgreement({ users: "" });
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "User inactivated successfully!",
        life: 3000,
      });
      setInactiveProductsDialog(false);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error inactivated user",
        life: 3000,
      });
    }

    setInactiveProductsDialog(false);
  };

  const getActiveUserListing = async () => {
    try {
      const res = await getApiCall(
        "getUserList?userType=activeUser&sort=firstName&order=ASC"
      );
      setResponseData(res);
    } catch (err) { }
  };

  const getActiveGroupListing = async () => {
    try {
      const res = await getApiCall("getOrgGroupList");
      setResData(
        res.map((groupData) => ({
          groupId: groupData.groupId,
          groupName: groupData.groupName,
          groupCode: groupData.groupCode,
          checked: 0,
        }))
      );
    } catch (err) { }
  };

  const handleChange = (e) => {
    const { value, checked } = e.target;
    const { users } = agreement;
    if (checked) {
      setAgreement({ users: [...users, value] });
    } else {
      setAgreement({
        users: users.filter((e) => e !== value),
      });
    }
  };

  function handleCheckboxChange(rowData, field, event) {
    const checked = event.target.checked ? 1 : 0;
    const updatedRow = { ...rowData, [field]: checked };
    const updatedData = resData.map((row) =>
      row.groupId === rowData.groupId ? updatedRow : row
    );
    setResData(updatedData);
    setPayload([
      {
        users: agreement.users,
        groups: updatedData,
      },
    ]);
  }

  const adduserGroup = async (data) => {
    try {
      const res = await postApiCall("userGroupAssign", data);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "User Group Assigned",
        life: 3000,
      });
      setVisible(false);

      getActiveUserListing();
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Assigning User Group",
        life: 3000,
      });
    }
  };

  const handleSave = () => {
    if (payload[0].groups[0].groupId === 0) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Select The Groups",
        life: 3000,
      });
    } else {
      adduserGroup(payload[0]);
    }
  };
  const org = (responseData) => (
    <>{responseData.organizationName ? responseData.organizationName : "-"}</>
  );

  const BulkDeleteuser = async (userId) => {
    const data = {
      userIds: userId,
    };
    try {
      const response = await generalDeleteApiCall("bulkDeleteUser", data);
      getActiveUserListing();
      setAgreement({ users: "" });
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "User deleted successfully!",
        life: 3000,
      });
      setDeleteProductsDialog(false);
      getActiveUserListing();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error deleting user",
        life: 3000,
      });
    }
  };

  const Deleteuser = async (userId) => {
    const data = {
      userId: userId,
    };
    try {
      const response = await generalDeleteApiCall("deleteUser", data);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "User deleted successfully!",
        life: 3000,
      });
      setDeleteProductDialog(false);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error deleting user",
        life: 3000,
      });
    }
  };

  const checkbox1 =
    responseData &&
    ((e) => (
      <>
        <input
          class="form-check-input"
          type="checkbox"
          onChange={(event) => handleChange(event)}
          value={e.userId}
          style={{ marginTop: "11px" }}
        />
      </>
    ));

  const active = (responseData) => (
    <>
      <CBadge className="badge badge-light-info text-info" color="light">
        {responseData?.isActive}
      </CBadge>
    </>
  );

  const name = (responseData) => (
    <>
      <span className="me-2">{responseData?.firstName}</span>
      <span>{responseData?.lastName}</span>
    </>
  );

  const roleName = (responseData) => (
    <>{responseData.roleName ? responseData.roleName : "-"}</>
  );
  const phone = (responseData) => (
    <>{responseData.phone ? responseData.phone : "-"}</>
  );

  const email = (responseData) => (
    <>{responseData.email ? responseData.email : "-"}</>
  );

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <Link
        to={`/admin/userlist/viewuser`}
        onClick={() => {
          localStorage.setItem("userId", responseData.userId);
        }}
      >
        <CImage
          src="/custom_icon/eye.svg"
          style={{ height: "25px" }}
          className="me-1 responsiveImage"
          alt="eye.svg"
          title="View User"
        />
      </Link>
      <Link
        to={`/admin/userlist/edituser`}
        onClick={() => {
          localStorage.setItem("userId", responseData.userId);
        }}
      >
        <CImage
          src="/custom_icon/edit.svg"
          className="me-1 responsiveImage"
          alt="edit.svg"
          style={{ height: "22px" }}
          title="Edit User"
        />
      </Link>
      <CImage
        src="/custom_icon/bin.svg"
        className=" responsiveImage"
        alt="bin.svg"
        style={{ height: "22px", cursor: "pointer" }}
        title="Delete User"
        onClick={() => confirmDeleteProduct(responseData)}
      />

      <div
        onClick={() => Inactiveuser(responseData.userId)}
        title="Inactive User"
        style={{ height: "25px", cursor: "pointer", marginRight: "10px" }}
      >
        {" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="28"
          fill="currentColor"
          class={`bi bi-person-fill-slash iconTheme`}
          viewBox="0 0 16 16"
        >
          <path d="M13.879 10.414a2.501 2.501 0 0 0-3.465 3.465l3.465-3.465Zm.707.707-3.465 3.465a2.501 2.501 0 0 0 3.465-3.465Zm-4.56-1.096a3.5 3.5 0 1 1 4.949 4.95 3.5 3.5 0 0 1-4.95-4.95ZM11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-9 8c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Z" />
        </svg>
      </div>
    </div>
  );

  const Inactiveuser = async (userId) => {
    const data = {
      userId: userId,
    };
    try {
      const response = await postApiCall("inactiveUser", data);

      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "User Inactivated successfully!",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Inactivating user",
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
        onClick={() => Deleteuser(selectedProduct.userId)}
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
        onClick={() => setDeleteProductsDialog(false)}
      />
      <Button
        label="Yes"
        size="sm"
        icon="pi pi-check"
        severity="info"
        onClick={() => BulkDeleteuser(agreement.users)}
      />
    </React.Fragment>
  );
  const inactiveProductsDialogFooter2 = () => (
    <React.Fragment>
      <Button
        label="No"
        size="sm"
        icon="pi pi-times"
        outlined
        onClick={() => setInactiveProductsDialog(false)}
      />
      <Button
        label="Yes"
        size="sm"
        icon="pi pi-check"
        severity="info"
        onClick={() => BulkInactiveuser(agreement.users)}
      />
    </React.Fragment>
  );

  const exportCSV = () => {
    dt.current.exportCSV();
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
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters2(_filters);
    setGlobalFilterValue2(value);
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      firstName: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      email: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      phone: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      organizationName: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      roleName: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
    });
    setGlobalFilterValue("");
  };

  const initFilters2 = () => {
    setFilters2({
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
    setGlobalFilterValue2("");
  };

  const items = Array.from({ length: 10 }, (v, i) => i);

  const firstNameRowFilterTemplate = (options) => {
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

  const phoneRowFilterTemplate = (options) => {
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

  const organizationNameRowFilterTemplate = (options) => {
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

  const roleNameRowFilterTemplate = (options) => {
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

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
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
                          style={{ cursor: "pointer", textDecoration: "none" }}
                          to={`/admin/userlist`}
                        >
                          <CNavLink active style={{ cursor: "pointer" }}>
                            <strong>Active Users</strong>
                          </CNavLink>{" "}
                        </Link>
                      </CNavItem>
                      <CNavItem>
                        <Link
                          style={{ cursor: "pointer", textDecoration: "none" }}
                          to={`/admin/inactiveuserlist`}
                        >
                          <CNavLink style={{ cursor: "pointer" }}>
                            Inactive Users
                          </CNavLink>{" "}
                        </Link>
                      </CNavItem>
                      <CNavItem>
                        <Link
                          style={{ cursor: "pointer", textDecoration: "none" }}
                          to={`/admin/deleteduserlist`}
                        >
                          <CNavLink style={{ cursor: "pointer" }}>
                            Deleted Users
                          </CNavLink>{" "}
                        </Link>
                      </CNavItem>

                      <CNavItem>
                        <Link
                          style={{ cursor: "pointer", textDecoration: "none" }}
                          to={`/admin/archiveduserlist`}
                        >
                          <CNavLink style={{ cursor: "pointer" }}>
                            Archived Users
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
                                  style={{ height: "40px" }}
                                  onChange={onGlobalFilterChange}
                                  className="p-input-sm"
                                  placeholder="Search..."
                                />
                              </span>
                            </div>
                          </div>
                          <div className="d-grid gap-2 d-md-flex ">
                            <Link
                              to={`/admin/userlist/addeditviewuser`}
                              className="me-md-2 btn btn-info"
                              title="Add New User"
                            >
                              +
                            </Link>

                            <Button
                              title="Export Users"
                              style={{ height: "40px" }}
                              icon="pi pi-upload"
                              className="btn btn-info"
                              onClick={exportCSV}
                            />

                            <Link to={"/admin/userlist/importusers"}>
                              <Button
                                title="Import Users"
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
                                    if (agreement.users.length > 0) {
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
                                    if (agreement.users.length === 0) {
                                      toast.current.show({
                                        severity: "error",
                                        summary: "Error",
                                        detail: "Select the Users",
                                        life: 3000,
                                      });
                                    } else {
                                      setVisible(!visible);
                                    }
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  Bulk Assign User to Group
                                </CDropdownItem>
                                <CDropdownItem
                                  onClick={(e) => {
                                    if (agreement.users.length > 0) {
                                      setInactiveProductsDialog(true);
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
                                  Bulk Inactivate
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
                  <Toast ref={toast} />
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
                        emptyMessage="No records found."
                        dataKey="groupId"
                        filters={filters2}
                        filterDisplay="row"
                        globalFilterFields2={["groupName"]}
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
                          field="groupName"
                          header="Group Name"
                          sortable
                        ></Column>
                        <Column field="groupCode" header="Group Code"></Column>
                      </DataTable>
                    </CModalBody>
                    <CModalFooter>
                      <CButton
                        className="btn btn-primary"
                        onClick={() => handleSave(false)}
                        type="button"
                        title="Add User to Group"
                      >
                        +
                      </CButton>

                      <CButton
                        className="btn btn-primary"
                        onClick={() => setVisible(false)}
                      >
                        Cancel
                      </CButton>
                    </CModalFooter>
                  </CModal>
                  {!responseData ? (
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
                          field="firstName"
                          header="Name"
                          sortable
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="email"
                          header="Email"
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="phone"
                          header="Contact"
                          style={{ width: "15%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="organizationName"
                          header="Organization"
                          style={{ width: "15%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="roleName"
                          header="User Role"
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
                    <div className="userListClass">
                      <DataTable
                        ref={dt}
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
                        dataKey="userId"
                        filters={filters}
                        filterDisplay="row"
                        globalFilterFields={[
                          "firstName",
                          "email",
                          "phone",
                          "roleName",
                          "organizationName",
                          "isActive",
                        ]}
                      >
                        <Column
                          body={checkbox1}
                          style={{ maxWidth: "2.7rem" }}
                        ></Column>
                        <Column
                          body={name}
                          field="firstName"
                          header="Name"
                          sortable
                          showFilterMenu={false}
                          filter
                          filterElement={firstNameRowFilterTemplate}
                          filterMenuStyle={{ width: "14rem" }}
                          style={{ minWidth: "7rem", maxWidth: "8rem" }}
                        ></Column>
                        <Column
                          body={email}
                          field="email"
                          header="Email"
                          showFilterMenu={false}
                          filter
                          filterElement={emailFilterTemplate}
                          filterMenuStyle={{ width: "14rem" }}
                          style={{ minWidth: "8rem", maxWidth: "9rem" }}
                        ></Column>
                        <Column
                          body={phone}
                          field="phone"
                          header="Contact"
                          showFilterMenu={false}
                          filter
                          filterElement={phoneRowFilterTemplate}
                          filterMenuStyle={{ width: "12rem" }}
                          style={{ maxwidth: "6rem" }}
                        ></Column>
                        <Column
                          body={org}
                          field="organizationName"
                          header="Organization"
                          showFilterMenu={false}
                          filter
                          filterElement={organizationNameRowFilterTemplate}
                          filterMenuStyle={{ width: "12rem" }}
                          style={{ maxWidth: "7rem" }}
                        ></Column>
                        <Column
                          body={roleName}
                          field="roleName"
                          header="User Role"
                          showFilterMenu={false}
                          filter
                          filterElement={roleNameRowFilterTemplate}
                          filterMenuStyle={{ width: "14rem" }}
                          style={{ maxWidth: "8rem" }}
                        ></Column>

                        <Column
                          body={active}
                          field="isActive"
                          header="Status"
                        ></Column>
                        <Column
                          header="Action"
                          body={buttonTemplate}
                          style={{ maxWidth: "7rem" }}
                        ></Column>
                      </DataTable>
                    </div>
                  )}
                  <div className="d-flex justify-content-end py-2"></div>
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
                    visible={inactiveProductsDialog}
                    style={{ width: "32rem" }}
                    breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                    header="Confirm"
                    modal
                    footer={inactiveProductsDialogFooter2}
                    onHide={() => setInactiveProductsDialog(false)}
                  >
                    <div className="confirmation-content">
                      <i
                        className="pi pi-exclamation-triangle me-3 mt-2"
                        style={{ fontSize: "1.5rem" }}
                      />
                      <span>Are you sure you want to inactivate users ?</span>
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
export default UserList;
