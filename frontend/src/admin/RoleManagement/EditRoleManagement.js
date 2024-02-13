import React, { useState, useEffect, useRef } from "react";
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
import generalUpdateApi from "src/server/generalUpdateApi";
import getApiCall from "src/server/getApiCall";
import "../../css/form.css";

function EditRoleManagement() {
  const navigate = useNavigate();
  const [validationMessages, setValidationMessages] = useState({});
  const roleId = window.location.href.split("?")[1];
  const [roleDetail, setroleDetail] = useState("");
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  const toast = useRef(null);
  const [disableButton, setDisableButton] = useState(false);
  const [isloading, setLoading1] = useState(false);

  const [form, setform] = useState({
    roleId: "",
    roleName: "",
    roleType: "",
    description: "",
    isActive: 1,
  });

  useEffect(() => {
    if (roleDetail) {
      setform({
        superAdminRoleName: roleDetail.superAdminRoleName,
        roleId: roleDetail.roleId,
        roleName: roleDetail.roleName,
        description: roleDetail.description,
        isActive: roleDetail.isActive,
      });
    }
  }, [roleDetail]);

  const updateRoleApi = async (data) => {
    const updateData = {
      roleId: roleId,
      roleName: data.roleName,
      description: data.description,
      isActive: data.isActive,
    };
    setLoading1(true);
    setDisableButton(true);
    try {
      const res = await generalUpdateApi(
        "updateOrgRoleById",
        updateData,
        roleId
      );
      setDisableButton(true);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Role Updated successfully!",
        life: 3000,
      });
      setTimeout(() => {
        setLoading1(false);
        navigate("/admin/rolemanagement");
      }, 2000);
    } catch (err) {}
  };

  const roleDetailApi = async (id) => {
    try {
      const res = await getApiCall("getOrgRoleById", id);
      setroleDetail(res);
    } catch (err) {}
  };

  useEffect(() => {
    if (roleId) {
      roleDetailApi(Number(roleId));
    }
  }, [roleId]);

  const handleSave = () => {
    if (roleId) {
      updateRoleApi(form);
    }
  };

  return (
    <CRow>
      <CCol xs={12} md={8} lg={12}>
        <CCard className="mb-4 mb-lg-0">
          <Toast ref={toast} />

          <CCardHeader>
            <strong>Role</strong>
          </CCardHeader>
          {roleDetail && (
            <CCardBody className="card-body org border-top p-9">
              <CForm
                className={`row g-15 needs-validation InputThemeColor${themes}`}
              >
                <CRow className="mb-3">
                  <CCol md={6} lg={12}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Role Name
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormInput
                          type="text"
                          id="validationCustom01"
                          required
                          placeholder="Role Name"
                          value={form.superAdminRoleName}
                          disabled
                        />
                      </div>
                    </CRow>
                  </CCol>

                  <CCol md={6} lg={12}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Display Name
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
                      </div>
                    </CRow>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
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
            <CCardBody className="card-body border-top p-9">
              <CForm
                className={`row g-15 needs-validation InputThemeColor${themes}`}
                form={form}
              >
                <CRow className="mb-3">
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

                <CRow className="mb-3">
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
              <Link
                to="/superadmin/roleslist"
                className={`btn btn-primary saveButtonTheme${themes}`}
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

export default EditRoleManagement;
