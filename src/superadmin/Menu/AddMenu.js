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
  CFormSwitch,
  CForm,
  CCardFooter,
  CButton,
  CFormCheck,
  CImage,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { toAbsoluteUrl } from "../../helpers/assetHelpers";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import Select from "react-select";
import "../../scss/required.scss";
import { Tooltip } from "primereact/tooltip";
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";
import generalUpdateApi from "src/server/generalUpdateApi";
import "../../css/form.css";

const AddMenu = () => {
  const [addMenuDets, setaddMenuDets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isloading, setLoading1] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();
  const [validationMessages, setValidationMessages] = useState({});
  const [showValidationMessages, setShowValidationMessages] = useState(false);
  // const menuId = window.location.href.split("?")[1];
  const [menuId, setMenuId] = useState();
  let menuId1 = "";
  useEffect(() => {
    menuId1 = localStorage.getItem("menuId");
    setMenuId(menuId1);
  }, []);

  const [isMenuGroup, setIsMenuGroup] = useState("0");
  const [isParentMenu, setIsParentMenu] = useState("0");
  const typeList = [
    {
      label: "Menu",
      value: "1-Menu",
    },
    {
      label: "SubMenu",
      value: "2-SubMenu",
    },
    {
      label: "Tab",
      value: "3-Tab",
    },
  ];

  const positionList = [
    {
      label: "Header",
      value: "Header",
    },
    {
      label: "LeftNav",
      value: "LeftNav",
    },
    {
      label: "Footer",
      value: "Footer",
    },
  ];

  const [fontIconList, setfontIconList] = useState([]);
  const [parentMenuListing, setparentMenuListing] = useState([]);
  let roleArr = [];

  const [form, setForm] = useState({
    menuName: "",
    routeUrl: "",
    fontIconName: {
      value: "/media/icon/fil012.svg",
      label: (
        <>
          <CImage
            src={toAbsoluteUrl(`/media/icon/fil012.svg`)}
            className="me-3 svg-icon-2"
            alt="test"
          />
          {"Test"}
        </>
      ),
    },
    parentMenu: "",
    position: "",
    order: "",
    type: "",
    menuRole: {
      superAdmin: 0,
      admin: 0,
      student: 0,
    },
    roles: [],
    isActive: 1,
  });
  useEffect(() => {
    if (addMenuDets) {
      setForm((prevState) => ({
        menuName: addMenuDets.menuName,
        routeUrl: addMenuDets.routeUrl,
        fontIconName: {
          value: addMenuDets.fontIconName,
          label: (
            <>
              <CImage
                src={toAbsoluteUrl(`/media/icon/${addMenuDets.fontIconName}`)}
                className="me-3 svg-icon-2"
                style={{ width: "1.5rem", height: "1rem" }}
                alt="test"
              />
              {addMenuDets.fontIconName}
            </>
          ),
        },
        parentMenu: addMenuDets.parentMenuId,
        position: addMenuDets.position,
        order: addMenuDets.order,
        type: addMenuDets.type,
        menuRole: addMenuDets.menuRole,
        roles: roleArr,
        isActive: addMenuDets.isActive,
      }));
    }
  }, [addMenuDets]);

  const fontIcon = async () => {
    try {
      const res = await getApiCall("getIconList");
      setfontIconList(res);
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

  const parentMenuList = async () => {
    try {
      const res = await getApiCall("getParentMenuMasterList");
      setparentMenuListing(res);
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

  const menuDetailApi = async (id) => {
    console.log({id});
    setIsLoading(true);
    try {
      const res = await getApiCall("getMenuMasterById", id);
      setaddMenuDets(res);
      setIsMenuGroup(`${res.isMenuGroup}`);
      setIsParentMenu(`${res.isParentMenu}`);
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
    if (menuId) {
      menuDetailApi(Number(menuId));
    }
  }, [menuId]);

  useEffect(() => {
    fontIcon();
    parentMenuList();

    setForm({
      ...form,
      fontIconName: {
        value: "Test",
        label: (
          <>
            <CImage
              src={`/media/icon/folder.svg`}
              className="me-3 svg-icon-2"
              alt="test"
            />
            {"Select Font Icon"}
          </>
        ),
      },
    });
  }, []);

  const addNewMenu = async (form) => {
    const updateData = {
      menuName: form.menuName,
      routeUrl: form.routeUrl,
      fontIconName: form.fontIconName.value,
      parentMenu: form.parentMenu,
      position: form.position,
      order: form.order,
      type: form.type,
      menuRole: form.menuRole,
      roles: form.roles,
      isActive: form.isActive,
      isParentMenu: isParentMenu,
      isMenuGroup: isMenuGroup,
    };
    setLoading1(true);

    try {
      const res = await postApiCall("addNewMenuMaster", updateData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Menu added Successfully",
        life: 3000,
      });
      setLoading1(false);

      if (isMenuGroup === "0") {
        setTimeout(() => {
          navigate(`/superadmin/modulelist/addeditmodule?${res.moduleId}`);
        }, 3000);
      } else {
        setTimeout(() => {
          navigate(`/superadmin/menulist`);
        }, 3000);
      }
    } catch (err) {
      setLoading1(false);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Adding Data ",
        life: 3000,
      });
    }
  };

  const handleChangeCheckbox = (e) => {
    const name = e.target.value;
    const checked = e.target.checked;
    if (form.menuRole == undefined) {
      form.menuRole = { superAdmin: 0, admin: 0, student: 0 };
    }
    if (name == "superAdmin" && checked) {
      form.menuRole["superAdmin"] = 1;
    } else if (name === "admin" && checked) {
      form.menuRole["admin"] = 1;
    } else if (name === "student" && checked) {
      form.menuRole["student"] = 1;
    } else if (name == "superAdmin" && !checked) {
      form.menuRole["superAdmin"] = 0;
    } else if (name == "admin" && !checked) {
      form.menuRole["admin"] = 0;
    } else if (name == "student" && !checked) {
      form.menuRole["student"] = 0;
    }

    setForm({
      ...form,
      menuRole: form.menuRole,
    });

    setValidationMessages({
      ...validationMessages,
      menuRole: e.target.name ? "" : "At least one menu role must be selected",
    });
  };

  const updateMenu = async (data) => {
    const updateData = {
      menuId: menuId,
      menuName: data.menuName,
      routeUrl: data.routeUrl,
      fontIconName: data.fontIconName.value,
      parentMenu: data.parentMenu,
      position: data.position,
      order: data.order,
      type: data.type,
      menuRole: data.menuRole,
      roles: data.roles,
      isActive: data.isActive,
      isParentMenu: isParentMenu,
      isMenuGroup: isMenuGroup,
    };

    setLoading1(true);

    try {
      const res = await generalUpdateApi("updateMenuMaster", updateData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Menu Data Updated successfully!",
        life: 3000,
      });
      setTimeout(() => {
        setLoading1(false);
        navigate("/superadmin/menulist");
      }, [1000]);
      localStorage.removeItem("menuId");
    } catch (err) {
      setLoading1(false);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Updating Data ",
        life: 3000,
      });
    }
  };
  const validateForm = () => {
    const messages = {};
    let isValid = true;

    if (!form.menuName) {
      messages.menuName = "Menu Name is required";
      isValid = false;
    } else {
      messages.menuName = "";
    }
    if (!form.fontIconName) {
      messages.fontIconName = "Font Icon is required";
      isValid = false;
    }

    if (!form.order) {
      messages.order = "Order is required";
      isValid = false;
    }

    if (!form.type) {
      messages.type = "Type is required";
      isValid = false;
    }

    if (
      form.menuRole["superAdmin"] === 0 &&
      form.menuRole["admin"] === 0 &&
      form.menuRole["student"] === 0
    ) {
      messages.menuRole = "At least one menu role must be selected";
      isValid = false;
    } else {
      messages.menuRole = "";
    }

    if (!form.position) {
      messages.position = "Position is required";
      isValid = false;
    }

    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };
  const handleSaveform = () => {
    if (validateForm()) {
      console.log({menuId});
      if (menuId) {
        updateMenu(form);
      } else {
        addNewMenu(form);
      }
    }
  };
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  return (
    <CRow>
      <Toast ref={toast} />
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className={`formHeader${themes}`}>
            <strong>Menu</strong>
          </CCardHeader>
          {isLoading ? (
            <CCardBody className="card-body border-top p-9">
              <formSkeleton />
            </CCardBody>
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
                        Menu Name
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormInput
                          type="text"
                          id="validationCustom01"
                          value={form.menuName}
                          onChange={(e) => {
                            setForm({ ...form, menuName: e.target.value });

                            setValidationMessages({
                              ...validationMessages,
                              menuName: e.target.value
                                ? ""
                                : "Menu Name is required",
                            });
                          }}
                          required
                          placeholder="Menu Name"
                        />
                        {showValidationMessages &&
                          validationMessages.menuName && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.menuName}
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
                        Is Menu Group?
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        <CFormCheck
                          inline
                          type="radio"
                          name="isMenuGroup"
                          id="inlineCheckbox1"
                          value={"1"}
                          label="Yes"
                          checked={isMenuGroup === "1"}
                          onChange={(e) => {
                            setIsMenuGroup(e.target.value);
                          }}
                        />
                        <CFormCheck
                          inline
                          type="radio"
                          name="isMenuGroup"
                          id="inlineCheckbox1"
                          value={"0"}
                          label="No"
                          checked={isMenuGroup === "0"}
                          onChange={(e) => {
                            setIsMenuGroup(e.target.value);
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

                {isMenuGroup && isMenuGroup === "0" && (
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          Route URL
                        </CFormLabel>
                        <div className="col-sm-7">
                          <div className="input-group">
                            <CFormInput
                              type="text"
                              id="validationCustom01"
                              value={form.routeUrl}
                              onKeyDown={(e) => {
                                if (e.key === " " || e.key === "/") {
                                  e.preventDefault();
                                }
                              }}
                              onChange={(e) => {
                                setForm({ ...form, routeUrl: e.target.value });
                              }}
                              required
                              placeholder="Route URL"
                            />

                            <label
                              className="input-group-text"
                              htmlFor="formFile"
                            >
                              <i
                                className="custom-choose-btn "
                                data-pr-tooltip="Example: actionpermission, organizationlist"
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
                              position="bottom"
                            ></Tooltip>
                          </div>
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>
                )}

                <CRow>
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Is Sub Menu?
                      </CFormLabel>
                      <div className="col-sm-7 py-2">
                        <CFormCheck
                          inline
                          type="radio"
                          name="isParentMenu"
                          id="inlineCheckbox1"
                          value={"1"}
                          label="Yes"
                          checked={isParentMenu === "1"}
                          onChange={(e) => {
                            setIsParentMenu(e.target.value);
                          }}
                        />
                        <CFormCheck
                          inline
                          type="radio"
                          name="isParentMenu"
                          id="inlineCheckbox1"
                          value={"0"}
                          label="No"
                          checked={isParentMenu === "0"}
                          onChange={(e) => {
                            setIsParentMenu(e.target.value);
                          }}
                        />
                      </div>
                    </CRow>
                  </CCol>

                  {isParentMenu && isParentMenu === "1" && (
                    <CCol md={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          Parent Menu
                        </CFormLabel>
                        <div className="col-sm-7">
                          <CFormSelect
                            type="text"
                            id="validationCustom01"
                            value={form.parentMenu}
                            onChange={(e) => {
                              setForm({ ...form, parentMenu: e.target.value });
                            }}
                            required
                            placeholder="Parent Menu"
                          >
                            <option value={""}>Select</option>
                            {parentMenuListing.map((e) => (
                              <option key={e.menuId} value={e.menuId}>
                                {e.menuName}
                              </option>
                            ))}
                          </CFormSelect>
                        </div>
                      </CRow>
                    </CCol>
                  )}
                </CRow>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Font Icon
                      </CFormLabel>
                      <div className="col-sm-7">
                        <Select
                          value={form.fontIconName}
                          // defaultvalue={form.fontIconName}
                          placeholder={"Select"}
                          options={fontIconList.map((e) => ({
                            value: e.iconPath,
                            label: (
                              <>
                                <CImage
                                  src={toAbsoluteUrl(
                                    `/media/icon/${e.iconPath}`
                                  )}
                                  className="me-3 svg-icon-2"
                                  style={{ width: "1rem", height: "1rem" }}
                                  alt={e.iconName}
                                />
                                {e.iconName}
                              </>
                            ),
                          }))}
                          // value={form.fontIconName}
                          onChange={(e) => {
                            setForm({ ...form, fontIconName: e });

                            setValidationMessages({
                              ...validationMessages,
                              fontIconName: e ? "" : "Font Icon is required",
                            });
                          }}
                        />
                        {showValidationMessages &&
                          validationMessages.fontIconName && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.fontIconName}
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
                        Order
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormInput
                          type="number"
                          onKeyDown={(e) => {
                            if (e.key === "e" || e.key === "E") {
                              e.preventDefault();
                            }
                          }}
                          id="validationCustom01"
                          value={form.order}
                          onChange={(e) => {
                            setForm({ ...form, order: e.target.value });

                            setValidationMessages({
                              ...validationMessages,
                              order: e.target.value ? "" : "Order is required",
                            });
                          }}
                          required
                          placeholder="Order"
                        />
                        {showValidationMessages && validationMessages.order && (
                          <div className="fw-bolder" style={{ color: "red" }}>
                            {validationMessages.order}
                          </div>
                        )}
                      </div>
                    </CRow>
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  {/*  */}

                  <CCol md={6}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-4 col-form-label fw-bolder fs-7 required"
                      >
                        Menu Type
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormSelect
                          type="text"
                          id="validationCustom01"
                          value={form.type}
                          onChange={(e) => {
                            setForm({ ...form, type: e.target.value });

                            setValidationMessages({
                              ...validationMessages,
                              type: e.target.value ? "" : "Type is required",
                            });
                          }}
                          required
                          placeholder="Parent Menu"
                        >
                          <option disabled value={""}>
                            Select
                          </option>
                          {typeList.map((e) => (
                            <option key={e.value} value={e.value}>
                              {e.label}
                            </option>
                          ))}
                        </CFormSelect>
                        {showValidationMessages && validationMessages.type && (
                          <div className="fw-bolder" style={{ color: "red" }}>
                            {validationMessages.type}
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
                        Menu role
                      </CFormLabel>
                      <div className="col-sm-7">
                        <span className="fw-bold ps-2 fs-6">
                          <CFormCheck
                            name="superAdmin"
                            id="validationCustom01"
                            checked={form.menuRole?.["superAdmin"]}
                            value="superAdmin"
                            onChange={(e) => {
                              handleChangeCheckbox(e);
                            }}
                            required
                          />
                          <span className="fw-bold ps-2 org fs-8">
                            SuperAdmin
                          </span>
                        </span>

                        <span className="fw-bold ps-2 fs-6">
                          <CFormCheck
                            name="admin"
                            id="validationCustom02"
                            className="me-1"
                            checked={form.menuRole?.["admin"]}
                            value="admin"
                            onChange={(e) => {
                              handleChangeCheckbox(e);
                            }}
                            required
                          />
                          <span className="fw-bold org ps-2 fs-6">Admin</span>
                        </span>

                        <span className="fw-bold ps-2 fs-6">
                          <CFormCheck
                            name="student"
                            id="validationCustom03"
                            checked={form.menuRole?.["student"]}
                            value="student"
                            onChange={(e) => handleChangeCheckbox(e)}
                            required
                          />
                          <span className="fw-bold org ps-2 fs-6">Student</span>
                        </span>
                        {showValidationMessages &&
                          validationMessages.menuRole && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.menuRole}
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
                        Position
                      </CFormLabel>
                      <div className="col-sm-7">
                        <CFormSelect
                          type="text"
                          id="validationCustom01"
                          value={form.position}
                          onChange={(e) => {
                            setForm({ ...form, position: e.target.value });

                            setValidationMessages({
                              ...validationMessages,
                              position: e.target.value
                                ? ""
                                : "Position is required",
                            });
                          }}
                          required
                          placeholder="Position"
                        >
                          <option disabled value={""}>
                            Select
                          </option>
                          {positionList.map((e) => (
                            <option key={e.value} value={e.value}>
                              {e.label}
                            </option>
                          ))}
                        </CFormSelect>
                        {showValidationMessages &&
                          validationMessages.position && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.position}
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
                to="/superadmin/menulist"
                className={`btn btn-primary me-2 saveButtonTheme${themes}`}
                onClick={() => {
                  localStorage.removeItem("menuId");
                }}
              >
                Back
              </Link>
              <CButton
                className={`btn btn-primary  saveButtonTheme${themes}`}
                onClick={() => {
                  localStorage.removeItem("menuId");
                  handleSaveform();
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
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default AddMenu;
