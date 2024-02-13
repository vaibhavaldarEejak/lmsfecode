import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CRow,
  CFormSelect,
  CFormSwitch,
  CForm,
  CCardFooter,
  CButton,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../../scss/required.scss";
import { Skeleton } from "primereact/skeleton";
import postApiCall from "src/server/postApiCall";
import getApiCall from "src/server/getApiCall";
import generalUpdateApi from "src/server/generalUpdateApi";

const addEditOrganizationCategory = () => {
  const categoryId = window.location.href.split("?")[1],
    navigate = useNavigate(),
    [isLoading, setIsLoading] = useState(false),
    [primaryCategoryList, setprimaryCategoryList] = useState([]),
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

  const getPrimaryCategoryList = async () => {
    try {
      const res = await getApiCall("getPrimaryCategoryList");
      setprimaryCategoryList(res);
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

  const addOrganizationCategory = async (data) => {
    try {
      const res = await postApiCall("addOrganizationCategory", data);
      navigate("/superadmin/genericcategorylist");
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

  const updateOrganizationCategory = async (data) => {
    const updateData = {
      categoryId: categoryId,
      categoryName: data.categoryName,
      categoryCode: data.categoryCode,
      primaryCategory: data.primaryCategory,
      description: data.description,
      isActive: data.isActive,
    };

    try {
      const res = await generalUpdateApi(
        "updateOrganizationCategory",
        updateData
      );
      navigate("/superadmin/genericcategorylist");
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

  const getOrganizationCategoryById = async (categoryId) => {
    setIsLoading(true);
    try {
      const res = await getApiCall("getOrganizationCategoryById", categoryId);
      setcategoryID(res);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
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
    getPrimaryCategoryList();
  }, []);

  useEffect(() => {
    if (categoryId) {
      getOrganizationCategoryById(Number(categoryId));
    }
  }, [categoryId]);

  const handleSave = () => {
    if (categoryId) {
      updateOrganizationCategory(form);
    } else {
      addOrganizationCategory(form);
    }
  };

  const SkeletonLoader = () => (
    <CCardBody className="card-body border-top p-9">
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
      </CForm>
    </CCardBody>
  );

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Category</strong>
          </CCardHeader>
          {isLoading ? (
            { SkeletonLoader }
          ) : (
            <CCardBody className="card-body border-top p-9">
              <CForm className="row g-15 needs-validation">
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Category Name
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormInput
                          type="text"
                          id="validationCustom01"
                          value={form.categoryName}
                          onChange={(e) =>
                            setForm({ ...form, categoryName: e.target.value })
                          }
                          required
                          placeholder="Category Name"
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
                        Category Code
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormInput
                          type="number"
                          onKeyDown={(e) => {
                            if (e.key === "e" || e.key === "E") {
                              e.preventDefault();
                            }
                          }}
                          id="validationCustom01"
                          value={form.categoryCode}
                          onChange={(e) =>
                            setForm({ ...form, categoryCode: e.target.value })
                          }
                          required
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
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Description
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormInput
                          type="text"
                          id="validationCustom01"
                          value={form.description}
                          onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                          }
                          required
                          placeholder="Description"
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
                        Primary Category
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormSelect
                          required
                          value={form.primaryCategory}
                          onChange={(f) =>
                            setForm({
                              ...form,
                              primaryCategory: f.target.value,
                            })
                          }
                          aria-label="select example"
                        >
                          <option disabled value={""}>
                            Select
                          </option>
                          {primaryCategoryList.map((e) => (
                            <option key={e.categoryId} value={e.categoryName}>
                              {e.categoryName}
                            </option>
                          ))}
                        </CFormSelect>
                      </div>
                    </CRow>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          )}
          <CCardFooter>
            <div className="d-flex justify-content-end">
              <CButton className="btn btn-primary me-2" onClick={handleSave}>
                Save
              </CButton>
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

export default addEditOrganizationCategory;
