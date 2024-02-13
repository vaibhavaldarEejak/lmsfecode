import React, { useEffect, useMemo, useState, useRef } from "react";
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
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./../../css/themes.css";
import { Toast } from "primereact/toast";
import { InputCustomEditor } from "../InputCustomEditor/InputCustomEditor"
import CreatableSelect from "react-select/creatable";
import generalUpdateApi from "src/server/generalUpdateApi";

const API_URL = process.env.REACT_APP_API_URL;

const updatefaq = () => {
  const toast = useRef(null),
    colorName = localStorage.getItem("ThemeColor"),
    [themes, setThemes] = useState(colorName),
    [isloading, setLoading1] = useState(false),
    token = "Bearer " + localStorage.getItem("ApiToken"),
    navigate = useNavigate(),
    [validationMessages, setValidationMessages] = useState({}),
    [docDetail, setDocdetail] = useState(""),
    faqId = window.location.href.split("?")[1],
    [categoryListing, setcategoryListing] = useState([]),
    [roleList, setRoleList] = useState([]),

    [form, setForm] = useState({
      faqTitle: "",
      roleId: "",
      category: [],
      faqDescription: "",
      faqLink: "",
      faqType: "",
      isActive: 1,
      isPublish: "",
    });

  const roleListApi = () => {
    axios
      .get(`${API_URL}/getRoleList`, {
        headers: { Authorization: token },
      })
      .then((res) => setRoleList(res.data.data))
      .catch((err) => console.log(err));
  };


  const categoryList = () => {
    axios
      .get(`${API_URL}/getCategoryOptionList`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        const categories = response.data.data.map((category) => ({
          label: category.categoryName,
          value: category.categoryId,
        }));
        setcategoryListing(categories);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const addCategoryApi = (text) => {
    axios
      .post(
        `${API_URL}/addNewCategory `,
        { categoryName: text },
        {
          headers: { Authorization: token },
        }
      )
      .then((res) => {
        res && categoryList();
        if (form.category == null) {
          setForm({
            ...form,
            category: [
              {
                value: res.data.data,
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
                value: res.data.data,
                label: text,
              },
            ],
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCreateCategory = (value) => {
    addCategoryApi(value);
  };

  const handleChangeCategory = (value) => {
    setForm({ ...form, category: value });
  };


  const handleSave = () => {
    updatedocApi(form, faqId);
  }

  useEffect(() => {
    categoryList();
    if (docDetail) {
      setForm({
        faqTitle: docDetail?.faqTitle || "",

        category:
          docDetail.category &&
          docDetail.category.map((e) => ({
            label: e.categoryName,
            value: e.categoryId,
          })),
        faqDescription: docDetail?.faqDescription || "",
        roleId: docDetail.roleId,

        isActive: docDetail?.isActive || 1,
        isPublish: docDetail?.isPublish,
      });
    }
  }, [docDetail]);


  const faqApi = (faqId) => {
    axios
      .get(`${API_URL}/getFaqById/${faqId}`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        setDocdetail(res.data.data);

      })
      .catch((err) => console.log(err));
  };
  useMemo(() => {
    if (token !== "Bearer null") {
      faqApi(faqId);
      roleListApi();
      categoryList();
    }
    setForm({
      ...form,
      category: null,

    });
  }, []);
  const updatedocApi = async (updatedForm, faqId) => {
    let formData = new FormData();

    formData.append("faqId", faqId);
    formData.append("faqTitle", updatedForm.faqTitle);
    const categoryString = form?.category ? form.category.map((e) => e.value).join(",") : "";
    formData.append("category", categoryString);
    formData.append("faqDescription", updatedForm.faqDescription);
    formData.append("roleId", updatedForm.roleId);
    formData.append("isPublish", form.isPublish);

    setLoading1(true);

    try {
      const res = await generalUpdateApi(`updateFaqById/${faqId}`, formData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "FAQ Updated Successfully",
        life: 3000,
      });
      setTimeout(() => {
        navigate("/superadmin/sfaq");
      }, 3000);
    } catch (err) {
      setLoading1(false);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Updating FAQ",
        life: 3000,
      });
    }
  };

  return (
    <CRow>
      <Toast ref={toast} />
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Update FAQ</strong>
          </CCardHeader>
          <CCardBody className="card-body border-top p-9">
            <CForm
              className={`row g-15 needs-validation InputThemeColor${themes}`}
              form={form}

            >
              <CRow>
                <CCol md={6}>
                  <CRow className="mb-1">
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
                      />
                    </div>
                  </CRow>
                </CCol>


                <CCol md={6}>
                  <CRow className="mb-1">
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
                            category: e ? "" : "Categories is required",
                          });
                        }}
                        feedbackInvalid="location"
                        id="validationCustom12"
                        required
                      />
                    </div>
                    {/* <div className="col-sm-7 offset-sm-4 mt-2"></div> */}
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
                    onChange={(e) => {
                      setForm({ ...form, faqDescription: e });
                      setValidationMessages({
                        ...validationMessages,
                        faqDescription: e ? "" : "Description is required",
                      });
                    }}
                  />
                </CCol>
              </CRow>

              <CRow className="mb-3">
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
                        <option disabled value={""}>
                          Select
                        </option>
                        {roleList.map((e) => (
                          <option key={e.roleId} value={e.roleId}>
                            {e.roleName}
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
                      className="col-sm-4 col-form-label fw-bolder fs-7 "
                      style={{ lineHeight: "2" }}
                    >
                      Publish
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormSelect
                        required
                        value={form.isPublish}
                        onChange={(e) => {
                          setForm({ ...form, isPublish: e.target.value });
                        }}
                        style={{ lineHeight: "2" }}
                        aria-label="select example"
                      >
                        <option value="">Select an Option</option>
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
                style={{ marginRight: '10px' }}
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

export default updatefaq;
