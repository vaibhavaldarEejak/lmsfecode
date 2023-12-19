import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormSwitch,
  CFormTextarea,
  CRow,
} from "@coreui/react";
import React, { useEffect, useState, useRef } from "react";
import { Toast } from "primereact/toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
const token = "Bearer " + localStorage.getItem("ApiToken");

function AddCustomFields() {
  const navigate = useNavigate();

  const toast = useRef(null);
  const [isloading, setLoading1] = useState(false);
  const [fielsType, setFielsType] = useState("");
  const [learningTpye, setLearningTpye] = useState("");
  const [numberOfFields1, setNumberOfFields] = useState();
  const [customFieldTypeData, setCustomFieldTypeData] = useState();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fieldName: "",
    labelName: "",
    customFieldTypeId: "",
    customFieldForId: "",
    trainingTypeId: "",
    numberOfFields: "",
    customNumberOfFields: [],
    isActive: 1,
  });

  useEffect(() => {
    getCustomFieldForList();
    getCustomFieldTypeList();
  }, []);
  const getCustomFieldTypeList = () => {
    axios
      .get(`${API_URL}/getCustomFieldTypeList`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        setCustomFieldTypeData(response.data.data);
      });
  };
  const [fieldsForList, setFieldsForList] = useState([]);
  const getCustomFieldForList = async () => {
    try {
      const response = await axios.get(`${API_URL}/getCustomFieldForList`, {
        headers: { Authorization: token },
      });
      setFieldsForList(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const [validationMessages, setValidationMessages] = useState({});
  const [showValidationMessages, setShowValidationMessages] = useState(false);

  const validateForm = () => {
    const messages = {};
    let isValid = true;

    if (!form.fieldName) {
      messages.fieldName = "Feild Name is required";
    }
    if (!form.labelName) {
      messages.labelName = "Label Name is required";
      isValid = false;
    }
    if (!form.customFieldForId) {
      messages.customFieldForId = "Custom Field For is required";
      isValid = false;
    }
    if (!form.customFieldTypeId) {
      messages.customFieldTypeId = "Field Type is required";
      isValid = false;
    }
    if (fielsType === "4" || fielsType === "5" || fielsType === "6")
      if (!form.numberOfFields) {
        messages.numberOfFields = "Number of Fields is required";
        isValid = false;
      }
    if (learningTpye === "2")
      if (!form.trainingTypeId) {
        messages.trainingTypeId = "Select Training Type is required";
        isValid = false;
      }
    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };

  const addOrgCustomField = (form) => {
    setLoading(true);
    axios
      .post(`${API_URL}/addOrgCustomField`, form, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setLoading(false);
        if (!isloading) {
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Custom Field Added Successfully",
            life: 3000,
          });
        }

        setTimeout(() => {
          navigate("/admin/customfields");
        }, 1500);
      });
  };

  const [state, setState] = useState([]);

  useEffect(() => {
    const numberOfFields = parseInt(numberOfFields1);
    if (state.length < numberOfFields) {
      const newFields = Array(numberOfFields - state.length).fill({
        labelName: "",
      });
      setState((prevState) => [...prevState, ...newFields]);
    } else if (state.length > numberOfFields) {
      setState((prevState) => prevState.slice(0, numberOfFields));
    }
  }, [numberOfFields1]);

  const handleChange = (i, event) => {
    setForm((prevForm) => {
      const newValues = [...prevForm.customNumberOfFields];
      newValues[i] = { ...newValues[i], labelName: event.target.value };
      return {
        ...prevForm,
        customNumberOfFields: newValues,
      };
    });
  };
  const handleSave = () => {
    if (validateForm()) {
      addOrgCustomField(form);
    }
  };

  return (
    <CRow>
      <Toast ref={toast} />
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Add Fields</strong>
          </CCardHeader>
          <CCardBody className="card-body border-top p-9">
            <CForm className="row g-15 needs-validation">
              <CCol>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Field Name
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormInput
                          type="text"
                          placeholder="Field Name"
                          value={form.fieldName}
                          onChange={(e) => {
                            setForm({ ...form, fieldName: e.target.value });
                            setValidationMessages({
                              ...validationMessages,
                              fieldName: e.target.value
                                ? ""
                                : "Field Name is required",
                            });
                          }}
                        />
                        {showValidationMessages &&
                          validationMessages.fieldName && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.fieldName}
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
                        Label Name
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormInput
                          type="text"
                          placeholder="Label Name"
                          value={form.labelName}
                          onChange={(e) => {
                            setForm({ ...form, labelName: e.target.value });
                            setValidationMessages({
                              ...validationMessages,
                              labelName: e.target.value
                                ? ""
                                : "Label Name is required",
                            });
                          }}
                        />
                        {showValidationMessages &&
                          validationMessages.labelName && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.labelName}
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
                        Custom Field For
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormSelect
                          required
                          aria-label="Select Content Type"
                          id="contentType2"
                          onChange={(e) => {
                            setLearningTpye(e.target.value);
                            setForm({
                              ...form,
                              customFieldForId: e.target.value,
                            });
                            setValidationMessages({
                              ...validationMessages,
                              customFieldForId: e.target.value
                                ? ""
                                : "Custom Field For is required",
                            });
                          }}
                        >
                          <option value="">Select</option>
                          {fieldsForList?.map((field) => (
                            <option key={field.id} value={field.id}>
                              {field.name}
                            </option>
                          ))}
                        </CFormSelect>
                        {showValidationMessages &&
                          validationMessages.customFieldForId && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.customFieldForId}
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
                        Field Type
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormSelect
                          // value={mediaType}
                          onChange={(e) => {
                            setFielsType(e.target.value);
                            setForm({
                              ...form,
                              customFieldTypeId: e.target.value,
                            });
                            setValidationMessages({
                              ...validationMessages,
                              customFieldTypeId: e.target.value
                                ? ""
                                : "Field Type is required",
                            });
                          }}
                          aria-label="select example"
                        >
                          <option>Select field type</option>
                          {customFieldTypeData &&
                            customFieldTypeData.map((e) => (
                              <option key={e.id} value={e.id}>
                                {e.name}
                              </option>
                            ))}
                        </CFormSelect>
                        {showValidationMessages &&
                          validationMessages.customFieldTypeId && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.customFieldTypeId}
                            </div>
                          )}
                      </div>
                    </CRow>
                  </CCol>

                  {(fielsType === "4" ||
                    fielsType === "5" ||
                    fielsType === "6") && (
                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-4 col-form-label fw-bolder fs-7 required"
                          >
                            Select Number of Fields
                          </CFormLabel>
                          <div className="col-sm-7">
                            <CFormSelect
                              id="fields-count"
                              name="fields-count"
                              onChange={(e) => {
                                setNumberOfFields(e.target.value);
                                setForm({
                                  ...form,
                                  numberOfFields: e.target.value,
                                });
                                setValidationMessages({
                                  ...validationMessages,
                                  numberOfFields: e.target.value
                                    ? ""
                                    : "Enter Number Of Fields required",
                                });
                              }}
                              aria-label="select example"
                            >
                              <option value="">Select Number Of Fields</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                            </CFormSelect>
                            {showValidationMessages &&
                              validationMessages.numberOfFields && (
                                <div
                                  className="fw-bolder"
                                  style={{ color: "red" }}
                                >
                                  {validationMessages.numberOfFields}
                                </div>
                              )}
                          </div>
                        </CRow>
                      </CCol>
                      <CCol>
                        {fielsType === "4" &&
                          state?.map((value, i) => (
                            <CCol>
                              <CRow
                                className="mb-3 dsfsd gap-4"
                                style={{ gap: "1rem" }}
                              >
                                <CFormLabel
                                  htmlFor=""
                                  className="col-sm-4 col-form-label fw-bolder fs-7"
                                ></CFormLabel>
                                <div className="col-sm-7">
                                  <CFormInput
                                    type="text"
                                    placeholder="Enter Radio Option Name"
                                    onChange={(e) => handleChange(i, e)}
                                  />
                                </div>
                              </CRow>
                            </CCol>
                          ))}
                        {fielsType === "5" &&
                          state?.map((value, i) => (
                            <CCol>
                              <CRow
                                className="mb-3 dsfs gap-4"
                                style={{ gap: "1rem" }}
                              >
                                <CFormLabel
                                  htmlFor=""
                                  className="col-sm-4 col-form-label fw-bolder fs-7 "
                                ></CFormLabel>
                                <div className="col-sm-7">
                                  <CFormInput
                                    type="text"
                                    placeholder="Enter Dropdown Option Values"
                                    onChange={(e) => handleChange(i, e)}
                                  />
                                </div>
                              </CRow>
                            </CCol>
                          ))}
                        {fielsType === "6" &&
                          state?.map((value, i) => (
                            <CCol>
                              <CRow
                                className="mb-3 dfsdf gap-4"
                                style={{ gap: "1rem" }}
                              >
                                <CFormLabel
                                  htmlFor=""
                                  className="col-sm-4 col-form-label fw-bolder fs-7 "
                                ></CFormLabel>
                                <div className="col-sm-7">
                                  <CFormInput
                                    type="text"
                                    placeholder="Enter Checkbox Option Name"
                                    onChange={(e) => handleChange(i, e)}
                                  />
                                </div>
                              </CRow>
                            </CCol>
                          ))}
                      </CCol>
                    </CRow>
                  )}
                </CRow>
                {learningTpye === "2" && (
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Custom Training Type
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormSelect
                          required
                          className="required"
                          aria-label="Select Content Type"
                          // value={mediaPayload.contentType}
                          id="contentType2"
                          onChange={(e) => {
                            setForm({
                              ...form,
                              trainingTypeId: e.target.value,
                            });
                            setValidationMessages({
                              ...validationMessages,
                              trainingTypeId: e.target.value
                                ? ""
                                : "Select Training Type is required",
                            });
                          }}
                        >
                          <option value="">Select</option>
                          <option value="1">elearning</option>
                          <option value="2">classroom</option>
                          <option value="3">assessment</option>
                        </CFormSelect>
                        {showValidationMessages &&
                          validationMessages.trainingTypeId && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.trainingTypeId}
                            </div>
                          )}
                      </div>
                    </CRow>
                  </CCol>
                )}
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7 "
                    >
                      Status
                    </CFormLabel>
                    <div
                      className="col-sm-7"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <CFormSwitch
                        size="xxl"
                        id="formSwitchCheckDefaultXL"
                        checked={form.isActive === 1}
                        onChange={(e) =>
                          e.target.checked
                            ? setForm({ ...form, isActive: 1 })
                            : setForm({ ...form, isActive: 2 })
                        }
                      />
                    </div>
                  </CRow>
                </CCol>
              </CCol>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <div className="d-flex justify-content-end">
              <CButton
                className="btn btn-primary me-2"
                onClick={handleSave}
                disabled={loading}
              >
                {loading && (
                  <span
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                Save
              </CButton>
              <Link to="/admin/customfields" className="btn btn-primary">
                Back
              </Link>
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  );
}

export default AddCustomFields;
