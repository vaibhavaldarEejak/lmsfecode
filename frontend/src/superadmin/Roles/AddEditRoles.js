import React, { useEffect, useMemo, useRef, useState } from "react";
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
import "../../scss/required.scss";
import { Toast } from "primereact/toast";
import "../../css/form.css";
const API_URL = process.env.REACT_APP_API_URL;
import generalUpdateApi from "src/server/generalUpdateApi";
import getApiCall from "src/server/getApiCall";

const addEditRoles = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken"),
    navigate = useNavigate(),
    [validationMessages, setValidationMessages] = useState({}),
    [showValidationMessages, setShowValidationMessages] = useState(false),
    roleId = window.location.href.split("?")[1],
    [roleDetail, setroleDetail] = useState(""),
    [isloading, setLoading1] = useState(false),
    toast = useRef(null),
    [disableButton, setDisableButton] = useState(true),
    colorName = localStorage.getItem("ThemeColor"),
    [themes, setThemes] = useState(colorName),
    [form, setform] = useState({
      roleId: "",
      roleName: "",
      description: "",
      isActive: 1,
    });

  useEffect(() => {
    if (roleDetail) {
      setform({
        roleId: roleDetail.roleId,
        roleName: roleDetail.roleName,
        description: roleDetail.description,
        isActive: roleDetail.isActive,
      });
    }
  }, [roleDetail]);

  const updateRoleApi = async (data) => {
    setLoading1(true);
    setDisableButton(true);
    const updateData = {
      roleId: roleId,
      roleName: data.roleName,
      roleType: data.roleType,
      description: data.description,
      isActive: data.isActive,
    };

    try {
      const res = await generalUpdateApi("updateRole", updateData);
      setDisableButton(true);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Role Updated successfully!",
        life: 3000,
      });
      setTimeout(() => {
        setLoading1(false);
        navigate("/superadmin/roleslist");
      }, 2000);
    } catch (error) {
      var errMsg = error?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
    }
  };

  const roleDetailApi = async (id) => {
    try {
      const res = await getApiCall("getRoleById", id);
      setroleDetail(res);
    } catch (err) {}
  };

  const addRoles = (data) => {
    setLoading1(true);

    axios
      .post(`${API_URL}/addNewRole`, data, {
        headers: { Authorization: token },
      })
      .then((response) => {
        if (response) {
          navigate("/superadmin/roleslist");
        }
      })
      .catch((error) => {
        var errMsg = error?.response?.data?.error;
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: errMsg,
          life: 3000,
        });
      });
  };

  useMemo(() => {
    if (roleId) {
      roleDetailApi(Number(roleId));
    }
  }, [roleId]);
  const validateForm = () => {
    const messages = {};
    let isValid = true;

    if (!form.roleName) {
      messages.roleName = "Role Name is required";
      isValid = false;
    } else {
      messages.groupName = "";
    }

    if (!form.description) {
      messages.description = "Description is required";
      isValid = false;
    }

    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };
  const handleSave = () => {
    if (validateForm()) {
      if (roleId) {
        updateRoleApi(form);
      } else {
        addRoles(form);
      }
    }
  };

  return (
    <CRow>
      <CCol xs={12} md={8} lg={12}>
        <CCard className="mb-4 mb-lg-0">
          <Toast ref={toast} />

          <CCardHeader className={`formHeader${themes}`}>
            <strong>Role</strong>
          </CCardHeader>
          {roleDetail && (
            <CCardBody className="card-body org border-top p-9">
              <CForm
                className={`row g-15 needs-validation InputThemeColor${themes}`}
                form={form}
                onFinish={addRoles}
              >
                <CRow className="mb-1">
                  <CCol md={6} lg={12}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Role Name
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormInput
                          type="text"
                          id="validationCustom01"
                          required
                          placeholder="Role Name"
                          value={form.roleName}
                          onChange={(e) => {
                            setform({ ...form, roleName: e.target.value });
                            setDisableButton(false);
                            setValidationMessages({
                              ...validationMessages,
                              roleName: e.target.value
                                ? ""
                                : "Category Name is required",
                            });
                          }}
                        />
                        {showValidationMessages &&
                          validationMessages.roleName && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.roleName}
                            </div>
                          )}
                      </div>
                    </CRow>
                  </CCol>
                </CRow>
                <CRow className="mb-1">
                  <CCol md={6} lg={12}>
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
                          required
                          placeholder="Description"
                          value={form.description}
                          onChange={(e) => {
                            setform({ ...form, description: e.target.value });
                            setDisableButton(false);
                            setValidationMessages({
                              ...validationMessages,
                              description: e.target.value
                                ? ""
                                : "Description is required",
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
                    </CRow>
                  </CCol>
                  <CCol md={6} lg={12}>
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
                          checked={form.isActive === 1}
                          onChange={(e) => {
                            e.target.checked
                              ? setform({ ...form, isActive: 1 })
                              : setform({ ...form, isActive: 2 });
                            setDisableButton(false);
                          }}
                        />
                      </div>
                    </CRow>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          )}
          {!roleDetail && (
            <CCardBody className="card-body org border-top p-9">
              <CForm
                className={`row g-15 needs-validation InputThemeColor${themes}`}
                form={form}
                onFinish={addRoles}
              >
                <CRow className="mb-1">
                  <CCol md={6} lg={12}>
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
                  <CCol md={6} lg={12}>
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
                  <CCol md={6} lg={12}>
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
                  <CCol md={6} lg={12}>
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
          )}
          <CCardFooter>
            <div className="d-flex justify-content-end">
              <Link
                to="/superadmin/roleslist"
                className={`btn btn-primary me-2 saveButtonTheme${themes}`}
              >
                Back
              </Link>
              <CButton
                className={`btn btn-primary me-2 saveButtonTheme${themes}`}
                onClick={handleSave}
                disabled={disableButton}
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

export default addEditRoles;
