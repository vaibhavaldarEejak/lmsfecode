import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { ProgressBar } from "primereact/progressbar";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Panel } from "primereact/panel";
import Userimage from "./Userimage/Userimage.jpg";
import "primeflex/primeflex.css";
import { Link } from "react-router-dom";
import "../../scss/required.scss";
import { Buffer } from "buffer";
import { Skeleton } from "primereact/skeleton";
import {
  CImage,
  CCardBody,
  CCol,
  CFormLabel,
  CRow,
  CForm,
} from "@coreui/react";
import getApiCall from "src/server/getApiCall";

const ProfileHeader = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken"),
    [userDetail, setUserDetail] = useState(""),
    // userId = window.location.href.split("?")[1],
    [form, setForm] = useState({
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
      userPhoto: "",
      userName: "",
      password: "",
      userId: 0,
      isActive: 1,
      customFields: [],
    });
  const decodeBase64 = (data = "") => {
    const decodedBuffer = Buffer.from(data, "base64");
    const decodedStr = decodedBuffer.toString("utf-8");
    return decodedStr;
  };
  let userId = "";
  useEffect(() => {
    userId = localStorage.getItem("userId");
  }, []);
  useMemo(() => {
    setForm({
      firstName: userDetail.firstName,
      lastName: userDetail.lastName,
      jobTitle: userDetail.jobTitle,
      role: userDetail.role,
      organizationId: userDetail.organizationId,
      emailAddress: userDetail.email,
      barcode: userDetail.barcode,
      division: userDetail.division,
      area: userDetail.area,
      location: userDetail.location,
      userPhoto: userDetail.userPhoto,
      userName: userDetail.userName,
      phoneNumber: userDetail.phone,
      password: decodeBase64(userDetail.userPassword),
      userId: userDetail.userId,
      isActive: userDetail.isActive,
      customFields: userDetail.customFields,
    });
  }, [userDetail]);

  useEffect(() => {
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
      const response = await getApiCall("viewUserById", id);
      setUserDetail(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="card mb-5 mb-xl-10 p-card p-card-rounded">
        <div className="card-body pt-9 pb-0">
          <div className="d-flex flex-wrap flex-sm-nowrap mb-3">
            <div className="me-7 mb-4">
              <div className="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative">
                {userDetail.userPhoto ? (
                  <CImage
                    src={userDetail.userPhoto}
                    alt=""
                    style={{ width: "180px", height: "180px" }}
                  />
                ) : (
                  <img
                    src={Userimage}
                    alt="User Image"
                    style={{ width: "180px", height: "180px" }}
                  />
                )}
                <div className="position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px"></div>
              </div>
            </div>

            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
                <div className="d-flex flex-column ">
                  <div className="d-flex align-items-center mb-2">
                    <a
                      href="#"
                      className="text-gray-800 text-hover-primary fs-2 fw-bolder me-1"
                      style={{
                        paddingLeft: "10px",
                        paddingTop: "10px",
                        textDecoration: "none",
                      }}
                    >
                      {userDetail.firstName}
                    </a>
                    <a href="#"></a>
                  </div>

                  <div className="d-flex flex-wrap fw-bold fs-6 mb-4 pe-2">
                    <a
                      href="#"
                      className="d-flex align-items-center text-gray-400 text-hover-primary me-4 mb-2 pl-3"
                      style={{ textDecoration: "none" }}
                    >
                      <i className="fas fa-address-book me-0.1 fs-4"></i>
                      {userDetail.roleName}
                    </a>
                    <a
                      href="#"
                      className="d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2"
                      style={{ textDecoration: "none" }}
                    >
                      <i className="pi pi-map-marker"></i>
                      {userDetail.locationName},{userDetail.areaName}
                    </a>
                    <a
                      href="#"
                      className="d-flex align-items-center text-gray-400 text-hover-primary mb-2"
                      style={{ textDecoration: "none" }}
                    >
                      <i className="pi pi-envelope"></i>
                      {form.emailAddress}
                    </a>
                  </div>
                </div>

                <div className="d-flex my-4">
                  <button
                    className="p-button p-button-secondary p-button-sm me-2"
                    id="kt_user_follow_button"
                  >
                    <i className="pi pi-user-plus"></i>
                    <span className="ms-2">Follow</span>
                    <span
                      className="p-progress-spinner p-component"
                      style={{ display: "none" }}
                    >
                      <svg
                        className="p-progress-spinner-svg"
                        viewBox="25 25 50 50"
                      >
                        <circle
                          className="p-progress-spinner-circle"
                          cx="50"
                          cy="50"
                          r="20"
                          fill="none"
                          strokeWidth="4"
                          stroke-miterlimit="10"
                        />
                      </svg>
                    </span>
                  </button>
                  <button className="p-button p-button-primary p-button-sm me-3">
                    <i className="pi pi-user-plus"></i>
                    <span className="ms-2">Hire Me</span>
                  </button>
                  <div className="me-0">
                    <button className="btn btn-sm btn-icon btn-bg-light btn-active-color-primary">
                      <i className="bi bi-three-dots fs-3"></i>
                    </button>
                    {/* <Dropdown1 /> */}
                  </div>
                </div>
              </div>

              <div className="d-flex flex-wrap flex-stack me-2">
                <div className="d-flex flex-column flex-grow-1 pe-8 ">
                  <div className="d-flex flex-wrap ms-2">
                    <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-2 mb-3 bg-light">
                      <div className="d-flex align-items-center">
                        <div className="fs-2 fw-bolder">37</div>
                      </div>
                      <div className="fw-bold fs-6 text-gray-400">Courses</div>
                    </div>

                    <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-2 mb-3 bg-light">
                      <div className="d-flex align-items-center">
                        <div className="fs-2 fw-bolder">6</div>
                      </div>

                      <div className="fw-bold fs-6 text-gray-400">
                        Certificates
                      </div>
                    </div>

                    <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-2 mb-3 bg-light">
                      <div className="d-flex align-items-center">
                        <div className="fs-2 fw-bolder">4,6</div>
                      </div>
                      <div className="fw-bold fs-6 text-gray-400">
                        Avg. Score
                      </div>
                    </div>
                    <div className="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-2 mb-3 bg-light">
                      <div className="d-flex align-items-center">
                        <div className="fs-2 fw-bolder">822</div>
                      </div>
                      <div className="fw-bold fs-6 text-gray-400">
                        Hrs Learned
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="d-flex align-items-center w-200px w-sm-300px flex-column mt-3"
                  style={{ paddingBottom: "40px" }}
                >
                  <div className="d-flex justify-content-between w-100 mt-auto mb-2">
                    <span className="fw-bold fs-6 text-gray-400">
                      Profile Completion
                    </span>
                    <span className="fw-bolder fs-6">50%</span>
                  </div>
                  <ProgressBar
                    value={50}
                    style={{ width: "400px", height: "10px" }}
                  ></ProgressBar>
                  <div className="h-5px mx-3 w-100 bg-light mb-3">
                    <div
                      className="bg-success rounded h-5px"
                      role="progressbar"
                      style={{ width: "50%", paddingRight: "20px" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                        First Name :
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
                        Last Name :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">{userDetail.lastName}</div>
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
                        Job Title :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {userDetail?.jobTitle?.join(",")}
                      </div>
                    </CRow>
                  </CCol>

                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 "
                      >
                        Company Name :
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
                        Division :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {userDetail.division?.join(",")}
                      </div>
                    </CRow>
                  </CCol>

                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Area :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {userDetail.area?.join(",")}
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
                        Location :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {userDetail.location?.join(",")}
                      </div>
                    </CRow>
                  </CCol>

                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        QR Code :
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
                        Phone Number :
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
                        Email Address :
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
                        Username :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">{userDetail.userName}</div>
                    </CRow>
                  </CCol>
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder"
                      >
                        Status :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">{userDetail.isActive}</div>
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
                        User Role :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">{userDetail.roleName}</div>
                    </CRow>
                  </CCol>
                </CRow>
                {form.customFields?.map((item, i) => (
                  <>
                    {item?.customFieldType === "Text" ||
                    item?.customFieldType === "Textarea" ||
                    item?.customFieldType === "Date" ? (
                      <CRow className="mb-3">
                        <CCol md={6}>
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-4 col-form-label fw-bolder fs-7 "
                            >
                              {item.labelName} :
                            </CFormLabel>
                            <div className="col-sm-7 py-2">
                              {item.customFieldValue}
                            </div>
                          </CRow>
                        </CCol>
                      </CRow>
                    ) : (
                      <CRow className="mb-3">
                        <CCol md={6}>
                          <CRow className="mb-3  d-flex">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-4 col-form-label fw-bolder fs-7 "
                            >
                              {item.labelName} :
                            </CFormLabel>
                            <div className="col-sm-7 py-2">
                              {item.customNumberOfFields?.map(
                                (item1, i) =>
                                  (item1?.checked === "1" ||
                                    item1?.customFieldValue === "1" ||
                                    item1?.selected === "1") && (
                                    <div>{item1.labelName}</div>
                                  )
                              )}
                            </div>
                          </CRow>
                        </CCol>
                      </CRow>
                    )}
                  </>
                ))}
              </CForm>
              <div className="d-flex justify-content-end">
                <Link
                  to="/admin/userlist"
                  className="btn btn-primary"
                  onClick={() => {
                    localStorage.removeItem("userId");
                  }}
                >
                  Back
                </Link>
              </div>
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
    </>
  );
};

export default ProfileHeader;
