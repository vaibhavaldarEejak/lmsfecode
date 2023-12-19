import React, { useRef, useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormCheck,
  CTabContent,
  CTabPane,
  CBadge,
  CModal,
  CFormInput,
  CNav,
  CNavItem,
  CNavLink,
} from "@coreui/react";
import { Link } from "react-router-dom";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { Dropdown } from "@coreui/coreui";
import "../../css/table.css";
const API_URL = process.env.REACT_APP_API_URL;

const TeamApproval = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const [visible, setVisible] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const toast = useRef(null);
  const [rowClick, setRowClick] = useState(false);
  const [status, setStatus] = useState("");
  const [teamApprovalId, setTeamApprovalId] = useState("");

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };

  const active = (responseData) => (
    <>
      <CBadge className={`badge badge-light-info text-info `} color="light">
        {responseData.Status}
      </CBadge>
    </>
  );

  const getteamapprovalListing = () => {
    var itemData = [];
    axios
      .get(`${API_URL}/getTeamApprovalList`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        setResponseData(response.data.data);
      });
  };
  const name = (responseData) => (
    <>{responseData.courseName ? responseData.courseName : "-"}</>
  );

  const type = (responseData) => (
    <>{responseData.courseType ? responseData.courseType : "-"}</>
  );

  const date = (responseData) => (
    <>{responseData.trainingDate ? responseData.trainingDate : "-"}</>
  );

  const trainingtype = (responseData) => (
    <>{responseData.trainingType ? responseData.trainingType : "-"}</>
  );

  const handleButtonClick = () => {
    const data = {
      teamApprovalId: teamApprovalId,
    };
    axios
      .post(`${API_URL}/teamApproved`, data, {
        headers: { Authorization: token },
        method: "POST",
        teamApprovalId: 1,
      })
      .then((response) => {
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Approved",
          life: 3000,
        });
        setStatus("Approved");
        getteamapprovalListing();
      })
      .catch((error) => {
        console.error(error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error Approving",
          life: 3000,
        });
      });
  };

  const handleButtonClick2 = (id) => {
    const data = {
      teamApprovalId: teamApprovalId,
    };
    axios
      .post(`${API_URL}/teamRejected`, data, {
        headers: { Authorization: token },
        method: "POST",
        //  teamApprovalId: 1,
      })
      .then((response) => {
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Request Denied",
          life: 3000,
        });
        setStatus("Request Denied");
        getteamapprovalListing();

        setStatus("Rejected");
      });
  };

  useEffect(() => {
    if (token !== "Bearer null") {
      getteamapprovalListing();
      initFilters();
    }
  }, []);

  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }} className="d-flex align-items-center">
      {/* <CTableDataCell> */}
      {responseData.Status === "Approved" ? (
        <>
          status:
          <CBadge className="badge badge-light-info text-info" color="light">
            {responseData.Status}
          </CBadge>
        </>
      ) : (
        <div className="d-grid gap-2 d-md-flex">
          <Link onClick={setTeamApprovalId(responseData.teamApprovalId)}>
            <Button
              label=""
              severity="info"
              className="btn btn-bg-secondary btn-active-color-primary"
              icon="pi pi pi-check"
              size="small"
              title="Apply"
              onClick={handleButtonClick}
            />
          </Link>
          <Link onClick={setTeamApprovalId(responseData.teamApprovalId)}>
            <Button
              label=""
              size="small"
              severity="info"
              className="btn btn-bg-secondary btn-active-color-primary"
              icon="pi pi-times"
              title="Deny"
              onClick={handleButtonClick2}
            />
          </Link>
        </div>
      )}
    </div>
  );
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [loading, setLoading] = useState(true);

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

  const items = Array.from({ length: 10 }, (v, i) => i);
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      userName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      jobTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
      courseName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      courseType: { value: null, matchMode: FilterMatchMode.CONTAINS },
      trainingType: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue("");
  };
  const userNameFilterTemplate = (options) => {
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
  const jobTitleFilterTemplate = (options) => {
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
  const courseNameFilterTemplate = (options) => {
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
  const courseTypeFilterTemplate = (options) => {
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
  const [statuses] = useState(["Draft", "Published", "Unpublished"]);

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
  const trainingTypeFilterTemplate = (options) => {
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
                          style={{ cursor: "pointer", textDecoration: "none" }}
                          to={`/admin/teamapprovalreportlist`}
                        >
                          <CNavLink active style={{ cursor: "pointer" }}>
                            <strong>Team Approval</strong>
                          </CNavLink>{" "}
                        </Link>
                      </CNavItem>
                    </CNav>
                    <CTabContent className="rounded-bottom">
                      <CTabPane className="p-3 preview" visible>
                        <div className="card-header border-0 d-flex justify-content-between">
                          <div className="d-flex row align-items-center">
                            <div className="col-md-12 col-xxl-12">
                              {/* <CFormSelect required aria-label="select example">
                            <option disabled selected>
                              Direct Report
                            </option>
                            <option value="1">Parent Group1</option>
                            <option value="2">Parent Group2</option>
                            <option value="3">Parent Group3</option>
                          </CFormSelect> */}
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
                          {/* search box div */}
                          {/* <div className="d-flex row align-items-center">
                        <div className="col-md-12 col-xxl-12"></div>
                      </div> */}
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
                  ></CModal>
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
                          field="User Name"
                          header="User Name"
                          sortable
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="jobTitle"
                          header="Job Title"
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="coursetype"
                          header="Course Name"
                          style={{ width: "15%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="Course Type"
                          header="Course Type"
                          style={{ width: "15%" }}
                          body={bodyTemplate}
                        ></Column>

                        <Column
                          field="training date"
                          header="Training Date"
                          style={{ width: "15%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="Status"
                          header="Status"
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="Approve"
                          header="Approve"
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="Training"
                          header="Training"
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
                    <DataTable
                      selectionMode={rowClick ? null : "checkbox"}
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
                      dataKey="organizationId"
                      filters={filters}
                      filterDisplay="row"
                      globalFilterFields={[
                        "userName",
                        "jobTitle",
                        "courseName",
                        "courseType",
                        "isActive",
                        "trainingType",
                      ]}
                    >
                      <Column
                        header={<CFormCheck id="flexCheckDefault" />}
                        body={<CFormCheck name="checkbox" />}
                        style={{ width: "1%" }}
                      ></Column>
                      <Column
                        field="userName"
                        header="User Name"
                        filter
                        filterElement={userNameFilterTemplate}
                        showFilterMenu={false}
                        filterPlaceholder="Search"
                      ></Column>
                      <Column
                        field="jobTitle"
                        header="Job Tittle"
                        filter
                        filterElement={jobTitleFilterTemplate}
                        showFilterMenu={false}
                        filterPlaceholder="Search"
                      ></Column>
                      <Column
                        body={name}
                        header="Course Name"
                        field="courseName"
                        filter
                        filterElement={courseNameFilterTemplate}
                        showFilterMenu={false}
                        filterPlaceholder="Search"
                      ></Column>
                      {/* <Column  body={responseData?.isPrimary === 1 ? "Primary Organization" : "Child Organization"} header="Organization Type"></Column> */}
                      <Column
                        body={type}
                        header="Course Type"
                        filter
                        field="courseType"
                        filterElement={courseTypeFilterTemplate}
                        showFilterMenu={false}
                        filterPlaceholder="Search"
                      ></Column>
                      <Column body={date} header="Training Date"></Column>
                      <Column
                        body={active}
                        header="Status"
                        field="isActive"
                        // filter
                        // filterElement={statusRowFilterTemplate}
                        // showFilterMenu={false}
                        // filterPlaceholder="Search"
                      ></Column>

                      <Column
                        body={trainingtype}
                        header="Training Type"
                        field="trainingType"
                        showFilterMenu={false}
                        filter
                        filterElement={trainingTypeFilterTemplate}
                        filterPlaceholder="Search"
                      ></Column>
                      <Column
                        field=""
                        header="Action"
                        body={buttonTemplate}
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
export default TeamApproval;
