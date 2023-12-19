import React, { useEffect, useState, useRef } from "react";
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
  CButton,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./../../css/themes.css";
import { Toast } from "primereact/toast";
import { InputCustomEditor } from "../InputCustomEditor/InputCustomEditor";
import CreatableSelect from "react-select/creatable";
import postApiCall from "src/server/postApiCall";
import getApiCall from "src/server/getApiCall";
import "../../css/form.css";

const addfaq = () => {
  const toast = useRef(null),
    colorName = localStorage.getItem("ThemeColor"),
    [themes, setThemes] = useState(colorName),
    [isloading, setLoading1] = useState(false),
    token = "Bearer " + localStorage.getItem("ApiToken"),
    navigate = useNavigate(),
    [validationMessages, setValidationMessages] = useState({}),
    [showValidationMessages, setShowValidationMessages] = useState(false),
    [categoryListing, setcategoryListing] = useState([]),
    [roleList, setRoleList] = useState([]),
    [showErrorMessage, setShowErrorMessage] = useState(false);

  let formData = new FormData();

  useEffect(() => {
    if (token !== "Bearer null") {
      roleListApi();
      categoryList();
    }
    setForm({
      ...form,
      category: null,
    });
  }, []);

  const roleListApi = async () => {
    try {
      const res = await getApiCall("getRoleList");
      setRoleList(res);
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

  const [form, setForm] = useState({
    faqTitle: "",
    roleId: "",
    category: null,
    faqDescription: "",
    faqLink: "",
    faqType: "",
    isActive: 1,
    isPublish: "",
  });

 

  const addDocument = async (data) => {
    setLoading1(true);
    try {
      const res = await postApiCall("addFaq", data);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "FAQ Added Successfully",
        life: 3000,
      });
      setTimeout(() => {
        navigate("/superadmin/sfaq");
      }, 3000);
    } catch (err) {
      let errorMessage = "An error occurred";
      if (err.response && err.response.data && err.response.data.errors) {
        errorMessage = err.response.data.errors;
      }
      toast.current.show({
        severity: "error",
        summary: "Error Adding FAQ",
        detail: errorMessage,
        life: 3000,
      });
    }
  };

  const categoryList = async () => {
    try {
      const res = await getApiCall("getCategoryOptionList");
      setcategoryListing(
        res.map((e) => ({
          label: e.categoryName,
          value: e.categoryId,
        }))
      );
    } catch (err) { }
  };

  const addCategoryApi = async (text) => {
    const data = { categoryName: text };
    try {
      const res = await postApiCall("addNewCategory", data);
      categoryList();
      if (form.category == null) {
        setForm({
          ...form,
          category: [
            {
              value: res,
              label: text,
            },
          ],
        });
      } else {
        setForm({
          ...form,
          category: [
            ...form.category,
            {
              value: res,
              label: text,
            },
          ],
        });
      }
    } catch (err) {
      setLoading1(false);
    }
  };

  const handleCreateCategory = (value) => {
    addCategoryApi(value);
  };

  const handleChangeCategory = (value) => {
    setForm({ ...form, category: value });
  };

  const validateForm = () => {
    const messages = {};
    let isValid = true;

    if (!form.faqTitle) {
      messages.faqTitle = "FAQ Name  is required";
      isValid = false;
    }
    if (!form.faqDescription) {
      messages.faqDescription = "FAQ Description  is required";
      isValid = false; 
    }

    if (!form.category) {
      messages.category = "Category Name  is required";
      isValid = false;
    }
    if (!form.roleId) {
      messages.roleId = "Role Name  is required";
      isValid = false;
    }
    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };

  const handleSave = () => {
    if (validateForm()) {
      let categoryString = "";
      if (form.category !== null) {
        categoryString = form.category.map((e) => e.value).join(",");
      }
      const formDataWithCategory = {
        ...form,
        category: categoryString,
      };
      addDocument(formDataWithCategory);
    }
  };

  return (
    <CRow>
      <Toast ref={toast} />
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Add FAQ</strong>
          </CCardHeader>
          <CCardBody className="card-body org border-top p-9">
            <CForm
              className={`row g-15 needs-validation InputThemeColor${themes}`}
              form={form}
              onFinish={addDocument}
            >
              <CRow className="">
                <CCol md={6}>
                  <CRow className="">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7 required"

                    >
                      FAQ Tittle
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="text"
                        value={form.faqTitle}
                        onChange={(e) => {
                          setForm({ ...form, faqTitle: e.target.value });
                          setValidationMessages({
                            ...validationMessages,
                            faqTitle: e.target.value
                              ? ""
                              : "title Name is required",
                          });
                        }}
                        id="validationCustom01"
                        required
                        placeholder="FAQ Name"
                        style={{ lineHeight: "1.5" }}
                      />
                      {showValidationMessages && validationMessages.faqTitle && (
                        <div className="fw-bolder" style={{ color: "red" }}>
                          {validationMessages.faqTitle}
                        </div>
                      )}
                    </div>
                  </CRow>
                </CCol>

                <CCol md={6}>
                  <CRow className="">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7 required"
                    >
                      Category
                    </CFormLabel>

                    <div className="col-sm-7">
                      <CreatableSelect
                        isClearable
                        isMulti
                        options={categoryListing}
                        value={form.category}
                        onCreateOption={handleCreateCategory}
                        onChange={(e) => {
                          handleChangeCategory(e);
                          setValidationMessages({
                            ...validationMessages,
                            category: e ? "" : "Categories are required",
                          });
                        }}
                        feedbackInvalid="location"
                        id="validationCustom12"
                        required
                        styles={{
                          // Apply line height directly to the CreatableSelect components
                          control: (provided) => ({
                            ...provided,
                            lineHeight: "1",
                          }),
                          singleValue: (provided) => ({
                            ...provided,
                            lineHeight: "1",
                          }),
                          // Add more styles if needed
                        }}
                      />
                      {showValidationMessages && validationMessages.category && (
                        <div className="fw-bolder" style={{ color: "red" }}>
                          {validationMessages.category}
                        </div>
                      )}
                    </div>
                    <div className="col-sm-7 offset-sm-4 mt-2" style={{ lineHeight: "1" }}></div>
                  </CRow>
                </CCol>

              </CRow>

              <CRow className="mb-2">
                <CCol md={2}>
                  <CFormLabel
                    htmlFor=""
                    className="col-form-label fw-bolder fs-7"
                  >
                    Description
                  </CFormLabel>
                </CCol>
                <CCol md={10}>
                  <InputCustomEditor
                    value={form.faqDescription}
                    id="validationCustom01"
                    required
                    label="Description"
                    showErrorMessage={showErrorMessage}
                    onChange={(e) => {
                      setForm({ ...form, faqDescription: e });
                      setValidationMessages({
                        ...validationMessages,
                        faqDescription: e ? "" : "Description is required",
                      });
                    }}
                    style={{ lineHeight: "1.5" }}
                  />

                  {showValidationMessages && validationMessages.faqDescription && (
                    <div className="fw-bolder" style={{ color: "red" }}>
                      {validationMessages.faqDescription}
                    </div>
                  )}
                </CCol>
              </CRow>

              <CRow className="mb-2">
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      style={{ lineHeight: "2 !important" }}
                    >
                      Role
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormSelect
                        required
                        value={form.roleId}
                        onChange={(f) => {
                          setForm({ ...form, roleId: f.target.value });
                        }}
                        aria-label="select example"
                        style={{ lineHeight: "2" }}
                      >
                        <option disabled value={""}style={{ lineHeight: "2 !important" }}>
                          Select
                        </option>
                        {roleList.map((e) => (
                          <option key={e.roleId} value={e.roleId}>
                            {e.roleName}
                          </option>
                        ))}
                         {showValidationMessages && validationMessages.roleName && (
                    <div className="fw-bolder" style={{ color: "red" }}>
                      {validationMessages.roleName}
                    </div>
                  )}

                      </CFormSelect>
                    </div>
                  </CRow>
                </CCol>

                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-4 col-form-label fw-bolder fs-7 "
                      style={{ lineHeight: "2" }}
                    >
                      Publish
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormSelect
                        required
                        value={form.isPublish}
                        onChange={(f) => {
                          setForm({ ...form, isPublish: f.target.value });
                        }}
                        style={{ lineHeight: "2" }}
                        aria-label="select example"
                      ><option value="">Select an Option</option>
                        <option value="0">Unpublish</option>
                        <option value="1">Publish</option>

                      </CFormSelect>
                    </div>
                  </CRow>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <div className="d-flex justify-content-end">
              <Link
                to="/superadmin/sfaq"
                className={`btn btn-primary saveButtonTheme${themes}`}
                style={{ marginRight: "10px" }}
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
                    class="spinner-border spinner-border-sm me-2"
                    roleId="status"
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

export default addfaq;
