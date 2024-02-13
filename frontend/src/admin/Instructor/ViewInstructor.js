import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Panel } from "primereact/panel";
import "primeflex/primeflex.css";
import "../../scss/required.scss";
import { Buffer } from "buffer";
import { Skeleton } from "primereact/skeleton";

import { CCard, CCardBody, CCol, CFormLabel, CRow, CForm } from "@coreui/react";
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";

const API_URL = process.env.REACT_APP_API_URL;

const ProfileHeader = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const orgId = window.location.href.split("?")[1];
  const [roleList, setRoleList] = useState([]);
  const [JobTitleList, setjobTitleList] = useState([]);
  const [divisionlist, setDivisiontlist] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [arealist, setArealist] = useState([]);
  const [organizationList, setOrganizationList] = useState([]);
  const [userDetail, setUserDetail] = useState("");
  const userId = window.location.href.split("?")[1];
  const [areaId, setAreaId] = useState(0);

  const decodeBase64 = (data = "") => {
    const decodedBuffer = Buffer.from(data, "base64");
    const decodedStr = decodedBuffer.toString("utf-8");
    return decodedStr;
  };

  const [form, setForm] = useState({
    role: "",
    organizationId: "",
    firstName: "",
    lastName: "",
    jobTitle: [],
    emailAddress: "",
    barcode: "",
    phoneNumber: "",
    division: [],
    location: [],
    area: [],
    role: "",
    userName: "",
    password: "",
    userId: 0,
    isActive: 1,
  });

  useMemo(() => {
    setForm({
      firstName: userDetail.firstName,
      lastName: userDetail.lastName,
      jobTitle: {
        value: userDetail.jobTitleId,
        label: userDetail.jobTitleName,
      },
      role: userDetail.role,
      organizationId: userDetail.organizationId,
      emailAddress: userDetail.email,
      barcode: userDetail.barcode,
      division: {
        value: userDetail.divisionId,
        label: userDetail.divisionName,
      },
      area: {
        value: userDetail.areaId,
        label: userDetail.areaName,
      },
      location: {
        value: userDetail.locationId,
        label: userDetail.locationName,
      },
      userName: userDetail.userName,
      phoneNumber: userDetail.phone,
      password: decodeBase64(userDetail.userPassword),
      userId: userDetail.userId,
      isActive: userDetail.isActive,
    });
  }, [userDetail]);

  useEffect(() => {
    roleListApi();
    JobListApi();
    DivisionListApi();
    locationlistApi();
    organizationListApi();
    AreaListApi();

    if (userId) {
      userDetailApi(userId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      userDetailApi(Number(userId));
    }
  }, [userId]);

  const userDetailApi = async (id) => {
    try {
      const res = await getApiCall("viewUserById", id);
      setUserDetail(res);
    } catch (err) {}
  };

  //Job LIST/ADD section

  const JobListApi = async () => {
    try {
      const res = await getApiCall("getJobTitleList");
      setjobTitleList(
        res.map((e) => {
          return { value: e.jobTitleId, label: e.jobTitleName };
        })
      );
    } catch (err) {}
  };

  //Division ADD/LIST api section

  const DivisionListApi = async () => {
    try {
      const res = await getApiCall("getDivisionList");
      setDivisiontlist(
        res.map((e) => ({
          value: e.divisionId,
          label: e.divisionName,
        }))
      );
    } catch (err) {}
  };
  //Location ADD/List API sections
  const locationlistApi = async () => {
    try {
      const res = await getApiCall("getLocationList");
      setLocationList(
        res.map((e) => ({
          value: e.locationId,
          label: e.locationName,
        }))
      );
    } catch (err) {}
  };

  //Area ADD/LIST api section

  const AreaListApi = async () => {
    try {
      const res = await getApiCall("getAreaList");
      setArealist(
        res.map((e) => ({
          value: e.areaId,
          label: e.areaName,
        }))
      );
    } catch (err) {}
  };

  const addareaApi = async (text) => {
    const data1 = { areaName: text };

    try {
      const res = await postApiCall("addArea", data1);
      AreaListApi();
      setAreaId(res);

      setForm({
        ...form,
        area: {
          value: res,
          label: text,
        },
      });
    } catch (err) {}
  };

  const roleListApi = async () => {
    try {
      const res = await getApiCall("getRoleList");
      setRoleList(res);
    } catch (err) {}
  };
  const organizationListApi = async () => {
    try {
      const res = await getApiCall("getOrganizationOptionsList");
      setOrganizationList(res);
    } catch (err) {}
  };

  const [passwordShown, setPasswordShown] = useState("password");
  const togglePassword = (event) => {
    if (passwordShown === "password") {
      setPasswordShown("text");
      event.preventDefault();
      return;
    }
    setPasswordShown("password");
    event.preventDefault();
  };

  const [num, setNum] = useState(0);

  function randomNumberInRange(min, max) {
    // 👇️ get number between min (inclusive) and max (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const handleClick = () => {
    form.barcode = randomNumberInRange(889666, 897666);
    setNum(randomNumberInRange(1, 5));
  };
  return (
    <>
      <CCard>
        <div className="card mb-5 mb-xl-10">
          <Panel header="Profile Details" toggleable>
            {userDetail && (
              <CCardBody className="card-body p-9">
                <CForm
                  className="row g-15 needs-validation"
                  form={form}
                  onFinish={form.updateUser}
                >
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7 "
                        >
                          First Name
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          {userDetail.firstName}
                        </div>
                      </CRow>
                    </CCol>
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7 "
                        >
                          Last Name
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          {userDetail.lastName}
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          Job Title
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          {userDetail.jobTitleName}
                        </div>
                      </CRow>
                    </CCol>

                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7 "
                        >
                          Company Name
                        </CFormLabel>
                        <div className="col-sm-7  py-2">
                          {userDetail.organizationName}
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          Division
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          {userDetail.divisionName}
                        </div>
                      </CRow>
                    </CCol>

                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          Area
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          {userDetail.areaName}
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          Location
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          {userDetail.locationName}
                        </div>
                      </CRow>
                    </CCol>

                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          QR Code
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          {userDetail.barcode}
                          {/* <Link onClick={handleClick}>Generate QR code</Link> */}
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          Phone Number
                        </CFormLabel>
                        <div className="col-sm-7 py-2">{userDetail.phone}</div>
                      </CRow>
                    </CCol>

                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          Email Address
                        </CFormLabel>
                        <div className="col-sm-7 py-2">{userDetail.email}</div>
                      </CRow>
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7 "
                        >
                          Username
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          {userDetail.userName}
                        </div>
                      </CRow>
                    </CCol>
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder"
                        >
                          Status
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          {userDetail.isActive}
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7 "
                        >
                          User Role
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          {userDetail.roleName}
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            )}

            {!userDetail && (
              <CCardBody className="card-body border-top p-9">
                <CForm className="row g-15 needs-validation">
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          <Skeleton width="85%" className="mr-2"></Skeleton>
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          <Skeleton width="97%"></Skeleton>
                        </div>
                      </CRow>
                    </CCol>
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          <Skeleton width="85%" className="mr-2"></Skeleton>
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          <Skeleton width="97%"></Skeleton>
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          <Skeleton width="85%" className="mr-2"></Skeleton>
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          <Skeleton width="97%"></Skeleton>
                        </div>
                      </CRow>
                    </CCol>

                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          <Skeleton width="85%" className="mr-2"></Skeleton>
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          <Skeleton width="97%"></Skeleton>
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          <Skeleton width="85%" className="mr-2"></Skeleton>
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          <Skeleton width="97%"></Skeleton>
                        </div>
                      </CRow>
                    </CCol>

                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          <Skeleton width="85%" className="mr-2"></Skeleton>
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          <Skeleton width="97%"></Skeleton>
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          <Skeleton width="85%" className="mr-2"></Skeleton>
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          <Skeleton width="97%"></Skeleton>
                        </div>
                      </CRow>
                    </CCol>

                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          <Skeleton width="85%" className="mr-2"></Skeleton>
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          <Skeleton width="97%"></Skeleton>
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          <Skeleton width="85%" className="mr-2"></Skeleton>
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          <Skeleton width="97%"></Skeleton>
                        </div>
                      </CRow>
                    </CCol>

                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          <Skeleton width="85%" className="mr-2"></Skeleton>
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          <Skeleton width="97%"></Skeleton>
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          <Skeleton width="85%" className="mr-2"></Skeleton>
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          <Skeleton width="97%"></Skeleton>
                        </div>
                      </CRow>
                    </CCol>

                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          <Skeleton width="85%" className="mr-2"></Skeleton>
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          <Skeleton width="97%"></Skeleton>
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          <Skeleton width="85%" className="mr-2"></Skeleton>
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          <Skeleton width="97%"></Skeleton>
                        </div>
                      </CRow>
                    </CCol>
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder"
                        >
                          <Skeleton width="85%" className="mr-2"></Skeleton>
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          <Skeleton width="97%"></Skeleton>
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            )}
          </Panel>
        </div>
      </CCard>
    </>
  );
};

export default ProfileHeader;
