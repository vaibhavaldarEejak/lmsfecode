import React, { useRef, useEffect, useState } from "react";
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
  CFormCheck,
  CFormTextarea,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../../scss/required.scss";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import postApiCall from "src/server/postApiCall";
import generalUpdateApi from "src/server/generalUpdateApi";
import getApiCall from "src/server/getApiCall";
import "../../css/form.css";

const addEditModule = () => {
  const navigate = useNavigate();
  const [moduleId, setModuleId] = useState("");
  let moduleId1 = "";
  useEffect(() => {
    moduleId1 = localStorage.getItem("ModuleID");
    setModuleId(moduleId1);
  }, []);
  const [isloading, setLoading1] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useRef(null);
  const [moduleDetails, setmoduleDetails] = useState("");
  const [validationMessages, setValidationMessages] = useState({});
  const [showValidationMessages, setShowValidationMessages] = useState(false);
  const [isParentModule, setIsParentModule] = useState("0");
  const [form, setform] = useState({
    moduleName: "",
    routeUrl: "",
    controllerName: "",
    methodName: "",
    parentModule: "",
    description: "",
    isActive: 1,
  });

  useEffect(() => {
    if (moduleDetails) {
      setform({
        moduleName: moduleDetails.moduleName,
        routeUrl: moduleDetails.routeUrl,
        controllerName: moduleDetails.controllerName,
        methodName: moduleDetails.methodName,
        parentModule: moduleDetails.parentModuleId,
        description: moduleDetails.description,
        isActive: moduleDetails.isActive,
      });
      setIsParentModule(`${moduleDetails.isParentModule}`);
    }
  }, [moduleDetails]);

  const addmodule = async (data) => {
    const updateData = {
      moduleName: data.moduleName,
      routeUrl: data.routeUrl,
      controllerName: data.controllerName,
      methodName: data.methodName,
      parentModule: data.parentModule,
      description: data.description,
      isActive: data.isActive,
      isParentModule: isParentModule,
    };

    setLoading1(true);

    try {
      const res = await postApiCall("addNewModule", updateData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Module added successfully",
        life: 1000,
      });
      setTimeout(() => {
        navigate("/superadmin/modulelist");
      }, 2000);
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Adding Action module",
        life: 3000,
      });
    }
  };

  const updateModule = async (data) => {
    const updateData = {
      moduleId: moduleId,
      moduleName: data.moduleName,
      routeUrl: data.routeUrl,
      controllerName: data.controllerName,
      methodName: data.methodName,
      parentModule: data.parentModule,
      description: data.description,
      isActive: data.isActive,
      isParentModule: isParentModule,
    };
    setLoading1(true);
    try {
      const res = await generalUpdateApi("updateModule", updateData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Module Updated successfully!",
        life: 3000,
      });
      setTimeout(() => {
        navigate("/superadmin/modulelist");
        localStorage.removeItem("ModuleID");
      }, 3000);
      setLoading1(false);
      localStorage.removeItem("ModuleID");
    } catch (err) {
      setLoading1(false);
      toast.current.show({
        severity: "error",
        summary: "error",
        detail: "Action deleted successfully!",
        life: 3000,
      });
    }
  };

  const getModuleById = async (id) => {
    setIsLoading(true);
    try {
      const res = await getApiCall("getModuleById", id);
      setmoduleDetails(res);
      setIsParentModule(`${res.isParentModule}`);
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
    if (moduleId) {
      getModuleById(Number(moduleId));
    }
  }, [moduleId]);
  const validateForm = () => {
    const messages = {};
    let isValid = true;

    if (!form.moduleName) {
      messages.moduleName = "Module Name is required";
      isValid = false;
    } else {
      messages.moduleName = "";
    }

    if (!form.routeUrl) {
      messages.routeUrl = "Route Url is required";
      isValid = false;
    }

    if (!form.controllerName) {
      messages.controllerName = "Controller Name is required";
      isValid = false;
    }

    if (!form.methodName) {
      messages.methodName = "Method Name is required";
      isValid = false;
    }
    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };
  const handleSave = () => {
    if (validateForm()) {
      addmodule(form);
    }
  };

  const handleUpdate = () => {
    localStorage.removeItem("ModuleID");

    if (validateForm()) {
      updateModule(form);
    }
  };
  const [parentModule1, setParentModule] = useState();
  const getParentModule = async () => {
    try {
      const res = await getApiCall("getModuleOptionList");
      setParentModule(res);
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

  useEffect(() => {
    getParentModule();
  }, []);
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className={`formHeader${themes}`}>
            <strong>Module</strong>
          </CCardHeader>
          {isLoading ? (
            <CCardBody className="card-body border-top p-9">
              <formSkeleton />
            </CCardBody>
          ) : (
            <CCardBody className="card-body org border-top p-9">
              <CForm
                className={`row g-15 needs-validation InputThemeColor${themes}`}
                form={form}
                onFinish={addmodule}
              >
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Module Name
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormInput
                          type="text"
                          id="validationCustom01"
                          placeholder="Module Name"
                          required
                          value={form.moduleName}
                          onChange={(e) => {
                            setform({ ...form, moduleName: e.target.value });
                            setValidationMessages({
                              ...validationMessages,
                              moduleName: e.target.value
                                ? ""
                                : "Module Name is required",
                            });
                          }}
                        />
                        {showValidationMessages &&
                          validationMessages.moduleName && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.moduleName}
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
                        Route Url
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormInput
                          type="text"
                          id="validationCustom01"
                          placeholder="Route Url"
                          required
                          value={form.routeUrl}
                          onKeyDown={(e) => {
                            if (e.key === " " || e.key === "/") {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) => {
                            setform({ ...form, routeUrl: e.target.value });
                            setValidationMessages({
                              ...validationMessages,
                              routeUrl: e.target.value
                                ? ""
                                : "Route Url is required",
                            });
                          }}
                        />
                        {showValidationMessages &&
                          validationMessages.routeUrl && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.routeUrl}
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
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Controller Name
                      </CFormLabel>
                      <div className="col-sm-7">
                        <div className="input-group">
                          <CFormInput
                            type="text"
                            id="validationCustom01"
                            placeholder="Controler Name"
                            required
                            onKeyDown={(e) => {
                              if (e.key === " " || e.key === "/") {
                                e.preventDefault();
                              }
                            }}
                            value={form.controllerName}
                            onChange={(e) => {
                              setform({
                                ...form,
                                controllerName: e.target.value,
                              });
                              setValidationMessages({
                                ...validationMessages,
                                controllerName: e.target.value
                                  ? ""
                                  : "Controller Name is required",
                              });
                            }}
                          />
                          <label
                            className="input-group-text"
                            htmlFor="formFile"
                          >
                            <i
                              className="custom-choose-btn"
                              data-pr-tooltip="Type Controller Name in Camel Case. Eg: Menu, MenuPermission"
                              data-pr-position="right"
                              data-pr-at="right+5 top"
                              data-pr-my="left center-2"
                              style={{
                                fontSize: ".9rem",
                                cursor: "pointer",
                              }}
                            >
                              <img src="/media/icon/gen045.svg" />
                            </i>
                          </label>

                          <Tooltip
                            target=".custom-choose-btn"
                            content="Upload Only PDF,DOC,PPT,JPG,JPEG"
                            position="bottom"
                          ></Tooltip>
                        </div>

                        {showValidationMessages &&
                          validationMessages.controllerName && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.controllerName}
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
                        Method Name
                      </CFormLabel>
                      <div className="col-sm-7">
                        <div className="input-group">
                          <CFormInput
                            type="text"
                            id="validationCustom01"
                            placeholder="Method Name"
                            required
                            onKeyDown={(e) => {
                              if (e.key === " " || e.key === "/") {
                                e.preventDefault();
                              }
                            }}
                            value={form.methodName}
                            onChange={(e) => {
                              setform({ ...form, methodName: e.target.value });
                              setValidationMessages({
                                ...validationMessages,
                                methodName: e.target.value
                                  ? ""
                                  : "Method Name is required",
                              });
                            }}
                          />
                          <label
                            className="input-group-text"
                            htmlFor="formFile"
                          >
                            <i
                              className="custom-choose-btn2"
                              data-pr-tooltip="Type Method Name in Camel Case. Eg: MenuListing, MenuPermissionList"
                              data-pr-position="right"
                              data-pr-at="right+5 top"
                              data-pr-my="left center-2"
                              style={{
                                fontSize: ".9rem",
                                cursor: "pointer",
                              }}
                            >
                              <img src="/media/icon/gen045.svg" />
                            </i>
                          </label>

                          <Tooltip
                            target=".custom-choose-btn2"
                            content="Upload Only PDF,DOC,PPT,JPG,JPEG"
                            position="bottom"
                          ></Tooltip>
                        </div>

                        {showValidationMessages &&
                          validationMessages.methodName && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.methodName}
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
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Is Parent Module?
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        <CFormCheck
                          inline
                          type="radio"
                          name="isParentMenu"
                          id="inlineCheckbox1"
                          value={"1"}
                          label="Yes"
                          checked={isParentModule === "1"}
                          onChange={(e) => {
                            setIsParentModule(e.target.value);
                          }}
                        />
                        <CFormCheck
                          inline
                          type="radio"
                          name="isParentMenu"
                          id="inlineCheckbox1"
                          value={"0"}
                          label="No"
                          checked={isParentModule === "0"}
                          onChange={(e) => {
                            setIsParentModule(e.target.value);
                          }}
                        />
                      </div>
                    </CRow>
                  </CCol>

                  {isParentModule && isParentModule === "1" && (
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7 "
                        >
                          Parent Module
                        </CFormLabel>
                        <div className="col-sm-7">
                          <select
                            className="form-select"
                            required
                            value={form.parentModule}
                            onChange={(f) => {
                              setform({
                                ...form,
                                parentModule: f.target.value,
                              });
                            }}
                            aria-label="select example"
                          >
                            <option value={""}>Select</option>
                            {parentModule1?.map((e) => (
                              <option key={e.moduleId} value={e.moduleId}>
                                {e.moduleName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </CRow>
                    </CCol>
                  )}
                </CRow>

                <CRow className="mb-5">
                  <CFormLabel
                    htmlFor=""
                    className="col-sm-4 col-form-label fw-bolder fs-7 "
                  >
                    Description
                  </CFormLabel>
                  <div className="col-sm-12">
                    <CFormTextarea
                      cols={6}
                      rows={6}
                      id="validationCustom01"
                      placeholder="Description"
                      required
                      value={form.description}
                      onChange={(e) => {
                        setform({ ...form, description: e.target.value });
                      }}
                    />
                  </div>
                </CRow>

                <CRow className="mb-3">
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
                              ? setform({ ...form, isActive: 1 })
                              : setform({ ...form, isActive: 2 })
                          }
                        />
                      </div>
                    </CRow>
                  </CCol>
                </CRow>
              </CForm>
              <Toast ref={toast} />
            </CCardBody>
          )}
          <CCardFooter>
            <div className="d-flex justify-content-end">
              <Link
                to={`/superadmin/modulelist`}
                className={`btn btn-primary me-2 saveButtonTheme${themes}`}
                onClick={() => {
                  localStorage.removeItem("ModuleID");
                }}
              >
                Back
              </Link>
              {moduleId ? (
                <CButton
                  className={`btn btn-primary me-2 saveButtonTheme${themes}`}
                  onClick={() => {
                    localStorage.removeItem("ModuleID");
                    handleUpdate();
                  }}
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
              ) : (
                <CButton
                  className={`btn btn-primary me-2 saveButtonTheme${themes}`}
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
              )}
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default addEditModule;
