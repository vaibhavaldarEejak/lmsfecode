import React, { useEffect, useMemo, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormLabel,
  CRow,
  CForm,
  CCardFooter,
  CBadge,
} from "@coreui/react";
import { Link } from "react-router-dom";
import getApiCall from "src/server/getApiCall";
function ViewCustomFields() {
  const API_URL = process.env.REACT_APP_API_URL;
  const token = "Bearer " + localStorage.getItem("ApiToken");

  const [form, setForm] = useState({
    customFieldFor: "",
    customFieldForId: "",
    customFieldType: "",
    customFieldTypeId: "",
    customNumberOfFields: [],
    fieldName: "",
    id: "",
    isActive: "",
    labelName: "",
    numberOfFields: "",
    trainingType: "",
    trainingTypeId: "",
    status: true,
  });
  const [responseData, setResponseData] = useState();
  // const customFieldId = window.location.href.split("?")[1];
  let customFieldId = "";
  useEffect(() => {
    customFieldId = localStorage.getItem("FieldID");
  }, []);

  const getOrgCustomFieldById = async (id) => {
    try {
      const res = await getApiCall("getOrgCustomFieldById", id);
      setResponseData(res);
    } catch (err) {}
  };

  useEffect(() => {
    getOrgCustomFieldById(customFieldId);
  }, [customFieldId]);

  useMemo(() => {
    if (responseData) {
      setForm({
        customFieldFor: responseData.customFieldFor,
        customFieldForId: responseData.customFieldForId,
        customFieldType: responseData.customFieldType,
        customFieldTypeId: responseData.customFieldTypeId,
        customNumberOfFields: responseData.customNumberOfFields,
        fieldName: responseData.fieldName,
        id: responseData.id,
        isActive: responseData.isActive,
        labelName: responseData.labelName,
        numberOfFields: responseData.numberOfFields,
        trainingType: responseData.trainingTypeId,
        trainingTypeId: responseData.trainingType,
      });
    }
  }, [responseData]);

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Custom Field Details</strong>
          </CCardHeader>
          <CCardBody className="card-body border-top p-9">
            <CForm
              className="row g-15 needs-validation ps-4"
              form={form}
              //   onFinish={medialibraryApi}
            >
              <CRow className="mb-3">
                <CCol lg={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7"
                    >
                      Label Name :
                    </CFormLabel>
                    <div className="col-sm-7 py-2">{form.labelName}</div>
                  </CRow>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7"
                    >
                      Field For :
                    </CFormLabel>
                    <div className="col-sm-7 py-2">{form.customFieldFor}</div>
                  </CRow>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7"
                    >
                      Field Type :
                    </CFormLabel>
                    <div className="col-sm-7 py-2">{form.customFieldType}</div>
                  </CRow>
                  {form.numberOfFields && (
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Number of Fields:
                      </CFormLabel>
                      <div className="col-sm-7 py-2">{form.numberOfFields}</div>
                    </CRow>
                  )}
                  {form.customFieldForId === 2 && (
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Training Type:
                      </CFormLabel>
                      <div className="col-sm-7 py-2">{form.trainingType}</div>
                    </CRow>
                  )}

                  {form.customNumberOfFields?.map((item, i) => (
                    <CRow className="mb-3" key={i}>
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >{`Input Field ${i + 1}:`}</CFormLabel>
                      <div className="col-sm-7 py-2"> {item.labelName}</div>
                    </CRow>
                  ))}
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7"
                    >
                      Status :
                    </CFormLabel>
                    <div className="col-sm-7 py-2 fs-6">
                      {form?.isActive === 1 ? (
                        <CBadge
                          className="badge badge-light-info "
                          color="primary"
                        >
                          {form?.isActive === 1 ? "Active" : "In-Active"}
                        </CBadge>
                      ) : (
                        <CBadge
                          className="badge badge-light-info "
                          color="secondary"
                        >
                          {form?.isActive === 1 ? "Active" : "In-Active"}
                        </CBadge>
                      )}
                    </div>
                  </CRow>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <div className="d-flex justify-content-end">
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
      </CCol>
    </CRow>
  );
}

export default ViewCustomFields;
