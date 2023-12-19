import React, { useRef, useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CImage,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CButton,
  CFormSelect,
  CBadge,
  CFormCheck,
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
import { Menu } from "primereact/menu";

const API_URL = process.env.REACT_APP_API_URL;

const ListUserCreditPage = () => {
  const [responseData, setResponseData] = useState(null);
  const [reportType, setReportType] = useState("1");
  const menu = useRef(null);
  const dt = useRef(null);
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const getOrgActiveListing = () => {
    axios
      .get(`${API_URL}/getCompanyList?type=active`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        setResponseData(response.data.data);
        //localStorage.getItem("ApiToken");
      });
  };
  // const autoLoginApi = (data,domainName) => {
  //   axios
  //     .post(
  //       `${API_URL}/`,
  //       data,{
  //         headers: { Authorization: token },
  //       }
  //     )
  //     .then((res) => {
  //       setUrl(domainName)
  //       setLoginToken(res.data.api_token)
  //       setVisible(true)
  //     })
  //     .catch((err) => console.log(err))
  // }
  useEffect(() => {
    if (token !== "Bearer null") {
      getOrgActiveListing();
      initFilters();
    }
  }, []);

  const data = [
    {
      id: 1000,
      name: "Andre Mike",
      country: {
        name: "Algeria",
        code: "dz",
      },
      cerdit: "5",
      role: "Learner",
      job: "Web,UI/UX Design",
      email: "AndreMike@gmail.com",
      company: "Benton, John B Jr",
      date: "2015-09-13",
      status: "unqualified",
      verified: true,
      activity: 17,
      representative: {
        name: "Ioni Bowcher",
        image: "ionibowcher.png",
      },
      balance: 70663,
    },
    {
      id: 1000,
      name: "Andre Mike",
      country: {
        name: "Algeria",
        code: "dz",
      },
      cerdit: "5",
      role: "Learner",
      job: "Web,UI/UX Design",
      email: "AndreMike@gmail.com",
      company: "Benton, John B Jr",
      date: "2015-09-13",
      status: "unqualified",
      verified: true,
      activity: 17,
      representative: {
        name: "Ioni Bowcher",
        image: "ionibowcher.png",
      },
      balance: 70663,
    },
    {
      id: 1000,
      name: "Andre Mike",
      country: {
        name: "Algeria",
        code: "dz",
      },
      cerdit: "5",
      role: "Developer",
      job: "Web,UI/UX Design",
      email: "AndreMike@gmail.com",
      company: "Benton, John B Jr",
      date: "2015-09-13",
      status: "unqualified",
      verified: true,
      activity: 17,
      representative: {
        name: "Ioni Bowcher",
        image: "ionibowcher.png",
      },
      balance: 70663,
    },
    {
      id: 1000,
      name: "Andre Mike",
      country: {
        name: "Algeria",
        code: "dz",
      },
      cerdit: "5",
      role: "Developer",
      job: "Web,UI/UX Design",
      email: "AndreMike@gmail.com",
      company: "Benton, John B Jr",
      date: "2015-09-13",
      status: "unqualified",
      verified: true,
      activity: 17,
      representative: {
        name: "Ioni Bowcher",
        image: "ionibowcher.png",
      },
      balance: 70663,
    },
  ];

  const badges = () => (
    <>
      <CBadge className="badge badge-light-info text-primary" color="light">
        8
      </CBadge>
    </>
  );
  const exportCSV = () => {
    dt.current.exportCSV();
  };
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
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue("");
  };
  const items = [
    {
      label: "Options",
      items: [
        {
          label: "elearning",
          url: "http://localhost:3011/#/admin/teamapprovalreportlist",
        },
        {
          label: "Classroom",
        },
        {
          label: "Manual Training",
        },
        {
          label: "Credential Items",
        },
      ],
    },
  ];

  const items1 = [
    {
      label: "Options",
      items: [
        {
          label: "View Transcript",
        },
        {
          label: "View Certificates",
        },
        {
          label: "View Training History",
        },
        {
          label: "View Skills",
        },
      ],
    },
  ];

  const buttonTemplate = (responseData) => (
    <>
      <Menu model={items1} popup ref={menu} />
      <Button
        className="btn btn-icon btn-bg-secondary btn-active-color-primary btn-sm me-1"
        title="view"
        size="sm"
        text
        raised
        severity="info"
        onClick={(e) => menu.current.toggle(e)}
      >
        <i className="pi pi-eye"></i>
      </Button>
    </>
  );
  return (
    <div className="">
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-7">
            <div>
              <CCardHeader>
                <CTabContent className="rounded-bottom">
                  <CTabPane className="p-3 preview" visible>
                    <div className="card-header border-0 d-flex justify-content-between">
                      <div className="d-flex row align-items-center">
                        <div className="col-md-6 col-xxl-4">
                          <CFormSelect
                            required
                            aria-label="select example"
                            value={reportType}
                            onChange={(e) => setReportType(e.target.value)}
                          >
                            <option disabled selected>
                              Direct Report
                            </option>
                            <option value="1">Parent Group1</option>
                            <option value="2">Parent Group2</option>
                            <option value="3">Parent Group3</option>
                          </CFormSelect>
                        </div>
                        <div className="col-md-6 col-xxl-4">
                          {/* {reportType === '3' && ( */}
                          <CFormSelect required aria-label="select example">
                            <option disabled selected>
                              Direct Report
                            </option>
                            <option value="1">Supervisor 1</option>
                            <option value="2">Supervisor 2</option>
                            <option value="3">Supervisor 3</option>
                          </CFormSelect>
                          {/* )} */}
                        </div>
                        <div className="col-md-6 col-xxl-4">
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

                      <div className=" ml-4 ">
                        <Button
                          title="Export Users"
                          style={{ height: "40px" }}
                          icon="pi pi-upload"
                          className="btn btn-info me-2"
                          onClick={exportCSV}
                        />
                        <Menu model={items} popup ref={menu} />
                        <Button
                          title="Credits"
                          style={{ height: "40px" }}
                          label="Give Credit"
                          icon="pi pi-bars"
                          onClick={(e) => menu.current.toggle(e)}
                        />
                      </div>
                    </div>
                  </CTabPane>
                </CTabContent>
              </CCardHeader>
            </div>
            <CCardBody>
              <DataTable
                ref={dt}
                value={data}
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
                filterDisplay="menu"
                globalFilterFields={[
                  "",
                  "organizationCode",
                  "isPrimary",
                  "parentOrganizationName",
                  "domainName",
                  "adminName",
                  "isActive",
                ]}
              >
                <Column
                  header={<CFormCheck id="flexCheckDefault" />}
                  body={<CFormCheck name="checkbox" />}
                  style={{ width: "1%" }}
                ></Column>
                <Column field="name" header="Name"></Column>
                <Column field="email" header="Email"></Column>
                <Column field="job" header="Job Tittle"></Column>
                {/* <Column  body={responseData?.isPrimary === 1 ? "Primary Organization" : "Child Organization"} header="Organization Type"></Column> */}
                <Column field="role" header="User Role"></Column>
                <Column
                  style={{ width: "12%", textAlign: "center" }}
                  body={badges}
                  header="Credit Score"
                ></Column>
                {/* <Column  field="isActive" header="Status"></Column> */}
                <Column header="View" body={buttonTemplate}></Column>
              </DataTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};
export default ListUserCreditPage;
