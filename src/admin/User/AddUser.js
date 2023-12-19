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
  CForm,
  CInputGroup,
  CCardFooter,
  CButton,
} from "@coreui/react";
import { Link, useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import "../../scss/required.scss";
import "primeicons/primeicons.css";
import { Toast } from "primereact/toast";
import getApiCall from "src/server/getApiCall";
import { Tooltip } from "primereact/tooltip";
import { Skeleton } from "primereact/skeleton";
import getApiForOptionalPayload from "src/server/getApiForOptionalPayload";
import postApiCall from "src/server/postApiCall";
import "../../css/form.css";

const AddUser = () => {
  const toast = useRef(null),
    navigate = useNavigate(),
    [roleList, setRoleList] = useState([]),
    [JobTitleList, setjobTitleList] = useState([]),
    [divisionlist, setDivisiontlist] = useState([]),
    [locationList, setLocationList] = useState([]),
    [newJobTitles, setNewJobTitles] = useState([]),
    [isLoading, setIsLoading] = useState(false),
    [newDivision, setNewDivision] = useState([]),
    [supervisorList, setSupervisorList] = useState([]),
    [newAreas, setNewAreas] = useState([]),
    [newLocations, setNewLocations] = useState([]),
    [arealist, setArealist] = useState([]),
    [isloading, setLoading1] = useState(false),
    [organizationList, setOrganizationList] = useState([]),
    [validationMessages, setValidationMessages] = useState({}),
    [showValidationMessages, setShowValidationMessages] = useState(false),
    [showError, setshowError] = useState(false),
    [displayEmailError, setdisplayEmailError] = useState(),
    [displayUserName, setdisplayUserName] = useState(),
    [customField, setCustomField] = useState([]),
    [userPhoto, setUserPhoto] = useState(""),
    [certImg, setCertImg] = useState(),
    [imgData, setImgData] = useState(null),
    [passwordShown, setPasswordShown] = useState("password"),
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
      customFields: "",
      isSupervisor: "",
      isActive: 1,
    });


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

  const getUserCustomFields = async () => {
    try {
      const res = await getApiCall("getUsersCustomFieldList");
      setCustomField(res);
    } catch (err) { }
  };

  useEffect(() => {
    getUserCustomFields();
  }, []);

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
                      <option name={option?.id} value={option?.id} key={index}>
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
                className="col-sm-7 d-flex align-items-center"
                style={{ gap: "0.5rem" }}
              >
                {field.customNumberOfFields?.map((option, index) => {
                  return (
                    <>
                      <input
                        type="checkbox"
                        name={field.fieldName}
                        value={option[index]}
                        key={index}
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
                        value={option[index]}
                        key={index}
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
                  name={field.fieldName}
                  placeholder={field.labelName}
                  type="text"
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
                <textarea
                  cols="32"
                  placeholder={field.labelName}
                  name={field.fieldName}
                  type="text"
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

  let updatedCustomFields = [...customField];
  const onChangesText = (fieldID, text, index) => {
    updatedCustomFields[index].value = text;
    updatedCustomFields[index].customFieldValue = text;

    const filteredData = updatedCustomFields.filter(
      (item) =>
        item.customFieldTypeId === 1 ||
        item.customFieldTypeId === 2 ||
        item.customFieldTypeId === 3
    );
    const filteredCustomFields = filteredData.filter((data) => data.value);

    setForm({
      ...form,
      customFields: {
        ...form.customFields,
        text: filteredCustomFields.map((data) => ({
          id: data.id,
          value: data.value,
        })),
      },
    });
  };

  const onChanges = (optionId, index, checked) => {
    updatedCustomFields[index].value = optionId;

    const filteredSelectData = updatedCustomFields.filter(
      (item) =>
        item.customFieldTypeId === 4 ||
        item.customFieldTypeId === 5 ||
        item.customFieldTypeId === 6
    );
    const filteredCustomFieldsArray = filteredSelectData.filter(
      (data) => data.value
    );
    setForm({
      ...form,
      customFields: {
        ...form.customFields,
        radio: filteredCustomFieldsArray.map((data) => ({
          id: data.id,
          value: data.value,
        })),
      },
    });
  };

  const JobListApi = async (orgId) => {
    try {
      const res = await getApiForOptionalPayload(
        "/getJobTitleList/?orgId=",
        orgId
      );
      setjobTitleList(
        res.data.data.map((e) => ({
          label: e.jobTitleName,
          value: e.jobTitleId,
        }))
      );
    } catch (err) { }
  };

  const handleCreatejobTitle = (value) => {
    setNewJobTitles((prevJobTitles) => [...prevJobTitles, value]);
  };
  const handleChangejobTitles = (value) => {
    setForm({ ...form, jobTitle: value });
  };

  const DivisionList = async (orgId) => {
    try {
      const res = await getApiForOptionalPayload(
        "/getDivisionList/?orgId=",
        orgId
      );
      setDivisiontlist(
        res.map((e) => ({
          label: e.divisionName,
          value: e.divisionId,
        }))
      );
    } catch (err) { }
  };

  const handleCreatedivison = (value) => {
    setNewDivision((prevDivision) => [...prevDivision, value]);
  };

  const handleChangedivision = (value) => {
    setForm({ ...form, division: value });
  };

  const handleCreatelocation = (value) => {
    // Add the new location to the newLocations state
    setNewLocations((prevLocations) => [...prevLocations, value]);
  };

  const handleChangelocation = (value) => {
    setForm({ ...form, location: value });
  };

  const locationlistApi = async (orgId) => {
    try {
      const res = await getApiForOptionalPayload(
        "/getLocationList/?orgId=",
        orgId
      );
      setLocationList(
        res.map((e) => ({
          label: e.locationName,
          value: e.locationId,
        }))
      );
    } catch (err) { }
  };

  const AreaListApi = async (orgId) => {
    try {
      const res = await getApiForOptionalPayload("/getAreaList/?orgId=", orgId);
      setArealist(res.map((e) => ({ label: e.areaName, value: e.areaId })));
    } catch (err) { }
  };

  const handleCreatearea = (value) => {
    setNewAreas((prevAreas) => [...prevAreas, value]);
  };

  const handleChangearea = (value) => {
    setForm({ ...form, area: value });
  };

  const addUser = async (data) => {
    try {
      const isValid = await validateForm1();

      if (!isValid) {
        return;
      }

      setLoading1(true);

      const res = await postApiCall("addNewUser", data);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "User Added Successfully",
        life: 3000,
      });

      setLoading1(false);
      setTimeout(() => {
        navigate("/admin/userlist");
      }, 3000);
    } catch (err) {
      const errMsg = err?.response?.data?.error || "An error occurred";
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
      setLoading1(false);
    }
  };




  const validateForm = async () => {
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
    } else if (form.password.length < 8) {
      messages.password = "Password length must be 8 characters";
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


  const validateForm1 = () => {
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

    if (!form.userName) {
      messages.userName = "User Name is required";
      isValid = false;
    }

    if (!form.password) {
      messages.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 8) {
      messages.password = "Password length must be 8 characters";
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

  const handleSave = () => {
    if (organizationList.length > 1) {
      validateForm();
    } else {
      validateForm1();
    }
    {
      let formData = new FormData();
      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("emailAddress", form.emailAddress);
      formData.append("barcode", form.barcode);
      formData.append("isSupervisor", form.isSupervisor);
      formData.append("userName", form.userName);
      formData.append("password", form.password);
      formData.append("phoneNumber", form.phoneNumber);
      const combinedAreas = [
        ...(form.area ? form.area.map((e) => e.value) : []),
        ...newAreas,
      ];

      formData.append("area", combinedAreas.join(","));
      formData.append(
        "customFields",
        form.customFields ? JSON.stringify(form.customFields) : ""
      );
      const combinedJobTitles = [
        ...(form.jobTitle ? form.jobTitle.map((e) => e.value) : []),
        ...newJobTitles,
      ];

      const combinedDivision = [
        ...(form.division ? form.division.map((e) => e.value) : []),
        ...newDivision,
      ];
      const combinedLocations = [
        ...(form.location ? form.location.map((e) => e.value) : []),
        ...newLocations,
      ];

      formData.append("location", combinedLocations.join(","));
      formData.append("jobTitle", combinedJobTitles.join(","));
      formData.append("division", combinedDivision.join(","));

      // Validation for organizationId
      if (organizationList.length === 1) {
        formData.append("organizationId", organizationList[0].organizationId);
      } else {
        formData.append("organizationId", form.organizationId);
      }
      formData.append("role", form.role);
      formData.append("isActive", form.isActive);
      if (form.userPhoto) {
        formData.append("userPhoto", form.userPhoto);
      }

      if (organizationList.length > 1 ? formData && validateForm() : formData && validateForm1()) {
        addUser(formData);
      }
    }
  };

  const roleListApi = async () => {
    try {
      const res = await getApiCall("getRoleOptionList");
      setRoleList(res);
    } catch (err) { }
  };

  const supervisorListApi = async () => {
    try {
      const res = await getApiCall("getSupervisorUserList");
      setSupervisorList(res);
    } catch (err) {
    }
  };
  const organizationListApi = async (id) => {
    setIsLoading(true);
    try {
      const res = await getApiCall("getOrganizationOptionsList");
      setOrganizationList(res);
      setIsLoading(false);
    } catch (err) { }
  };

  useEffect(() => {
    JobListApi();
    DivisionList();
    locationlistApi();
    AreaListApi();
    organizationListApi();
    roleListApi();
    supervisorListApi();
    setForm({
      ...form,
      jobTitle: null,
    });
  }, []);

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
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const handleClick = () => {
    form.barcode = randomNumberInRange(889666, 897666);
    setNum(randomNumberInRange(1, 5));
  };

  return (
    <CRow>
      <Toast ref={toast} />
      <CCol xs={12} style={{ padding: "0px" }}>
        <CCard className="mb-4 card-ric">
          <CCardHeader>
            <strong>Add New User</strong>
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
              <CForm
                className="row g-15 needs-validation"
                form={form}
                onFinish={form.addUser}
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

                {organizationList.length > 1 && (
                  <CRow className="mb-3">
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
                              <div
                                className="fw-bolder"
                                style={{ color: "red" }}
                              >
                                {validationMessages.organizationId}
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
                )}

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Job Title
                      </CFormLabel>
                      {organizationList.length > 1 && !form.organizationId ? (
                        <div
                          className="col-sm-7"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <div style={{ width: "85%" }}>
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
                              isDisabled={!form.organizationId} // Disable when organizationId is not selected
                            />
                          </div>
                          <div style={{ width: "15%", marginLeft: "5px" }}>
                            {!form.organizationId && (
                              <label
                                className="input-group-text custom-choose-btn2"
                                style={{
                                  fontSize: ".9rem",
                                  cursor: "pointer",
                                }}
                              >
                                <Tooltip
                                  target="#tooltip" // Use the ID of the tooltip target
                                  position="right"
                                  content="Please select company first"
                                />
                                <span id="tooltip">
                                  <img
                                    src="/media/icon/gen045.svg"
                                    alt="Upload"
                                  />
                                </span>
                              </label>
                            )}
                          </div>
                        </div>
                      ) : form.organizationId ||
                        organizationList.length === 1 ? (
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
                      ) : (
                        form.organizationId && (
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
                        )
                      )}
                    </CRow>
                  </CCol>
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 "
                      >
                        Division
                      </CFormLabel>
                      {organizationList.length > 1 && !form.organizationId ? (
                        <div
                          className="col-sm-7"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <div style={{ width: "85%" }}>
                            <CreatableSelect
                              isClearable
                              isMulti
                              options={divisionlist}
                              value={[
                                ...form.division,
                                ...newDivision.map((division) => ({
                                  label: division,
                                  value: division,
                                })),
                              ]}
                              onCreateOption={handleCreatedivison}
                              onChange={(selectedOptions) =>
                                handleChangedivision(selectedOptions)
                              }
                              feedbackInvalid="JobTitleList"
                              id="validationCustom12"
                              required
                              isDisabled={!form.organizationId}
                            />
                          </div>
                          <div style={{ width: "15%", marginLeft: "5px" }}>
                            {!form.organizationId && (
                              <label
                                className="input-group-text custom-choose-btn2"
                                style={{
                                  fontSize: ".9rem",
                                  cursor: "pointer",
                                }}
                              >
                                <Tooltip
                                  target="#divisionTooltip"
                                  position="right"
                                  content="Please select company first"
                                />
                                <span id="divisionTooltip">
                                  <img
                                    src="/media/icon/gen045.svg"
                                    alt="Upload"
                                  />
                                </span>
                              </label>
                            )}
                          </div>
                        </div>
                      ) : form.organizationId ||
                        organizationList.length === 1 ? (
                        <div className="col-sm-7">
                          <CreatableSelect
                            isClearable
                            isMulti
                            options={divisionlist}
                            value={[
                              ...form.division,
                              ...newDivision.map((division) => ({
                                label: division,
                                value: division,
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
                      ) : (
                        form.organizationId && (
                          <div className="col-sm-7">
                            <CreatableSelect
                              isClearable
                              isMulti
                              options={divisionlist}
                              value={[
                                ...form.division,
                                ...newDivision.map((division) => ({
                                  label: division,
                                  value: division,
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
                        )
                      )}
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
                      {organizationList.length > 1 && !form.organizationId ? (
                        <div
                          className="col-sm-7"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <div style={{ width: "85%" }}>
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
                              isDisabled={!form.organizationId}
                            />
                          </div>
                          <div style={{ width: "15%", marginLeft: "5px" }}>
                            {!form.organizationId && (
                              <label
                                className="input-group-text custom-choose-btn2"
                                style={{
                                  fontSize: ".9rem",
                                  cursor: "pointer",
                                }}
                              >
                                <Tooltip
                                  target="#locationTooltip"
                                  position="right"
                                  content="Please select company first"
                                />
                                <span id="locationTooltip">
                                  <img
                                    src="/media/icon/gen045.svg"
                                    alt="Upload"
                                  />
                                </span>
                              </label>
                            )}
                          </div>
                        </div>
                      ) : form.organizationId ||
                        organizationList.length === 1 ? (
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
                      ) : (
                        form.organizationId && (
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
                        )
                      )}
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
                      {organizationList.length > 1 && !form.organizationId ? (
                        <div
                          className="col-sm-7"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <div style={{ width: "85%" }}>
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
                              isDisabled={!form.organizationId}
                            />
                          </div>
                          <div style={{ width: "15%", marginLeft: "5px" }}>
                            {!form.organizationId && (
                              <label
                                className="input-group-text custom-choose-btn2"
                                style={{
                                  fontSize: ".9rem",
                                  cursor: "pointer",
                                }}
                              >
                                <Tooltip
                                  target="#areaTooltip"
                                  position="right"
                                  content="Please select company first"
                                />
                                <span id="areaTooltip">
                                  <img
                                    src="/media/icon/gen045.svg"
                                    alt="Upload"
                                  />
                                </span>
                              </label>
                            )}
                          </div>
                        </div>
                      ) : form.organizationId ||
                        organizationList.length === 1 ? (
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
                      ) : (
                        form.organizationId && (
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
                        )
                      )}
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
                        Phone Number
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormInput
                          required
                          type="number"
                          id="validationCustom01"
                          value={form.phoneNumber}
                          onChange={(e) => {
                            setForm((prevForm) => ({
                              ...prevForm,
                              phoneNumber: e.target.value,
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
                        className="col-sm-4 col-form-label fw-bolder fs-7 "
                      >
                        Email
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormInput
                          type="email"
                          id="validationCustom01"
                          value={form.emailAddress}
                          placeholder="Email"
                          required
                          onChange={(e) => {
                            setForm({ ...form, emailAddress: e.target.value });
                          }}
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
                            In-Active
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
                              isSupervisor: f.target.value ? "" : "Supervisor is required",
                            });
                          }}
                          aria-label="select example"
                        >
                          <option disabled value="">
                            Select
                          </option>
                          {supervisorList.map((e) => (
                            <option key={e.userId} value={e.userId}>
                              {e.supervisorName}
                            </option>
                          ))}
                        </CFormSelect>
                        {showValidationMessages && validationMessages.isSupervisor && (
                          <div className="fw-bolder" style={{ color: "red" }}>
                            {validationMessages.isSupervisor}
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
                              setValidationMessages({
                                ...validationMessages,
                                userPhoto: e.target.files[0]
                                  ? ""
                                  : "Image is required",
                              });
                              onChangePicture(e);
                            }}
                            style={{ height: "30px" }}
                          />
                          <label
                            className="input-group-text custom-choose-btn2"
                            htmlFor="formFile"
                            style={{
                              fontSize: ".2rem",
                              cursor: "pointer",
                              marginLeft: "5px",
                              height: "30px",
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
                          accept=".jpg, .jpeg, .png"
                          style={{ display: "none" }}
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
                        {showValidationMessages &&
                          validationMessages.userPhoto && (
                            <div
                              className="fw-bolder"
                              style={{ color: "red", marginLeft: "5px" }}
                            >
                              {validationMessages.userPhoto}
                            </div>
                          )}
                      </div>
                    </CRow>
                  </CCol>

                  {organizationList.length === 1 && (
                    <CCol md={6} style={{ marginTop: "20px" }}>
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
                  )}
                </CRow>
                <CRow className="md-3">{addCustomFields(customField)}</CRow>
              </CForm>
            </CCardBody>
          )}

          <CCardFooter>
            <div className="d-flex justify-content-end">
              <Link to="/admin/userlist" className="btn btn-primary me-2">
                Back
              </Link>
              <CButton
                className="btn btn-primary me-2"
                onClick={() => handleSave()}
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

export default AddUser;
