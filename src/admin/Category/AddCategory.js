import React, { useEffect, useState, useMemo, useRef } from "react";
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
import { _ } from "core-js";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";
import { Row } from "react-bootstrap";
import { Toast } from "primereact/toast";
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";
import generalUpdateApi from "src/server/generalUpdateApi";
import { InputCustomEditor } from "./InputCustomEditor";
import "../../css/form.css";

const addEditCategory = () => {
  const toast = useRef(null);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const [categoryId, setCategoryId] = useState();
  let categoryId1 = "";
  useEffect(() => {
    categoryId1 = localStorage.getItem("categoryId");
    setCategoryId(categoryId1)
  }, []);
  const [primaryCategoryList, setprimaryCategoryList] = useState([]);
  const [CategoryDetail, setCategoryDetail] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [validationMessages, setValidationMessages] = useState({});
  const [showValidationMessages, setShowValidationMessages] = useState(false);
  const [isloading, setLoading1] = useState(false);
  const [form, setForm] = useState({
    categoryName: "",
    categoryCode: "",
    description: "",
    primaryCategory: "",
    isActive: 1,
  });

  useEffect(() => {
    if (CategoryDetail) {
      setForm({
        categoryName: CategoryDetail.categoryName,
        categoryCode: CategoryDetail.categoryCode,
        description: CategoryDetail.description,
        primaryCategory: CategoryDetail.primaryCategoryId,
        isActive: CategoryDetail.isActive,
      });
    }
  }, [CategoryDetail]);

  const getGenericCategory = async () => {
    try {
      const res = await getApiCall("getOrganizationCategoryList");
      if (!categoryId) {
        if (
          (res.length > 0 && res[0].categoryCode === null) ||
          res.length === 0
        ) {
          setForm({
            ...form,
            categoryCode: 100001,
          });
        } else {
          setForm({
            ...form,
            categoryCode: parseInt(res[0].categoryCode) + 1,
          });
        }
      }
    } catch (err) {}
  };

  const addCategory = async (data) => {
    setLoading1(true);
    try {
      const res = await postApiCall("addOrganizationCategory", data);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Category Added Successfully",
        life: 3000,
      });
      setTimeout(() => {
        navigate("/admin/categorylist");
      }, 3000);
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Adding Category",
        life: 3000,
      });
    }
  };

  const categoryDetailApi = async (id) => {
    setIsLoading(true);
    try {
      const res = await getApiCall("getOrganizationCategoryById", id);
      setCategoryDetail(res);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  const getPrimaryCategoryList = async () => {
    try {
      const res = await getApiCall("getOrganizationPrimaryCategoryList");
      setprimaryCategoryList(res);
    } catch (err) {}
  };

  const updateCategory = async (data) => {
    const updateData = {
      categoryId: categoryId,
      categoryCode: data.categoryCode,
      categoryName: data.categoryName,
      description: data.description,
      primaryCategory: data.primaryCategory,
      isActive: data.isActive,
    };
    setLoading1(true);
    try {
      const res = await generalUpdateApi(
        "updateOrganizationCategory",
        updateData
      );
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Category Updated Successfully",
        life: 3000,
      });
      localStorage.removeItem("categoryId");

      setTimeout(() => {
        navigate("/admin/categorylist");
      }, 3000);
    } catch (err) {
      setLoading1(false);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Updating Category",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    if (token !== "Bearer null") {
      getGenericCategory();
      getPrimaryCategoryList();
    }
  }, []);

  useEffect(() => {
    if (categoryId) {
      categoryDetailApi(Number(categoryId));
    }
  }, [categoryId]);

  const validateForm = () => {
    const messages = {};
    let isValid = true;

    if (!form.categoryName) {
      messages.categoryName = "Category Name is required";
      isValid = false;
    } else {
      messages.categoryName = "";
    }

    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };
  const handleSave = () => {
    if (validateForm()) {
      // save form data
      if (categoryId) {
        updateCategory(form);
      } else {
        addCategory(form);
      }
    }
  };

  return (
    <CRow>
      <Toast ref={toast} />
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Organization Category</strong>
          </CCardHeader>
          {isLoading ? (
            <CCardBody className="card-body org border-top p-9">
              <CForm className="row g-15 needs-validation">
                <CRow className="mb-1">
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

                <CRow className="mb-1">
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
          ) : (
            <CCardBody className="card-body org border-top p-9">
              <CForm
                className="row g-15 needs-validation"
                form={form}
                onFinish={addCategory}
              >
                <CRow className="mb-1">
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
                          required
                          value={form.categoryName}
                          placeholder="Category Name"
                          onChange={(e) => {
                            setForm({ ...form, categoryName: e.target.value });
                            setValidationMessages({
                              ...validationMessages,
                              categoryName: e.target.value
                                ? ""
                                : "Category Name is required",
                            });
                          }}
                        />
                        {showValidationMessages &&
                          validationMessages.categoryName && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.categoryName}
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
                          disabled
                          id="validationCustom01"
                          value={form.categoryCode}
                          required
                          placeholder="Category Code"
                          onChange={(e) => {
                            setForm({ ...form, categoryCode: e.target.value });
                            setValidationMessages({
                              ...validationMessages,
                              categoryCode: e.target.value
                                ? ""
                                : "Category Code is required",
                            });
                          }}
                        />
                        {showValidationMessages &&
                          validationMessages.categoryCode && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.categoryCode}
                            </div>
                          )}
                        {/* <Link onClick={handleClick}>Category code</Link> */}
                      </div>
                    </CRow>
                  </CCol>
                </CRow>

                <CRow className="mb-1">
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
                          size="xl"
                          id="formSwitchCheckDefaultXL"
                          checked={form.isActive == "1"}
                          onChange={(e) =>
                            e.target.checked
                              ? setForm({ ...form, isActive: "1" })
                              : setForm({ ...form, isActive: "2" })
                          }
                        />
                      </div>
                    </CRow>
                  </CCol>
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 "
                      >
                        Primary Category
                      </CFormLabel>
                      <div className="col-sm-7 mb-2">
                        <select
                          className="form-select"
                          required
                          value={form.primaryCategory}
                          onChange={(f) => {
                            setForm({
                              ...form,
                              primaryCategory: f.target.value,
                            });
                            setValidationMessages({
                              ...validationMessages,
                              primaryCategory: f.target.value
                                ? ""
                                : "Primary Category is required",
                            });
                          }}
                          aria-label="select example"
                        >
                          <option value={""}>Select</option>
                          {primaryCategoryList.map((e) => (
                            <option key={e.categoryId} value={e.categoryId}>
                              {e.categoryName}
                            </option>
                          ))}
                        </select>
                        {showValidationMessages &&
                          validationMessages.primaryCategory && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.primaryCategory}
                            </div>
                          )}
                      </div>
                    </CRow>
                  </CCol>
                </CRow>
                <Row className="mb-1">
                  <CFormLabel
                    htmlFor=""
                    className="col-sm-4 col-form-label fw-bolder fs-7"
                  >
                    Description
                  </CFormLabel>
                  <div className="col-lg-12 fv-row">
                    <InputCustomEditor
                      value={form.description}
                      id="validationCustom01"
                      required
                      label="Description"
                      showErrorMessage={showErrorMessage}
                      onChange={(e) => {
                        setForm({ ...form, description: e });
                        setValidationMessages({
                          ...validationMessages,
                          description: e ? "" : "Description is required",
                        });
                      }}
                    />
                    {showValidationMessages &&
                      validationMessages.description && (
                        <div className="fw-bolder" style={{ color: "red" }}>
                          {validationMessages.description}
                        </div>
                      )}
                  </div>
                </Row>
              </CForm>
            </CCardBody>
          )}
          <CCardFooter>
            <div className="d-flex justify-content-end">
              <Link
                onClick={() => {
                  localStorage.removeItem("categoryId");
                }}
                to="/admin/categorylist"
                className="btn btn-primary me-2"
              >
                Back
              </Link>
              <CButton
                className="me-2"
                onClick={handleSave}
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

export default addEditCategory;
