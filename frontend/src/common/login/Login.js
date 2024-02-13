import React, { useRef, useEffect, useState } from "react";
import "../../../src/css/fontSize.css";
import "../../../src/css/generic.css";
import { CCard, CCol, CImage, CRow } from "@coreui/react";
import logo from "../login/gif/pencil.gif";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Card } from "primereact/card";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./Loginpage.css";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import SettingTokenService from "src/server/SettingTokenService";
import loginService from "src/server/loginService";
import postApiCall from "src/server/postApiCall";

const API_URL = process.env.REACT_APP_API_URL,
  domainURL = window.location.origin,
  pureDomainURL = domainURL.split("/"),
  urlData = {
    isHttps: pureDomainURL[0] === "http:" ? 0 : 1,
    domainName: pureDomainURL[2],
  };

const LoginPage = () => {
  const navigate = useNavigate();
  const [organizationName, setOrganizationName] = useState("");
  const toast = useRef(null);
  const [butLoading, setBtnLoading] = useState(false);
  const [isLoading, setLoading1] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [logInValue, setLogInValue] = useState({ username: "", password: "" });
  const [logoImg, setLogoImg] = useState("");
  const [organizationLogoText, setOrganizationLogoText] = useState("");
  const userRole = localStorage.getItem("RoleType");

  const handleChangeForm = (event) => {
    const { name, value } = event.target;
    if (event.target.name === "username") {
      setValidationMessages({
        ...validationMessages,
        labelName: event.target.value && "Please Enter Username.",
      });
      setLogInValue({ ...logInValue, [name]: value });
    } else {
      setValidationMessages({
        ...validationMessages,
        labelName: event.target.value ? "" : "Please Enter Password.",
      });
      setLogInValue({ ...logInValue, [name]: value });
    }
  };

  useEffect(() => {
    if (localStorage.getItem("ApiToken") && userRole) {
      switch (userRole) {
        case "role_system_admin":
          navigate("/admin/admindashboard");
          break;
        case "role_user_students":
          navigate("/student/studentdashboard");
          break;
        case "role_super_admin":
          navigate("/superadmin/dashboard");
          break;
        default:
          navigate("/admin/admindashboard");
      }
    }
  }, []);

  useEffect(() => {
    verifyOrganization();
  }, []);

   // Auto-Login with Token from URL
  const autoLogToken = window.location.href.split("?")[1];
  useEffect(() => {
    // Logs in the user automatically if a token is present in the URL.
    if (autoLogToken) {
      localStorage.setItem("ApiToken", autoLogToken);
      navigate("/student/studentdashboard");
    }
  }, [autoLogToken]);

  const verifyOrganization = async () => {
    setBtnLoading(true);
    localStorage.clear();
    try {
      const res = await postApiCall("verifyOrganization", urlData);
      setResponseData(res);
      setLogoImg(res.organizationLogo);
      setOrganizationName(res.organizationName);
      setOrganizationLogoText(res.organizationLogoText);

      if (autoLogToken) {
        localStorage.setItem("UserLogo", res.organizationLogo);
        localStorage.setItem("OrgLogoText", res.organizationLogoText);
      }
      setBtnLoading(false);
    } catch (err) {
      setBtnLoading(true);
    }
  };
  const [validationMessages, setValidationMessages] = useState({});
  const [showValidationMessages, setShowValidationMessages] = useState(false);

  const validateForm = () => {
    const messages = {};
    let isValid = true;

    if (!logInValue.password) {
      messages.password = "Password is required";
      isValid = false;
    }
    if (!logInValue.username) {
      messages.username = "Username is required";
      isValid = false;
    }
    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };
  const [toekens, setTokens] = useState();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const data = {
        username: logInValue.username,
        password: logInValue.password,
        organization: responseData.organizationId,
      };

      setLoading1(true);

      try {
        const res = await loginService("login", data);
        setTokens(res.api_token);
        verifyTokenFunc(res.api_token);
        localStorage.setItem("ApiToken", res.api_token);
      } catch (err) {
        setLoading1(false);
        var errMsg = err?.response?.data?.errors;
        var errMsg1 = err?.response?.data?.error;
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: errMsg || errMsg1,
          life: 3000,
        });
      }
    }
  };

  const verifyTokenFunc = async (token1) => {
    try {
      const res1 = await SettingTokenService("verify_token", token1);
      localStorage.setItem("UserName", res1.firstName);
      localStorage.setItem("RoleName", res1.roleName);
      localStorage.setItem("ApiRoleName", res1.roleName);
      localStorage.setItem("RoleType", res1.roleType);
      localStorage.setItem("OrgId", res1.orgId);
      localStorage.setItem("UserLogo", res1.organizationLogo);
      localStorage.setItem("orgLogoText", res1.orgLogoText);
      localStorage.setItem("logoText", res1.orgLogoText);
      localStorage.setItem("profileImage", res1.userPhoto);
      localStorage.setItem("logoText", res1.orgLogoText);
      setLoading1(false);

      if (res1.roleType === "role_system_admin") {
        navigate("/admin/admindashboard");
      } else if (res1.roleType === "role_super_admin") {
        navigate("/superadmin/dashboard");
      } else if (res1.roleType === "role_user_students") {
        navigate("/student/studentdashboard");
      } else {
        navigate("/admin/admindashboard");
      }
    } catch (err) {
      setLoading1(false);
      var errMsg = err?.response?.data?.errors;
      var errMsg1 = err?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg || errMsg1,
        life: 3000,
      });
    }
  };
  return (
    <div
      className="mainContainer login__container "
      style={{ display: "grid", gridTemplateColumns: " 1.5fr 1fr" }}
    >
      <div style={{ width: "100%", height: "100%" }}>
        <img
          src="/media/background-images/login3.jpg"
          style={{ width: "100%", height: "100%", objectFit: "fill" }}
        />
      </div>
      <Toast ref={toast} />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <div className="">
          {!logoImg ? (
            <div>
              <CCard
                className="card-logo"
                style={{ width: "50%", margin: "0 auto" }}
              >
                <CImage style={{ height: "150px" }} src={logo} />
                <span className="ms-1 fw-bolder">
                  Page Loading...Please Wait
                </span>
              </CCard>
              <h1 style={{ textAlign: "center", padding: ".5rem" }}>
                {organizationLogoText}
              </h1>
            </div>
          ) : (
            <div>
              <CCard className="card-logo" style={{ border: "none" }}>
                <CImage
                  className=""
                  style={{
                    height: "140px",
                    width: "200px",
                    alignSelf: "center",
                  }}
                  src={logoImg}
                  alt={organizationLogoText}
                />
              </CCard>
              <h1 style={{ textAlign: "center", padding: ".5rem" }}>
                {organizationLogoText}
              </h1>
            </div>
          )}
        </div>
        <Toast ref={toast} />
        <div className="form__container" style={{ margin: "0 auto" }}>
          <Card
            title=""
            className="card__shadow"
            // style={{ height: "400px", width: "60%", margin: ".5rem auto 0" }}
          >
            <div className="login__title mb-5">
              <h2>{organizationName}</h2>
            </div>
            <form className="row g-3 needs-validation" onSubmit={handleSubmit}>
              <div className="p-field">
                <span className="p-float-label">
                  <InputText
                    id="username"
                    type="text"
                    name="username"
                    value={logInValue.username}
                    onChange={handleChangeForm}
                  />
                  <label htmlFor="username">Username</label>
                </span>

                {showValidationMessages && validationMessages.username && (
                  <div className="fw-bolder" style={{ color: "red" }}>
                    {validationMessages.username}
                  </div>
                )}
              </div>
              <div className="p-field  i-btn">
                <span className="p-float-label">
                  <Password
                    type="password"
                    name="password"
                    id="password"
                    value={logInValue.password}
                    onChange={handleChangeForm}
                    feedback={false}
                    toggleMask
                  />
                  <label htmlFor="password">Password</label>
                </span>

                {showValidationMessages && validationMessages.password && (
                  <div className="fw-bolder" style={{ color: "red" }}>
                    {validationMessages.password}
                  </div>
                )}
              </div>
              <div className="form__group">
                <Button
                  className="login__button"
                  type="submit"
                  label={isLoading ? "Please Wait..." : "Login"}
                  icon={isLoading ? "pi pi-spin pi-spinner" : ""}
                  disabled={butLoading}
                />
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
