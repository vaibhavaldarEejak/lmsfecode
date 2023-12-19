import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  CCard,
  CCardBody,
  CCol,
  CFormInput,
  CFormLabel,
  CRow,
  CFormSelect,
  CForm,
  CCardFooter,
  CButton,
  CFormTextarea,
  CCardHeader,
} from "@coreui/react";
import { Link, useNavigate } from "react-router-dom";
import { InputCustomEditor } from "./common/EditorBox/InputCustomEditor";
import "./credential.css";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;
import CreatableSelect from "react-select/creatable";
import { Toast } from "primereact/toast";
import getApiCall from "src/server/getApiCall";
import "../../css/form.css";
const AddSACredentials = () => {
  const toast = useRef(null);
  const [validationMessages, setValidationMessages] = useState({});
  const [showValidationMessages, setShowValidationMessages] = useState(false);
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const [isloading, setLoading1] = useState(false);
  const navigate = useNavigate();
  const [customField, setCustomField] = useState([]);
  const [credentialStatus, setCredentialStatus] = useState(1);
  const credentialId = window.location.href.split("?")[1];
  const [form, setForm] = useState({
    credentialTitle: "",
    credentialCode: "",
    category: null,
    credentialNote: "",
    credentialDescription: "",
    expirationTime: "",
    daysTillExpiration: "",
    customFields: "",
    status: "",
  });

  const getCredentialCode = () => {
    axios
      .get(`${API_URL}/getCredentialList`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        if (!credentialId) {
          if (
            (response.data.data.length > 0 &&
              response.data.data[0].credentialCode === null) ||
            response.data.data.length === 0
          ) {
            setForm({
              ...form,
              credentialCode: 100001,
            });
          } else {
            setForm({
              ...form,
              credentialCode:
                parseInt(response.data.data[0].credentialCode) + 1,
            });
          }
        }
      });
  };

  const validateForm = (e) => {
    const messages = {};
    let isValid = true;

    if (!form.credentialTitle) {
      messages.credentialTitle = "Credential Title is required";
      isValid = false;
    } else {
      messages.credentialTitle = "";
    }

    if (!form.category) {
      messages.category = "Category is required";
      isValid = false;
    }

    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };

  //Status Listing

  const [statusListing, setstatusListing] = useState([]);

  const getStatusList = () => {
    axios
      .get(`${API_URL}/getTrainingStatusList`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setstatusListing(response.data.data);
      });
  };

  //Category Add/List

  const [categoryListing, setcategoryListing] = useState([]);

  const categoryList = () => {
    axios
      .get(`${API_URL}/getCategoryOptionList`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setcategoryListing(
          response.data.data.map((e) => ({
            label: e.categoryName,
            value: e.categoryId,
          }))
        );
      });
  };

  const addCategoryApi = (text) => {
    axios
      .post(
        `${API_URL}/addNewCategory`,
        { categoryName: text },
        {
          headers: { Authorization: token },
        }
      )
      .then((res) => {
        res.data.code === 200 && categoryList();
        if (form.category == null) {
          setForm({
            ...form,
            category: [
              {
                value: res.data.data,
                label: text,
              },
            ],
          });
        } else {
          setForm({
            ...form,
            category: [
              ...form.category,
              {
                value: res.data.data,
                label: text,
              },
            ],
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCreateCategory = (value) => {
    addCategoryApi(value);
  };

  const handleChangeCategory = (value) => {
    setForm({ ...form, category: value });
  };

  useEffect(() => {
    if (token !== "Bearer null") {
      categoryList();
      getCredentialCode();
      getStatusList();
    }
  }, []);

  //Add credentials

  const addCredential = (data) => {
    setLoading1(true);

    axios
      .post(`${API_URL}/addSUCredentials`, data, {
        headers: { Authorization: token },
      })
      .then((response) => {
        if (response) {
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Credentials Added Successfully",
            life: 3000,
          });
        }

        setTimeout(() => {
          navigate("/superadmin/credentiallist");
        }, 3000);
      })
      .catch((errors) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error Adding Credentials",
          life: 3000,
        });
      });
  };

  const handleSave = () => {
    if (validateForm()) {
      let formData = new FormData();
      formData.append("credentialTitle", form.credentialTitle);
      formData.append("credentialCode", form.credentialCode);
      formData.append(
        "category",
        form.category && form.category.map((e) => e.value)
      );
      formData.append("credentialNote", form.credentialNote);
      formData.append("credentialDescription", form.credentialDescription);
      formData.append("expirationTime", form.expirationTime);
      formData.append("daysTillExpiration", form.daysTillExpiration);
      formData.append("status", credentialStatus ? credentialStatus: 1);
      formData.append(
        "customFields",
        form.customFields ? JSON.stringify(form.customFields) : ""
      );
      if (formData) {
        addCredential(formData);
      }
    }
  };
  const getUserCustomFields = async () => {
    try {
      const res = await getApiCall("getCredentialsCustomFieldList");
      setCustomField(res);
    } catch (err) {}
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
  return (
    <CRow>
      <Toast ref={toast} />
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Add Credentials</strong>
          </CCardHeader>
          <CCardBody className="card-body org border-top p-9">
            <CForm
              className="row g-15 needs-validation"
              form={form}
              onFinish={addCredential}
            >
              <CRow className="mb-3">
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7 required1"
                    >
                      Credential Title
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        required
                        placeholder="Credential Title"
                        value={form.credentialTitle}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            credentialTitle: e.target.value,
                          });
                          setValidationMessages({
                            ...validationMessages,
                            credentialTitle: e.target.value
                              ? ""
                              : "Credential Title is required",
                          });
                        }}
                      />
                      {showValidationMessages &&
                        validationMessages.credentialTitle && (
                          <div className="fw-bolder" style={{ color: "red" }}>
                            {validationMessages.credentialTitle}
                          </div>
                        )}
                    </div>
                  </CRow>
                </CCol>
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7 required1"
                    >
                      Credential Code
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="number"
                        id="validationCustom01"
                        placeholder="Credential ID"
                        required
                        disabled
                        value={form.credentialCode}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            credentialCode: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </CRow>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <CRow className="mb-4">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-2 col-form-label fw-bolder fs-7"
                    >
                      Note
                    </CFormLabel>
                    <div className="col-sm-9">
                      <CFormTextarea
                        id="validationCustom01"
                        placeholder="Note"
                        required
                        value={form.credentialNote}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            credentialNote: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </CRow>
                </CCol>
                {/*  */}
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CRow className="mb-4">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-2 col-form-label fw-bolder fs-7 "
                      >
                        Description
                      </CFormLabel>
                      <div className="col-sm-10">
                        <InputCustomEditor
                          value={form.credentialDescription}
                          label="Description"
                          required={true}
                          onChange={(e) =>
                            setForm({ ...form, credentialDescription: e })
                          }
                        />
                      </div>
                    </CRow>
                  </CCol>
                </CRow>
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7"
                    >
                      Expiration Time(yrs)
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="number"
                        id="validationCustom01"
                        placeholder="Expiration Time"
                        required
                        value={form.expirationTime}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            expirationTime: e.target.value,
                          });
                        }}
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
                      Days Until Expiration
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="number"
                        id="validationCustom01"
                        placeholder="Days Until Expiration"
                        required
                        value={form.daysTillExpiration}
                        onChange={(e) => {
                          setForm({
                            ...form,
                            daysTillExpiration: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </CRow>
                </CCol>
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7 required1"
                    >
                      Category
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CreatableSelect
                        isClearable
                        isMulti
                        options={categoryListing}
                        value={form.category}
                        onCreateOption={handleCreateCategory}
                        onChange={(e) => {
                          handleChangeCategory(e);
                          setValidationMessages({
                            ...validationMessages,
                            category: e ? "" : "Category is required",
                          });
                        }}
                        feedbackInvalid="location"
                        id="validationCustom12"
                        required
                      />
                      {showValidationMessages &&
                        validationMessages.category && (
                          <div className="fw-bolder" style={{ color: "red" }}>
                            {validationMessages.category}
                          </div>
                        )}
                    </div>
                  </CRow>
                </CCol>
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7 required1"
                    >
                      Status
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormSelect
                        required
                        aria-label="select example"
                        value={credentialStatus}
                        onChange={(f) => {
                            setCredentialStatus(f.target.value);
                        }}
                      >
                        <option value={0}>Select Status</option>

                        {statusListing &&
                          statusListing.map(
                            (e) =>
                              e.trainingStatus && (
                                <option
                                  key={e.trainingStatusId}
                                  value={e.trainingStatusId}
                                >
                                  {e.trainingStatus}
                                </option>
                              )
                          )}
                      </CFormSelect>
                    </div>
                  </CRow>
                </CCol>
              </CRow>
              <CRow className="md-3">{addCustomFields(customField)}</CRow>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <div className="d-flex justify-content-end">
              <Link to="/superadmin/credentiallist" className="btn btn-primary me-2">
                Back
              </Link>
              <CButton
                className="btn btn-primary me-2"
                onClick={(e) => handleSave(e)}
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

export default AddSACredentials;
