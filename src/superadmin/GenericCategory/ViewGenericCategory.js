import React, { useEffect, useState } from "react";
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
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import getApiCall from "src/server/getApiCall";

const ViewGenericCategory = () => {
  const categoryId = window.location.href.split("?")[1],
    [categoryDetail, setcategoryDetail] = useState(""),
    [form, setform] = useState({
      categoryId: "",
      categoryName: "",
      primaryCategoryName: "",
      description: "",
      isActive: 1,
    });

  useEffect(() => {
    if (categoryDetail) {
      setform({
        categoryId: categoryDetail.categoryId,
        categoryName: categoryDetail.categoryName,
        primaryCategoryName: categoryDetail.primaryCategoryName,
        description: categoryDetail.description,
        isActive: categoryDetail.isActive,
      });
    }
  }, [categoryDetail]);

  const getCategoryById = async (id) => {
    try {
      const res = await getApiCall("getCategoryById", id);
      setcategoryDetail(res);
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
    if (categoryId) {
      getCategoryById(Number(categoryId));
    }
  }, [categoryId]);

  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Category Details</strong>
            </CCardHeader>
            <CCardBody className="card-body border-top p-9">
              <CForm className="row g-15 needs-validation ps-4">
                <CRow className="mb-3">
                  <CCol lg={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Category Name :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {categoryDetail.categoryName}
                      </div>
                    </CRow>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Category Code :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {categoryDetail.categoryCode}
                      </div>
                    </CRow>

                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Description :
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        {categoryDetail.description}
                      </div>
                    </CRow>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Status :
                      </CFormLabel>
                      <div className="col-sm-7 py-2 fs-6">
                        {categoryDetail?.isActive === 1 ? (
                          <CBadge
                            className="badge badge-light-info "
                            color="primary"
                          >
                            {categoryDetail?.isActive === 1
                              ? "Active"
                              : "In-Active"}
                          </CBadge>
                        ) : (
                          <CBadge
                            className="badge badge-light-info "
                            color="secondary"
                          >
                            {categoryDetail?.isActive === 1
                              ? "Active"
                              : "In-Active"}
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
    </div>
  );
};

export default ViewGenericCategory;
