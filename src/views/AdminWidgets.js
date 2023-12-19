import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import {CIcon} from '@coreui/icons-react';
import { cilChartLine, cilLayers, cilNotes } from "@coreui/icons";
import * as icon from "@coreui/icons";
import {
  CWidgetStatsD,
  CRow,
  CCol,
  CCard,
  CCardImage,
  CCardBody,
  CCardTitle,
  CCardText,
  CCardHeader,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cibFacebook,
  cibLinkedin,
  cibTwitter,
  cildocument,
  cilCalendar,
} from "@coreui/icons";
import axios from "axios";
import { CChart } from "@coreui/react-chartjs";
import "../css/adminwidgets.css";
const API_URL = process.env.REACT_APP_API_URL;

const AdminWidgetsBrand = ({ withCharts }) => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const [responseData, setResponseData] = useState([]),
    colorName = localStorage.getItem("ThemeColor"),
    [themes, setThemes] = useState(colorName);

  const [totalRequirement, setTotalRequirement] = useState(0);
  const chartOptions = {
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      },
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  };

  const data = [
    { id: 1, name: "John Doe", age: 30, city: "New York" },
    { id: 2, name: "Jane Smith", age: 25, city: "Los Angeles" },
    { id: 3, name: "Bob Johnson", age: 35, city: "Chicago" },
    // Add more data as needed
  ];

  const userRole = localStorage.getItem("RoleName");

  useEffect(() => {
    if (userRole === "Students") {
      if (token !== "Bearer null") {
        getStudentDashboardCount();
      }
    }
  }, []);

  const getStudentDashboardCount = () => {
    axios
      .get(`${API_URL}/getStudentDashboardCount`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        setResponseData(response.data.data);
        console.log(response.data.data);
      });
  };

  return (
    <div>
      <div
        className="admin-image-card"
      >
        <div className="first-card">
          <CCard>
            <div className="card-space-sizing">
              <div>
                <CIcon icon={cilChartLine} size="xl" />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "right",
                }}
              >
                <div>Average Credit training & per user YTD</div>
                <div style={{ fontSize: "20px", marginRight: "10px" }}>
                  <strong>1</strong>
                </div>
              </div>
            </div>
          </CCard>
        </div>
        <div className="first-card">
          <CCard>
            <div className="card-space-sizing">
              <div>
                <CIcon icon={cilLayers} size="xl" />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "right",
                }}
              >
                <div>Average Learning Plan progress</div>
                <div style={{ fontSize: "20px", marginRight: "10px" }}>
                  <strong>21</strong>
                </div>
              </div>
            </div>
          </CCard>
        </div>
        <div className="first-card">
          <CCard>
            <div className="card-space-sizing">
              <div>
                <CIcon icon={cilNotes} size="xl" />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "right",
                }}
              >
                <div>Total YTD Training Credits</div>
                <div style={{ fontSize: "20px", marginRight: "10px" }}>
                  <strong>12833 CREDITS</strong>
                </div>
              </div>
            </div>
          </CCard>
        </div>
      </div>
      <div
        className="widgets"
      >
        <div>
          <CCard>
            <CCardHeader>
              <strong>DataTable</strong>
            </CCardHeader>

            <CCardBody className={`card tableTheme${themes}`}>
              <div className="datatable">
                <DataTable value={data}>
                  <Column field="id" header="ID" />
                  <Column field="name" header="Name" />
                  <Column field="age" header="Age" />
                  <Column field="city" header="City" />
                </DataTable>
              </div>
            </CCardBody>
          </CCard>
        </div>
        <div>
          <CCard>
            <i class="fi fi-rr-chart-histogram"></i>
            <CCardHeader>
              <strong>Normal Table</strong>
            </CCardHeader>

            <CCardBody className={`card tableTheme${themes}`}>
              <div className="datatable">
                <DataTable value={data}>
                  <Column field="id" header="ID" />
                  <Column field="name" header="Name" />
                  <Column field="age" header="Age" />
                  <Column field="city" header="City" />
                </DataTable>
              </div>
            </CCardBody>
          </CCard>
        </div>
      </div>
      <div></div>
    </div>
  );
};

AdminWidgetsBrand.propTypes = {
  withCharts: PropTypes.bool,
};

export default AdminWidgetsBrand;
