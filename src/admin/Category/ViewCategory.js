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
  CButton,
  CBadge,
} from "@coreui/react";
import { Link } from "react-router-dom";
import axios from "axios";
import { _ } from "core-js";
import getApiCall from "src/server/getApiCall";
const API_URL = process.env.REACT_APP_API_URL;

const addEditCategory = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  // const categoryId = window.location.href.split("?")[1];
  let categoryId = "";
  useEffect(() => {
    categoryId = localStorage.getItem("categoryId");
  }, []);
  const [CategoryDetail, setCategoryDetail] = useState("");

  const [form, setForm] = useState({
    categoryCode: "",
    categoryName: "",
    description: "",
    primaryCategory: "",

    isActive: 1,
  });

  useEffect(() => {
    if (CategoryDetail) {
      setForm({
        categoryId: categoryId,
        categoryCode: CategoryDetail.categoryCode,
        categoryName: CategoryDetail.categoryName,
        description: CategoryDetail.description,
        primaryCategory: CategoryDetail.primaryCategory,
        isActive: CategoryDetail.isActive,
      });
    }
  }, [CategoryDetail]);

  const categoryDetailApi = async (id) => {
    try {
      const response = await getApiCall("getOrganizationCategoryById", id);
      setCategoryDetail(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (categoryId) {
      categoryDetailApi(Number(categoryId));
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
              <CForm
                className="row g-15 needs-validation ps-4"
                form={form}
                onFinish={categoryDetailApi}
              >
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
                        {CategoryDetail.categoryName}
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
                        {CategoryDetail.categoryCode}
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
                        {CategoryDetail.description}
                      </div>
                    </CRow>

                    {/* <CRow className="mb-3">
                  <CFormLabel
                    htmlFor=""
                    className="col-sm-4 col-form-label fw-bolder fs-7"
                  >
                    Primary Category :
                  </CFormLabel>
                  <div className="col-sm-7 py-2">
                    {categoryDetail.primaryCategoryName}
                  </div>
                </CRow>    */}

                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Status :
                      </CFormLabel>
                      <div className="col-sm-7 py-2 fs-6">
                        {CategoryDetail?.isActive === 1 ? (
                          <CBadge
                            className="badge badge-light-info "
                            color="primary"
                          >
                            {CategoryDetail?.isActive === 1
                              ? "Active"
                              : "In-Active"}
                          </CBadge>
                        ) : (
                          <CBadge
                            className="badge badge-light-info "
                            color="secondary"
                          >
                            {CategoryDetail?.isActive === 1
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
                <Link to="/admin/categorylist" className="btn btn-primary">
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

export default addEditCategory;
