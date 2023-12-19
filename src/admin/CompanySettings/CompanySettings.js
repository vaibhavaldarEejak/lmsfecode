import React, { useEffect, useState, useRef } from "react";
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
  CFormInput,
  CFormSwitch,
  CFormLabel,
  CInputGroup,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { Buffer } from "buffer";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import getApiCall from "src/server/getApiCall";
import generalUpdateApi from "src/server/generalUpdateApi";
import "../../css/form.css";
const API_URL = process.env.REACT_APP_API_URL;
function CompanySettings() {
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  const decodeBase64 = (data) => {
    return new Buffer.from(data, "base64").toString("ascii");
  };
  const [editMode, setEditMode] = useState(false);
  const [isloading, setLoading1] = useState(false);
  const toast = useRef(null);
  const [form, setForm] = useState({
    organizationLogo: "",
    logoText: "",
    organizationName: "",
    adminUsername: "",
    adminPassword: "",
    adminEmail: "",
    userPhoneNumber: "",
    address: "",
  });
  const [passwordShown, setPasswordShown] = useState("password");
  const [imgData, setImgData] = useState(null);
  const [validationMessages, setValidationMessages] = useState({});
  const [showValidationMessages, setShowValidationMessages] = useState(false);

  const togglePassword = () => {
    setPasswordShown(passwordShown === "password" ? "text" : "password");
  };
  const token = "Bearer " + localStorage.getItem("ApiToken");

  const onChangePicture = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getOrganization = async () => {
    try {
      const res = await getApiCall("getOrganization");
      setForm({
        organizationLogo: "",
        logoText: res.logoText,
        organizationName: res.organizationName,
        adminUsername: res.adminUsername,
        adminPassword: decodeBase64(res.userPassword),
        adminEmail: res.userEmailId,
        userPhoneNumber: res.userPhoneNumber,
        address: res.address,
      });
      setImgData(res.organizationLogo);
    } catch (err) {}
  };

  useEffect(() => {
    getOrganization();
  }, []);

  const updateOrganization = async () => {
    const formData = new FormData();
    formData.append("organizationLogo", form.organizationLogo);
    formData.append("logoText", form.logoText);
    formData.append("organizationName", form.organizationName);
    formData.append("adminUsername", form.adminUsername);
    formData.append("adminPassword", form.adminPassword);
    formData.append("userEmailId", form.adminEmail);
    formData.append("userPhoneNumber", form.userPhoneNumber);
    formData.append("address", form.address);
    setLoading1(true);
    try {
      const res = await generalUpdateApi("updateOrganization", formData);
      getOrganization();
      setEditMode(false);
      setLoading1(false);
      toast.current.show({
        severity: "success",
        summary: "Success Message",
        detail: "Company setting updated successfully",
        life: 3000,
      });
    } catch (err) {}
  };

  const validateForm = () => {
    const messages = {};
    let isValid = true;

    // if (!form.organizationLogo) {
    //   messages.organizationLogo = "Organization Logo is required";
    //   isValid = false;
    // } else {
    //   messages.organizationId = "";
    // }

    if (!form.organizationName) {
      messages.organizationName = "Organization Name is required";
      isValid = false;
    }

    // if (!form.logoText) {
    //   messages.logoText = "Logo Text is required";
    //   isValid = false;
    // }

    if (!form.adminUsername) {
      messages.adminUsername = "Admin User Name is required";
      isValid = false;
    }

    if (!form.adminPassword) {
      messages.adminPassword = "Admin Password is required";
      isValid = false;
    }

    if (!form.adminEmail) {
      messages.adminEmail = "Admin Email is required";
      isValid = false;
    }

    if (!form.userPhoneNumber) {
      messages.userPhoneNumber = "Contact Number is required";
      isValid = false;
    }

    if (!form.address) {
      messages.address = "Address is required";
      isValid = false;
    }

    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };

  const onUpdate = () => {
    if (validateForm()) {
      updateOrganization();
    }
  };

  return (
    <div>
      <div className="container">
        <div className="container-fluid">
          <Toast ref={toast} />
          <CRow>
            <CCol xs={12} style={{ padding: "1px" }}>
              <CCard className="mb-7 card-ric">
                <div>
                  <CCardHeader className="p-0">
                    <CNav variant="tabs">
                      <CNavItem>
                        <Link
                          style={{ cursor: "pointer", textDecoration: "none" }}
                          to={`/admin/companysettings`}
                        >
                          <CNavLink active style={{ cursor: "pointer" }}>
                            <strong>Company Details</strong>
                          </CNavLink>{" "}
                        </Link>
                      </CNavItem>
                      <CNavItem>
                        <Link
                          style={{ cursor: "pointer", textDecoration: "none" }}
                          to={`/admin/generalsettings`}
                        >
                          <CNavLink style={{ cursor: "pointer" }}>
                            General Settings.
                          </CNavLink>
                        </Link>
                      </CNavItem>
                    </CNav>
                  </CCardHeader>
                  <CTabContent className="rounded-bottom">
                    <CTabPane className="p-3 preview" visible>
                      <div className="card-header border-0 d-flex justify-content-md-end">
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-10 col-form-label fw-bolder fs-7"
                          >
                            Edit:
                          </CFormLabel>
                          <CFormSwitch
                            size="xl"
                            id="formSwitchCheckDefaultXL"
                            className="py-1"
                            checked={editMode}
                            onChange={(e) => setEditMode(e.target.checked)}
                          />
                        </div>
                      </div>
                    </CTabPane>
                  </CTabContent>
                </div>
                <CCardBody className="org">
                  {editMode ? (
                    <>
                      <CRow className="mb-3">
                        <CCol md={6}>
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-4 col-form-label fw-bolder fs-7"
                            >
                              Organization Logo
                            </CFormLabel>
                            <div className="col-sm-7">
                              <CFormInput
                                type="file"
                                accept={"image/png, image/jpeg, image/jpg"}
                                onChange={(e) => {
                                  setForm({
                                    ...form,
                                    organizationLogo: e.target.files[0],
                                  });
                                  onChangePicture(e);
                                }}
                                feedbackInvalid="Organization Logo is required"
                                id="validationCustom01"
                                required
                              />
                              {imgData && (
                                <img
                                  style={{
                                    objectFit: "contain ",
                                    width: "300px",
                                    height: "200px",
                                    marginTop: "10px",
                                    marginLeft: "5%",
                                  }}
                                  alt="Organization logo"
                                  src={imgData}
                                ></img>
                              )}
                            </div>
                          </CRow>
                        </CCol>
                        <CCol md={6}>
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-4 col-form-label fw-bolder fs-7"
                            >
                              Logo Text
                            </CFormLabel>
                            <div className="col-sm-7">
                              <CFormInput
                                type="text"
                                // feedbackInvalid="Logo Text is required"
                                id="validationCustom02"
                                required
                                value={form.logoText}
                                onChange={(e) => {
                                  setForm({
                                    ...form,
                                    logoText: e.target.value,
                                  });
                                  // setValidationMessages({
                                  //   ...validationMessages,
                                  //   logoText: e.target.value
                                  //     ? ""
                                  //     : "Logo Text is required",
                                  // });
                                }}
                                placeholder="Logo Text"
                              />
                              {/* {showValidationMessages &&
                          validationMessages.logoText && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.logoText}
                            </div>
                          )} */}
                            </div>
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
                              Organization Name
                            </CFormLabel>
                            <div className="col-sm-7">
                              <CFormInput
                                type="text"
                                id="validationCustom03"
                                required
                                value={form.organizationName}
                                onChange={(e) => {
                                  setForm({
                                    ...form,
                                    organizationName: e.target.value,
                                  });
                                  setValidationMessages({
                                    ...validationMessages,
                                    organizationName: e.target.value
                                      ? ""
                                      : "Organization Name is required",
                                  });
                                }}
                                placeholder="Organization Name"
                              />
                              {showValidationMessages &&
                                validationMessages.organizationName && (
                                  <div
                                    className="fw-bolder"
                                    style={{ color: "red" }}
                                  >
                                    {validationMessages.organizationName}
                                  </div>
                                )}
                            </div>
                          </CRow>
                        </CCol>
                        <CCol md={6}>
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-4 col-form-label fw-bolder fs-7 required"
                            >
                              Admin User Name
                            </CFormLabel>
                            <div className="col-sm-7">
                              <CFormInput
                                type="text"
                                feedbackInvalid="Admin User Name is required"
                                id="validationCustom08"
                                required
                                value={form.adminUsername}
                                onChange={(e) => {
                                  setForm({
                                    ...form,
                                    adminUsername: e.target.value,
                                  });
                                  setValidationMessages({
                                    ...validationMessages,
                                    adminUsername: e.target.value
                                      ? ""
                                      : "Admin User Name is required",
                                  });
                                }}
                                placeholder="Admin User Name"
                              />
                              {showValidationMessages &&
                                validationMessages.adminUsername && (
                                  <div
                                    className="fw-bolder"
                                    style={{ color: "red" }}
                                  >
                                    {validationMessages.adminUsername}
                                  </div>
                                )}
                            </div>
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
                              Admin Password
                            </CFormLabel>
                            <div className="col-sm-7">
                              <CInputGroup>
                                <CFormInput
                                  type={passwordShown}
                                  feedbackInvalid="Admin Password is required"
                                  id="validationCustom10"
                                  required
                                  value={form.adminPassword}
                                  onChange={(e) => {
                                    setForm({
                                      ...form,
                                      adminPassword: e.target.value,
                                    });
                                    setValidationMessages({
                                      ...validationMessages,
                                      adminPassword: e.target.value
                                        ? ""
                                        : "Admin Password is required",
                                    });
                                  }}
                                  placeholder="Admin Password"
                                />
                                <CButton
                                  type="button"
                                  onClick={togglePassword}
                                  color="secondary"
                                  variant="outline"
                                  id="button-addon1"
                                >
                                  {passwordShown === "password" ? (
                                    <i
                                      className="pi pi-eye"
                                      title="Hide Password"
                                    ></i>
                                  ) : (
                                    <i
                                      className="pi pi-eye-slash"
                                      title="Show Password"
                                    ></i>
                                  )}
                                </CButton>
                              </CInputGroup>
                              {showValidationMessages &&
                                validationMessages.adminPassword && (
                                  <div
                                    className="fw-bolder"
                                    style={{ color: "red" }}
                                  >
                                    {validationMessages.adminPassword}
                                  </div>
                                )}
                            </div>
                          </CRow>
                        </CCol>
                        <CCol md={6}>
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-4 col-form-label fw-bolder fs-7 required"
                            >
                              Admin Email ID
                            </CFormLabel>
                            <div className="col-sm-7">
                              <CFormInput
                                type="text"
                                feedbackInvalid="Admin User Name is required"
                                id="validationCustom08"
                                required
                                value={form.adminEmail}
                                onChange={(e) => {
                                  setForm({
                                    ...form,
                                    adminEmail: e.target.value,
                                  });
                                  setValidationMessages({
                                    ...validationMessages,
                                    adminEmail: e.target.value
                                      ? ""
                                      : "Admin Email is required",
                                  });
                                }}
                                placeholder="Admin Email"
                              />
                              {showValidationMessages &&
                                validationMessages.adminEmail && (
                                  <div
                                    className="fw-bolder"
                                    style={{ color: "red" }}
                                  >
                                    {validationMessages.adminEmail}
                                  </div>
                                )}
                            </div>
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
                              Contact Number
                            </CFormLabel>
                            <div className="col-sm-7">
                              <CFormInput
                                type="number"
                                maxLength={10}
                                minLength={10}
                                onKeyDown={(e) => {
                                  if (e.key === "e" || e.key === "E") {
                                    e.preventDefault();
                                  }
                                }}
                                value={form.userPhoneNumber}
                                onChange={(e) => {
                                  if (e.target.value.length <= 10) {
                                    setForm({
                                      ...form,
                                      userPhoneNumber: e.target.value,
                                    });
                                  }

                                  setValidationMessages({
                                    ...validationMessages,
                                    userPhoneNumber: e.target.value
                                      ? ""
                                      : "Contact Number is required",
                                  });
                                }}
                                placeholder="Contact Number"
                              />
                              {showValidationMessages &&
                                validationMessages.userPhoneNumber && (
                                  <div
                                    className="fw-bolder"
                                    style={{ color: "red" }}
                                  >
                                    {validationMessages.userPhoneNumber}
                                  </div>
                                )}
                            </div>
                          </CRow>
                        </CCol>
                        <CCol md={6}>
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-4 col-form-label fw-bolder fs-7 required"
                            >
                              Address
                            </CFormLabel>
                            <div className="col-sm-7">
                              <CFormInput
                                type="text"
                                value={form.address}
                                onChange={(e) => {
                                  setForm({ ...form, address: e.target.value });

                                  setValidationMessages({
                                    ...validationMessages,
                                    address: e.target.value
                                      ? ""
                                      : "Address is required",
                                  });
                                }}
                                placeholder="Address"
                              />
                              {showValidationMessages &&
                                validationMessages.address && (
                                  <div
                                    className="fw-bolder"
                                    style={{ color: "red" }}
                                  >
                                    {validationMessages.address}
                                  </div>
                                )}
                            </div>
                          </CRow>
                        </CCol>
                      </CRow>
                    </>
                  ) : (
                    <>
                      <CRow className="mb-3">
                        <CCol md={12}>
                          <CRow className="mb-3">
                            <div className="col-sm-12 py-2">
                              {imgData ? (
                                <div>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <>
                                      <img
                                        style={{
                                          objectFit: "contain",
                                          width: "100px",
                                          height: "100px",
                                          marginTop: "10px",
                                        }}
                                        src={imgData}
                                        alt={form.logoText}
                                      />

                                      <span
                                        style={{
                                          fontWeight: "bold",
                                          fontSize: "24px",
                                          marginTop: "10px",
                                        }}
                                        className="py-4 px-2"
                                      >
                                        {form.organizationName}
                                      </span>
                                    </>
                                  </div>
                                  <div className="ms-2">{form.logoText}</div>
                                </div>
                              ) : (
                                <>
                                  <Skeleton
                                    shape="square"
                                    width="100px"
                                    height="100px"
                                    style={{ marginTop: "10px" }}
                                  ></Skeleton>
                                </>
                              )}
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
                              Admin Email ID
                            </CFormLabel>
                            <div className="col-sm-7">
                              {form.adminEmail ? (
                                form.adminEmail
                              ) : (
                                <Skeleton height="30px"></Skeleton>
                              )}
                            </div>
                          </CRow>
                        </CCol>
                        <CCol md={6}>
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-4 col-form-label fw-bolder fs-7"
                            >
                              Contact Number
                            </CFormLabel>
                            <div className="col-sm-7 py-2">
                              {form.userPhoneNumber ? (
                                form.userPhoneNumber
                              ) : (
                                <Skeleton height="30px"></Skeleton>
                              )}
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
                              Address
                            </CFormLabel>
                            <div className="col-sm-7 py-2">
                              {form.address ? (
                                form.address
                              ) : (
                                <Skeleton height="30px"></Skeleton>
                              )}
                            </div>
                          </CRow>
                        </CCol>
                        <CCol md={6}>
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-4 col-form-label fw-bolder fs-7"
                            >
                              Admin User Name
                            </CFormLabel>
                            <div className="col-sm-7">
                              {form.adminUsername ? (
                                form.adminUsername
                              ) : (
                                <Skeleton height="30px"></Skeleton>
                              )}
                            </div>
                          </CRow>
                        </CCol>
                      </CRow>
                    </>
                  )}
                  {editMode && (
                    <div className="d-flex justify-content-end">
                      <CButton
                        className="me-2"
                        color="primary"
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </CButton>
                      <CButton
                        color="primary"
                        onClick={onUpdate}
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
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </div>
    </div>
  );
}

export default CompanySettings;
