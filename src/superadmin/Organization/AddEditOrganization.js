import React, { useEffect, useState, useRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CRow,
  CFormSelect,
  CFormSwitch,
  CForm,
  CInputGroup,
  CCardFooter,
  CButton,
  CInputGroupText,
} from "@coreui/react";
import { Link, useNavigate } from "react-router-dom";
import { Buffer } from "buffer";
import CreatableSelect from "react-select/creatable";
import "primeicons/primeicons.css";
import "../../scss/required.scss";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import "../../css/themes.css";
import { Tooltip } from "primereact/tooltip";
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";
import generalUpdateApi from "src/server/generalUpdateApi";
import "../../css/form.css";

const AddEditOrganization = () => {
  const domainNameFn = () => {
    if (window.location.href.includes("elitelms.com")) {
      return window.location.href.includes("www")
        ? "." + window.location.href.split(".")[2] + "." + "com"
        : "." + window.location.href.split(".")[1] + "." + "com";
    } else if (window.location.href.includes("elitelms.ml")) {
      return window.location.href.includes("www")
        ? "." + window.location.href.split(".")[2] + "." + "ml"
        : "." + window.location.href.split(".")[1] + "." + "ml";
    } else {
      return ".elitelms.com";
    }
  };

  const prefixNameFn = (data) => {
    if (data.includes("elitelms.com")) {
      return data.includes("www") ? data.split(".")[1] : data.split(".")[0];
    } else if (data.includes("elitelms.ml")) {
      return form.domainName.includes("www")
        ? data.split(".")[1]
        : data.split(".")[0];
    } else {
      data.includes("www") ? data.split(".")[1] : data.split(".")[0];
    }
  };




  const onChangePicture = (e) => {
    const file = e.target.files[0];

    if (
      file &&
      (file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg" ||
        file.type === "image/gif")
    ) {
      setForm({
        ...form,
        organizationLogo: file,
      });

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImgData(reader.result);
      };
    } else {
      alert(
        "The selected file is invalid. Please select a file that is a JPEG, PNG, JPG, or GIF image."
      );
      setImgData(null);
    }
  };

  const toast = useRef(null);
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const isPrimaryList = [
    {
      value: 0,
      label: "Child Organization",
    },
    {
      value: 1,
      label: "Primary Organization",
    },
    {
      value: 2,
      label: "New Organization",
    },
  ];
  const domainTypeList = [
    {
      value: 1,
      label: "Demo",
    },
    {
      value: 2,
      label: "Staging",
    },
    {
      value: 3,
      label: "Testing",
    },
    {
      value: 4,
      label: "Production",
    },
  ];
  // const orgId = window.location.href.split("?")[1];
  const [orgId, setOrgId] = useState();

  let orgId1 = "";
  useEffect(() => {
    orgId1 = localStorage.getItem("organizationId");
    setOrgId(orgId1);
  }, []);

  const navigate = useNavigate(),
    [primaryOrganizationList, setPrimaryOrganizationList] = useState([]),
    [authenticationTypeList, setAuthenticationTypeList] = useState([]),
    [countryList, setCountryList] = useState([]),
    [organizationTypeList, setOrganizationTypeList] = useState([]),
    [orgTypeSelectList, setOrgTypeSelectList] = useState([]),
    [tagList, setTagList] = useState([]),
    [orgDetail, setOrgDetail] = useState(""),
    [isLoading, setIsLoading] = useState(false),
    [validationMessages, setValidationMessages] = useState({}),
    [showValidationMessages, setShowValidationMessages] = useState(false),
    domainName = domainNameFn(),
    [imgData, setImgData] = useState(null),
    [isloading, setLoading1] = useState(false),
    [onSelect, setOnSelect] = useState(false);

  const decodeBase64 = (data) => {
    return new Buffer.from(data, "base64").toString("ascii");
  };

  const [form, setForm] = useState({
    organizationLogo: "",
    logoText: "",
    organizationName: "",
    isPrimary: "1",
    role: "",
    primaryOrganization: "1",
    domainName: "",
    domainType: "",
    adminUsername: "",
    adminPassword: "",
    adminLoginId: "",
    userFirstName: "",
    userLastName: "",
    userEmailId: "",
    userPhoneNumber: "",
    userId: "",
    address: "",
    zipCode: "",
    country: "",
    state: "",
    organizationType: 0,
    organizationTypeName: "",
    organizationNote: "",
    authenticationType: "",
    sessionTimeOut: 0,
    tags: [],
    isActive: "1",
  });
  useEffect(() => {
    if (orgDetail) {
      setForm({
        organizationLogoPreview: orgDetail.organizationLogo,
        organizationLogo: "",
        logoText: orgDetail.logoText,
        organizationName: orgDetail.organizationName,
        isPrimary: orgDetail.isPrimary,
        role: orgDetail.role,
        primaryOrganization: orgDetail.primaryOrganization,
        domainName: domainName
          ? orgDetail.domainName.split(domainName).join("")
          : orgDetail.domainName.split(".elitelms.com").join(""),
        domainType: orgDetail.domainType,
        adminUsername: orgDetail.adminUsername,
        adminPassword: decodeBase64(orgDetail.userPassword),
        adminLoginId: orgDetail.adminLoginId,
        userFirstName: orgDetail.userFirstName,
        userLastName: orgDetail.userLastName,
        userEmailId: orgDetail.userEmailId,
        userPhoneNumber: orgDetail.userPhoneNumber,
        organizationNote: orgDetail.organizationNote,
        userId: orgDetail.userId,
        address: orgDetail.address,
        zipCode: orgDetail.zipCode,
        country: orgDetail.country,
        state: orgDetail.state,
        organizationTypeName: [
          {
            value: parseInt(orgDetail.organizationType),
            label: orgDetail.organizationTypeName,
          },
        ],
        organizationNote: orgDetail.organizationNote,
        tags: orgDetail.tags.map((tag) => ({ value: tag, label: tag })),
        isActive: orgDetail.isActive,
        organizationNote: orgDetail.organizationNote,
        authenticationType: orgDetail.authenticationType,
        sessionTimeOut: orgDetail.sessionTimeOut,
      });
    }
  }, [orgDetail]);
  useEffect(() => {
    if (organizationTypeList) {
      setOrgTypeSelectList(
        organizationTypeList.map((e) => ({
          value: e.organizationTypeId,
          label: e.organizationType,
        }))
      );
    }
  }, [organizationTypeList]);

  const primaryOrganizationListApi = async () => {
    try {
      const res = await getApiCall("getPrimaryOrganizationList");
      setPrimaryOrganizationList(res);
    } catch (err) {
      var errMsg = err?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
    }
  };

  const authenticationTypeListApi = async () => {
    try {
      const res = await getApiCall("getAuthenticationType");
      setAuthenticationTypeList(res);
      console.log(res);
    } catch (err) {
      var errMsg = err?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
    }
  };

  const countryListApi = async () => {
    try {
      const res = await getApiCall("getCountryList");

      const filteredData = res.filter((item) => item.countryId);
      setCountryList(filteredData);
    } catch (err) {
      var errMsg = err?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
    }
  };

  const addOrganizationTypeApi = async (text) => {
    const data = { organizationType: text };
    try {
      const res = await postApiCall("addOrganizationType", data);
      if (res) {
        organizationTypeListApi();
      }
    } catch (err) {
      var errMsg = err?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
    }
  };

  const addTagsApi = async (text) => {
    const data = { tags: [text] };
    try {
      const res = await postApiCall("addTag", data);
      if (res) {
        organizationTypeListApi();
      }
    } catch (err) {
      var errMsg = err?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
    }
  };

  const tagListApi = async () => {
    try {
      const res = await getApiCall("getTagList");
      setTagList(res.map((e) => ({ label: e.tagName, value: e.tagName })));
    } catch (err) {
      var errMsg = err?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
    }
  };

  const organizationTypeListApi = async () => {
    try {
      const res = await getApiCall("getOrganizationType");
      setOrganizationTypeList(res);
    } catch (err) {
      var errMsg = err?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
    }
  };

  const organizationDetailApi = async (id) => {
    setIsLoading(true);
    try {
      const res = await getApiCall("getOrganizationById", id);
      setOrgDetail(res);
      setImgData(res.organizationLogo);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      var errMsg = err?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
    }
  };

  const primeryOrganizationDomainApi = async (id) => {
    const data = { organizationId: id };
    try {
      const res = await postApiCall("getPrimaryOrganizationDomain", data);
      setForm({
        ...form,
        domainName: prefixNameFn(res.domainName),
        primaryOrganization: id,
      });
    } catch (err) {
      var errMsg = err?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
    }
  };

  useEffect(() => {
    if (orgId) {
      organizationDetailApi(Number(orgId));
    }
  }, [orgId]);

  useEffect(() => {
    if (token !== "Bearer null") {
      primaryOrganizationListApi();
      countryListApi();
      organizationTypeListApi();
      authenticationTypeListApi();
      tagListApi();
    }
  }, []);

  const validateForm = () => {
    const messages = {};
    let isValid = true;
    if (!orgId) {
      if (!form.organizationLogo) {
        messages.organizationLogo = "Organization Logo is required";
        isValid = false;
      } else {
        messages.organizationLogo = "";
      }
    }

    if (!form.organizationName) {
      messages.organizationName = "Organization Name is required";
      isValid = false;
    }

    if (!form.isPrimary) {
      messages.isPrimary = "Is Primary is required";
      isValid = false;
    }

    if (!form.domainName) {
      messages.domainName = "Domain Name is required";
      isValid = false;
    }

    if (!form.domainType) {
      messages.domainType = "Domain Type is required";
      isValid = false;
    }

    if (!form.adminUsername) {
      messages.adminUsername = "Admin User Name is required";
      isValid = false;
    }

    if (!form.adminPassword) {
      messages.adminPassword = "Admin Password is required";
      isValid = false;
    }

    if (!form.userFirstName || !form.userLastName) {
      messages.fullName = "Full Name is required";
      isValid = false;
    } else {
      messages.fullName = "";
    }

    if (!form.organizationTypeName) {
      messages.organizationTypeName = "Organization Type is required";
      isValid = false;
    }
    if (form.isPrimary === "0") {
      if (!form.primaryOrganization) {
        messages.primaryOrganization = "Primary organization is required";
        isValid = false;
      }
    }

    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };

  useEffect(() => {
    setForm({ ...form, primaryOrganization: "" });
    setForm({
      ...form,
      organizationName: "",
    });
  }, [onSelect]);

  const handleSave = async (e) => {
    e.preventDefault();

    // Validate the form input fields
    if (validateForm()) {
      // Create a new instance of FormData and append the form data to it
      const formData = new FormData();
      formData.append("organizationId", orgDetail.organizationId);
      formData.append(
        "organizationLogo",
        form.organizationLogo === undefined ? "" : form.organizationLogo
      );
      formData.append("logoText", form.logoText);
      formData.append("organizationName", form.organizationName);
      formData.append("isPrimary", form.isPrimary);
      formData.append("role", form.role == 1 ? 1 : 2);
      formData.append("primaryOrganization", form.primaryOrganization);
      formData.append(
        "domainName",
        form.domainName +
        (form.isPrimary == 2 ? "" : domainName ? domainName : ".elitelms.com")
      );
      formData.append("domainType", form.domainType);
      formData.append("adminUsername", form.adminUsername);
      formData.append("adminPassword", form.adminPassword);
      formData.append("adminLoginId", form.adminLoginId);
      formData.append("userFirstName", form.userFirstName);
      formData.append("userLastName", form.userLastName);
      formData.append("userEmailId", form.userEmailId);
      formData.append("userPhoneNumber", form.userPhoneNumber);
      formData.append("userId", form.userId);
      formData.append("address", form.address);
      formData.append("zipCode", form.zipCode);
      formData.append("country", form.country);
      formData.append("state", form.state);
      formData.append(
        "organizationType",
        form.organizationTypeName.value || orgDetail.organizationType
      );
      const tagValues = form.tags.map((tag) => tag.value);
      formData.append("tags", tagValues);
      formData.append("organizationNote", form.organizationNote);
      formData.append("authenticationType", form.authenticationType);
      formData.append("sessionTimeOut", form.sessionTimeOut);
      formData.append("isActive", form.isActive);
      setLoading1(true);

      try {
        const res = await generalUpdateApi("updateOrganizationById", formData);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Organization Updated Successfully",
          life: 3000,
        });
        setTimeout(() => {
          if (form.isActive == "2") {
            navigate("/superadmin/inactiveorganizationlist");
          } else navigate("/superadmin/organizationlist");
        }, 3000);
      } catch (err) {
        setLoading1(false);
        var errMsg = err?.response?.data?.error;
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: errMsg,
          life: 3000,
        });
      }
    }
  };

  const handleSave2 = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const formData = new FormData();
      formData.append("organizationLogo", form.organizationLogo || "");
      formData.append("logoText", form.logoText);
      formData.append("organizationName", form.organizationName);
      formData.append("isPrimary", form.isPrimary);
      formData.append("role", form.role == 1 ? 1 : 2);

      if (form.isPrimary === "0") {
        formData.append("primaryOrganization", form.primaryOrganization);
      }

      formData.append(
        "domainName",
        form.domainName +
        (form.isPrimary == 2 ? "" : domainName ? domainName : ".elitelms.com")
      );
      console.log(domainName);

      formData.append("domainType", form.domainType);
      formData.append("adminUsername", form.adminUsername);
      formData.append("adminPassword", form.adminPassword);
      formData.append("adminLoginId", form.adminLoginId);
      formData.append("userFirstName", form.userFirstName);
      formData.append("userLastName", form.userLastName);
      formData.append("userEmailId", form.userEmailId);
      formData.append("userPhoneNumber", form.userPhoneNumber);
      formData.append("userId", form.userId);
      formData.append("address", form.address);
      formData.append("zipCode", form.zipCode);
      formData.append("country", form.country);
      formData.append("state", form.state);
      formData.append(
        "organizationType",
        form.organizationTypeName.value || ""
      );
      const tagValues = form.tags.map((tag) => tag.value);
      formData.append("tags", tagValues);
      formData.append("organizationNote", form.organizationNote);
      formData.append("authenticationType", form.authenticationType);
      formData.append("sessionTimeOut", form.sessionTimeOut);
      formData.append("isActive", form.isActive);
      setLoading1(true);

      try {
        const res = await postApiCall("addNewCompany", formData);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Organization Added Successfully",
          life: 2000,
        });
        setLoading1(false);
        localStorage.removeItem("organizationId");

        setTimeout(() => {
          navigate("/superadmin/organizationlist");
        }, 2000);
      } catch (err) {
        console.log({ err });
        setLoading1(false);
        var errMsg = err?.response?.data?.errors;

        if (errMsg[0] === "The user email id format is invalid." &&
          errMsg[1] === "The admin password must be at least 8 characters.") {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: <div>
              <div>{errMsg[0]}</div>
              <div>{errMsg[1]}</div></div>,
            life: 3000,
          });
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: errMsg,
            life: 3000,
          });
        }
        console.log({ errMsg });

      }
    }
  };

  const handleCreateOrgType = (value) => {
    setForm({
      ...form,
      organizationTypeName: [
        {
          value: value,
          label: value,
        },
      ],
    });
    addOrganizationTypeApi(value);
  };

  const handleCreateTag = (value) => {
    const tagValues = form.tags.map((tag) => tag.value);
    tagValues.push(value);
    console.log("tagValues:", tagValues);
    setForm({
      ...form,
      tags: tagValues.map((tag) => ({ value: tag, label: tag })),
    });
    addTagsApi(value);
  };

  const handleChangeType = (value) => {
    setForm({ ...form, organizationTypeName: value });
  };

  const handleChangeTags = (value) => {
    setForm({ ...form, tags: value });
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
  const colorName = localStorage.getItem("ThemeColor");

  const [themes] = useState(colorName);

  return (
    <div className="container">
      <div className="container-fluid">
        <CForm className={`row g-15 needs-validation InputThemeColor${themes}`}>
          <CCol xs={12} style={{ padding: "1px" }}>
            <CCard className="mb-4 card-ric">
              <Toast ref={toast}></Toast>
              <CCardHeader className={`formHeader${themes} fs-14`}>
                <strong>Organization</strong>
              </CCardHeader>
              {isLoading ? (
                <CCardBody className="card-body border-top p-9">
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
                  {form.isPrimary === "0" && (
                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-4 col-form-label fw-bolder fs-7"
                          >
                            <Skeleton width="85%" className="mr-2"></Skeleton>
                          </CFormLabel>
                          <div className="col-sm-7  py-2">
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
                  )}

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
                          className="col-sm-4 col-form-label fw-bolder"
                        >
                          <Skeleton width="85%" className="mr-2"></Skeleton>
                        </CFormLabel>
                        <div className="col-sm-7">
                          <Skeleton width="97%"></Skeleton>
                        </div>
                      </CRow>
                    </CCol>
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7 "
                        >
                          <Skeleton width="85%" className="mr-2"></Skeleton>
                        </CFormLabel>
                        <div className="col-sm-7">
                          <Skeleton width="97%"></Skeleton>
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    {form.isPrimary === "1" && (
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
                    )}
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className={
                            form.isPrimary === 1
                              ? "col-sm-4 col-form-label fw-bolder fs-7"
                              : "col-sm-4 col-form-label fw-bolder"
                          }
                        >
                          <Skeleton width="85%" className="mr-2"></Skeleton>
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          <Skeleton width="97%"></Skeleton>
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>
                </CCardBody>
              ) : (
                <CCardBody className="card-body org border-top p-9">
                  <CRow className="mb-1">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7 required"
                        >
                          Organization Logo
                        </CFormLabel>
                        <div className="col-sm-7" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CFormInput
                              type="file"
                              accept=".png, .jpeg, .jpg, .gif"
                              onChange={(e) => {
                                const selectedFile = e.target.files[0];
                                setForm({ ...form, selectedFile }); // store the selected file in the form state
                                setValidationMessages({
                                  ...validationMessages,
                                  organizationLogo: selectedFile ? "" : "Organization Logo is required",
                                });
                                onChangePicture(e);
                              }}
                              id="validationCustom01"
                              required
                            />
                            <div style={{ flexShrink: 0 }}>
                              <i
                                className="custom-choose-btn2"
                                data-pr-tooltip={`File type supported PNG, JPEG, JPG, GIF`}
                                data-pr-position="right"
                                data-pr-at="right-5 top"
                                data-pr-my="left center-2"
                                style={{
                                  fontSize: ".4rem",
                                  cursor: "pointer",
                                }}
                              >
                                <img src="/media/icon/gen045.svg" alt="Choose Logo" />
                              </i>
                              <Tooltip
                                target=".custom-choose-btn2"
                                content="Tooltip for Organization Logo"
                                position="bottom"
                              ></Tooltip>
                            </div>
                          </div>
                          {/* Display selected file name */}
                          {form.selectedFile && (
                            <div style={{ marginRight: '15px' }}>
                              {form.selectedFile.name}
                            </div>
                          )}
                          {showValidationMessages && validationMessages.organizationLogo && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.organizationLogo}
                            </div>
                          )}
                          {imgData && (
                            <img
                              style={{
                                objectFit: "contain",
                                width: "300px",
                                height: "200px",
                                marginTop: "0px",
                                marginLeft: "10%",
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
                          className="col-sm-4 col-form-label fw-bolder fs-7 "
                        >
                          Logo Text
                        </CFormLabel>
                        <div className="col-sm-7">
                          <CFormInput
                            type="text"
                            id="validationCustom02"
                            required
                            value={form.logoText}
                            onChange={(e) => {
                              setForm({ ...form, logoText: e.target.value });
                            }}
                            placeholder="Logo Text"
                          />
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>

                  <CRow className="mb-1">
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
                          Is Primary
                        </CFormLabel>
                        <div className="col-sm-7">
                          <CFormSelect
                            feedbackInvalid="Is Primary is required"
                            id="validationCustom04"
                            required
                            value={form.isPrimary}
                            disabled={orgId ? true : false}
                            onChange={(e) => {
                              setOnSelect(!onSelect);
                              setForm({ ...form, isPrimary: e.target.value });
                              setValidationMessages({
                                ...validationMessages,
                                isPrimary: e.target.value
                                  ? ""
                                  : "Is Primary is required",
                              });
                            }}
                            aria-label="select example"
                          >
                            {isPrimaryList.map((e) => (
                              <option key={e.value} value={e.value}>
                                {e.label}
                              </option>
                            ))}
                          </CFormSelect>
                          {showValidationMessages &&
                            validationMessages.isPrimary && (
                              <div
                                className="fw-bolder"
                                style={{ color: "red" }}
                              >
                                {validationMessages.isPrimary}
                              </div>
                            )}
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>
                  {form.isPrimary === "0" ? (
                    <div>
                      <CRow className="mb-1">
                        <CCol md={6}>
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-4 col-form-label fw-bolder fs-7 required"
                            >
                              Primary Organization
                            </CFormLabel>
                            <div className="col-sm-7">
                              <CFormSelect
                                feedbackInvalid="Primary Organization is required"
                                id="validationCustom05"
                                required
                                value={form.primaryOrganization}
                                onChange={(f) => {
                                  primeryOrganizationDomainApi(f.target.value);
                                }}
                                aria-label="select example"
                              >
                                <option disabled value={""}>
                                  Select
                                </option>
                                {primaryOrganizationList.map((e) => (
                                  <option key={e.orgId} value={e.orgId}>
                                    {e.organizationName}
                                  </option>
                                ))}
                              </CFormSelect>
                            </div>
                          </CRow>
                        </CCol>
                        <CCol md={6}>
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-4 col-form-label fw-bolder fs-7"
                            >
                              Note
                            </CFormLabel>
                            <div className="col-sm-7">
                              <CFormInput
                                type="text"
                                id="validationCustom06"
                                value={form.organizationNote}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    organizationNote: e.target.value,
                                  })
                                }
                                placeholder="Note"
                                required
                              />
                            </div>
                          </CRow>
                        </CCol>
                      </CRow>
                      <CRow className="mb-1">
                        <CCol md={6}>
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-4 col-form-label fw-bolder fs-7 required"
                            >
                              Domain Name
                            </CFormLabel>
                            <div className="col-sm-7">
                              <CInputGroup>
                                <CFormInput
                                  type="text"
                                  feedbackInvalid="Domain Name is required"
                                  id="validationCustom06"
                                  required
                                  disabled={form.isPrimary === "0"}
                                  value={form.domainName}
                                  onChange={(e) => {
                                    setForm({
                                      ...form,
                                      domainName: e.target.value,
                                    });
                                    setValidationMessages({
                                      ...validationMessages,
                                      domainName: e.target.value
                                        ? ""
                                        : "Domain Name is required",
                                    });
                                  }}
                                  placeholder="Domain Name"
                                />

                                <CInputGroupText>
                                  {domainName ? domainName : ".elitelms.com"}
                                </CInputGroupText>
                              </CInputGroup>
                              {showValidationMessages &&
                                validationMessages.domainName && (
                                  <div
                                    className="fw-bolder"
                                    style={{ color: "red" }}
                                  >
                                    {validationMessages.domainName}
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
                              Domain Type
                            </CFormLabel>
                            <div className="col-sm-7">
                              <CFormSelect
                                type="text"
                                feedbackInvalid="Domain Type is required"
                                id="validationCustom07"
                                required
                                value={form.domainType}
                                onChange={(f) => {
                                  setForm({
                                    ...form,
                                    domainType: f.target.value,
                                  });
                                  setValidationMessages({
                                    ...validationMessages,
                                    domainType: f.target.value
                                      ? ""
                                      : "Domain Type is required",
                                  });
                                }}
                                aria-label="select example"
                              >
                                <option disabled value={""}>
                                  Select
                                </option>
                                {domainTypeList.map((e) => (
                                  <option key={e.value} value={e.value}>
                                    {e.label}
                                  </option>
                                ))}
                              </CFormSelect>
                              {showValidationMessages &&
                                validationMessages.domainType && (
                                  <div
                                    className="fw-bolder"
                                    style={{ color: "red" }}
                                  >
                                    {validationMessages.domainType}
                                  </div>
                                )}
                            </div>
                          </CRow>
                        </CCol>
                      </CRow>
                    </div>
                  ) : form.isPrimary === "1" ? (
                    <div>
                      <CRow className="mb-1">
                        <CCol md={6}>
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-4 col-form-label fw-bolder fs-7 required"
                            >
                              Domain Name
                            </CFormLabel>
                            <div className="col-sm-7">
                              <CInputGroup>
                                <CFormInput
                                  type="text"
                                  feedbackInvalid="Domain Name is required"
                                  id="validationCustom06"
                                  required
                                  value={form.domainName}
                                  onChange={(e) => {
                                    setForm({
                                      ...form,
                                      domainName: e.target.value,
                                    });
                                    setValidationMessages({
                                      ...validationMessages,
                                      domainName: e.target.value
                                        ? ""
                                        : "Domain Name is required",
                                    });
                                  }}
                                  placeholder="Domain Name"
                                />

                                <CInputGroupText>
                                  {domainName ? domainName : ".elitelms.com"}
                                </CInputGroupText>
                              </CInputGroup>
                              {showValidationMessages &&
                                validationMessages.domainName && (
                                  <div
                                    className="fw-bolder"
                                    style={{ color: "red" }}
                                  >
                                    {validationMessages.domainName}
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
                              Domain Type
                            </CFormLabel>
                            <div className="col-sm-7">
                              <CFormSelect
                                type="text"
                                feedbackInvalid="Domain Type is required"
                                id="validationCustom07"
                                required
                                value={form.domainType}
                                onChange={(f) => {
                                  setForm({
                                    ...form,
                                    domainType: f.target.value,
                                  });
                                  setValidationMessages({
                                    ...validationMessages,
                                    domainType: f.target.value
                                      ? ""
                                      : "Domain Type is required",
                                  });
                                }}
                                aria-label="select example"
                              >
                                <option disabled value={""}>
                                  Select
                                </option>
                                {domainTypeList.map((e) => (
                                  <option key={e.value} value={e.value}>
                                    {e.label}
                                  </option>
                                ))}
                              </CFormSelect>
                              {showValidationMessages &&
                                validationMessages.domainType && (
                                  <div
                                    className="fw-bolder"
                                    style={{ color: "red" }}
                                  >
                                    {validationMessages.domainType}
                                  </div>
                                )}
                            </div>
                          </CRow>
                        </CCol>
                      </CRow>
                    </div>
                  ) : (
                    <div>
                      <CRow className="mb-1">
                        <CCol md={6}>
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-4 col-form-label fw-bolder fs-7 required"
                            >
                              Domain Name
                            </CFormLabel>
                            <div className="col-sm-7">
                              <CInputGroup>
                                <CFormInput
                                  type="text"
                                  feedbackInvalid="Domain Name is required"
                                  id="validationCustom06"
                                  required
                                  value={form.domainName}
                                  onChange={(e) => {
                                    setForm({
                                      ...form,
                                      domainName: e.target.value,
                                    });
                                    setValidationMessages({
                                      ...validationMessages,
                                      domainName: e.target.value
                                        ? ""
                                        : "Domain Name is required",
                                    });
                                  }}
                                  placeholder="Domain Name"
                                />
                              </CInputGroup>
                              {showValidationMessages &&
                                validationMessages.domainName && (
                                  <div
                                    className="fw-bolder"
                                    style={{ color: "red" }}
                                  >
                                    {validationMessages.domainName}
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
                              Domain Type
                            </CFormLabel>
                            <div className="col-sm-7">
                              <CFormSelect
                                type="text"
                                feedbackInvalid="Domain Type is required"
                                id="validationCustom07"
                                required
                                value={form.domainType}
                                onChange={(f) => {
                                  setForm({
                                    ...form,
                                    domainType: f.target.value,
                                  });
                                  setValidationMessages({
                                    ...validationMessages,
                                    domainType: f.target.value
                                      ? ""
                                      : "Domain Type is required",
                                  });
                                }}
                                aria-label="select example"
                              >
                                <option disabled value={""}>
                                  Select
                                </option>
                                {domainTypeList.map((e) => (
                                  <option key={e.value} value={e.value}>
                                    {e.label}
                                  </option>
                                ))}
                              </CFormSelect>
                              {showValidationMessages &&
                                validationMessages.domainType && (
                                  <div
                                    className="fw-bolder"
                                    style={{ color: "red" }}
                                  >
                                    {validationMessages.domainType}
                                  </div>
                                )}
                            </div>
                          </CRow>
                        </CCol>
                      </CRow>
                    </div>
                  )}

                  <CRow className="mb-1">
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
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7 required"
                        >
                          Full Name
                        </CFormLabel>
                        <div className="col-sm-7">
                          <CInputGroup>
                            <CFormInput
                              aria-label="First name"
                              placeholder="First Name"
                              value={form.userFirstName}
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  userFirstName: e.target.value,
                                });
                                setValidationMessages({
                                  ...validationMessages,
                                  fullName: e.target.value
                                    ? ""
                                    : "First name is required",
                                });
                              }}
                              id="validationCustom11"
                              required
                            />
                            <CFormInput
                              aria-label="Last name"
                              placeholder="Last Name"
                              value={form.userLastName}
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  userLastName: e.target.value,
                                });
                                setValidationMessages({
                                  ...validationMessages,
                                  fullName: e.target.value
                                    ? ""
                                    : "Last Name is required",
                                });
                              }}
                              feedbackInvalid="Full Name is required"
                              id="validationCustom11"
                              required
                            />
                          </CInputGroup>
                          {showValidationMessages &&
                            validationMessages.fullName && (
                              <div
                                className="fw-bolder"
                                style={{ color: "red" }}
                              >
                                {validationMessages.fullName}
                              </div>
                            )}
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>

                  <CRow className="mb-1">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7 required"
                        >
                          Admin Password
                        </CFormLabel>
                        <div className="col-sm-7" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
                          <div>
                            <i
                              className="custom-choose-btn2"
                              data-pr-tooltip={`The admin password must be at least 8 characters.`}
                              data-pr-position="right"
                              data-pr-at="right+5 top"
                              data-pr-my="left center-2"
                              style={{
                                fontSize: ".4rem",
                                cursor: "pointer",
                              }}
                            >
                              <img src="/media/icon/gen045.svg" />
                            </i>
                            <Tooltip
                              target=".custom-choose-btn2"
                              content="The admin password must be at least 8 characters."
                              position="bottom"
                            ></Tooltip>
                          </div>

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
                          className="col-sm-4 col-form-label fw-bolder fs-7"
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
                            }}
                            placeholder="Contact Number"
                          />
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>

                  <CRow className="mb-1">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          User Email Id
                        </CFormLabel>
                        <div className="col-sm-7">
                          <CFormInput
                            type="email"
                            value={form.userEmailId}
                            onChange={(e) => {
                              setForm({ ...form, userEmailId: e.target.value });
                            }}
                            placeholder="User Email Id"
                            validated={true}
                          />
                        </div>
                      </CRow>
                    </CCol>
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          Zip Code
                        </CFormLabel>
                        <div className="col-sm-7">
                          <CFormInput
                            type="number"
                            onKeyDown={(e) => {
                              if (e.key === "e" || e.key === "E") {
                                e.preventDefault();
                              }
                            }}
                            value={form.zipCode}
                            min={100000}
                            max={999999}
                            onChange={(e) => {
                              if (e.target.value.length <= 6) {
                                setForm({ ...form, zipCode: e.target.value });
                              }
                            }}
                            placeholder="Zip Code"
                          />
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>

                  <CRow className="mb-1">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          Address
                        </CFormLabel>
                        <div className="col-sm-7">
                          <CFormInput
                            type="text"
                            value={form.address}
                            onChange={(e) =>
                              setForm({ ...form, address: e.target.value })
                            }
                            placeholder="Address"
                          />
                        </div>
                      </CRow>
                    </CCol>
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          State
                        </CFormLabel>
                        <div className="col-sm-7">
                          <CFormInput
                            type="text"
                            value={form.state}
                            onChange={(e) =>
                              setForm({ ...form, state: e.target.value })
                            }
                            placeholder="State"
                          />
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>

                  <CRow className="mb-1">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          Country
                        </CFormLabel>
                        <div className="col-sm-7">
                          <CFormSelect
                            value={form.country}
                            onChange={(f) =>
                              setForm({ ...form, country: f.target.value })
                            }
                            aria-label="select example"
                          >
                            <option disabled value="">
                              Select
                            </option>
                            {countryList.map((e) => (
                              <option key={e.countryId} value={e.countryId}>
                                {e.country}
                              </option>
                            ))}
                          </CFormSelect>
                        </div>
                      </CRow>
                    </CCol>
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7 "
                        >
                          Tags
                        </CFormLabel>
                        <div className="col-sm-7">
                          <CreatableSelect
                            isClearable
                            isMulti
                            options={tagList}
                            value={form.tags}
                            onCreateOption={handleCreateTag}
                            onChange={(e) => handleChangeTags(e)}
                            feedbackInvalid="Tags is required"
                            id="validationCustom12"
                            required
                          />
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>

                  <CRow className="mb-1">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder required"
                        >
                          Organization Type
                        </CFormLabel>
                        <div className="col-sm-7">
                          <CreatableSelect
                            id="validationCustom13"
                            feedbackInvalid="OrganizationType is required"
                            isClearable
                            required
                            options={orgTypeSelectList}
                            value={form.organizationTypeName}
                            onCreateOption={handleCreateOrgType}
                            onChange={(e) => handleChangeType(e)}
                          />
                          {showValidationMessages &&
                            validationMessages.organizationTypeName &&
                            !form.organizationTypeName && (
                              <div
                                className="fw-bolder"
                                style={{ color: "red" }}
                              >
                                {validationMessages.organizationTypeName}
                              </div>
                            )}
                        </div>
                      </CRow>
                    </CCol>
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7 "
                        >
                          Session Time Out (minutes)
                        </CFormLabel>
                        <div className="col-sm-7">
                              <CInputGroup>
                                {/* <CInputGroupText>
                                  Hours And Minutes
                                </CInputGroupText> */}
                                {/* <CFormInput
                                  type="number"
                                  onKeyDown={(e) => {
                                    if (e.key === "e" || e.key === "E") {
                                      e.preventDefault();
                                    }
                                  }}
                                  value={form.hours}
                                  aria-label="Hours"
                                  onChange={(e) => {
                                    setForm({
                                      ...form,
                                      hours: e.target.value,
                                    });
                                  }}
                                /> */}
                                <CFormInput
                                  type="number"
                                  onKeyDown={(e) => {
                                    if (e.key === "e" || e.key === "E") {
                                      e.preventDefault();
                                    }
                                  }}
                                  value={form.sessionTimeOut}
                                  aria-label="Minutes"
                                  min="1"
                                  max="60"
                                  onChange={(e) => {
                                    if (e.target.value > 60) {
                                      e.target.value = 0;
                                    }
                                    setForm({
                                      ...form,
                                      sessionTimeOut: e.target.value,
                                    });
                                  }}
                                />
                              </CInputGroup>
                            </div>
                      </CRow>
                    </CCol>
                  </CRow>

                  <CRow className="mb-1">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder"
                        >
                          Authentication Type
                        </CFormLabel>
                        <div className="col-sm-7">
                          <CFormSelect
                            feedbackInvalid="Authentication Type is required"
                            id="validationCustom09"
                            value={form.authenticationType}
                            onChange={(f) => {
                              setForm({
                                ...form,
                                authenticationType: f.target.value,
                              });
                            }}
                            aria-label="select example"
                          >
                            <option disabled value={""}>
                              Select
                            </option>
                            {authenticationTypeList.map((e) => (
                              <option key={e.id} value={e.id}>
                                {e.authenticationType}
                              </option>
                            ))}
                          </CFormSelect>
                        </div>
                      </CRow>
                    </CCol>
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className={
                            form.isPrimary === 1
                              ? "col-sm-4 col-form-label fw-bolder fs-7"
                              : "col-sm-4 col-form-label fw-bolder"
                          }
                        >
                          Status
                        </CFormLabel>
                        <div className={`col-sm-7 themeColors${themes}`}>
                          <CFormSwitch
                            size="xl"
                            feedbackInvalid="Status is required"
                            id="validationCustom14"
                            required
                            checked={form.isActive === "1" ? true : false}
                            onChange={(e) =>
                              e.target.checked
                                ? setForm({ ...form, isActive: "1" })
                                : setForm({ ...form, isActive: "2" })
                            }
                          />
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>

                  <CRow className="mb-1">
                    {form.isPrimary === "1" && (
                      <CCol md={6}>
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-4 col-form-label fw-bolder"
                          >
                            Note
                          </CFormLabel>
                          <div className="col-sm-7">
                            <CFormInput
                              type="text"
                              value={form.organizationNote}
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  organizationNote: e.target.value,
                                })
                              }
                              placeholder="Note"
                            />
                          </div>
                        </CRow>
                      </CCol>
                    )}
                  </CRow>
                </CCardBody>
              )}
              <CCardFooter>
                <div className="d-flex justify-content-end">
                  {orgDetail ? (
                    <>
                      <Link
                        to="/superadmin/organizationlist"
                        // className="btn btn-primary"
                        className={`btn btn-primary me-2 saveButtonTheme${themes}`}
                        onClick={() => {
                          localStorage.removeItem("organizationId");
                        }}
                      >
                        Back
                      </Link>
                      <CButton
                        type="submit"
                        style={{ backgroundColor: `#212529 !important` }}
                        className={`me-2 themeColor${themes}`}
                        onClick={(e) => {
                          handleSave(e);
                          localStorage.removeItem("organizationId");
                        }}
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
                    </>
                  ) : (
                    <>
                      <Link
                        to="/superadmin/organizationlist"
                        // className="btn btn-primary"
                        className={`btn btn-primary me-2 saveButtonTheme${themes}`}
                        onClick={() => {
                          localStorage.removeItem("organizationId");
                        }}
                      >
                        Back
                      </Link>
                      <CButton
                        //style={{ backgroundColor: `#212529 !important` }}
                        type="submit"
                        className={`me-2 themeColor${themes}`}
                        onClick={(e) => {
                          handleSave2(e);
                          localStorage.removeItem("organizationId");
                        }}
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
                    </>
                  )}
                </div>
              </CCardFooter>
            </CCard>
          </CCol>
        </CForm>
      </div>
    </div>
  );
};
export default AddEditOrganization;
