import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CRow,
  CFormSwitch,
  CForm,
  CCardFooter,
} from "@coreui/react";
import { Link } from "react-router-dom";
import getApiCall from "src/server/getApiCall";

const ViewOrganizationcategory = () => {
  const categoryId = window.location.href.split("?")[1],
    [categoryID, setcategoryID] = useState([]),
    [form, setForm] = useState({
      categoryName: "",
      categoryCode: "",
      primaryCategory: "",
      description: "",
      isActive: 1,
    });

  useEffect(() => {
    if (categoryID) {
      setForm({
        categoryName: categoryID.categoryName,
        categoryCode: categoryID.categoryCode,
        primaryCategory: categoryID.primaryCategory,
        description: categoryID.description,
        isActive: categoryID.isActive,
      });
    }
  }, [categoryID]);

  const getCategoryById = async (categoryId) => {
    try {
      const res = await getApiCall("getCategoryById", categoryId);
      setcategoryID(res);
    } catch (err) {
      var errMsg = err.response.data.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
    }
  };

  useEffect(() => {
    if (categoryId) {
      getCategoryById(Number(categoryId));
    }
  }, [categoryId]);

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Category</strong>
          </CCardHeader>
          <CCardBody className="card-body border-top p-9">
            <CForm className="row g-15 needs-validation">
              <CRow className="mb-3">
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7"
                    >
                      Category Name
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        disabled
                        type="text"
                        id="validationCustom01"
                        required
                        value={form.categoryName}
                        onChange={(e) =>
                          setForm({ ...form, categoryName: e.target.value })
                        }
                        placeholder="Notification Name"
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
                      Category Code
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        disabled
                        type="text"
                        id="validationCustom01"
                        required
                        value={form.categoryCode}
                        onChange={(e) =>
                          setForm({ ...form, categoryCode: e.target.value })
                        }
                        placeholder="Category Code"
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
                      Description
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        disabled
                        type="text"
                        id="validationCustom01"
                        required
                        value={form.description}
                        onChange={(e) =>
                          setForm({ ...form, description: e.target.value })
                        }
                        placeholder=" Description"
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
                      Status
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormSwitch
                        disabled
                        size="xl"
                        id="formSwitchCheckDefaultXL"
                        checked={form.isActive === 1}
                        onChange={(e) =>
                          e.target.checked
                            ? setForm({ ...form, isActive: 1 })
                            : setForm({ ...form, isActive: 0 })
                        }
                      />
                    </div>
                  </CRow>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <div className="d-flex justify-content-end">
              <Link
                to="/superadmin/genericcategorylist"
                className="btn btn-primary"
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

export default ViewOrganizationcategory;
