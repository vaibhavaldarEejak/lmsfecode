import PropTypes from "prop-types";
import React, { useEffect, useState, createRef } from "react";
import classNames from "classnames";
import { CRow, CCol, CCard, CCardHeader, CCardBody } from "@coreui/react";
import { Toast } from "primereact/toast";
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";
import "../../css/form.css";
import { useRef } from "react";
const token = "Bearer " + localStorage.getItem("ApiToken");

const ThemeView = ({ colorCode }) => {
  return (
    // <table className="table w-100" ref={ref}>
    <table className="table w-100">
      <tbody>
        <tr>
          <td className="text-medium-emphasis">HEX:</td>
          <td className="font-weight-bold">{colorCode}</td>
        </tr>
        {/* <tr>
          <td className="text-medium-emphasis">RGB:</td>
          <td className="font-weight-bold">{colorCode}</td>
        </tr> */}
      </tbody>
    </table>
  );
};

const ThemeColor = ({ className, children }) => {
  const classes = classNames(className, "theme-color w-75 rounded mb-3");
  return (
    <CCol xs={12} sm={6} md={4} xl={2} className="mb-4">
      <div className={classes} style={{ paddingTop: "75%" }}></div>
      {children}
      <ThemeView />
    </CCol>
  );
};

ThemeColor.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

const Colors = () => {
  const [themes, setThemes] = useState();
  const [newThemes, setNewThemes] = useState();
  const toast = useRef(null);

  const getThemes = async () => {
    try {
      const res = await getApiCall("getThemeList");
      setThemes(res);
      res?.map((item, i) => {
        if (item.isDeafult != 0) {
          localStorage.setItem("ThemeColor", item.themeName);
          setNewThemes(item.themeName);
        }
      });
    } catch (err) {}
  };
  const [loading, setLoading] = useState(false);
  const sendThemeData = async (data) => {
    const themeID = {
      themeId: data,
    };
    setLoading(true);
    try {
      const res = await postApiCall("setTheme", themeID);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Theme updated successfully!",
        life: 3000,
      });
      window.location.reload();
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
    if (token !== "Bearer null") {
      getThemes();
    }
  }, []);

  const colorName = localStorage.getItem("ThemeColor");
  useEffect(() => {
    if (newThemes === colorName) {
      window.location.reload();
    }
  }, []);

  return (
    <>
      <div>
        <Toast ref={toast} />
        <div className="container">
          <div className="container-fluid">
            <CCol xs={12} style={{ padding: "1px" }}>
              <CCard className="mb-4">
                <CCardHeader className={`formHeader${colorName}`}>
                  <strong>Theme colors</strong>
                </CCardHeader>
                <CCardBody
                  style={{
                    cursor: "pointer",
                    display: `${loading ? "flex" : "block"}`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {loading ? (
                    <span
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    <CRow>
                      {themes?.map((item, i) => (
                        <>
                          <CCol
                            xs={12}
                            sm={6}
                            md={4}
                            xl={2}
                            className="mb-4"
                            onClick={(e) => {
                              sendThemeData(item.themeId);
                            }}
                          >
                            <div
                              style={{
                                paddingTop: "75%",
                                background: `${item.backgroundColor}`,
                              }}
                            ></div>
                            <h6 style={{ paddingTop: "1rem" }}>
                              {item.themeName}
                            </h6>
                            <table className="table w-100">
                              <tbody>
                                <tr>
                                  <td
                                    className="text-medium-emphasis"
                                    style={{ paddingLeft: "0" }}
                                  >
                                    HEX:
                                  </td>
                                  <td className="font-weight-bold">
                                    {item.backgroundColor}
                                  </td>
                                </tr>
                                {/* <tr>
                          <td
                            className="text-medium-emphasis"
                            style={{ paddingLeft: "0" }}
                          >
                            RGB:
                          </td>
                          <td className="font-weight-bold">
                            {item.backgroundColor}
                          </td>
                        </tr> */}
                              </tbody>
                            </table>
                          </CCol>
                        </>
                      ))}
                    </CRow>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </div>
        </div>
      </div>
    </>
  );
};

export default Colors;
