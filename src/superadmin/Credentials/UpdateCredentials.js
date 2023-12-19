import React, { useEffect, useMemo, useState, useRef } from "react";
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
  CCardFooter,
  CButton,
  CFormTextarea,
} from "@coreui/react";
import { json, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CreatableSelect from "react-select/creatable";
import "../../scss/required.scss";
import { Buffer } from "buffer";
import "primeicons/primeicons.css";
import { Skeleton } from "primereact/skeleton";
import { InputCustomEditor } from "./common/EditorBox/InputCustomEditor";
import { Toast } from "primereact/toast";
import "../../css/form.css";
const API_URL = process.env.REACT_APP_API_URL;

const UpdateCredentials = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const navigate = useNavigate();

  const [isloading, setLoading1] = useState(false);
  const toast = useRef(null);

  const [credDetail, setCredDetail] = useState("");
  const [cat, setCat] = useState([]);
  const [credentialId, setCredentialId] = useState(null);

  const [form, setForm] = useState({
    credentialTitle: "",
    credentialCode: "",
    category: null,
    credentialNote: "",
    credentialDescription: "",
    expirationTime: "",
    daysTillExpiration: "",
    status: [],
    customFields: "",
    customField: "",
  });


  useEffect(() => {
    const storedCredentialId = localStorage.getItem("credentialId");
    if (storedCredentialId) {
      // Update the state with the stored value
      setCredentialId(storedCredentialId);
    }
  }, []);

  useEffect(() => {
    if (credentialId) {
      credentialsDetailApi(Number(credentialId));
    }
  }, [credentialId]);

  //Status Listing API

  const [statusListing, setstatusListing] = useState([]);
  const [statusApi, setStatusApi] = useState(false);

  const getStatusList = () => {
    axios
      .get(`${API_URL}/getTrainingStatusList`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setstatusListing(response.data.data);
        setStatusApi(true);
      });
  };

  //Category Add/List

  const [categoryListing, setcategoryListing] = useState([]);
  const [categoryApi, setCategoryApi] = useState(false);
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
        setCategoryApi(true);
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

  useMemo(() => {
    if (categoryApi === false) {
      if (token !== "Bearer null") {
        categoryList();
      }
    }
    if (statusApi === false) {
      if (token !== "Bearer null") {
        getStatusList();
      }
    }

    if (credDetail) {
      setForm({
        credentialTitle: credDetail.credentialTitle,
        credentialCode: credDetail.credentialCode,
        category: cat && cat.map((e) => ({ label: e.label, value: e.value })),
        credentialNote: credDetail.credentialNote,
        credentialDescription: credDetail.credentialDescription,
        expirationTime: credDetail.expirationTime,
        customFields: credDetail.customFields,
        daysTillExpiration: credDetail.daysTillExpiration,
        status: credDetail.statusId,
      });
    }
  }, [credDetail]);

  const credentialsDetailApi = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/getSUCredentialsById/${id}`, {
        headers: { Authorization: token },
      });
      setCredDetail(res.data.data);
      setCat(
        res.data.data.category.map((item) => ({
          value: item.categoryId,
          label: item.categoryName,
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const updateCredentials = (data) => {
    setLoading1(true);
    if (credentialId) {
      data.credentialId = credentialId; // Include credentialId if it exists
    }
    axios
      .post(`${API_URL}/updateSUCredentials/?_method=PUT`, data, {
        headers: { Authorization: token },
      })
      .then((res) => {
        if (res.data.code === 200) {
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Credentials Updated Successfully",
            life: 3000,
          });
        }
        setTimeout(() => {
          navigate("/superadmin/credentiallist");
        }, 3000);
        localStorage.removeItem("credentialId");
      })
      .catch((err) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error Adding Credentials",
          life: 3000,
        });
      });
  };

  const handleSave2 = (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append("credentialId", credentialId);
    formData.append(
      "credentialTitle",
      form.credentialTitle || credDetail.credentialTitle
    );
    formData.append(
      "credentialCode",
      form.credentialCode || credDetail.credentialCode
    );
    formData.append(
      "category",
      form.category && form.category.map((e) => e.value)
    );
    formData.append(
      "credentialNote",
      form.credentialNote || credDetail.credentialNote
    );
    formData.append(
      "credentialDescription",
      form.credentialDescription || credDetail.credentialDescription
    );

    formData.append(
      "expirationTime",
      form.expirationTime || credDetail.expirationTime
    );
    formData.append(
      "daysTillExpiration",
      form.daysTillExpiration || credDetail.daysTillExpiration
    );
    formData.append("status", form.status || credDetail.status);
    formData.append("customFields", JSON.stringify(form.customField) || "");

    if (credDetail) {
      updateCredentials(formData);
    }
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
  const [test, setTest] = useState();

  useEffect(() => {
    console.log({ test });
  }, [test]);
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
                    setTest(
                      field.customNumberOfFields?.map((option, index) => {
                        if (option.selected === 1) {
                          return option.id;
                        }
                      })
                    );
                  }}
                  name={field.fieldName}
                  aria-label="select example"
                >
                  <option value={""}>Select</option>

                  {field.customNumberOfFields?.map((option, index) => {
                    return (
                      <option
                        name={option?.id}
                        value={option?.id}
                        selected={option.selected === "1"}
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
              <div className="col-sm-7 d-flex align-items-center gap-2">
                {field.customNumberOfFields?.map((option, index) => {
                  return (
                    <>
                      <input
                        type="checkbox"
                        name={field.fieldName}
                        value={option?.checked}
                        checked={
                          field.selectedValue
                            ? option.id === field.selectedValue
                            : option.customFieldValue
                        }
                        key={index}
                        onChange={(e) => {
                          onChanges(option.id, idx, e.target.checked);
                        }}
                      />
                      <label for="html">{option.labelName}</label>
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
              <div className="col-sm-7 d-flex align-items-center gap-2">
                {field.customNumberOfFields?.map((option, index) => {
                  return (
                    <>
                      <input
                        type="radio"
                        name={field.fieldName}
                        value={option?.checked}
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
                      <label for="html">{option.labelName}</label>
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
                  type="date"
                  value={field.customFieldValue}
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

  const onChangesText = (fieldID, text, index) => {
    let updatedCustomFields = [...credDetail.customFields];
    updatedCustomFields[index].value = text;
    updatedCustomFields[index].customFieldValue = text;

    const filteredData = updatedCustomFields.filter(
      (item) =>
        item.customFieldTypeId === 1 ||
        item.customFieldTypeId === 2 ||
        item.customFieldTypeId === 3
    );

    const filteredCustomFields = filteredData.filter((data) => data.value);
    console.log({ filteredCustomFields });
    setForm({
      ...form,
      customField: {
        ...form.customField,
        text: filteredCustomFields.map((data) => ({
          id: data.id,
          value: data.value,
        })),
      },
    });
  };

  const onChanges = (optionId, index) => {
    let updatedCustomFields1 = [...credDetail.customFields];
    updatedCustomFields1[index].value = optionId;
    updatedCustomFields1[index].selectedValue = optionId;

    const newArray = updatedCustomFields1.filter(
      (item) => item.selectedValue === optionId
    );

    const filteredSelectData = updatedCustomFields1.filter(
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
      customField: {
        ...form.customField,
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
            <strong>Edit Credentials</strong>
          </CCardHeader>
          {credDetail && (
            <CCardBody className="card-body org border-top p-9">
              <CForm
                className="row g-15 needs-validation"
                form={form}
                onFinish={form.updateCredentials}
              >
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
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
                          //   value={form.categoryName}
                          onChange={(e) => {
                            setForm({
                              ...form,
                              credentialTitle: e.target.value,
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
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
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
                          className="col-sm-2 col-form-label fw-bolder fs-7"
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
                        className="col-sm-4 required col-form-label fw-bolder fs-7"
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
                          }}
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
                        className="col-sm-4 required col-form-label fw-bolder fs-7"
                      >
                        Status
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormSelect
                          required
                          aria-label="select example"
                          value={form.status}
                          onChange={(f) => {
                            setForm({
                              ...form,
                              status: f.target.value,
                            });
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
                <CRow className="md-3">
                  {addCustomFields(credDetail.customFields)}
                </CRow>
              </CForm>
            </CCardBody>
          )}

          {!credDetail && (
            <CCardBody className="card-body org border-top p-9">
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
                onClick={() => {
                  localStorage.removeItem("credentialId");
                }}
                to="/superadmin/credentiallist"
                className="btn btn-primary me-2" // Add me-2 class for spacing
              >
                Back
              </Link>
              <CButton
                className="btn btn-primary me-3" // Add me-3 class for spacing
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
        </CCard>
      </CCol>
    </CRow>
  );
};

export default UpdateCredentials;
