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

const Updateuser = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const navigate = useNavigate();

  const toast = useRef(null);

  const [CredDetail, setCredDetail] = useState("");
  const [cat, setCat] = useState([]);

  // const credentialId = window.location.href.split("?")[1];
  let credentialId = "";
  useEffect(() => {
    credentialId = localStorage.getItem("credentialId");
  }, []);
  const [form, setForm] = useState({
    credentialTitle: "",
    credentialCode: "",
    category: null,
    credentialNote: "",
    credentialDescription: "",
    expirationTime: "",
    daysTillExpiration: "",
    customFields: [],
    status: [],
  });

  useEffect(() => {
    if (credentialId) {
      credentialsDetailApi(Number(credentialId));
    }
  }, [credentialId]);

  useMemo(() => {
    if (CredDetail) {
      setForm({
        credentialTitle: CredDetail.credentialTitle,
        credentialCode: CredDetail.credentialId,

        category: cat && cat.map((e) => ({ label: e.label, value: e.value })),
        credentialNote: CredDetail.credentialNote,
        credentialDescription: CredDetail.credentialDescription,
        expirationTime: CredDetail.expirationTime,

        daysTillExpiration: CredDetail.daysTillExpiration,
        customFields: CredDetail.customFields,
        status: CredDetail.statusId,
      });
    }
  }, [CredDetail]);

  const credentialsDetailApi = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/getCredentialById/${id}`, {
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

  const [num, setNum] = useState(0);

  function randomNumberInRange(min, max) {
    // 👇️ get number between min (inclusive) and max (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const handleClick = () => {
    form.barcode = randomNumberInRange(889666, 897666);
    setNum(randomNumberInRange(1, 5));
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
                  disabled
                  className="form-select"
                  onChange={(e) => {
                    onChanges(parseInt(e.target.value), idx);
                  }}
                  // value={op}
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
              <div className="col-sm-7 d-flex align-items-center gap-2">
                {field.customNumberOfFields?.map((option, index) => {
                  return (
                    <>
                      <input
                        type="checkbox"
                        name={field.fieldName}
                        value={option?.checked}
                        disabled
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
                        disabled
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
                  disabled
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
                  disabled
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
                  disabled
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
  return (
    <CRow>
      <Toast ref={toast} />
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>View Credentials</strong>
          </CCardHeader>
          {CredDetail && (
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
                          disabled
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
                          disabled
                          type="number"
                          id="validationCustom01"
                          placeholder="Credential ID"
                          required
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
                          disabled
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
                            disabled={true}
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
                        Expiration Date
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormInput
                          disabled
                          type="date"
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
                          disabled
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
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Category
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CreatableSelect
                          isDisabled
                          isClearable
                          isMulti
                          value={form.category}
                          // onCreateOption={handleCreateCategory}
                          // onChange={(e) => {
                          //   handleChangeCategory(e);
                          // }}
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
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Status
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormSelect
                          disabled
                          required
                          aria-label="select example"
                          value={form.status}
                        >
                          <option value={CredDetail.status}>
                            {CredDetail.status}
                          </option>
                        </CFormSelect>
                      </div>
                    </CRow>
                  </CCol>
                  {addCustomFields(CredDetail.customFields)}
                </CRow>
              </CForm>
            </CCardBody>
          )}

          {!CredDetail && (
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
                to="/admin/credentials"
                className="btn btn-primary"
                onClick={() => {
                  localStorage.removeItem("credentialId");
                }}
              >
                Back
              </Link>
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Updateuser;
