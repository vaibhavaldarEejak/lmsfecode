import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CRow,
  CFormSelect,
  CForm,
  CInputGroup,
  CCardFooter,
  CButton,
} from "@coreui/react";
import { Link, useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import "../../scss/required.scss";
import { Buffer } from "buffer";
import "primeicons/primeicons.css";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import getApiCall from "src/server/getApiCall";
import getApiForOptionalPayload from "src/server/getApiForOptionalPayload";
import generalUpdateApi from "src/server/generalUpdateApi";
import { Tooltip } from "primereact/tooltip";
import "../../css/form.css";

const Updateuser = () => {
  const toast = useRef(null),
    token = "Bearer " + localStorage.getItem("ApiToken"),
    navigate = useNavigate(),
    [isloading, setLoading1] = useState(false),
    // orgId = window.location.href.split("?")[1],
    [roleList, setRoleList] = useState([]),
    [JobTitleList, setjobTitleList] = useState([]),
    [supervisorList, setSupervisorList] = useState([]),
    [divisionlist, setDivisiontlist] = useState([]),
    [imgData, setImgData] = useState(null),
    [newJobTitles, setNewJobTitles] = useState([]),
    [newDivision, setNewDivision] = useState([]),
    [newAreas, setNewAreas] = useState([]),
    [division, setDivision] = useState([]),
    [location, setLocation] = useState([]),
    [locationList, setLocationList] = useState([]),
    [cat, setCat] = useState([]),
    [arealist, setArealist] = useState([]),
    [area, setArea] = useState([]),
    [newLocations, setNewLocations] = useState([]),
    [organizationList, setOrganizationList] = useState([]),
    [userDetail, setUserDetail] = useState(""),
    // userId = window.location.href.split("?")[1],
    [validationMessages, setValidationMessages] = useState({}),
    [showValidationMessages, setShowValidationMessages] = useState(false),
    [passwordShown, setPasswordShown] = useState("password"),
    [displayUserName, setdisplayUserName] = useState(),
    [displayEmailError, setdisplayEmailError] = useState(),
    [showError, setshowError] = useState(false),
    [newCustomField, setNewCustomField] = useState(),
    [certImg, setCertImg] = useState(),
    [userPhoto, setUserPhoto] = useState(""),
    [form, setForm] = useState({
      role: "",
      organizationId: "",
      firstName: "",
      lastName: "",
      jobTitle: [],
      emailAddress: null,
      barcode: "",
      phoneNumber: "",
      isSupervisor: "",
      isSupervisorName: "",
      division: [],
      location: [],
      area: [],
      userPhoto: "",
      userName: "",
      password: "",
      userId: 0,
      isActive: 1,
      customFields: "",
      customField: "",
    });
  const decodeBase64 = (data = "") => {
    const decodedBuffer = Buffer.from(data, "base64");
    const decodedStr = decodedBuffer.toString("utf-8");
    return decodedStr;
  };

  let orgId = "";
  useEffect(() => {
    orgId = localStorage.getItem("userId");
  }, []);

  let userId = "";
  useEffect(() => {
    userId = localStorage.getItem("userId");
  }, []);
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
      isSupervisor: userDetail.isSupervisor,
      supervisorName: userDetail.supervisorName,
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
      password: decodeBase64(userDetail.userPassword),
      userId: userDetail.userId,
      isActive: userDetail.isActive,
      customFields: userDetail.customFields,
    });
  }, [userDetail, cat, division]);

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

  useEffect(() => {
    roleListApi();
    JobListApi();
    DivisionListApi();
    locationlistApi();
    organizationListApi();
    AreaListApi();
    supervisorListApi();

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
      const response = await getApiCall("getUserById", id);
      setUserDetail(response);
      setCat(
        res.jobTitle.map((item) => ({
          value: item.jobTitleId,
          label: item.jobTitleName,
        }))
      );

      setDivision(
        res.division.map((item) => ({
          value: item.divisionId,
          label: item.divisionName,
        }))
      );

      setLocation(
        res.location.map((item) => ({
          value: item.locationId,
          label: item.locationName,
        }))
      );

      setArea(
        res.area.map((item) => ({
          value: item.areaId,
          label: item.areaName,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const JobListApi = async () => {
    try {
      const response = await getApiForOptionalPayload(
        "/getJobTitleList/?orgId=",
        (orgId != " ") & orgId
      );
      setjobTitleList(
        response.map((e) => ({
          label: e.jobTitleName,
          value: e.jobTitleId,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreatejobTitle = (value) => {
    setNewJobTitles((prevJobTitles) => [...prevJobTitles, value]);
  };

  const handleChangejobTitles = (value) => {
    setForm({ ...form, jobTitle: value });
  };

  //Division ADD/LIST api section
  const DivisionListApi = async () => {
    try {
      const response = await getApiCall("getDivisionList/?orgId=", orgId);
      setDivisiontlist(
        response.map((e) => ({
          value: e.divisionId,
          label: e.divisionName,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreatedivison = (value) => {
    setNewDivision((prevDivision) => [...prevDivision, value]);
  };

  const handleChangedivision = (value) => {
    setForm({ ...form, division: value });
  };

  //Location ADD/List API sections
  const handleCreatelocation = (value) => {
    setNewLocations((prevLocations) => [...prevLocations, value]);
  };
  const handleChangelocation = (value) => {
    setForm({ ...form, location: value });
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

  const locationlistApi = async () => {
    try {
      const res = await getApiCall("getLocationList/?orgId=", orgId);
      setLocationList(
        res.map((e) => ({
          value: e.locationId,
          label: e.locationName,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  //Area ADD/LIST api section
  const AreaListApi = async () => {
    try {
      const response = await getApiCall("getAreaList/?orgId=", orgId);
      setArealist(
        response.map((e) => ({
          value: e.areaId,
          label: e.areaName,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreatearea = (value) => {
    setNewAreas((prevAreas) => [...prevAreas, value]);
  };

  const handleChangearea = (value) => {
    setForm({ ...form, area: value });
  };

  const updateUser = async (data) => {
    setLoading1(true);
    try {
      const response = await generalUpdateApi("updateUser", data);
      setLoading1(false);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "User Updated Successfully",
        life: 3000,
      });
      setTimeout(() => {
        navigate("/admin/userlist");
      }, 3000);
      localStorage.removeItem("userId");
    } catch (errors) {
      let errorMessage = "An error occurred"; // Default error message
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
  const validateForm = () => {
    const messages = {};
    let isValid = true;

    if (!form.firstName) {
      messages.firstName = "First Name is required";
      isValid = false;
    } else {
      messages.firstName = "";
    }

    if (!form.lastName) {
      messages.lastName = "Last Name is required";
      isValid = false;
    }

    if (!form.organizationId) {
      messages.organizationId = "Company is required";
      isValid = false;
    }

    if (!form.userName) {
      messages.userName = "User Name is required";
      isValid = false;
    }

    if (!form.password) {
      messages.password = "Password is required";
      isValid = false;
    }

    if (!form.role) {
      messages.role = "User Role is required";
      isValid = false;
    }

    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };

  const handleSave2 = (e) => {
    e.preventDefault();
    if (validateForm()) {
      let formData = new FormData();
      formData.append("firstName", form.firstName || userDetail.firstName);
      formData.append("lastName", form.lastName || userDetail.lastName);
      formData.append("isSupervisor", form.isSupervisor);
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
      const combinedJobTitles = [
        ...(form.jobTitle ? form.jobTitle.map((e) => e.value) : []),
        ...newJobTitles,
      ];
      formData.append("jobTitle", combinedJobTitles.join(","));
      const combinedDivision = [
        ...(form.division ? form.division.map((e) => e.value) : []),
        ...newDivision,
      ];
      formData.append("division", combinedDivision.join(","));
      const combinedLocations = [
        ...(form.location ? form.location.map((e) => e.value) : []),
        ...newLocations,
      ];
      formData.append("location", combinedLocations.join(","));

      const combinedAreas = [
        ...(form.area ? form.area.map((e) => e.value) : []),
        ...newAreas,
      ];
      formData.append("area", combinedAreas.join(","));
      formData.append("userId", userDetail.userId);
      formData.append("userName", form.userName || userDetail.userName);

      formData.append(
        "phoneNumber",
        form.phoneNumber !== null ? form.phoneNumber : "-"
      );
      formData.append("isActive", form.isActive || userDetail.isActive);
      formData.append("userPhoto", userPhoto || "");
      formData.append(
        "customFields",
        JSON.stringify(newCustomField?.customField) || ""
      );

      if (userDetail) {
        updateUser(formData);
      }
    }
  };

  const roleListApi = async () => {
    try {
      const res = await getApiCall("getRoleOptionList");
      setRoleList(res);
    } catch (err) { }
  };

  const organizationListApi = async (id) => {
    try {
      const res = await getApiCall("getOrganizationOptionsList");
      setOrganizationList(res);
    } catch (err) { }
  };

  const supervisorListApi = async () => {
    try {
      const res = await getApiCall("getSupervisorUserList");
      setSupervisorList(res);
    } catch (err) {
    }
  };

  const togglePassword = (event) => {
    if (passwordShown === "password") {
      setPasswordShown("text");
      event.preventDefault();
      return;
    }
    setPasswordShown("password");
    event.preventDefault();
  };

  const addCustomFields = (inputTextArr1) => {
    return inputTextArr1?.map((field, idx) => {
      if (field.customFieldType === "Dropdown") {
        return (
          <CCol md={6}>
            <CRow className="mb-3 ">
              <CFormLabel
                htmlFor=""
                className="col-sm-4 col-form-label fw-bolder fs-7"
              >
                {field.labelName}
              </CFormLabel>
              <div className="col-sm-7 ">
                <select
                  className="form-select"
                  onChange={(e) => {
                    onChanges(parseInt(e.target.value), idx);
                  }}
                  name={field.fieldName}
                  aria-label="select example"
                >
                  <option value={""}>Select</option>

                  {field.customNumberOfFields?.map((option, index) => {
                    return (
                      <option
                        name={option?.id}
                        selected={option.selected === "1"}
                        value={option?.id}
                        key={index}
                      >
                        {option.labelName}
                      </option>
                    );
                  })}
                </select>
              </div>
            </CRow>
          </CCol>
        );
      } else if (field.customFieldType === "Checkbox") {
        return (
          <CCol md={6}>
            <CRow className="mb-3 ">
              <CFormLabel
                htmlFor=""
                className="col-sm-4 col-form-label fw-bolder fs-7"
              >
                {field.labelName}
              </CFormLabel>
              <div
                className="col-sm-7 d-flex align-items-center "
                style={{ gap: "0.5rem" }}
              >
                {field.customNumberOfFields?.map((option, index) => {
                  return (
                    <>
                      <input
                        type="checkbox"
                        name={field.fieldName}
                        value={option?.customFieldValue}
                        key={index}
                        checked={
                          field.selectedValue
                            ? option.id === field.selectedValue
                            : option.customFieldValue
                        }
                        onChange={(e) => {
                          onChanges(option.id, idx, e.target.checked);
                        }}
                      />
                      <label
                        for="html"
                        style={{
                          fontSize: "0.85rem",
                          paddingRight: " 0.5rem",
                          paddingTop: "0.2rem",
                        }}
                      >
                        {option.labelName}
                      </label>
                      <br></br>
                      {option[index]}
                    </>
                  );
                })}
              </div>
            </CRow>
          </CCol>
        );
      } else if (field.customFieldType === "Radio Button") {
        return (
          <CCol md={6}>
            <CRow className="mb-3 ">
              <CFormLabel
                htmlFor=""
                className="col-sm-4 col-form-label fw-bolder fs-7"
              >
                {field.labelName}
              </CFormLabel>
              <div
                className="col-sm-7 d-flex align-items-center"
                style={{ gap: "0.5rem" }}
              >
                {field.customNumberOfFields?.map((option, index) => {
                  return (
                    <>
                      <input
                        type="radio"
                        name={field.fieldName}
                        value={option?.labelName}
                        checked={
                          field.selectedValue
                            ? option.id === field.selectedValue
                            : option.checked
                        }
                        key={index}
                        onClick={(e) => {
                          onChanges(option.id, idx, e.target.checked);
                        }}
                      />
                      <label
                        for="html"
                        style={{
                          fontSize: "0.85rem",
                          paddingRight: " 0.5rem",
                          paddingTop: "0.2rem",
                        }}
                      >
                        {option.labelName}
                      </label>
                      <br></br>
                      {option[index]}
                    </>
                  );
                })}
              </div>
            </CRow>
          </CCol>
        );
      } else if (field.customFieldType === "Text") {
        return (
          <CCol md={6}>
            <CRow className="mb-3 ">
              <CFormLabel
                htmlFor=""
                className="col-sm-4 col-form-label fw-bolder fs-7"
              >
                {field.labelName}
              </CFormLabel>
              <div className="col-sm-7">
                <CFormInput
                  placeholder={field.labelName}
                  name={field.fieldName}
                  type="text"
                  value={field.customFieldValue}
                  onChange={(e) => {
                    onChangesText(field.id, e.target.value, idx);
                  }}
                />
              </div>
            </CRow>
          </CCol>
        );
      } else if (field.customFieldType === "Textarea") {
        return (
          <CCol md={6}>
            <CRow className="mb-3 ">
              <CFormLabel
                htmlFor=""
                className="col-sm-4 col-form-label fw-bolder fs-7"
              >
                {field.labelName}
              </CFormLabel>
              <div className="col-sm-7">
                <CFormInput
                  name={field.fieldName}
                  placeholder={field.labelName}
                  type="text"
                  value={field.customFieldValue}
                  onChange={(e) => {
                    onChangesText(field.id, e.target.value, idx);
                  }}
                />
              </div>
            </CRow>
          </CCol>
        );
      } else if (field.customFieldType === "Date") {
        return (
          <CCol md={6}>
            <CRow className="mb-3 ">
              <CFormLabel
                htmlFor=""
                className="col-sm-4 col-form-label fw-bolder fs-7"
              >
                {field.labelName}
              </CFormLabel>
              <div className="col-sm-7">
                <CFormInput
                  name={field.fieldName}
                  value={field.customFieldValue}
                  type="date"
                  id="birthday"
                  onChange={(e) => {
                    onChangesText(field.id, e.target.value, idx);
                  }}
                />
              </div>
            </CRow>
          </CCol>
        );
      }
    });
  };

  const onChangesText = (text, index) => {
    let updatedCustomFields = [...userDetail.customFields];
    updatedCustomFields[index].value = text;
    updatedCustomFields[index].customFieldValue = text;

    const filteredData = updatedCustomFields.filter(
      (item) =>
        item.customFieldTypeId === 1 ||
        item.customFieldTypeId === 2 ||
        item.customFieldTypeId === 3
    );

    const filteredCustomFields = filteredData.filter((data) => data.value);

    setNewCustomField({
      ...newCustomField,
      customField: {
        ...newCustomField?.customField,
        text: filteredCustomFields.map((data) => ({
          id: data.id,
          value: data.value,
        })),
      },
    });
  };

  const onChanges = (optionId, index, checked) => {
    let updatedCustomFields1 = [...userDetail.customFields];
    updatedCustomFields1[index].value = optionId;
    updatedCustomFields1[index].selectedValue = optionId;

    const filteredSelectData = updatedCustomFields1.filter(
      (item) =>
        item.customFieldTypeId === 4 ||
        item.customFieldTypeId === 5 ||
        item.customFieldTypeId === 6
    );
    const filteredCustomFieldsArray = filteredSelectData.filter(
      (data) => data.value
    );
    setNewCustomField({
      ...newCustomField,
      customField: {
        ...newCustomField?.customField,
        radio: filteredCustomFieldsArray.map((data) => ({
          id: data.id,
          value: data.value,
        })),
      },
    });
  };

  return (
    <CRow>
      <Toast ref={toast} />
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Edit User</strong>
          </CCardHeader>
          {userDetail && (
            <CCardBody className="card-body org border-top p-9">
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
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        First Name
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormInput
                          type="text"
                          aria-label="First name"
                          value={form.firstName}
                          placeholder="First Name"
                          required
                          onChange={(e) => {
                            setForm({ ...form, firstName: e.target.value });
                            setValidationMessages({
                              ...validationMessages,
                              firstName: e.target.value
                                ? ""
                                : "First Name is required",
                            });
                          }}
                        />
                        {showValidationMessages &&
                          validationMessages.firstName && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.firstName}
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
                        Last Name
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormInput
                          type="text"
                          aria-label="Last name"
                          value={form.lastName}
                          placeholder="Last Name"
                          required
                          onChange={(e) => {
                            setForm({ ...form, lastName: e.target.value });
                            setValidationMessages({
                              ...validationMessages,
                              lastName: e.target.value
                                ? ""
                                : "Last Name is required",
                            });
                          }}
                        />
                        {showValidationMessages &&
                          validationMessages.lastName && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.lastName}
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
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Job Title
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CreatableSelect
                          isClearable
                          isMulti
                          options={JobTitleList}
                          value={[
                            ...(Array.isArray(form.jobTitle)
                              ? form.jobTitle
                              : []),
                            ...newJobTitles.map((title) => ({
                              label: title,
                              value: title,
                            })),
                          ]}
                          onCreateOption={handleCreatejobTitle}
                          onChange={(selectedOptions) =>
                            handleChangejobTitles(selectedOptions)
                          }
                          feedbackInvalid="JobTitleList"
                          id="validationCustom12"
                          required
                        />
                      </div>
                    </CRow>
                  </CCol>

                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Company
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormSelect
                          required
                          value={form.organizationId}
                          onChange={(f) => {
                            setForm({
                              ...form,
                              organizationId: f.target.value,
                            });
                            setValidationMessages({
                              ...validationMessages,
                              organizationId: f.target.value
                                ? ""
                                : "Company is required",
                            });
                          }}
                          aria-label="select example"
                        >
                          <option disabled value={""}>
                            Select
                          </option>
                          {organizationList.map((e) => (
                            <option
                              key={e.organizationId}
                              value={e.organizationId}
                            >
                              {e.organizationName}
                            </option>
                          ))}
                        </CFormSelect>
                        {showValidationMessages &&
                          validationMessages.organizationId && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.organizationId}
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
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Division
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CreatableSelect
                          isClearable
                          isMulti
                          options={divisionlist}
                          value={[
                            ...(Array.isArray(form.division)
                              ? form.division
                              : []),
                            ...newDivision.map((title) => ({
                              label: title,
                              value: title,
                            })),
                          ]}
                          onCreateOption={handleCreatedivison}
                          onChange={(selectedOptions) =>
                            handleChangedivision(selectedOptions)
                          }
                          feedbackInvalid="JobTitleList"
                          id="validationCustom12"
                          required
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
                        Area
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CreatableSelect
                          isClearable
                          isMulti
                          options={arealist}
                          value={[
                            ...(Array.isArray(form.area) ? form.area : []),
                            ...newAreas.map((area) => ({
                              label: area,
                              value: area,
                            })),
                          ]}
                          onCreateOption={handleCreatearea}
                          onChange={(e) => handleChangearea(e)}
                          feedbackInvalid="location"
                          id="validationCustom12"
                          required
                        />
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
                      <div className="col-sm-7">
                        <CreatableSelect
                          isClearable
                          isMulti
                          options={locationList}
                          value={[
                            ...(Array.isArray(form.location)
                              ? form.location
                              : []),
                            ...newLocations.map((location) => ({
                              label: location,
                              value: location,
                            })),
                          ]}
                          onCreateOption={handleCreatelocation}
                          onChange={(selectedOptions) =>
                            handleChangelocation(selectedOptions)
                          }
                          feedbackInvalid="location"
                          id="validationCustom12"
                          required
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
                        QR Code
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormInput
                          type="number"
                          id="validationCustom01"
                          value={form.barcode}
                          onChange={(e) =>
                            setForm({ ...form, barcode: e.target.value })
                          }
                          placeholder="QR Code"
                          required
                        />
                        <Link onClick={handleClick}>Generate QR code</Link>
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
                      <div className="col-sm-7">
                        <CFormInput
                          required
                          type="number"
                          id="validationCustom01"
                          value={form.phoneNumber !== null ? form.phoneNumber : ""}
                          onChange={(e) => {
                            setForm((prevForm) => ({
                              ...prevForm,
                              phoneNumber: e.target.value !== "" ? e.target.value : null,
                            }));
                          }}
                          placeholder="Phone Number"
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
                        Email Address
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormInput
                          type="text"
                          id="validationCustom01"
                          value={
                            form.emailAddress !== null ? form.emailAddress : ""
                          }
                          onChange={(e) =>
                            setForm({ ...form, emailAddress: e.target.value })
                          }
                          placeholder="Email Address"
                          required
                        />
                        {showError ||
                          displayEmailError ===
                          "The email address has already been taken." ? (
                          <div className="fw-bolder" style={{ color: "red" }}>
                            {displayEmailError}
                          </div>
                        ) : (
                          <></>
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
                        User Name
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormInput
                          type="text"
                          id="validationCustom01"
                          value={form.userName}
                          placeholder="User Name"
                          required
                          onChange={(e) => {
                            setForm({ ...form, userName: e.target.value });
                            setValidationMessages({
                              ...validationMessages,
                              userName: e.target.value
                                ? ""
                                : "User Name is required",
                            });
                          }}
                        />
                        {showValidationMessages &&
                          validationMessages.userName && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.userName}
                            </div>
                          )}
                        {showError ||
                          displayUserName ===
                          "The user name has already been taken." ? (
                          <div className="fw-bolder" style={{ color: "red" }}>
                            {displayUserName}
                          </div>
                        ) : (
                          <div></div>
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
                        Password
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CInputGroup>
                          <CFormInput
                            type={passwordShown}
                            value={form.password}
                            onChange={(e) => {
                              setForm({ ...form, password: e.target.value });
                              setValidationMessages({
                                ...validationMessages,
                                password: e.target.value
                                  ? ""
                                  : "Password is required",
                              });
                            }}
                            placeholder="Password"
                            required
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
                          validationMessages.password && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.password}
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
                        User Role
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormSelect
                          required
                          value={form.role}
                          onChange={(f) => {
                            setForm({ ...form, role: f.target.value });
                            setValidationMessages({
                              ...validationMessages,
                              role: f.target.value
                                ? ""
                                : "User Role is required",
                            });
                          }}
                          aria-label="select example"
                        >
                          <option disabled value={""}>
                            Select
                          </option>
                          {roleList.map((e) => (
                            <option key={e.roleId} value={e.roleId}>
                              {e.roleName}
                            </option>
                          ))}
                        </CFormSelect>
                        {showValidationMessages && validationMessages.role && (
                          <div className="fw-bolder" style={{ color: "red" }}>
                            {validationMessages.role}
                          </div>
                        )}
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
                      <div className="col-sm-7">
                        <CFormSelect
                          size="xl"
                          id="formSwitchCheckDefault"
                          onChange={(e) =>
                            setForm({ ...form, isActive: e.target.value })
                          }
                          aria-label="Select Status"
                        >
                          <option disabled value={""}>
                            Select
                          </option>
                          <option key={1} value={1}>
                            Active
                          </option>
                          <option key={2} value={2}>
                            Inactive
                          </option>
                        </CFormSelect>
                      </div>
                    </CRow>
                  </CCol>
                  <CCol md={6} style={{ marginTop: "20px" }}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Supervisor
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormSelect
                          required
                          value={form.isSupervisor}
                          onChange={(f) => {
                            setForm({ ...form, isSupervisor: f.target.value });
                            setValidationMessages({
                              ...validationMessages,
                              isSupervisor: f.target.value
                                ? ""
                                : "Supervisor is required",
                            });
                          }}
                          aria-label="select example"
                        >
                          <option value={""}>
                            Select
                          </option>
                          {supervisorList.map((e) => (
                            <option key={e.userId} value={e.userId}>
                              {e.supervisorName === null ? "Select" : e.supervisorName}

                            </option>
                          ))}

                        </CFormSelect>
                        {showValidationMessages && validationMessages.role && (
                          <div className="fw-bolder" style={{ color: "red" }}>
                            {validationMessages.role}
                          </div>
                        )}
                      </div>
                    </CRow>
                  </CCol>
                  <CCol md={6} style={{ marginTop: "20px" }}>
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
                              marginLeft: "0%",
                            }}
                            alt="Uploaded"
                          />
                        )}
                      </div>
                    </CRow>
                  </CCol>
                </CRow>
                {addCustomFields(userDetail.customFields)}
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
          <CCardFooter>
            <div className="d-flex justify-content-end">
              <Link
                to="/admin/userlist"
                className="btn btn-primary me-2"
                onClick={() => {
                  localStorage.removeItem("userId");
                }}
              >
                Back
              </Link>
              <CButton
                className="btn btn-primary me-2"
                onClick={(e) => {
                  handleSave2(e);
                  localStorage.removeItem("userId");
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
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Updateuser;
