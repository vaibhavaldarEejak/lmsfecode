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
import { Link, useNavigate } from "react-router-dom";
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";
import "../../css/table.css";

const SearchableDropdown = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken"),
    [certificateList, setCertificateList] = useState(),
    [organizations, setOrganizations] = useState([]),
    [roleId, setRoleId] = useState(null),
    [organizationId, setOrganizationId] = useState(null),
    [loading, setLoading] = useState(false),
    [loading2, setLoading2] = useState(false),
    [loading4, setLoading4] = useState(false),
    [isloading, setLoading1] = useState(false),
    [buttonEnable, setButtonEnable] = useState(false),
    [agreement, setAgreement] = useState({ certificateIds: [] }),
    toast = useRef(null),
    [dropDownList, setDropDownList] = useState(false),
    [organisationApi, setOrganisationApi] = useState(false),
    [certificateListApi, setCertificateListApi] = useState(false),
    [filters, setFilters] = useState(null),
    [globalFilterValue, setGlobalFilterValue] = useState(""),
    colorName = localStorage.getItem("ThemeColor"),
    [themes, setThemes] = useState(colorName),
    [bulkCertificateUpdateByOrgId, setBulkCertificateUpdateByOrgId] = useState(
      []
    ),
    [certificateData, setCertificateData] = useState([
      {
        organizationId: 0,
        certificates: [
          {
            certificateId: 0,
            isChecked: 1,
          },
        ],
      },
    ]);

  // useEffect(() => {
  //   if (organizationId) {
  //     getOrgById(organizationId);

  //     if (certificateList) {
  //       setCertificateData({
  //         organizationId: certificateList.map((item) => {
  //           return {
  //             certificateId: item.certificateId,
  //             certificateName: item.certificateName,
  //             organizationId: organizationId,
  //             roleId: roleId,
  //             isActive: item.isActive,
  //           };
  //         }),
  //       });
  //     }
  //   }
  // }, [organizationId, loading4]);

  useEffect(() => {
    const fetchData = async () => {
      if (organizationId && certificateList) {
        const newData = certificateList.map(item => ({
          certificateId: item.certificateId,
          certificateName: item.certificateName,
          organizationId: organizationId,
          roleId: roleId,
          isActive: item.isActive,
        }));
        setCertificateData({ organizationId: newData });
      }
    };
  
    fetchData();
  }, [organizationId, certificateList, roleId]);  

  const getOrgById = async (value) => {
    setDropDownList(true);
    try {
      setLoading4(true);
      const res = await getApiCall("getCertificateListByOrgId", value);
      setCertificateList(res);
    } catch (err) {}
  };

  const handleSubmit = (e) => {
    if (!organizationId) {
      alert("Please select organizations ");
      return false;
    }
    updateBulkCertificateData();
  };

  const updateBulkCertificateData = async () => {
    setLoading1(true);
    setButtonEnable(false);
    var postData = {
      organizationId: organizationId,
      certificates: bulkCertificateUpdateByOrgId,
    };
    try {
      const res = await postApiCall("bulkUpdateOrgCertificate", postData);
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

  const getAllCertificateList = async () => {
    try {
      const res = await getApiCall("getCertificateList");
      setLoading(true);
      setCertificateList(res);
      setCertificateListApi(true);
    } catch (err) {}
  };

  // useEffect(() => {
  //   if (certificateListApi === false) {
  //     if (token !== "Bearer null") {
  //       getAllCertificateList();
  //     }
  //   }
  //   initFilters();
  // }, [loading]);

  useEffect(()=>{
    if(!certificateListApi && token !== "Bearer null"){
      getAllCertificateList();
    }
    initFilters();
  },[certificateListApi, token])

  useEffect(() => {
    if (!organisationApi && token !== "Bearer null") {
      getOrganizationsList();
    }
  }, [organisationApi, token]);

  const inputs1 = (certificateList) => (
    <>{certificateList.certificateName || certificateList.certificateName}</>
  );

  // const onGlobalFilterChange = (e) => {
  //   const value = e.target.value;
  //   let _filters = { ...filters };
  //   _filters["global"].value = value;

  //   setFilters(_filters);
  //   setGlobalFilterValue(value);
  // };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setFilters(prevFilters => ({
      ...prevFilters,
      global: {
        ...prevFilters.global,
        value: value
      }
    }));
    setGlobalFilterValue(value);
  };
  
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      certificateName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      notificationEventName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      isActive: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
  };
  
  const items = Array.from({ length: 10 }, (v, i) => i);

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };

  const certificateNameFilter = (options) => {
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

  const certificateCodeFilter = (options) => {
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

  // const handleChange = (e, certificateId) => {
  //   console.log(certificateList);

  //   setButtonEnable(true);

  //   certificateList.map((index) => {
  //     if (index.certificateId === certificateId) {
  //       index.isChecked = !index.isChecked;

  //       setBulkCertificateUpdateByOrgId((oldArray) => [
  //         ...oldArray,
  //         {
  //           certificateId: index.certificateId,
  //           isChecked: index.isChecked === true ? 1 : 0,
  //         },
  //       ]);
  //     }
  //   });

  //   e.target.checked = !e.target.checked;
  //   const { value, checked } = e.target;
  //   const { certificateIds } = agreement;

  //   if (checked) {
  //     setAgreement({ certificateIds: [...certificateIds, value] });
  //     setButtonEnable(true);
  //   } else {
  //     setAgreement({
  //       certificateIds: certificateIds.filter((e) => e !== value),
  //     });
  //   }
  // };

  const handleChange = (e, certificateId) => {
    // Update isChecked in certificateList
    const updatedCertificateList = certificateList.map(certificate => {
      if (certificate.certificateId === certificateId) {
        return {
          ...certificate,
          isChecked: !certificate.isChecked,
        };
      }
      return certificate;
    });
  
    // Update bulkCertificateUpdateByOrgId
    const updatedBulkCertificate = updatedCertificateList
      .filter(certificate => certificate.isChecked)
      .map(certificate => ({
        certificateId: certificate.certificateId,
        isChecked: certificate.isChecked ? 1 : 0,
      }));
  
    // Update agreement
    const { value, checked } = e.target;
    setAgreement(prevAgreement => ({
      certificateIds: checked
        ? [...prevAgreement.certificateIds, value]
        : prevAgreement.certificateIds.filter(id => id !== value),
    }));
  
    // Update state
    setButtonEnable(true);
    setBulkCertificateUpdateByOrgId(updatedBulkCertificate);
  };
  

  const certificatecode = (responseData) => (
    <>{responseData.certificateCode ? responseData.certificateCode : "-"}</>
  );

  const checkbox1 = (certificate) => (
    <input
      className="form-check-input"
      type="checkbox"
      checked={certificate.isChecked}
      value={certificate.certificateId}
      onChange={(event) => handleChange(event, certificate.certificateId)}
      style={{ marginTop: "11px" }}
    />
  );
  
  return (
    <div className="">
      <div className="container">
        <div className="container-fluid">
          <CRow>
            <CCol xs={12} style={{ padding: "1px" }}>
              <Toast ref={toast} />
              <CCard className="card-ric mb-7">
                <div>
                  <CCardHeader className="p-0">
                    <CNav variant="tabs">
                      <CNavItem>
                        <Link
                          style={{ textDecoration: "none" }}
                          to="/superadmin/certificatelist"
                        >
                          <CNavLink style={{ cursor: "pointer" }}>
                            <strong>Certificate</strong>
                          </CNavLink>
                        </Link>
                      </CNavItem>
                      <CNavItem>
                        <Link
                          style={{ textDecoration: "none" }}
                          to="/superadmin/certificatelist/assigncertificate"
                        >
                          <CNavLink active style={{ cursor: "pointer" }}>
                            <strong>Company Certificates</strong>
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
                          body={bodyTemplate}
                          style={{ width: "3%" }}
                        ></Column>
                        <Column
                          field="certificateName"
                          header="Certificate Name"
                          sortable
                          style={{ width: "25%" }}
                          body={bodyTemplate}
                        ></Column>
                        <Column
                          field="certificateCode"
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
                          value={certificateList}
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
                          dataKey="certificateId"
                          filters={filters}
                          filterDisplay="row"
                          globalFilterFields={[
                            "certificateName",
                            "certificateCode",
                            "isActive",
                          ]}
                        >
                          <Column
                            body={checkbox1}
                            style={{ width: "5%" }}
                          ></Column>
                          <Column
                            body={inputs1}
                            placeholder="Certificate Name"
                            field="certificateName"
                            required
                            filter
                            filterElement={certificateNameFilter}
                            style={{ width: "35%" }}
                            sortableshowFilterMenu={false}
                            filterPlaceholder="Search"
                            header="Certificate Name"
                            sortable
                          ></Column>
                          <Column
                            body={certificatecode}
                            placeholder="Certificate Code"
                            field="certificateCode"
                            required
                            filter
                            filterElement={certificateCodeFilter}
                            style={{ width: "35%" }}
                            sortableshowFilterMenu={false}
                            filterPlaceholder="Search"
                            header="Certificate Code"
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