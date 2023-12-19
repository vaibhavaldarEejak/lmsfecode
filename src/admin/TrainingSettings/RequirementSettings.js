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
} from "@coreui/react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;
import { useNavigate } from "react-router-dom";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Toast } from "primereact/toast";
import getApiCall from "src/server/getApiCall";
import { Dialog } from "primereact/dialog";
import { Skeleton } from "primereact/skeleton";
import "../../css/table.css";

const Requirements = () => {
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
      const res = await getApiCall("getCredentialList");
      setResponseData(res);
    } catch (err) {}
  };

  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

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
  const items = Array.from({ length: 10 }, (v, i) => i);

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
                          <CNavLink active style={{ cursor: "pointer" }}>
                            <strong>Requirement Settings</strong>
                          </CNavLink>
                        </Link>
                      </CNavItem>
                      <CNavItem>
                        <Link
                          style={{ cursor: "pointer", textDecoration: "none" }}
                          to={`/admin/trainingcatalogsettings`}
                        >
                          <CNavLink style={{ cursor: "pointer" }}>
                            Training Catalog Settings
                          </CNavLink>{" "}
                        </Link>
                      </CNavItem>
                    </CNav>
                  </CCardHeader>
                </div>
                <CCardBody>
                  <Toast ref={toast} />

                  <CCol md={7}>
                    <CRow className="mb-3">
                      <div className="col-sm-12">
                        {/* <CFormCheck checked> </CFormCheck> */}
                        <input
                          type="checkbox"
                          className="form-check-input"
                        />{" "}
                        &nbsp; Remove learning tab items from My Requirements
                        tab after completion.
                      </div>
                    </CRow>
                    <CRow className="mb-3">
                      <div className="col-sm-12">
                        {/* <CFormCheck checked> </CFormCheck> */}
                        <input
                          type="checkbox"
                          className="form-check-input"
                        />{" "}
                        &nbsp; Remove Assessment from the My Requirements tab
                        after completion.
                      </div>
                    </CRow>
                    <CRow className="mb-3">
                      <div className="col-sm-12">
                        {/* <CFormCheck checked> </CFormCheck> */}
                        <input
                          type="checkbox"
                          className="form-check-input"
                        />{" "}
                        &nbsp; Remove Assignments from the My Requirements tab
                        after completion.
                      </div>
                    </CRow>
                  </CCol>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </div>
    </div>
  );
};

export default Requirements;
