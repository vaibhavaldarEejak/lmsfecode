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
  CBadge,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CFormInput,
} from "@coreui/react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;
import { useNavigate } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Panel } from "primereact/panel";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Skeleton } from "primereact/skeleton";
import getApiCall from "src/server/getApiCall";

const TrainingCatalogSettings = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const navigate = useNavigate();
  useEffect(() => {
    if (token !== "Bearer null") {
      getCredentialListings();
      initFilters();
    }
  }, []);

  const [responseData, setResponseData] = useState(null);
  const toast = useRef(null);

  const getCredentialListings = async () => {
    try {
      const res = await getApiCall("getCredentialList", id);
      setResponseData(res);
    } catch (err) {}
  };

  //Bulk Archieve Credentials

  //Bulk Delete Credentials

  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [agreement, setAgreement] = useState({ credentialIds: [] });

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      credentialTitle: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      credentialId: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
        credentialId: "global",
      },
    });
    setGlobalFilterValue("");
  };

  return (
    <div>
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
                          to={`/admin/trainingsettings`}
                        >
                          <CNavLink style={{ cursor: "pointer" }}>
                            Requirement Settings
                          </CNavLink>
                        </Link>
                      </CNavItem>
                      <CNavItem>
                        <Link
                          style={{ cursor: "pointer", textDecoration: "none" }}
                          to={`/admin/trainingcatalogsettings`}
                        >
                          <CNavLink active style={{ cursor: "pointer" }}>
                            <strong>Training Catalog Settings</strong>
                          </CNavLink>{" "}
                        </Link>
                      </CNavItem>
                    </CNav>
                  </CCardHeader>
                </div>
                <CCardBody>
                  <Toast ref={toast} />
                  <div className="card mb-5 mb-xl-10 p-card p-card-rounded">
                    <Panel
                      header="Training catalog settings"
                      toggleable
                    ></Panel>
                  </div>
                  <div className="card mb-3 mb-xl-5 p-card p-card-rounded">
                    <Panel
                      header="Training notification settings"
                      toggleable
                    ></Panel>
                  </div>

                  <div className="card mb-3 mb-xl-5 p-card p-card-rounded">
                    <Panel
                      header="Training expiration settings"
                      toggleable
                    ></Panel>
                  </div>

                  <div className="card mb-3 mb-xl-5 p-card p-card-rounded">
                    <Panel header="Training status settings" toggleable></Panel>
                  </div>
                  <div className="card mb-3 mb-xl-5 p-card p-card-rounded">
                    <Panel header="Training email settings" toggleable></Panel>
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

export default TrainingCatalogSettings;
