import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CFormSwitch,
  CRow,
  CFormSelect,
  CForm,
  CCardFooter,
  CFormCheck,
  CContainer,
  CButton,
  CFormTextarea,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../../scss/required.scss";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import getApiCall from "src/server/getApiCall";
import generalUpdateApi from "src/server/generalUpdateApi";
import postApiCall from "src/server/postApiCall";
import "../../css/form.css";

const addEditGroup = () => {
  const toast = useRef(null);
  const [isloading, setLoading1] = useState(false);
  const token = "Bearer " + localStorage.getItem("ApiToken");
  // const groupId = window.location.href.split("?")[1];
  const navigate = useNavigate();
  const [organizationgroupList, setOrganizationgroupList] = useState([]);
  const [groupDetail, setGroupDetail] = useState("");
  const [validationMessages, setValidationMessages] = useState({});
  const [showValidationMessages, setShowValidationMessages] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [parentGroupList, setparentGroupList] = useState([]);
  const [OrgSettingsList, setOrgSettingsList] = useState([]);
  const [orgSettingsAdd, setorgSettingsAdd] = useState([]);
  const [groupsettings, setGroupsettings] = useState([
    {
      groupsetting: {
        groupsettingId: null,
        isActive: 0,
      },
    },
  ]);
  const [form, setForm] = useState({
    groupName: "",
    groupCode: "",
    groupId: "",
    isActive: 1,
    parentGroup: "",
    organization: "",
    groupType: 1,
    description: "",
  });
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  let groupId = "";
  useEffect(() => {
    groupId = localStorage.getItem("groupId");
  }, []);
  useMemo(() => {
    if (groupDetail) {
      const groupType = groupDetail.parentGroupId ? "2" : "1";
      setForm((prevForm) => ({
        ...prevForm,
        groupName: groupDetail.groupName,
        groupCode: groupDetail.groupCode,
        description: groupDetail.description,
        groupType: groupType,
        parentGroup: groupDetail.parentGroupId,
        organization: groupDetail.organization,
        isActive: groupDetail.isActive,
      }));
    }
  }, [groupDetail]);

  useEffect(() => {
    if (token !== "Bearer null") {
      organizationgroupListApi();
      parentGroupListAPI();
      orgGroupSettingListAPI();
      if (groupId) {
        groupDetailApi(Number(groupId));
      }
    }
  }, [groupId]);

  const groupDetailApi = async (id) => {
    setIsLoading(true);
    try {
      const response = await getApiCall("getOrgGroupById", id);
      setGroupDetail(response);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const organizationgroupListApi = async (id) => {
    try {
      const response = await getApiCall("getOrgGroupList");
      setOrganizationgroupList(response);
    } catch (error) { }
  };

  const parentGroupListAPI = async () => {
    try {
      const response = await getApiCall("getOrgPrimaryGroupList");
      setparentGroupList(response);
    } catch (error) { }
  };

  const addGroup = async (data) => {
    setLoading1(true);
    try {
      const response = await postApiCall("addOrgGroup", data);

      toast.current.show({
        severity: "success",
        summary: "Group Added Successfully",
        life: 3000,
      });
      setTimeout(() => {
        navigate("/admin/grouplist");
      }, 3000);

    } catch (err) {
      var errMsg = err?.response?.data?.errors;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
    }
    setLoading1(false);
  };


  const updateGroupApi = async (data) => {
    const updateData = {
      groupId: groupId,
      groupType: data.groupType,
      groupName: data.groupName,
      parentGroup: data.parentGroup,
      description: data.description,
      organization: data.organization,
      isActive: data.isActive,
    };
    setLoading1(true);
    try {
      const res = await generalUpdateApi("updateOrgGroup", updateData);
      if (res) {
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Group Updated Successfully",
          life: 3000,
        });
      }

      setTimeout(() => {
        navigate("/admin/grouplist");
      }, 3000);
    } catch (err) { }
  };

  const validateForm = () => {
    const messages = {};
    let isValid = true;

    if (!form.groupName) {
      messages.groupName = "Group Name is required";
      isValid = false;
    } else {
      messages.groupName = "";
    }
    if (!form.groupType || (form.groupType !== "1" && form.groupType !== "2")) {
      messages.groupType = "Group Type is required";
      isValid = false;
    } else {
      messages.groupType = "";
    }
    if (!form.description) {
      messages.description = "Description is required";
      isValid = false;
    } else if (form.description.length > 512) {
      messages.description = "Description must not exceed 512 characters";
      isValid = false;
    } else {
      messages.description = "";
    }

    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };

  const handleSave = () => {
    if (validateForm()) {
      if (groupId) {
        updateGroupApi(form);
        localStorage.removeItem("groupId");
      } else {
        addGroup(form);
      }
    }
  };

  //OrganizationSettingsList & Add API
  const onClick = async (e) => {
    const { value, checked } = e.target;
    const isChecked = checked ? 1 : 2;
    setGroupsettings([
      {
        groupsetting: {
          groupsettingId: value,
          isActive: isChecked,
        },
      },
    ]);

    OrgSettingsList.map((e) => {
      if (e.groupSettingId == value) {
        return {
          ...e,
          isActive: isChecked,
        };
      }
      return e;
    });

    const data = { groupSetting: value };
    try {
      const res = await postApiCall("addOrganizationGroup", data);
      setorgSettingsAdd((orgSettingsAdd) => [...orgSettingsAdd, value]);

      orgGroupSettingListAPI();
    } catch (err) { }
  };

  const orgGroupSettingListAPI = async (id) => {
    try {
      const res = await getApiCall("getOrganizationGroupList");
      setOrgSettingsList(res);
    } catch (err) { }
  };

  return (
    <CRow>
      <Toast ref={toast} />
      <CCol xs={12}>
        <CContainer>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Add New Group</strong>
            </CCardHeader>
            {isLoading ? (
              <CCardBody className="card-body org border-top">
                <CForm
                  className={`row g-15 needs-validation ps-4 InputThemeColor${themes}`}
                >
                  <CRow className="mb-3">
                    <CCol lg={12}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-3 col-form-label fw-bolder fs-7"
                        >
                          <Skeleton width="90%" className="mr-2"></Skeleton>
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          <Skeleton width="90%"></Skeleton>
                        </div>
                      </CRow>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-3 col-form-label fw-bolder fs-7"
                        >
                          <Skeleton width="90%" className="mr-2"></Skeleton>
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          <Skeleton width="90%"></Skeleton>
                        </div>
                      </CRow>
                      <CRow className="mb-4">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-3 col-form-label fw-bolder fs-7"
                        >
                          <Skeleton width="90%" className="mr-2"></Skeleton>
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          <Skeleton width="90%"></Skeleton>
                        </div>
                      </CRow>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-3 col-form-label fw-bolder fs-7"
                        >
                          <Skeleton width="90%" className="mr-2"></Skeleton>
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          <Skeleton width="90%"></Skeleton>
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            ) : (
              <CCardBody className="card-body org border-top">
                <CRow>
                  <CCol lg={12} className="mb-3">
                    <CCard className="h-100">
                      <CCardBody className="p-4">
                        <CForm
                          className={`row g-15 needs-validation ps-4 InputThemeColor${themes}`}
                        >
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-3 col-form-label fw-bolder fs-7 required"
                            >
                              Group Name
                            </CFormLabel>
                            <div className="col-sm-4">
                              <CFormInput
                                type="text"
                                value={form.groupName}
                                onChange={(e) => {
                                  setForm({
                                    ...form,
                                    groupName: e.target.value,
                                  });
                                  setValidationMessages({
                                    ...validationMessages,
                                    groupName: e.target.value
                                      ? ""
                                      : "Group Name is required",
                                  });
                                }}
                                id="validationCustom01"
                                required
                                placeholder="Group Name"
                              />
                              {showValidationMessages &&
                                validationMessages.groupName && (
                                  <div
                                    className="fw-bolder"
                                    style={{ color: "red" }}
                                  >
                                    {validationMessages.groupName}
                                  </div>
                                )}
                            </div>
                          </CRow>
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-3 col-form-label fw-bolder fs-7 required"
                            >
                              Group Type
                            </CFormLabel>
                            <div className="col-sm-7 py-2">
                              <CFormCheck
                                inline
                                type="radio"
                                name="groupType"
                                id="inlineCheckbox1"
                                value="1"
                                checked={form.groupType === "1"}
                                onChange={(e) => {
                                  setForm({
                                    ...form,
                                    groupType: e.target.value,
                                  });
                                  setValidationMessages({
                                    ...validationMessages,
                                    groupType: e.target.value
                                      ? ""
                                      : "Group Type is required",
                                  });
                                }}
                                label="Primary group"
                              />
                              <CFormCheck
                                inline
                                type="radio"
                                name="groupType"
                                id="inlineCheckbox2"
                                value="2"
                                checked={form.groupType === "2"}
                                onChange={(e) => {
                                  setForm({
                                    ...form,
                                    groupType: e.target.value,
                                  });
                                  setValidationMessages({
                                    ...validationMessages,
                                    groupType: e.target.value
                                      ? ""
                                      : "Group Type is required",
                                  });
                                }}
                                label="Secondary group"
                              />
                              {showValidationMessages &&
                                validationMessages.groupType && (
                                  <div
                                    className="fw-bolder"
                                    style={{ color: "red" }}
                                  >
                                    {validationMessages.groupType}
                                  </div>
                                )}
                            </div>
                          </CRow>
                          {form.groupType === "2" ? (
                            <CRow className="mb-4">
                              <CFormLabel
                                htmlFor=""
                                className="col-sm-3 col-form-label fw-bolder fs-7"
                              >
                                Parent Group
                              </CFormLabel>
                              <div className="col-sm-4">
                                <CFormSelect
                                  required
                                  value={form.parentGroup}
                                  onChange={(f) => {
                                    setForm({
                                      ...form,
                                      parentGroup: f.target.value,
                                    });
                                  }}
                                  aria-label="select example"
                                >
                                  <option value={""}>Select</option>
                                  {parentGroupList.map((e) => (
                                    <option key={e.groupId} value={e.groupId}>
                                      {e.groupName}
                                    </option>
                                  ))}
                                </CFormSelect>
                              </div>
                            </CRow>
                          ) : null}
                          <CRow className="mb-4">
                            <CCol md={12}>
                              <CRow className="mb-3">
                                <CFormLabel
                                  htmlFor=""
                                  className="col-sm-3 col-form-label fw-bolder fs-7"
                                >
                                  Description
                                </CFormLabel>
                                <div className="col-sm-8 col-md-9">
                                  <CFormTextarea
                                    rows={3}
                                    type="text"
                                    id="validationCustom01"
                                    value={form.description}
                                    onChange={(e) => {
                                      setForm({
                                        ...form,
                                        description: e.target.value,
                                      });
                                      setValidationMessages({
                                        ...validationMessages,
                                        description: e.target.value
                                          ? ""
                                          : "Description is required",
                                      });
                                    }}
                                    required
                                    placeholder="Description"
                                  />
                                  {showValidationMessages &&
                                    validationMessages.description && (
                                      <div
                                        className="fw-bolder"
                                        style={{ color: "red" }}
                                      >
                                        {validationMessages.description}
                                      </div>
                                    )}
                                </div>
                              </CRow>
                            </CCol>
                          </CRow>

                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-3 col-form-label fw-bolder fs-7 required"
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
                        </CForm>
                      </CCardBody>
                    </CCard>
                  </CCol>
                </CRow>
              </CCardBody>
            )}
            <CCardFooter>
              <div className="buttons d-flex justify-content-end">
                <Link
                  to="/admin/grouplist"
                  className="btn btn-primary me-2"
                  onClick={() => {
                    localStorage.removeItem("groupId");
                  }}
                >
                  Back
                </Link>
                <CButton
                  className="btn btn-primary"
                  onClick={() => {
                    handleSave();
                    localStorage.removeItem("groupId");
                  }}
                  disabled={isloading}
                >
                  {isloading && (
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
                  Save
                </CButton>
              </div>
            </CCardFooter>
          </CCard>
        </CContainer>
      </CCol>
    </CRow>
  );
};

export default addEditGroup;
