import React, { useRef, useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CFormSelect,
  CFormInput,
} from "@coreui/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import "../../css/themes.css";
import "./action.css";
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";
import "../../css/table.css";

const manageActionPermissionWidget = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const API_URL = process.env.REACT_APP_API_URL;
  const [roles, setRoles] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [roleId, setRoleId] = useState(null);
  const [organizationId, setOrganizationId] = useState(null);
  const [actionPermissions, setActionPermissions] = useState([]);
  const [moduleActionList, setmoduleActionList] = useState([]);
  const toast = useRef(null);
  const [actionPayload, setActionPayload] = useState([
    {
      permissions: [
        {
          moduleId: 0,
          actionsId: 0,
          organizationId: 0,
          roleId: 0,
          actionName: "",
          readAccess: 0,
          writeAccess: 0,
          isActive: 1,
        },
      ],
    },
  ]);
  const [loading3, setLoading3] = useState(false);
  const [loading4, setLoading4] = useState(false);
  const [isloading, setLoading1] = useState(false);

  const onChangeRole = (evt) => {
    const value = evt.target.value;
    setRoleId(value);
  };

  const onChangeOrganization = (evt) => {
    const value = evt.target.value;
    setOrganizationId(value);
  };

  const getOrganizationsList = async () => {
    try {
      const res = await getApiCall("getOrganizationOptionsList");
      setOrganizations(res);
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

  const getRolesList = async () => {
    try {
      const res = await getApiCall("getRoleList");
      setRoles(res);
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

  const getPermissionsByID = async () => {
    const payloadData = {
      roleId: roleId,
      organizationId: organizationId,
    };

    try {
      const res = await postApiCall(
        "getPermissionsByOrganizationIdAndRoleId",
        payloadData
      );
      setActionPermissions(res);
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

  const handleChange = (e, index) => {
    moduleActionList[index][e.target.name] = e.target.checked;

    setmoduleActionList((prevData) => {
      const updatedData = [...prevData];
      const { baseTitle } = prevData[0];
      updatedData[index] = { ...updatedData[index] };
      return updatedData;
    });

    setActionPayload({ permissions: moduleActionList });
  };

  const getAllPermissions = async () => {
    try {
      const res = await getApiCall("getModuleActionsList");
      setLoading4(true);
      setActionPermissions(res);
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
  const handleSubmit = (e) => {
    if (!roleId) {
      alert("Please select role");
      return false;
    }
    if (!organizationId) {
      alert("Please select organizations ");
      return false;
    }

    if (actionPayload) {
      postActionPermission();
    }
  };

  const postActionPermission = async () => {
    setLoading1(true);

    try {
      const res = await postApiCall("addNewMultiplePermissions", actionPayload);
      setLoading1(false);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Permission Changed successfully!",
        life: 3000,
      });
    } catch (err) {
      setLoading1(false);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Changing Permission",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    if (actionPermissions) {
      setmoduleActionList(
        actionPermissions
          ?.map((res) =>
            res?.actions?.map((i) => ({
              moduleName: res?.moduleName,
              moduleId: res?.moduleId,
              actionsId: i?.actionsId,
              permissionId: i?.permissionId,
              actionName: i?.actionsName,
              readAccess: i?.readAccessPermission === 1,
              writeAccess: i?.writeAccessPermission === 1,
              isActive: 1,
              organizationId: organizationId,
              roleId: roleId,
            }))
          )
          .reduce((a, b) => [...a, ...b], [])
      );
    }
  }, [actionPermissions]);

  useEffect(() => {
    if (roleId && organizationId) {
      getPermissionsByID();
    } else {
      if (token !== "Bearer null") {
        getAllPermissions();
      }
    }
    initFilters();
  }, [roleId, organizationId, loading3]);

  useEffect(() => {
    if (actionPermissions) {
      setmoduleActionList(
        actionPermissions
          ?.map((res) =>
            res?.actions.map((i) => ({
              moduleName: res?.moduleName,
              moduleId: res?.moduleId,
              actionsId: i?.actionsId,
              actionName: i?.actionsName,
              readAccess: false,
              writeAccess: false,
              isActive: 1,
            }))
          )
          .reduce((a, b) => [...a, ...b], [])
      );
    }
    if (token !== "Bearer null") {
      getOrganizationsList();
      getRolesList();
    }
  }, []);
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const clearFilter = () => {
    initFilters();
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
      moduleName: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      actionName: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
    });
    setGlobalFilterValue("");
  };
  const items = Array.from({ length: 10 }, (v, i) => i);

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };
  const handleChangeText = (e, name, id) => {
    const index = moduleActionList.findIndex((row) => row.moduleId === id);
    moduleActionList[index][name] = e;
    setmoduleActionList((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = { ...updatedData[index] };
      return updatedData;
    });
    // setButtonEnable(true);
    setActionPayload({
      permissions: moduleActionList.map((item) => {
        return {
          moduleId: item.moduleId,
          actionsId: item.actionsId,
          organizationId: organizationId,
          roleId: roleId,
          actionName: item.actionName,
          readAccess: item.readAccess,
          writeAccess: item.writeAccess,
          isActive: item.isActive,
        };
      }),
    });
  };
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  const moduleNameFilter = (options) => {
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
    <div className={`parentClass${themes}`}>
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
                          {/* <CIcon icon={cilMediaPlay} className="me-2" /> */}
                          <strong>Manage Actions</strong>
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
                          <div
                            className={`d-grid gap-2 d-md-flex selectThemeClass${themes}`}
                          >
                            <CFormSelect
                              className="me-md-2"
                              type="text"
                              id="validationCustom01"
                              placeholder="Select Role"
                              required
                              onChange={(e) => onChangeRole(e)}
                            >
                              <option key={0} value={0}>
                                Select Role
                              </option>
                              {/* Role Drop Down Start*/}
                              {roles.map((role) => (
                                <option key={role.roleId} value={role.roleId}>
                                  {role.roleName}
                                </option>
                              ))}
                              {/* Role Drop Down End*/}
                            </CFormSelect>
                            <CFormSelect
                              className="me-md-2"
                              type="text"
                              id="validationCustom01"
                              placeholder="Select Organisation"
                              required
                              onChange={(evt) => onChangeOrganization(evt)}
                            >
                              <option key={0} value={0}>
                                Select Organization
                              </option>
                              {/* Organization Drop Down Start*/}
                              {organizations.map((organization) => (
                                <option
                                  key={organization.organizationId}
                                  value={organization.organizationId}
                                >
                                  {organization.organizationName}
                                </option>
                              ))}
                              {/* Organization Drop Down End*/}
                            </CFormSelect>
                          </div>
                        </div>
                      </CTabPane>
                    </CTabContent>
                  </CCardHeader>
                </div>
                <CCardBody>
                  <Toast ref={toast} />
                  {!loading4 ? (
                    <div className="card">
                      <DataTable
                        value={items}
                        showGridlines
                        className="p-datatable-striped"
                      >
                        {/* DataTable columns */}
                      </DataTable>
                    </div>
                  ) : (
                    <div
                      className={` InputThemeColor${themes} patentActionClass`}
                    >
                      <DataTable
                        value={moduleActionList}
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
                        dataKey="getPermissionsByID"
                        filters={filters}
                        filterDisplay="row"
                        globalFilterFields={[
                          "moduleName",
                          "menuName",
                          "isActive",
                        ]}
                      >
                        <Column
                          field="moduleName"
                          header="Module Name"
                          filter
                          filterElement={moduleNameFilter}
                          sortableshowFilterMenu={false}
                          filterPlaceholder="Search"
                        ></Column>
                        <Column
                          // field="actionName"
                          header="Action Name"
                          body={(moduleActionList) => (
                            <CFormInput
                              type="text"
                              placeholder="Action Name"
                              value={moduleActionList.actionName}
                              onChange={(e) =>
                                handleChangeText(
                                  e.target.value,
                                  "actionName",
                                  moduleActionList.moduleId
                                )
                              }
                              disabled={!roleId || !organizationId}
                              required
                            />
                          )}
                        ></Column>
                        <Column
                          body={(moduleActionList, props) => (
                            <div className="form-check form-check-sm form-check-custom form-check-solid">
                              <input
                                className="form-check-input widget-13-check"
                                type="checkbox"
                                checked={moduleActionList?.readAccess}
                                name="readAccess"
                                onChange={(e) =>
                                  handleChange(e, props.rowIndex)
                                }
                              />
                            </div>
                          )}
                          header="Read Permission"
                        ></Column>
                        <Column
                          body={(moduleActionList, props) => (
                            <div className="form-check form-check-sm form-check-custom form-check-solid">
                              <input
                                className="form-check-input widget-13-check"
                                type="checkbox"
                                checked={moduleActionList?.writeAccess}
                                name="writeAccess"
                                onChange={(e) =>
                                  handleChange(e, props.rowIndex)
                                }
                              />
                            </div>
                          )}
                          header="Write Permission"
                        ></Column>
                      </DataTable>
                    </div>
                  )}
                  <div className={`d-flex justify-content-end `}>
                    {organizationId && roleId && (
                      <CButton
                        className={`btn btn-primary saveButtonTheme${themes} mt-3`}
                        onClick={(e) => handleSubmit(e)}
                        disabled={isloading}
                      >
                        {isloading && (
                          <span
                            class="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        )}
                        Save
                      </CButton>
                    )}
                  </div>
                  {/* </DocsExample> */}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </div>
    </div>
  );
};
export default manageActionPermissionWidget;
