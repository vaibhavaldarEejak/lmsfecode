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
import { FilterMatchMode } from "primereact/api";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import { Link } from "react-router-dom";
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";
import "../../css/table.css";

const SearchableDropdown = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken"),
    [notificationList, setNotificationList] = useState([]),
    [organizations, setOrganizations] = useState([]),
    [roleId, setRoleId] = useState(null),
    [organizationId, setOrganizationId] = useState(null),
    [loading, setLoading] = useState(false),
    [loading2, setLoading2] = useState(false),
    [loading4, setLoading4] = useState(false),
    [isloading, setLoading1] = useState(false),
    [buttonEnable, setButtonEnable] = useState(false),
    [agreement, setAgreement] = useState({ notificationIds: [] }),
    [organisationApi, setOrganisationApi] = useState(false),
    [dropDownList, setDropDownList] = useState(false),
    [notificationListApi, setNotificationListApi] = useState(false),
    [filters, setFilters] = useState(null),
    [globalFilterValue, setGlobalFilterValue] = useState(""),
    colorName = localStorage.getItem("ThemeColor"),
    [themes, setThemes] = useState(colorName),
    [bulkNotificationUpdateByOrgId, setBulkNotificationUpdateByOrgId] =
      useState([]),
    toast = useRef(null),
    [notificationData, setNotificationData] = useState([
      {
        organizationId: 0,
        notifications: [
          {
            notificationId: 0,
            isChecked: 1,
          },
        ],
      },
    ]);

  useEffect(() => {
    if (organizationId) {
      getOrgById(organizationId);

      if (notificationList) {
        setNotificationData({
          menus: notificationList.map((item) => {
            return {
              notificationId: item.notificationId,
              displayName: item.displayName,
              organizationId: organizationId,
              roleId: roleId,
              isActive: item.isActive,
            };
          }),
        });
      }
    }
  }, [organizationId, loading4]);

  const getOrgById = async (value) => {
    setDropDownList(true);
    try {
      const res = await getApiCall("getNotificationListByOrgId", value);
      setLoading4(true);
      setNotificationList(res);
    } catch (err) {}
  };

  const handleSubmit = (e) => {
    if (!organizationId) {
      alert("Please select organizations ");
      return false;
    }
    updateBulkNotificationData();
  };

  const updateBulkNotificationData = async () => {
    setLoading1(true);
    setButtonEnable(false);
    var postData = {
      organizationId: organizationId,
      notifications: bulkNotificationUpdateByOrgId,
    };
    try {
      const res = await postApiCall("bulkUpdateOrgNotification", postData);
      setLoading1(false);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Assignment Changed successfully!",
        life: 1000,
      });
      getOrgById(organizationId);
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

  const onChangeOrganization = (evt) => {
    const value = evt.target.value;
    setOrganizationId(value);
  };

  const getOrganizationsList = async () => {
    try {
      const res = await getApiCall("getOrganizationOptionsList?withoutSA=1");
      setLoading2(true);
      setOrganizations(res);
      setOrganisationApi(true);
      setDropDownList(false);
    } catch (err) {}
  };

  const getAllNotificationList = async () => {
    try {
      const res = await getApiCall("getNotificationList");
      setLoading(true);
      setNotificationList(res);
      setNotificationListApi(true);
    } catch (err) {}
  };

  useEffect(() => {
    if (notificationListApi === false) {
      if (token !== "Bearer null") {
        getAllNotificationList();
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
      notificationName: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      notificationEventName: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      isActive: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    setGlobalFilterValue("");
  };

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };

  const notificationNameFilter = (options) => {
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

  const notificationEventFilter = (options) => {
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

  const handleChange = (e, notificationId) => {
    console.log(notificationList);
    setButtonEnable(true);
    notificationList.map((index) => {
      if (index.notificationId === notificationId) {
        index.isChecked = !index.isChecked;

        setBulkNotificationUpdateByOrgId((oldArray) => [
          ...oldArray,
          {
            notificationId: index.notificationId,
            isChecked: index.isChecked === true ? 1 : 0,
          },
        ]);
      }
    });

    e.target.checked = !e.target.checked;
    const { value, checked } = e.target;
    const { notificationIds } = agreement;

    if (checked) {
      setAgreement({ notificationIds: [...notificationIds, value] });
      setButtonEnable(true);
    } else {
      setAgreement({
        notificationIds: notificationIds.filter((e) => e !== value),
      });
    }
  };

  const notificationName = (responseData) => (
    <>{responseData.notificationName ? responseData.notificationName : "-"}</>
  );

  const notificationEvent = (responseData) => (
    <>
      {responseData.notificationEventName
        ? responseData.notificationEventName
        : "-"}
    </>
  );

  const checkbox1 =
    notificationList &&
    ((e) => (
      <>
        <input
          class="form-check-input"
          type="checkbox"
          checked={e.isChecked}
          value={e.notificationId}
          onChange={(event) => handleChange(event, e.notificationId)}
          style={{ marginTop: "11px" }}
        />
      </>
    ));

  return (
    <div className="">
      <div className="container">
        <div className="container-fluid">
          <CRow>
            <CCol xs={12} style={{ padding: "1px" }}>
              <Toast ref={toast} />
              <CCard className=" card-ric mb-7">
                <div>
                  <CCardHeader className="p-0">
                    <CNav variant="tabs">
                      <CNavItem>
                        <Link
                          style={{ textDecoration: "none" }}
                          to="/superadmin/notificationlisting"
                        >
                          <CNavLink style={{ cursor: "pointer" }}>
                            <strong>Notifications</strong>
                          </CNavLink>
                        </Link>
                      </CNavItem>
                      <CNavItem>
                        <Link
                          style={{ textDecoration: "none" }}
                          to="/superadmin/notificationlist/CompanyNotifications"
                        >
                          <CNavLink active style={{ cursor: "pointer" }}>
                            <strong>Company Notifications</strong>
                          </CNavLink>
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
                    <div className="card">
                      <DataTable
                        value={Array(10).fill({})}
                        showGridlines
                        className="p-datatable-striped"
                      >
                        <Column
                          field="notificationName"
                          header="Notification Name"
                          sortable
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="Notification Type"
                          header="Notification Type"
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="isActive"
                          header="Status"
                          style={{ width: "10%" }}
                          body={bodyTemplate}
                        ></Column>
                      </DataTable>
                    </div>
                  ) : (
                    <div className={`InputThemeColor${themes}`}>
                      {dropDownList && (
                        <DataTable
                          value={notificationList}
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
                            "notificationName",
                            "notificationEventName",
                            "isActive",
                          ]}
                        >
                          <Column
                            body={checkbox1}
                            style={{ width: "5%" }}
                          ></Column>
                          <Column
                            body={notificationName}
                            placeholder="Notification Name"
                            field="notificationName"
                            required
                            filter
                            filterElement={notificationNameFilter}
                            style={{ width: "35%" }}
                            sortableshowFilterMenu={false}
                            filterPlaceholder="Search"
                            header="Notification Name"
                            sortable
                          ></Column>
                          <Column
                            body={notificationEvent}
                            placeholder="Notification Event"
                            field="notificationEventName"
                            required
                            filter
                            filterElement={notificationEventFilter}
                            style={{ width: "35%" }}
                            sortableshowFilterMenu={false}
                            filterPlaceholder="Search"
                            header="Notification Event"
                            sortable
                          ></Column>
                        </DataTable>
                      )}
                    </div>
                  )}
                  {dropDownList && (
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
                        Update
                      </CButton>
                    </div>
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
export default SearchableDropdown;
