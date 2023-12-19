import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormLabel,
  CRow,
  CForm,
  CCardFooter,
  CBadge,
} from "@coreui/react";
import { Link } from "react-router-dom";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import getApiCall from "src/server/getApiCall";
import "../../css/form.css";

const ViewMenu = () => {
  // const menuId = window.location.href.split("?")[1];
  const [menuDetail, setmenuDetail] = useState("");
  const [form, setform] = useState({
    menuId: "",
    menuName: "",
    routeUrl: "",
    fontIconName: "",
    parentMenuName: "",
    type: "",
    isActive: 1,
    order: "",
    position: "",
  });

  let menuId = "";
  useEffect(() => {
    menuId = localStorage.getItem("menuId");
  }, []);

  useEffect(() => {
    if (menuDetail) {
      setform({
        menuId: menuDetail.menuId,
        menuName: menuDetail.menuName,
        routeUrl: menuDetail.routeUrl,
        fontIconName: menuDetail.fontIconName,
        parentMenuName: menuDetail.parentMenuName,
        type: menuDetail.type,
        order: menuDetail.order,
        isActive: menuDetail.isActive,
        position: menuDetail.position,
      });
    }
  }, [menuDetail]);
  const [loading, setLoading] = useState(false);

  const menuDetailApi = async (id) => {
    setLoading(true);
    try {
      const res = await getApiCall("getMenuMasterById", id);
      setmenuDetail(res);
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
    if (menuId) {
      menuDetailApi(Number(menuId));
    }
  }, [menuId]);
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  return (
    <div>
      <CRow>
        {loading ? (
          <div
            className="pt-3 text-center d d-flex justify-content-center align-items-center"
            style={{ height: "70vh" }}
          >
            <div className="spinner-border " role="status">
              <span className="sr-only"></span>
            </div>
          </div>
        ) : (
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader className={`formHeader${colorName}`}>
                <strong>Menu Details</strong>
              </CCardHeader>
              <CCardBody className="card-body org border-top p-9">
                <CForm
                  className={`row g-15 needs-validation ps-4 InputThemeColor${themes}`}
                  form={form}
                  onFinish={menuDetailApi}
                >
                  <CRow className="mb-3">
                    <CCol lg={6}>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          Menu Name :
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          {menuDetail.menuName}
                        </div>
                      </CRow>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          Route URL :
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          {menuDetail.routeUrl}
                        </div>
                      </CRow>

                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          Font Icon :
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          {menuDetail.fontIconName}
                        </div>
                      </CRow>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          type :
                        </CFormLabel>
                        <div className="col-sm-7 py-2">{menuDetail.type}</div>
                      </CRow>

                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          Order :
                        </CFormLabel>
                        <div className="col-sm-7 py-2">{menuDetail.order}</div>
                      </CRow>

                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          Position :
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          {menuDetail.position}
                        </div>
                      </CRow>

                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-4 col-form-label fw-bolder fs-7"
                        >
                          Status :
                        </CFormLabel>
                        <div className="col-sm-7 py-2 fs-6">
                          {menuDetail?.isActive === 1 ? (
                            <CBadge
                              className={`badge badge-light-info saveButtonTheme${themes}`}
                              color="primary"
                            >
                              {menuDetail?.isActive === 1
                                ? "Active"
                                : "In-Active"}
                            </CBadge>
                          ) : (
                            <CBadge
                              className={`badge badge-light-info saveButtonTheme${themes}`}
                              color="secondary"
                            >
                              {menuDetail?.isActive === 1
                                ? "Active"
                                : "In-Active"}
                            </CBadge>
                          )}
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
              <CCardFooter>
                <div className="d-flex justify-content-end">
                  <Link
                    to="/superadmin/menulist"
                    className={`btn btn-primary saveButtonTheme${themes}`}
                    onClick={() => {
                      localStorage.removeItem("menuId");
                    }}
                  >
                    Back
                  </Link>
                </div>
              </CCardFooter>
            </CCard>
          </CCol>
        )}
      </CRow>
    </div>
  );
};

export default ViewMenu;
