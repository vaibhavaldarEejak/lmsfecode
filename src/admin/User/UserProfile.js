import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Userimage from "./Userimage/Userimage.jpg";
import { ProgressBar } from "primereact/progressbar";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Panel } from "primereact/panel";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import axios from "axios";

import "primeflex/primeflex.css";

import {
  CCard,
  CImage,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CRow,
  CFormSelect,
  CForm,
  CCardFooter,
  CFormCheck,
  CContainer,
  CBadge,
  CButton,
} from "@coreui/react";
import { Link, useNavigate } from "react-router-dom";
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";

const ProfileHeader = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [userDetail, setUserDetail] = useState("");
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);

  const [form, setForm] = useState({
    userPhoto: "",
  });

  const [certImg, setCertImg] = useState();
  const [imgData, setImgData] = useState(null);
  const [isloading, setLoading1] = useState(false);

  const toast = useRef(null);
  const [userPhoto, setUserPhoto] = useState("");
  const onChangePicture = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.includes("image")) {
        setCertImg(file);
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          setImgData(reader.result);
        });
        reader.readAsDataURL(file);
      } else {
        // Handle error for non-image files
        console.log("Please select an image file.");
      }
    }
  };

  useMemo(() => {
    setForm({
      firstName: userDetail.firstName,
      lastName: userDetail.lastName,
      jobTitle:
        userDetail.jobTitle &&
        userDetail.jobTitle.map((e) => ({
          label: e.jobTitleName,
          value: e.jobTitleId,
        })),
      role: userDetail.role,
      organizationId: userDetail.organizationId,
      emailAddress: userDetail.email !== null ? userDetail.email : "",
      barcode: userDetail.barcode,
      division:
        userDetail.division &&
        userDetail.division.map((e) => ({
          label: e.divisionName,
          value: e.divisionId,
        })),
      area:
        userDetail.area &&
        userDetail.area.map((e) => ({
          label: e.areaName,
          value: e.areaId,
        })),
      location:
        userDetail.location &&
        userDetail.location.map((e) => ({
          label: e.locationName,
          value: e.locationId,
        })),
      userPhoto: userDetail.userPhoto,
      userName: userDetail.userName,
      phoneNumber: userDetail.phone,
      userId: userDetail.userId,
      isActive: userDetail.isActive,
      customFields: userDetail.customFields,
    });
  }, [userDetail]);

  const userDetailApi = async () => {
    try {
      const response = await getApiCall(`getProfileDetails`);
      setUserDetail(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (token !== "Bearer null") {
      userDetailApi();
    }
  }, []);

  <Toast ref={toast} />;

  const updateUser = async (data) => {
    setLoading1(true);
    try {
      const response = await generalUpdateApi(
        "updateProfileDetails/?_method=PUT",
        data
      );
      setLoading1(false);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Profile updated successfully!",
        life: 3000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (errors) {
      let errorMessage = "Error Updating the photo"; // Default error message
      if (
        errors.response &&
        errors.response.data &&
        errors.response.data.errors
      ) {
        errorMessage = errors.response.data.errors; // Directly displays the errors from  API
      }
      if (
        errors.response &&
        errors.response.data &&
        errors.response.data.error
      ) {
        errorMessage = errors.response.data.error; // Directly displays the error from  API
      }
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errorMessage,
        life: 3000,
      });
      setLoading1(false);
      setshowError(true);
    }
  };

  <Toast ref={toast} />;

  const handleSave2 = (e) => {
    e.preventDefault();
    {
      let formData = new FormData();
      formData.append("firstName", form.firstName || userDetail.firstName);
      formData.append("lastName", form.lastName || userDetail.lastName);
      formData.append(
        "emailAddress",
        form.emailAddress !== null ? form.emailAddress : ""
      );
      formData.append("password", form.password || userDetail.password);
      formData.append(
        "organizationId",
        form.organizationId || userDetail.password
      );
      formData.append("role", form.role);
      formData.append("barcode", form.barcode);
      formData.append(
        "jobTitle",
        Array.isArray(form.jobTitle) ? form.jobTitle.map((e) => e.value) : []
      );
      formData.append(
        "division",
        Array.isArray(form.division) ? form.division.map((e) => e.value) : []
      );
      formData.append(
        "location",
        Array.isArray(form.location) ? form.location.map((e) => e.value) : []
      );
      formData.append(
        "area",
        Array.isArray(form.area) ? form.area.map((e) => e.value) : []
      );
      formData.append("userId", userDetail.userId);
      formData.append("userName", form.userName || userDetail.userName);
      formData.append(
        "phoneNumber",
        form.phoneNumber || userDetail.phoneNumber
      );
      formData.append("isActive", form.isActive || userDetail.isActive);
      formData.append("userPhoto", userPhoto || "");

      if (userDetail) {
        updateUser(formData);
      }
    }
  };

  return (
    <>
      <div className="card mb-5 mb-xl-10 p-card p-card-rounded">
        <div className="card-body pt-9 pb-0">
          <div className="d-flex flex-wrap flex-sm-nowrap mb-3">
            <div className="me-7 mb-4">
              <div className="symbol symbol-100px symbol-lg-100px symbol-fixed position-relative">
                {userDetail.userPhoto ? (
                  <CImage
                    src={userDetail.userPhoto}
                    alt=""
                    style={{ width: "100px", height: "100px" }}
                  />
                ) : (
                  <CImage src={Userimage} />
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
                      {userDetail.userName}
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
                      {userDetail.email}
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
                    value={""}
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
      <CCard>
        <div className="card mb-5 mb-xl-10">
          <Panel header="Profile Details" toggleable>
            <CCardBody className="card-body border-top p-9">
              <CForm className="row g-15 needs-validation">
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
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
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Last Name
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
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
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
                      <div className="col-sm-7 py-2">{userDetail.areaName}</div>
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
                      <div className="col-sm-7 py-2">{userDetail.barcode}</div>
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
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Username
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
                        Status
                      </CFormLabel>
                      <div className="col-sm-7 py-2">{userDetail.isActive}</div>
                    </CRow>
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  {/* Column 1 for User Role */}
                  <CCol sm="6">
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        User Role
                      </CFormLabel>
                      <div className="col-sm-8 py-2">{userDetail.roleName}</div>
                    </CRow>
                  </CCol>

                  {/* Column 2 for Profile Image */}
                  <CCol sm="6">
                    <CRow className="mb-3" style={{ marginTop: "10px" }}>
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Profile Image
                      </CFormLabel>
                      <div className="col-sm-7">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <CFormInput
                            type="file"
                            id="formFile"
                            accept="image/*"
                            onChange={(e) => {
                              setForm({
                                ...form,
                                userPhoto: e.target.files[0],
                              });
                              setUserPhoto(e.target.files[0]);
                              onChangePicture(e);
                            }}
                          />
                          <label
                            className="input-group-text custom-choose-btn2"
                            htmlFor="formFile"
                            style={{
                              fontSize: ".9rem",
                              cursor: "pointer",
                              marginLeft: "5px",
                            }}
                          >
                            <Tooltip
                              target="#tooltipImage" // Use the ID of the tooltip target
                              position="right"
                              content="File type images only (JPEG, PNG)"
                            />
                            <span id="tooltipImage">
                              <img src="/media/icon/gen045.svg" alt="Upload" />
                            </span>
                          </label>
                        </div>
                        <input
                          type="file"
                          id="formFile"
                          accept=".jpg, .jpeg, .png" // Accept only image files
                          style={{ display: "none" }} // Hide the actual input
                        />
                        {userPhoto && (
                          <img
                            src={URL.createObjectURL(userPhoto)}
                            style={{
                              objectFit: "contain",
                              width: "300px",
                              height: "150px",
                              marginTop: "10px",
                              marginLeft: "35%",
                            }}
                            alt="Uploaded"
                          />
                        )}
                      </div>
                    </CRow>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </Panel>
          <CCardFooter>
            <div className="d-flex justify-content-end">
              <Link to="/admin/userlist" className="btn btn-primary me-2">
                Back
              </Link>
              <CButton
                className="btn btn-primary me-2"
                onClick={(e) => handleSave2(e)}
                disabled={isloading}
              >
                {isloading && (
                  <span
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                Save
              </CButton>
            </div>
          </CCardFooter>
        </div>
      </CCard>
    </>
  );
};

export default ProfileHeader;
