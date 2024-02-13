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
import { SwitchButton } from "./switchbutton.tsx";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import generalUpdateApi from "src/server/generalUpdateApi.js";
import getApiCall from "src/server/getApiCall.js";
import getApiWithTwoParameter from "src/server/getApiWithTwoParameter.js";
import "../../css/table.css";
import DatatableSkeleton from "./DatatableSkeleton.js";

const manageMenuPermissionListingWidget = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken"),
    [menuList, setMenuList] = useState([]),
    [roles, setRoles] = useState([]),
    [organizations, setOrganizations] = useState([]),
    [roleId, setRoleId] = useState(null),
    [organizationId, setOrganizationId] = useState(null),
    [loading, setLoading] = useState(false),
    [loading2, setLoading2] = useState(false),
    [loading3, setLoading3] = useState(false),
    [loading4, setLoading4] = useState(false),
    [isloading, setLoading1] = useState(false),
    [buttonEnable, setButtonEnable] = useState(false);

  const toast = useRef(null);

  const [menuPermission, setMenuPermission] = useState([
    {
      menus: [
        {
          menuId: 0,
          displayName: "",
          organizationId: 0,
          roleId: 0,
          isActive: 0,
        },
      ],
    },
  ]);

  const handleSubmit = (e) => {
    if (!roleId) {
      alert("Please select role");
      return false;
    }
    if (!organizationId) {
      alert("Please select organizations ");
      return false;
    }
    postMenuPermissionData();
  };

  const postMenuPermissionData = async () => {
    setLoading1(true);
    setButtonEnable(false);
    try {
      const res = await generalUpdateApi(
        "bulkUpdateMenuPermission",
        menuPermission
      );
      setLoading1(false);

      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Permission Changed successfully!",
        life: 1000,
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

  const onChangeRole = (evt) => {
    const value = evt.target.value;
    setRoleId(value);
  };

  const onChangeOrganization = (evt) => {
    const value = evt.target.value;
    setOrganizationId(value);
  };
  const [roleListApi, setRoleList] = useState(false);
  const getRolesList = async () => {
    try {
      const res = await getApiCall("getRoleList");
      setLoading3(true);
      setRoles(res);
      setRoleList(true);
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
  const [organisationApi, setOrganisationApi] = useState(false);
  const getOrganizationsList = async () => {
    try {
      const res = await getApiCall("getOrganizationOptionsList");
      setLoading2(true);
      setOrganizations(res);
      setOrganisationApi(true);
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

  const handleChangeText = (e, name, id) => {
    const index = menuList.findIndex((row) => row.menuId === id);
    menuList[index][name] = e;
    setMenuList((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = { ...updatedData[index] };
      return updatedData;
    });
    setButtonEnable(true);
    setMenuPermission({
      menus: menuList.map((item) => {
        return {
          menuId: item.menuId,
          displayName: item.displayName,
          organizationId: organizationId,
          roleId: roleId,
          isActive: item.isActive,
        };
      }),
    });
  };
  const [menuListApi, setMenuListApi] = useState(false);
  const getAllMenuList = async () => {
    try {
      const res = await getApiCall("getMenuList");
      setLoading(true);
      setMenuList(res);
      setMenuListApi(true);
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

  const getMenuListById = async (orgsId, roleId) => {
    try {
      const res = await getApiWithTwoParameter("getMenuList", orgsId, roleId);
      setLoading4(true);
      setMenuList(res);
    } catch (err) {
      setLoading4(false);
      var errMsg = err?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
    }
  };
  useEffect(() => {
    if (roleId && organizationId) {
      getMenuListById(organizationId, roleId);

      if (menuList) {
        setMenuPermission({
          menus: menuList.map((item) => {
            return {
              menuId: item.menuId,
              displayName: item.displayName,
              organizationId: organizationId,
              roleId: roleId,
              isActive: item.isActive,
            };
          }),
        });
      }
    }
  }, [roleId, organizationId, loading4]);

  useEffect(() => {
    if (menuListApi === false) {
      if (token !== "Bearer null") {
        getAllMenuList();
      }
    }
    initFilters();
  }, [loading]);
  useEffect(() => {
    if (organisationApi === false) {
      if (token !== "Bearer null") {
        getOrganizationsList();
      }
    }
  }, [loading2]);
  useEffect(() => {
    if (roleListApi === false) {
      if (token !== "Bearer null") {
        getRolesList();
      }
    }
  }, [loading3]);

  const inputs1 = (menuList) => <>{menuList.moduleName || menuList.menuName}</>;

  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

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
      displayName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      moduleName: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      isActive: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    setGlobalFilterValue("");
  };

  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);

  const memuNameFilter = (options) => {
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
              <Toast ref={toast} />
              <CCard className="mb-7 card-ric">
                <div>
                  <CCardHeader className="p-0">
                    <CNav variant="tabs">
                      <CNavItem>
                        <CNavLink active style={{ cursor: "pointer" }}>
                          <strong>Menu Permission</strong>
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
                            className={`d-grid gap-2 d-md-flex InputThemeColor${themes}`}
                          >
                            <CFormSelect
                              className={`me-md-2 `}
                              type="text"
                              id="validationCustom01"
                              placeholder="Select Role"
                              required
                              onChange={(e) => onChangeRole(e)}
                            >
                              <option key={0} value={0}>
                                Select Role
                              </option>
                              {roles.map((role) => (
                                <option key={role.roleId} value={role.roleId}>
                                  {role.roleName}
                                </option>
                              ))}
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
                              {organizations.map((organization) => (
                                <option
                                  key={organization.organizationId}
                                  value={organization.organizationId}
                                >
                                  {organization.organizationName}
                                </option>
                              ))}
                            </CFormSelect>
                          </div>
                        </div>
                      </CTabPane>
                    </CTabContent>
                  </CCardHeader>
                </div>
                <CCardBody>
                  {!loading ? (
                    <div>
                      <DatatableSkeleton />
                    </div>
                  ) : (
                    <div className={`InputThemeColor${themes}`}>
                      <DataTable
                        value={menuList}
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
                        dataKey="organizationId"
                        filters={filters}
                        filterDisplay="row"
                        globalFilterFields={[
                          "moduleName",
                          "displayName",
                          "isActive",
                        ]}
                      >
                        <Column
                          body={inputs1}
                          field="moduleName"
                          header="Menu Name"
                          filter
                          filterElement={memuNameFilter}
                          sortableshowFilterMenu={false}
                          filterPlaceholder="Search"
                          sortable
                        ></Column>
                        <Column
                          body={(menuList) => (
                            <CFormInput
                              type="text"
                              placeholder="Display Name"
                              value={menuList.displayName || menuList.menuName}
                              onChange={(e) =>
                                handleChangeText(
                                  e.target.value,
                                  "displayName",
                                  menuList.menuId
                                )
                              }
                              disabled={!organizationId || !roleId}
                              required
                            />
                          )}
                          header="Display Name"
                        ></Column>
                        <Column
                          body={(menuList) => (
                            <SwitchButton
                              status={menuList?.isActive === 1}
                              handleChange={(e) =>
                                handleChangeText(
                                  e ? 1 : 2,
                                  "isActive",
                                  menuList.menuId
                                )
                              }
                              labelOff="Active"
                              labelOn="Inactive"
                              value={menuList.menuId}
                            />
                          )}
                          header="Status"
                        ></Column>
                      </DataTable>
                    </div>
                  )}

                  <div className="d-flex justify-content-end py-2">
                    <CButton
                      className={`btn btn-primary saveButtonTheme${themes}`}
                      onClick={(e) => handleSubmit(e)}
                      disabled={!buttonEnable}
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
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </div>
    </div>
  );
};
export default manageMenuPermissionListingWidget;
