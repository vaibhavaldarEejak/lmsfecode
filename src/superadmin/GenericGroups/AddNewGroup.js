import React, { useEffect, useState, useForm } from "react";
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
  CFormCheck,
  CButton,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../../scss/required.scss";
import { Skeleton } from "primereact/skeleton";
import getApiCall from "src/server/getApiCall";
import generalUpdateApi from "src/server/generalUpdateApi";
import postApiCall from "src/server/postApiCall";

const API_URL = process.env.REACT_APP_API_URL;

const addNewGroup = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const groupId = window.location.href.split("?")[1];
  const navigate = useNavigate();
  const [validationMessages, setValidationMessages] = useState({});
  const [showValidationMessages, setShowValidationMessages] = useState(false);
  const [groupID, setgroupID] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isloading, setLoading1] = useState(false);

  const [form, setForm] = useState({
    groupName: "",
    parentGroup: "",
    description: "",
    organization: 1,
    isActive: 1,
  });

  useEffect(() => {
    if (groupID) {
      setForm({
        groupName: groupID.groupName,
        parentGroup: groupID.parentGroup,
        description: groupID.description,
        organization: groupID.organization,
        isActive: 1,
      });
    }
  }, [groupID]);

  const getGroupListing = async () => {
    try {
      const res = await getApiCall("getGroupOptionList");
      setResponseData(res);
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

  const AddGroup = async (data) => {
    setLoading1(true);
    try {
      const res = await postApiCall("addGroup", data);
      navigate("/superadmin/genericgrouplist");
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

  const updateGroupApi = async (data) => {
    const updateData = {
      groupId: groupId,
      groupName: data.groupName,
      parentGroup: data.parentGroup,
      description: data.description,
      organization: data.organization,
      isActive: data.isActive,
    };

    setLoading1(true);
    try {
      const res = await generalUpdateApi("updateGroup", updateData);
      navigate("/superadmin/genericgrouplist");
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

  const getGroupById = async (groupId) => {
    setLoading(true);
    try {
      const res = await getApiCall("getGroupById", groupId);
      setgroupID(res);
      setLoading(false);
    } catch (err) {
      setLoading(false);
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
    getGroupListing();
  }, []);

  useEffect(() => {
    if (groupId) {
      getGroupById(Number(groupId));
    }
  }, [groupId]);
  const validateForm = () => {
    const messages = {};
    let isValid = true;

    if (!form.groupName) {
      messages.groupName = "Group Name is required";
      isValid = false;
    } else {
      messages.groupName = "";
    }

    if (!form.description) {
      messages.description = "Description is required";
      isValid = false;
    }

    if (!form.organization) {
      messages.organization = "organization is required";
      isValid = false;
    }

    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };
  const handleSave = () => {
    if (validateForm()) {
      if (groupId) {
        updateGroupApi(form);
      } else {
        AddGroup(form);
      }
    }
  };
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Groups</strong>
          </CCardHeader>
          {isLoading ? (
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
                        <Skeleton width="99%"></Skeleton>
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
                      <div className="col-sm-7">
                        <div className="mb-2">
                          <Skeleton width="99%"></Skeleton>
                        </div>
                        <div className="mb-2">
                          <Skeleton width="99%"></Skeleton>
                        </div>
                        <div className="mb-2">
                          <Skeleton width="99%"></Skeleton>
                        </div>
                        <div className="mb-2">
                          <Skeleton width="99%"></Skeleton>
                        </div>
                        <div className="mb-2">
                          <Skeleton width="99%"></Skeleton>
                        </div>
                      </div>
                    </CRow>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          ) : (
            <CCardBody className="card-body border-top p-9">
              <CForm
                className={`row g-15 needs-validation InputThemeColor${themes}`}
              >
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Add New Group :
                      </CFormLabel>
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
                        Name
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormInput
                          type="text"
                          id="validationCustom01"
                          value={form.groupName}
                          placeholder="Name"
                          required
                          onChange={(e) => {
                            setForm({ ...form, groupName: e.target.value });
                            setValidationMessages({
                              ...validationMessages,
                              groupName: e.target.value
                                ? ""
                                : "Category Name is required",
                            });
                          }}
                        />
                        {showValidationMessages &&
                          validationMessages.groupName && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.groupName}
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
                        Description
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormInput
                          type="textarea"
                          id="validationCustom01"
                          value={form.description}
                          placeholder="Description"
                          required
                          onChange={(e) => {
                            setForm({ ...form, description: e.target.value });
                            setValidationMessages({
                              ...validationMessages,
                              description: e.target.value
                                ? ""
                                : "Category Name is required",
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
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Parent Group
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormSelect
                          type="text"
                          id="validationCustom01"
                          value={form.parentGroup}
                          onChange={(e) => {
                            setForm({ ...form, parentGroup: e.target.value });
                          }}
                          required
                          placeholder="Parent Group"
                        >
                          <option disabled value={""}>
                            Select
                          </option>
                          {responseData.map((e) => (
                            <option key={e.groupId} value={e.groupId}>
                              {e.groupName}
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
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Status
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormSwitch
                          size="xl"
                          id="formSwitchCheckDefaultXL"
                          checked={form.isActive === 1}
                          onChange={(e) =>
                            e.target.checked
                              ? setForm({ ...form, isActive: 1 })
                              : setForm({ ...form, isActive: 2 })
                          }
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
                        className="col-sm-4 col-form-label fw-bolder fs-7"
                      >
                        Organize User Group Based On :
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormCheck
                          id="flexCheckDefault"
                          value={form.organization}
                          onClick={() => {
                            setForm({ ...form, organization: 1 });
                            setValidationMessages({
                              ...validationMessages,
                              organization: 1 ? "" : "organization is required",
                            });
                          }}
                        />
                        Job Title First Word
                        <div>
                          <CFormCheck
                            id="flexCheckDefault"
                            value={form.organization}
                            onClick={() => {
                              setForm({ ...form, organization: 1 });
                              setValidationMessages({
                                ...validationMessages,
                                organization: 1
                                  ? ""
                                  : "organization is required",
                              });
                            }}
                          />
                          Job Title Second Word
                        </div>
                        <div>
                          <CFormCheck
                            id="flexCheckDefault"
                            value={form.organization}
                            onClick={() => {
                              setForm({ ...form, organization: 1 });
                              setValidationMessages({
                                ...validationMessages,
                                organization: 1
                                  ? ""
                                  : "organization is required",
                              });
                            }}
                          />
                          Job Title Third Word
                        </div>
                        <div>
                          <CFormCheck
                            id="flexCheckDefault"
                            value={form.organization}
                            onClick={() => {
                              setForm({ ...form, organization: 1 });
                              setValidationMessages({
                                ...validationMessages,
                                organization: 1
                                  ? ""
                                  : "organization is required",
                              });
                            }}
                          />
                          Job Title Fourth Word
                        </div>
                        <div>
                          <CFormCheck
                            id="flexCheckDefault"
                            value={form.organization}
                            onClick={() => {
                              setForm({ ...form, organization: 1 });
                              setValidationMessages({
                                ...validationMessages,
                                organization: 1
                                  ? ""
                                  : "organization is required",
                              });
                            }}
                          />
                          Job Title Five Word
                        </div>
                        {showValidationMessages &&
                          validationMessages.organization && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.organization}
                            </div>
                          )}
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
                className={`me-2 saveButtonTheme${themes}`}
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
              <Link
                to="/superadmin/genericgrouplist"
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
};

export default addNewGroup;
