import React, { useEffect, useState, useRef } from "react";
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
  CButton,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../../scss/required.scss";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import { InputCustomEditor } from "./EditorBox/InputCustomEditor";
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";
import generalUpdateApi from "src/server/generalUpdateApi";
import "../../css/form.css";

const addEditCategory = () => {
  const toast = useRef(null),
    [isloading, setLoading1] = useState(false),
    // categoryId = window.location.href.split("?")[1],
    navigate = useNavigate(),
    [isLoading, setIsLoading] = useState(false),
    [primaryCategoryList, setprimaryCategoryList] = useState([]),
    [categoryID, setcategoryID] = useState([]),
    [validationMessages, setValidationMessages] = useState({}),
    [showValidationMessages, setShowValidationMessages] = useState(false),
    [form, setForm] = useState({
      categoryName: "",
      categoryCode: "",
      primaryCategory: "",
      description: "",
      isActive: 1,
    }),

    [categoryId, setCategoryId] = useState();
    let categoryId1 = "";
    useEffect(() => {
      categoryId1 = localStorage.getItem("categoryId");
      setCategoryId(categoryId1)
    }, []);

  useEffect(() => {
    if (categoryID) {
      setForm({
        categoryName: categoryID.categoryName,
        categoryCode: categoryID.categoryCode,
        primaryCategory: categoryID.primaryCategoryId,
        description: categoryID.description,
        isActive: categoryID.isActive,
      });
    }
  }, [categoryID]);

  const getGenericCategoryList = async () => {
    try {
      const res = await getApiCall("getGenericCategoryList");
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

  const addCategory = async (data) => {
    setLoading1(true);
    try {
      const res = await postApiCall("addNewCategory", data);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Category Added Successfully",
        life: 3000,
      });
      setTimeout(() => {
        navigate("/superadmin/genericcategorylist");
      }, 3000);
    } catch (err) {
      setLoading1(false);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Adding Category",
        life: 3000,
      });
    }
  };

  const updateApi = async (data) => {
    const updateData = {
      categoryId: categoryId,
      categoryName: data.categoryName,
      categoryCode: data.categoryCode,
      primaryCategory: data.primaryCategory,
      description: data.description,
      isActive: data.isActive,
    };
    setLoading1(true);

    try {
      const res = await generalUpdateApi("updateCategoryById", updateData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Category Updated Successfully",
        life: 3000,
      });
      localStorage.removeItem("categoryId");

      setTimeout(() => {
        navigate("/superadmin/genericcategorylist");
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

  const getCategoryById = async (categoryId) => {
    setIsLoading(true);
    try {
      const res = await getApiCall("getCategoryById", categoryId);
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
    if (!categoryId) {
      setIsLoading(true);
      getGenericCategoryList();
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }

    getPrimaryCategoryList();
  }, []);

  useEffect(() => {
    if (categoryId) {
      getCategoryById(Number(categoryId));
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
    localStorage.removeItem("categoryId");

    if (validateForm()) {
      if (categoryId) {
        localStorage.removeItem("categoryId");
        updateApi(form);
      } else {
        addCategory(form);
      }
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
              <div className="col-sm-7 py-2 mb-2">
                <Skeleton width="97%"></Skeleton>
              </div>
            </CRow>
          </CCol>
          <CRow className="mb-3">
            <CCol md={6}>
              <CRow className="mb-3">
                <CFormLabel
                  htmlFor=""
                  className="col-sm-4 col-form-label fw-bolder fs-7"
                >
                  <Skeleton width="85%" className="mr-2"></Skeleton>
                </CFormLabel>
                <div className="ms-1 col-sm-7 py-2">
                  <Skeleton width="99%"></Skeleton>
                </div>
              </CRow>
            </CCol>
          </CRow>
        </CRow>
      </CForm>
    </CCardBody>
  );

  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);

  return (
    <CRow>
      <Toast ref={toast}></Toast>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className={`formHeader${themes}`}>
            <strong>Category</strong>
          </CCardHeader>
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <CCardBody className="card-body org border-top p-9">
              <CForm
                className={`row g-15 needs-validation InputThemeColor${themes}`}
              >
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
                          required
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
                      </div>
                    </CRow>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <CCol md={12}>
                    <CRow className="mb-4">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-2 col-form-label fw-bolder fs-7 "
                      >
                        Description
                      </CFormLabel>
                      <div className="col-sm-10">
                        <InputCustomEditor
                          value={form.description}
                          label="Description"
                          onChange={(e) => {
                            setForm({ ...form, description: e });
                            setValidationMessages({
                              ...validationMessages,
                              description: e ? "" : "Description is required",
                            });
                          }}
                        ></InputCustomEditor>
                        {showValidationMessages &&
                          validationMessages.description && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.description}
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
                        className="col-sm-4 col-form-label fw-bolder fs-7 "
                      >
                        Primary Category
                      </CFormLabel>
                      <div className="col-sm-7">
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
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Status
                      </CFormLabel>
                      <div className="ms-1 col-sm-7 mb-2">
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
                </CRow>
              </CForm>
            </CCardBody>
          )}
          <CCardFooter>
            <div className="d-flex justify-content-end">
              <Link
                to="/superadmin/genericcategorylist"
                className={`btn btn-primary me-2 saveButtonTheme${themes}`}
                onClick={() => {
                  localStorage.removeItem("categoryId");
                }}
              >
                Back
              </Link>
              <CButton
                className={`me-2 saveButtonTheme${themes}`}
                onClick={handleSave}
                disabled={isloading}
              >
                {isloading && (
                  <span
                    class={`spinner-border spinner-border-sm me-2 `}
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
