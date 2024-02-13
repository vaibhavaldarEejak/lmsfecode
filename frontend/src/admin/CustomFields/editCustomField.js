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
  CRow,
} from "@coreui/react";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { Toast } from "primereact/toast";
import { Link, useNavigate } from "react-router-dom";
import getApiCall from "src/server/getApiCall";
import generalUpdateApi from "src/server/generalUpdateApi";

const API_URL = process.env.REACT_APP_API_URL;
const token = "Bearer " + localStorage.getItem("ApiToken");

function editCustomField() {
  const toast = useRef(null);
  let customFieldId = "";
  useEffect(() => {
    customFieldId = localStorage.getItem("FieldID");
  }, []);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (customFieldId) {
      getCustomFieldByID(Number(customFieldId));
    }
  }, [customFieldId]);

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
  const [customFieldTypeData, setCustomFieldTypeData] = useState();
  const getCustomFieldByID = async (id) => {
    setLoading(true);
    try {
      const res = await getApiCall("getOrgCustomFieldById", id);
      setLoading(false);
      setCustomFieldTypeData(res);
    } catch (err) {
      setLoading(false);
    }
  };
  useMemo(() => {
    if (customFieldTypeData) {
      setForm({
        fieldName: customFieldTypeData.fieldName,
        labelName: customFieldTypeData.labelName,
        customFieldTypeId: customFieldTypeData.customFieldTypeId,
        customFieldForId: customFieldTypeData.customFieldForId,
        trainingTypeId: customFieldTypeData.trainingTypeId,
        numberOfFields: customFieldTypeData.numberOfFields,
        customNumberOfFields: customFieldTypeData.customNumberOfFields,
        isActive: customFieldTypeData.isActive,
      });
    }
  }, [customFieldTypeData]);
  const [customFieldTypeData1, setCustomFieldTypeData1] = useState();

  useEffect(() => {
    getCustomFieldForList();
    getCustomFieldTypeList();
  }, []);
  const getCustomFieldTypeList = async () => {
    try {
      const res = await getApiCall("getCustomFieldTypeList");
      setCustomFieldTypeData1(res);
    } catch (err) {}
  };
  const [fieldsForList, setFieldsForList] = useState([]);
  const getCustomFieldForList = async () => {
    try {
      const res = await getApiCall("getCustomFieldForList");
      setFieldsForList(res);
    } catch (err) {}
  };

  // updateOrgCustomFieldById;
  const updateCustomFieldApi = async () => {
    setLoading(true);
    try {
      const res = await generalUpdateApi(
        "updateOrgCustomFieldById",
        form,
        customFieldId
      );
      setLoading(false);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Field Updated successfully!",
        life: 3000,
      });
      localStorage.removeItem("FieldID");
      // setTimeout(() => {
      navigate("/admin/customfields");
      // }, 2000);
    } catch (err) {
      setLoading(false);
    }
  };
  return (
    <CRow>
      <Toast ref={toast} />
      <CCol xs={12}>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
            }}
          >
            <span
              class="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
          </div>
        ) : (
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
                          className="col-sm-4 col-form-label fw-bolder fs-7"
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
                              // arr.fieldName = e.target.value;
                              // setForm({ ...arr });
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
                          Label Name
                        </CFormLabel>
                        <div className="col-sm-7">
                          <CFormInput
                            type="text"
                            placeholder="Label Name"
                            value={form.labelName}
                            onChange={(e) => {
                              setForm({ ...form, labelName: e.target.value });
                            }}
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
                          Custom Field For
                        </CFormLabel>
                        <div className="col-sm-7">
                          <CFormSelect
                            required
                            aria-label="Select Content Type"
                            value={form.customFieldForId}
                            id="contentType2"
                            onChange={(e) => {
                              // setLearningTpye(e.target.value);
                              setForm({
                                ...form,
                                customFieldForId: e.target.value,
                              });
                            }}
                            // onDropdownVisibleChange={() => {
                            //   if (categories.length === 0)
                            //     getCustomFieldForList();
                            // }}
                          >
                            <option value="">Select</option>
                            {fieldsForList?.map((field) => (
                              <option key={field.id} value={field.id}>
                                {field.name}
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
                          Field Type
                        </CFormLabel>
                        <div className="col-sm-7">
                          <CFormSelect
                            value={form.customFieldTypeId}
                            onChange={(e) => {
                              // setFielsType(e.target.value);
                              setForm({
                                ...form,
                                customFieldTypeId: e.target.value,
                              });
                            }}
                            aria-label="select example"
                          >
                            <option>Select field type</option>
                            {customFieldTypeData1 &&
                              customFieldTypeData1.map((e) => (
                                <option key={e.id} value={e.id}>
                                  {e.name}
                                </option>
                              ))}
                          </CFormSelect>
                        </div>
                      </CRow>
                    </CCol>

                    {form.numberOfFields && (
                      <CRow className="mb-3">
                        <CCol md={6}>
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-4 col-form-label fw-bolder fs-7"
                            >
                              Select Number of Fields
                            </CFormLabel>
                            <div className="col-sm-7">
                              <CFormSelect
                                id="fields-count"
                                name="fields-count"
                                value={form.numberOfFields}
                                onChange={(e) => {
                                  // setNumberOfFields(e.target.value);
                                  setForm({
                                    ...form,
                                    numberOfFields: e.target.value,
                                  });
                                }}
                                aria-label="select example"
                              >
                                <option value="">
                                  Select Number Of Fields
                                </option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                              </CFormSelect>
                            </div>
                          </CRow>
                        </CCol>
                        {form.customNumberOfFields.map((item, i) => (
                          <CCol>
                            <CRow
                              className="mb-3 dsfs gap-3"
                              style={{ gap: "0.5rem" }}
                            >
                              <CFormLabel
                                htmlFor=""
                                className="col-sm-4 col-form-label fw-bolder fs-7"
                              ></CFormLabel>
                              <div className="col-sm-7">
                                <CFormInput
                                  type="text"
                                  value={item.labelName}
                                  onChange={(e) => {
                                    //   setForm({
                                    //     ...form,
                                    //     customNumberOfFields.labelName: item.labelName,
                                    //   });
                                    const newCustomNumberOfFields = [
                                      ...form.customNumberOfFields,
                                    ];
                                    newCustomNumberOfFields[i].labelName =
                                      e.target.value;
                                    setForm({
                                      ...form,
                                      customNumberOfFields:
                                        newCustomNumberOfFields,
                                    });
                                  }}
                                />
                              </div>
                            </CRow>
                          </CCol>
                        ))}
                      </CRow>
                    )}
                  </CRow>
                  {form.customFieldForId === "2" && (
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          Custom Training Type
                        </CFormLabel>
                        <div className="col-sm-7">
                          <CFormSelect
                            required
                            aria-label="Select Content Type"
                            value={form.trainingTypeId}
                            id="contentType2"
                            onChange={(e) => {
                              setForm({
                                ...form,
                                trainingTypeId: e.target.value,
                              });
                            }}
                          >
                            <option value="">Select</option>
                            <option value="1">elearning</option>
                            <option value="2">classroom</option>
                            <option value="3">assessment</option>
                          </CFormSelect>
                        </div>
                      </CRow>
                    </CCol>
                  )}
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
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
                  onClick={updateCustomFieldApi}
                  disabled={loading}
                >
                  {loading && (
                    <span
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
                  Update
                </CButton>
                <Link
                  to="/admin/customfields"
                  className="btn btn-primary"
                  onClick={() => {
                    localStorage.removeItem("FieldID");
                  }}
                >
                  Back
                </Link>
              </div>
            </CCardFooter>
          </CCard>
        )}
      </CCol>
    </CRow>
  );
}

export default editCustomField;
