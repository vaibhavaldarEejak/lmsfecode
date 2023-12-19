import React, { useRef, useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormLabel,
  CFormInput,
  CFormSwitch,
  CCardFooter,
  CImage,
  CBadge,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode } from "primereact/api";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import "../../scss/required.scss";
import "./../../css/themes.css";
import postApiCall from "src/server/postApiCall";
import generalUpdateApi from "src/server/generalUpdateApi";
import getApiCall from "src/server/getApiCall";
import generalDeleteApiCall from "src/server/generalDeleteApiCall";
import "../../css/table.css";
import DataTableSkeleton from "./DataTableSkeleton";

const manageModuleListingWidget = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [updateMode, setUpdateMode] = useState(false);
  const [edit, setEdit] = useState(false);
  const [add, setAdd] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [actionData, setactionData] = useState([]);
  const [getIdActionData, setGetIdActionData] = useState([]);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [validationMessages, setValidationMessages] = useState({});
  const [showValidationMessages, setShowValidationMessages] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);

  const toast = useRef(null);
  const [form, setform] = useState({
    actionName: "",
    moduleId: 1,
    controllerName: "",
    methodName: "",
    isActive: 1,
  });
  const [clickModuleID, setClickModuleID] = useState();
  const [isloading, setLoading] = useState(false);
  const [isloading1, setLoading1] = useState(false);

  useEffect(() => {
    if (actionData) {
      setform({
        actionName: actionData.actionName,
        moduleId: clickModuleID,
        controllerName: actionData.controllerName,
        methodName: actionData.methodName,
        isActive: actionData.isActive,
      });
    }
  }, [actionData]);

  useEffect(() => {
    if (!edit) {
      setGetIdActionData({
        actionName: "",
        controllerName: "",
        methodName: "",
        isActive: false,
      });
    }
  }, [edit]);
  const validateForm = () => {
    const messages = {};
    let isValid = true;

    if (!form.actionName && !getIdActionData.actionName) {
      messages.actionName = "Action Name is required";
      isValid = false;
    } else {
      messages.actionName = "";
    }

    if (!form.methodName && !getIdActionData.methodName) {
      messages.methodName = "Method Name is required";
      isValid = false;
    }

    if (!form.controllerName && !getIdActionData.controllerName) {
      messages.controllerName = "Controller Name is required";
      isValid = false;
    }

    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };

  "moduleName", "methodName", "parentModuleName", "isActive";
  const moduleName1 = (responseData) => (
    <>{responseData.moduleName ? responseData.moduleName : "-"}</>
  );

  const methodName = (responseData) => (
    <>{responseData.methodName ? responseData.methodName : "-"}</>
  );

  const parentModuleName = (responseData) => (
    <>{responseData.parentModuleName ? responseData.parentModuleName : "-"}</>
  );

  const addAction = async (e, data) => {
    e.preventDefault();
    setLoading(true);
    if (validateForm()) {
      try {
        const res = await postApiCall("addNewAction", data);
        setEdit(false);
        setAdd(true);
        setLoading(false);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Action added successfully!",
          life: 3000,
        });
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
    }
  };
  const [actionID, setActionId] = useState();
  const updateActionModule = async (e, data) => {
    setLoading1(true);
    e.preventDefault();
    if (validateForm()) {
      try {
        const res = await generalUpdateApi("updateAction", data);
        navigate("/superadmin/modulelist");
        setLoading1(false);
        getActionTableByModuleID(clickModuleID);
      } catch (err) {
        setLoading1(false);
        var errMsg = err?.response?.data?.error;
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: errMsg,
          life: 3000,
        });
      }
    }
  };

  const getActionModuleById = async (id) => {
    setLoading(false);
    try {
      const res = await getApiCall("getActionById", id);
      setGetIdActionData(res);
      setLoading(true);
      setEdit(true);
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
    if (add === true) {
      getActionTableByModuleID(clickModuleID);
    }
  }, [add, clickModuleID, actionData, form]);

  const deleteActions = async (actionsId) => {
    const data = {
      actionsId: actionsId,
    };
    try {
      const res = await generalDeleteApiCall("deleteAction", data);
      const filteredData = actionData.filter(
        (item) => item.actionsId !== actionsId
      );
      setShowForm(false);
      setactionData(filteredData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Action deleted successfully!",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Deleting Action",
        life: 3000,
      });
    }
  };

  const getActionTableByModuleID = async (id) => {
    try {
      const res = await getApiCall("getActionsByModuleId", id);
      setactionData(res);
      setform({
        actionName: "",
        moduleId: "",
        controllerName: "",
        methodName: "",
        isActive: 1,
      });
      setEdit(false);
      setAdd(false);
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
    if (token !== "Bearer null") {
      initFilters();
      getModuleList();
    }
  }, []);

  const getModuleList = async () => {
    try {
      const res = await getApiCall("getModuleList");
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

  const deleteModuleData = async (moduleId) => {
    const data = {
      moduleId: moduleId,
    };
    try {
      const res = await generalDeleteApiCall("deleteModule", data);
      const filteredData = responseData.filter(
        (item) => item.moduleId !== moduleId
      );
      setResponseData(filteredData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Module deleted successfully!",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Deleting Module",
        life: 3000,
      });
    }
    setDeleteProductDialog(false);
  };

  const statusShow1 = (actionData) =>
    actionData?.isActive === 1 ? (
      <CBadge
        className={`badge badge-light-info text-info badgeColor${themes}`}
        color="light"
      >
        {actionData?.isActive === 1 ? "Active" : "In-Active"}
      </CBadge>
    ) : (
      <CBadge
        className={`badge badge-light-info text-secondary badgeColor${themes}`}
        color="light"
      >
        {actionData?.isActive === 1 ? "Active" : "In-Active"}
      </CBadge>
    );

  const statusShow = (responseData) =>
    responseData?.isActive === 1 ? (
      <CBadge
        className={`badge badge-light-info text-info badgeColor${themes}`}
        color="light"
      >
        {responseData?.isActive === 1 ? "Active" : "In-Active"}
      </CBadge>
    ) : (
      <CBadge
        className={`badge badge-light-info text-secondary badgeColor${themes}`}
        color="light"
      >
        {responseData?.isActive === 1 ? "Active" : "In-Active"}
        {responseData.isActive ? responseData.isActive : "-"}
      </CBadge>
    );
  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <div
        title="Add Module Action"
        onClick={() => {
          setVisible(!visible),
            getActionTableByModuleID(responseData.moduleId),
            setClickModuleID(responseData.moduleId);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          class={`bi bi-plus-circle-fill iconTheme${themes}`}
          viewBox="0 0 16 16"
        >
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
        </svg>
      </div>
      <div
        title="Edit Module"
        onClick={() => {
          localStorage.setItem("ModuleID", responseData.moduleId);
          navigate(
            // `/superadmin/modulelist/addeditmodule?${responseData.moduleId}`
            `/superadmin/modulelist/addeditmodule`
          );
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          style={{ margin: "0 0.5rem" }}
          class={`bi bi-pencil-fill iconTheme${themes}`}
          viewBox="0 0 16 16"
        >
          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
        </svg>
      </div>
      <div
        title="Delete Module"
        onClick={() => confirmDeleteProduct(responseData)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          class={`bi bi-trash-fill iconTheme${themes}`}
          viewBox="0 0 16 16"
        >
          <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
        </svg>
      </div>
    </div>
  );
  const confirmDeleteProduct = (product) => {
    setSelectedProduct(product);
    setDeleteProductDialog(true);
  };
  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };
  const deleteProductDialogFooter = () => (
    <React.Fragment>
      <Button
        label="No"
        size="sm"
        icon="pi pi-times"
        className={`saveButtonTheme${themes}`}
        outlined
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Yes"
        size="sm"
        icon="pi pi-check"
        severity="info"
        onClick={() => deleteModuleData(selectedProduct.moduleId)}
      />
    </React.Fragment>
  );

  const buttonTemplate1 =
    responseData &&
    ((e) => (
      <div style={{ display: "flex" }}>
        <CImage
          src="/custom_icon/eye.svg"
          className="me-1"
          alt="eye_icon"
          title="View"
          style={{ height: "28px", cursor: "pointer" }}
          onClick={(evt) => {
            setIsViewMode(true);
            getActionModuleById(e.actionsId), setShowForm(true);
          }}
        />

        <CImage
          src="/custom_icon/edit.svg"
          className="me-2"
          alt="edit.svg"
          title="Edit"
          style={{ height: "24px", cursor: "pointer" }}
          onClick={(evt) => {
            getActionModuleById(e.actionsId), setShowForm(true);
            setIsViewMode(false);
            setLoading(false);
            setUpdateMode(true);
            setActionId(e.actionsId);
          }}
        />
        <CImage
          src="/custom_icon/bin.svg"
          className="me-3"
          alt="bin.svg"
          title="Delete"
          style={{ height: "24px", cursor: "pointer" }}
          onClick={(event) => deleteActions(e.actionsId)}
        />
      </div>
    ));

  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      moduleName: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      methodName: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
      parentModuleName: {
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH,
      },
    });
    setGlobalFilterValue("");
  };

  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  const moduleNameFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search"
        className="p-column-filter"
        showClear
        style={{
          height: "2rem",
          maxWidth: "10rem",
          lineHeight: "4px",
        }}
      />
    );
  };
  const methodNameFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search"
        className="p-column-filter"
        showClear
        style={{
          height: "2rem",
          maxWidth: "10rem",
          lineHeight: "4px",
        }}
      />
    );
  };
  const parentModuleFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search"
        className="p-column-filter"
        showClear
        style={{
          height: "2rem",
          maxWidth: "10rem",
          lineHeight: "4px",
        }}
      />
    );
  };

  return (
    <div className="p-0">
      <div className="container">
        <div className="container-fluid">
          <CModal
            size="xl"
            scrollable
            visible={visible}
            onClose={() => setVisible(false)}
          >
            <CModalHeader>
              <CModalTitle>Actions</CModalTitle>
            </CModalHeader>
            <CModalBody>
              <>
                <div>
                  <CCardHeader>
                    <div className="card-header border-0 d-flex justify-content-end mb-1">
                      <div className="d-grid gap-2 d-md-flex">
                        <CButton
                          onClick={() => {
                            localStorage.removeItem("ModuleID");
                            setShowForm(true);
                            setEdit(false);
                            setIsViewMode(false);
                            setform({
                              actionName: "",
                              moduleId: clickModuleID,
                              controllerName: "",
                              methodName: "",
                              isActive: 1,
                            });
                            setUpdateMode(false);
                          }}
                          className={`me-md-2 btn btn-info saveButtonTheme${themes}`}
                        >
                          Add New Action
                        </CButton>
                      </div>
                    </div>
                  </CCardHeader>
                  <CTabContent className="rounded-bottom">
                    <CTabPane className="p-3 preview" visible>
                      <div>
                        {showForm && (
                          <CForm
                            className={`row g-15 needs-validation InputThemeColor${themes}`}
                            form={form}
                            onFinish={addAction}
                          >
                            {edit && getActionModuleById ? (
                              <>
                                <CRow className={`mb-3 `}>
                                  <CCol md={6}>
                                    <CRow className={`mb-3 `}>
                                      <CFormLabel
                                        htmlFor=""
                                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                                      >
                                        Action Name
                                      </CFormLabel>

                                      <div className="col-sm-7">
                                        <CFormInput
                                          type="text"
                                          id="validationCustom01"
                                          placeholder="Module Name"
                                          required
                                          value={getIdActionData.actionName}
                                          disabled={isViewMode}
                                          onChange={(e) => {
                                            setGetIdActionData({
                                              ...getIdActionData,
                                              actionName: e.target.value,
                                            });
                                            setValidationMessages({
                                              ...validationMessages,
                                              actionName: e.target.value
                                                ? ""
                                                : "Action Name is required",
                                            });
                                          }}
                                        />
                                        {showValidationMessages &&
                                          validationMessages.actionName && (
                                            <div
                                              className="fw-bolder"
                                              style={{ color: "red" }}
                                            >
                                              {validationMessages.actionName}
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
                                        <CFormInput
                                          type="text"
                                          id="validationCustom01"
                                          placeholder="Route Url"
                                          required
                                          value={getIdActionData.methodName}
                                          disabled={isViewMode}
                                          onChange={(e) => {
                                            setGetIdActionData({
                                              ...getIdActionData,
                                              methodName: e.target.value,
                                            });
                                            setValidationMessages({
                                              ...validationMessages,
                                              methodName: e.target.value
                                                ? ""
                                                : "Method Name is required",
                                            });
                                          }}
                                        />
                                        {showValidationMessages &&
                                          validationMessages.methodName && (
                                            <div
                                              className="fw-bolder"
                                              style={{ color: "red" }}
                                            >
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
                                        Controller Name
                                      </CFormLabel>
                                      <div className="col-sm-7">
                                        <CFormInput
                                          type="text"
                                          id="validationCustom01"
                                          placeholder="Controler Name"
                                          required
                                          value={getIdActionData.controllerName}
                                          disabled={isViewMode}
                                          onChange={(e) => {
                                            setGetIdActionData({
                                              ...getIdActionData,
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
                                        {showValidationMessages &&
                                          validationMessages.controllerName && (
                                            <div
                                              className="fw-bolder"
                                              style={{ color: "red" }}
                                            >
                                              {
                                                validationMessages.controllerName
                                              }
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
                                      <div className="col-sm-7">
                                        <CFormSwitch
                                          size="xl"
                                          id="formSwitchCheckDefaultXL"
                                          disabled={isViewMode}
                                          checked={
                                            getIdActionData.isActive === 1
                                          }
                                          onChange={(e) =>
                                            e.target.checked
                                              ? setGetIdActionData({
                                                  ...getIdActionData,
                                                  isActive: 1,
                                                })
                                              : setGetIdActionData({
                                                  ...getIdActionData,
                                                  isActive: 2,
                                                })
                                          }
                                        />
                                      </div>
                                    </CRow>
                                  </CCol>
                                </CRow>
                              </>
                            ) : (
                              <>
                                <CRow className="mb-3">
                                  <CCol md={6}>
                                    <CRow className="mb-3">
                                      <CFormLabel
                                        htmlFor=""
                                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                                      >
                                        Action Name
                                      </CFormLabel>

                                      <div className="col-sm-7">
                                        <CFormInput
                                          type="text"
                                          id="validationCustom01"
                                          placeholder="Module Name"
                                          required
                                          value={form.actionName}
                                          disabled={isViewMode}
                                          onChange={(e) => {
                                            setform({
                                              ...form,
                                              actionName: e.target.value,
                                            });
                                            setValidationMessages({
                                              ...validationMessages,
                                              actionName: e.target.value
                                                ? ""
                                                : "Action Name is required",
                                            });
                                          }}
                                        />
                                        {showValidationMessages &&
                                          validationMessages.actionName && (
                                            <div
                                              className="fw-bolder"
                                              style={{ color: "red" }}
                                            >
                                              {validationMessages.actionName}
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
                                        <CFormInput
                                          type="text"
                                          id="validationCustom01"
                                          placeholder="Route Url"
                                          required
                                          value={form.methodName}
                                          disabled={isViewMode}
                                          onChange={(e) => {
                                            setform({
                                              ...form,
                                              methodName: e.target.value,
                                            });
                                            setValidationMessages({
                                              ...validationMessages,
                                              methodName: e.target.value
                                                ? ""
                                                : "Method Name is required",
                                            });
                                          }}
                                        />
                                        {showValidationMessages &&
                                          validationMessages.methodName && (
                                            <div
                                              className="fw-bolder"
                                              style={{ color: "red" }}
                                            >
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
                                        Controller Name
                                      </CFormLabel>
                                      <div className="col-sm-7">
                                        <CFormInput
                                          type="text"
                                          id="validationCustom01"
                                          placeholder="Controler Name"
                                          required
                                          value={form.controllerName}
                                          disabled={isViewMode}
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
                                        {showValidationMessages &&
                                          validationMessages.controllerName && (
                                            <div
                                              className="fw-bolder"
                                              style={{ color: "red" }}
                                            >
                                              {
                                                validationMessages.controllerName
                                              }
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
                                      <div className="col-sm-7">
                                        <CFormSwitch
                                          size="xl"
                                          id="formSwitchCheckDefaultXL"
                                          disabled={isViewMode}
                                          checked={form.isActive === 1}
                                          onChange={(e) =>
                                            e.target.checked
                                              ? setform({
                                                  ...form,
                                                  isActive: 1,
                                                })
                                              : setform({
                                                  ...form,
                                                  isActive: 2,
                                                })
                                          }
                                        />
                                      </div>
                                    </CRow>
                                  </CCol>
                                </CRow>
                              </>
                            )}

                            <CCardFooter>
                              <div className="d-flex justify-content-end">
                                {!isViewMode && (
                                  <>
                                    {updateMode ? (
                                      <CButton
                                        className={`btn btn-primary me-2 saveButtonTheme${themes}`}
                                        onClick={(e) => {
                                          updateActionModule(
                                            e,
                                            getIdActionData
                                          );
                                          setUpdateMode(false);
                                        }}
                                      >
                                        {!isloading && (
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
                                        onClick={(e) => {
                                          addAction(e, form);
                                        }}
                                      >
                                        {isloading1 && (
                                          <span
                                            class="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                          ></span>
                                        )}
                                        Save
                                      </CButton>
                                    )}
                                    <CButton
                                      onClick={() => {
                                        setShowForm(false);
                                        setUpdateMode(false);
                                      }}
                                      className={`btn btn-primary me-2 saveButtonTheme${themes}`}
                                    >
                                      Cancel
                                    </CButton>
                                  </>
                                )}
                              </div>
                            </CCardFooter>
                          </CForm>
                        )}
                      </div>
                    </CTabPane>
                  </CTabContent>

                  <CCardBody className={`card-richa tableTheme${themes}`}>
                    <div className={` InputThemeColor${themes}`}>
                      <DataTable
                        value={actionData}
                        removableSort
                        paginator
                        showGridlines
                        rowHover
                        emptyMessage="No records found."
                        responsiveLayout="scroll"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                        rows={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        dataKey="actionsId"
                        filterDisplay="menu"
                        globalFilterFields={[
                          "actionName",
                          "controllerName",
                          "methodName",
                          "isActive",
                          "Action",
                        ]}
                      >
                        <Column
                          field="actionName"
                          header="Action Name"
                          sortable
                        ></Column>
                        <Column
                          field="controllerName"
                          header="Controler Name"
                        ></Column>
                        <Column
                          field="methodName"
                          header="Method Name"
                        ></Column>
                        <Column body={statusShow1} header="Status"></Column>
                        <Column
                          field="Action"
                          header="Action"
                          body={buttonTemplate1}
                        ></Column>
                      </DataTable>
                    </div>
                  </CCardBody>
                </div>
              </>
            </CModalBody>
            <CModalFooter></CModalFooter>
          </CModal>
          <CRow>
            <CCol xs={12} style={{ padding: "1px" }}>
              <CCard className="card-ric mb-7">
                <div>
                  <CCardHeader className="p-0">
                    <CNav variant="tabs">
                      <CNavItem>
                        <CNavLink active style={{ cursor: "pointer" }}>
                          <strong>Module</strong>
                        </CNavLink>
                      </CNavItem>
                    </CNav>
                    <CTabContent className="rounded-bottom">
                      <CTabPane className="p-3 preview" visible>
                        <div className="card-header border-0 d-flex justify-content-between">
                          <div className="d-flex row align-items-center">
                            <div className="col-md-12 col-xxl-12">
                              <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText
                                  value={globalFilterValue}
                                  onChange={onGlobalFilterChange}
                                  style={{ height: "40px" }}
                                  className="p-input-sm org"
                                  placeholder="Search..."
                                />
                              </span>
                            </div>
                          </div>
                          <div className="d-grid gap-2 d-md-flex">
                            <Link
                              to={`/superadmin/modulelist/addeditmodule`}
                              className={`me-md-2 btn d-flex align-items-center btn-info saveButtonTheme${themes}`}
                              title="Add New Module"
                              onClick={() => {
                                localStorage.removeItem("ModuleID");
                              }}
                            >
                              + &nbsp; Add New Module
                            </Link>
                          </div>
                        </div>
                      </CTabPane>
                    </CTabContent>
                  </CCardHeader>
                </div>
                <CCardBody className={`card-richa tableTheme${themes}`}>
                  <Toast ref={toast} />
                  {!responseData ? (
                    <div className="card">
                      <DataTableSkeleton />
                    </div>
                  ) : (
                    <div className={` InputThemeColor${themes}`}>
                      <DataTable
                        value={responseData}
                        removableSort
                        paginator
                        showGridlines
                        rowHover
                        emptyMessage="-"
                        responsiveLayout="scroll"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                        rows={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        dataKey="moduleId"
                        filters={filters}
                        filterDisplay="row"
                        globalFilterFields={[
                          "moduleName",
                          "methodName",
                          "parentModuleName",
                          "isActive",
                          "Action",
                        ]}
                      >
                        <Column
                          header="Module Name"
                          body={moduleName1}
                          sortable
                          field="moduleName"
                          showFilterMenu={false}
                          filter
                          filterElement={moduleNameFilterTemplate}
                          filterPlaceholder="Search"
                        ></Column>
                        <Column
                          field="methodName"
                          header="Method Name"
                          body={methodName}
                          showFilterMenu={false}
                          filter
                          filterElement={methodNameFilterTemplate}
                          filterPlaceholder="Search"
                        ></Column>
                        <Column
                          header="Parent Module Name"
                          body={parentModuleName}
                          filter
                          field="parentModuleName"
                          filterElement={parentModuleFilterTemplate}
                          showFilterMenu={false}
                          filterPlaceholder="Search"
                        ></Column>
                        <Column body={statusShow} header="Status"></Column>
                        <Column
                          field="Action"
                          header="Action"
                          body={buttonTemplate}
                        ></Column>
                      </DataTable>
                    </div>
                  )}
                  <Dialog
                    visible={deleteProductDialog}
                    style={{ width: "32rem" }}
                    breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                    header="Confirm"
                    modal
                    footer={deleteProductDialogFooter}
                    onHide={hideDeleteProductDialog}
                  >
                    <div className="confirmation-content">
                      <i
                        className="pi pi-exclamation-triangle me-3 mt-2"
                        style={{ fontSize: "1.5rem" }}
                      />
                      <span>Are you sure you want to delete ?</span>
                    </div>
                  </Dialog>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </div>
    </div>
  );
};
export default manageModuleListingWidget;
