import React, { useEffect, useState, useRef } from "react";
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
  CFormCheck,
  CForm,
  CFormLabel,
  CCardFooter,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { Toast } from "primereact/toast";
import postApiCall from "src/server/postApiCall";
import getApiCall from "src/server/getApiCall";
import "../../css/table.css";

function GeneralSettings() {
  const [themes, setThemes] = useState("");
  const [isloading, setLoading1] = useState(false);
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const toast = useRef(null);
  const [GeneralSettings, setGeneralSetting] = useState({
    generalSettings: [
      {
        generalSettingId: null,
        generalSettingName: "",
        isChecked: 0,
      },
    ],
  });

  const onClick = (e) => {
    const { value, checked } = e.target;
    const index = GeneralSettings.generalSettings.findIndex(
      (x) => x.generalSettingId == value
    );
    if (index > -1) {
      GeneralSettings.generalSettings[index].generalSettingId = parseInt(value);
      GeneralSettings.generalSettings[index].isChecked = checked ? 1 : 0;
      setGeneralSetting({
        generalSettings: GeneralSettings.generalSettings,
      });
    }
  };

  const onSave = async () => {
    const data = { generalSettings: GeneralSettings.generalSettings };
    setLoading1(true);
    try {
      const res = await postApiCall("addGeneralSetting", data);
      setLoading1(false);
      if (res) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: res.data.message,
          life: 3000,
        });
      }
    } catch (err) {
      setLoading1(false);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: err.response.data.message,
        life: 3000,
      });
    }
  };

  useEffect(() => {
    getGeneralSettingsList();
  }, []);

  const getGeneralSettingsList = async () => {
    try {
      const res = await getApiCall("getGeneralSettingList");
      setGeneralSetting({
        generalSettings: res.map((e) => ({
          generalSettingId: e.generalSettingId,
          generalSettingName: e.generalSettingName,
          isChecked: e.isChecked,
        })),
      });
    } catch (err) {}
  };

  return (
    <div>
      <div className="container">
        <div className="container-fluid">
          <Toast ref={toast} />
          <CRow>
            <CCol xs={12} style={{ padding: "1px" }}>
              <CCard className="mb-7 card-ric">
                <div>
                  <CCardHeader className="p-0">
                    <CNav variant="tabs">
                      <CNavItem>
                        <Link
                          style={{ cursor: "pointer", textDecoration: "none" }}
                          to={`/admin/companysettings`}
                        >
                          <CNavLink style={{ cursor: "pointer" }}>
                            Company Details
                          </CNavLink>{" "}
                        </Link>
                      </CNavItem>
                      <CNavItem>
                        <Link
                          style={{ cursor: "pointer", textDecoration: "none" }}
                          to={`/admin/generalsettings`}
                        >
                          <CNavLink active style={{ cursor: "pointer" }}>
                            <strong>General Settings</strong>
                          </CNavLink>
                        </Link>
                      </CNavItem>
                    </CNav>
                  </CCardHeader>
                </div>
                <CCardBody className="card-body org border-top">
                  <CRow className="mb-3">
                    <CCol lg={12} className="mb-3">
                      <CCard className="h-100">
                        <CCardBody className="p-4">
                          <CForm
                            className={`row g-15 needs-validation ps-4 InputThemeColor${themes}`}
                          >
                            {GeneralSettings.generalSettings &&
                              GeneralSettings.generalSettings.map(
                                (item, index) => (
                                  <CCol lg={6} key={index}>
                                    <CFormCheck
                                      type="checkbox"
                                      id="flexCheckDefault"
                                      label={item.generalSettingName}
                                      value={item.generalSettingId}
                                      checked={
                                        item.isChecked == 1 ? true : false
                                      }
                                      onChange={onClick}
                                    />
                                  </CCol>
                                )
                              )}
                          </CForm>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                  <CCardFooter>
                    <div className="buttons d-flex justify-content-end">
                      <Link
                        to="/admin/admindashboard"
                        className="btn btn-primary me-2"
                      >
                        Back
                      </Link>
                      <CButton
                        className="btn btn-primary me-2"
                        onClick={onSave}
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
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </div>
    </div>
  );
}

export default GeneralSettings;
