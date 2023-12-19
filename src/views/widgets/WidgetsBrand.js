import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { CWidgetStatsD, CRow, CCol } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilList,
  cilTask,
  cilNotes,
  cilDescription,
} from "@coreui/icons";
import { CChart } from "@coreui/react-chartjs";
import getApiCall from "src/server/getApiCall";

const API_URL = process.env.REACT_APP_API_URL;

const WidgetsBrand = ({ withCharts }) => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const [responseData, setResponseData] = useState([]);
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
  const userRole = localStorage.getItem("RoleName");

  useEffect(() => {

    if (token !== "Bearer null") {
      getStudentDashboardCount();
    }

  }, []);


  const getStudentDashboardCount = async () => {
    try {
      const res = await getApiCall("getStudentDashboardCount");
      setResponseData(res);

    } catch (err) {

    }
  };


  return (
    <CRow>
      <CCol sm={6} lg={3}>
        <CWidgetStatsD
          className="mb-4"
          color="primary"
          {...(withCharts && {
            chart: (
              <CChart
                className="position-absolute w-100 h-100"
                type="line"
                data={{
                  labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                  ],
                  datasets: [
                    {
                      backgroundColor: "rgba(255,255,255,.1)",
                      borderColor: "rgba(255,255,255,.55)",
                      pointHoverBackgroundColor: "#fff",
                      borderWidth: 2,
                      data: [65, 59, 84, 84, 51, 55, 40],
                      fill: true,
                    },
                  ],
                }}
                options={chartOptions}
              />
            ),
          })}
          icon={
            <CIcon icon={cilList} height={52} className="my-4 text-white" />
          }
          values={[
            {
              title: "TotalRequirement",
              value: ` ${responseData.totalRequirement
                ? responseData.totalRequirement
                : "0"
                }`,
            },
          ]}
          style={{
            "--cui-card-cap-bg": "#3b5998",
          }}
          zzz
        />
      </CCol>

      <CCol sm={6} lg={3}>
        <CWidgetStatsD
          className="mb-4"
          color="warning"
          {...(withCharts && {
            chart: (
              <CChart
                className="position-absolute w-100 h-100"
                type="line"
                data={{
                  labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                  ],
                  datasets: [
                    {
                      backgroundColor: "rgba(255,255,255,.1)",
                      borderColor: "rgba(255,255,255,.55)",
                      pointHoverBackgroundColor: "#fff",
                      borderWidth: 2,
                      data: [1, 13, 9, 17, 34, 41, 38],
                      fill: true,
                    },
                  ],
                }}
                options={chartOptions}
              />
            ),
          })}
          icon={
            <CIcon icon={cilNotes} height={52} className="my-4 text-white" />
          }
          values={[
            {
              title: "totalTranscript",
              value: `${responseData.totalTranscript
                ? responseData.totalTranscript
                : "0"
                } `,
            },
          ]}
        />
      </CCol>

      <CCol sm={6} lg={3}>
        <CWidgetStatsD
          className="mb-4"
          color="info"
          {...(withCharts && {
            chart: (
              <CChart
                className="position-absolute w-100 h-100"
                type="line"
                data={{
                  labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                  ],
                  datasets: [
                    {
                      backgroundColor: "rgba(255,255,255,.1)",
                      borderColor: "rgba(255,255,255,.55)",
                      pointHoverBackgroundColor: "#fff",
                      borderWidth: 2,
                      data: [35, 23, 56, 22, 97, 23, 64],
                      fill: true,
                    },
                  ],
                }}
                options={chartOptions}
              />
            ),
          })}
          icon={
            <CIcon icon={cilDescription} height={52} className="my-4 text-white" />
          }
          values={[
            {
              title: "Total Document",
              value: `${responseData.totalDocument ? responseData.totalDocument : "0"
                }`,
            },
          ]}
          style={{
            "--cui-card-cap-bg": "#4875b4",
          }}
        />
      </CCol>

      <CCol sm={6} lg={3}>
        <CWidgetStatsD
          className="mb-4"
          color="success"
          {...(withCharts && {
            chart: (
              <CChart
                className="position-absolute w-100 h-100"
                type="line"
                data={{
                  labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                  ],
                  datasets: [
                    {
                      backgroundColor: "rgba(255,255,255,.1)",
                      borderColor: "rgba(255,255,255,.55)",
                      pointHoverBackgroundColor: "#fff",
                      borderWidth: 2,
                      data: [35, 23, 56, 22, 97, 23, 64],
                      fill: true,
                    },
                  ],
                }}
                options={chartOptions}
              />
            ),
          })}
          icon={
            <CIcon icon={cilTask} height={52} className="my-4 text-white" />
          }
          values={[
            {
              title: "TotalCourses Completed",
              value: `${responseData.totalCoursesCompleted
                ? responseData.totalCoursesCompleted
                : "0"
                }`,
            },
          ]}
        />
      </CCol>
    </CRow>
  );
};

WidgetsBrand.propTypes = {
  withCharts: PropTypes.bool,
};

export default WidgetsBrand;
