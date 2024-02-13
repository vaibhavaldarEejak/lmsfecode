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
  CCardFooter,
  CFormSelect,
  CFormInput,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import "../../css/table.css";
import getApiCall from "src/server/getApiCall";
import generalUpdateApi from "src/server/generalUpdateApi";

function ActiveInActiveRoles() {
  const [isloading, setLoading1] = useState(false),
    [organizationId, setOrganizationId] = useState(0),
    navigate = useNavigate(),
    [rolesList, setRolesList] = useState([]),
    [selectAllCheck, setSelectAllCheck] = useState(false),
    [Organisation, setOrganisation] = useState([]),
    [loading4, setLoading4] = useState(false),
    [dropDownList, setDropDownList] = useState(false),
    colorName = localStorage.getItem("ThemeColor"),
    [themes, setThemes] = useState(colorName),
    toast = useRef(null);

  const getOrgList = async () => {
    try {
      const res = await getApiCall(`getOrganizationOptionsList?withoutSA=1`);
      setOrganisation(res);
      setDropDownList(false);
    } catch (err) {}
  };

  const onSave = async () => {
    setLoading1(true);

    try {
      const res = await generalUpdateApi(
        `bulkUpdateOrgRole/${organizationId}`,
        { roles: rolesList }
      );

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Role has been Updated Successfully!",
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
      setLoading1(false);
    }
  };

  const selectAll = (e) => {
    const { checked } = e.target;
    setSelectAllCheck(checked);
    if (checked) {
      rolesList.map((item) => {
        item.isChecked = 1;
      });
    } else {
      rolesList.map((item) => {
        item.isChecked = 0;
      });
    }

    setRolesList([...rolesList]);
  };

  const onClick = (e) => {
    const { value, checked } = e.target;
    const index = rolesList.findIndex((x) => x.roleId == value);
    if (index > -1) {
      rolesList[index].isChecked = checked ? 1 : 0;
      setRolesList([...rolesList]);
    }
  };

  const getRolesListByOrgId = async (organizationId) => {
    setLoading4(true);
    try {
      const res = await getApiCall("getRoleListByOrgId", organizationId);
      setRolesList(
        res.map((item) => {
          return {
            roleId: item.roleId,
            roleName: item.roleName,
            superAdminRoleName: item.superAdminRoleName,
            isChecked: item.isChecked,
          };
        })
      );
      setLoading4(false);
    } catch (err) {
      var errMsg = err?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
      setLoading4(false);
    }
  };

  useEffect(() => {
    getOrgList();
  }, []);

  useEffect(() => {
    if (organizationId) {
      getRolesListByOrgId(organizationId);
    }
  }, [organizationId]);

  return (
    <div>
      <div className="container">
        <div className="container-fluid">
          <Toast ref={toast} />
          <CRow>
            <CCol xs={12}>
              <CCard className="mb-lg-0">
                <CCardHeader className="p-0">
                  <CNav variant="tabs">
                    <CNavItem>
                      <Link
                        style={{ cursor: "pointer", textDecoration: "none" }}
                        to={`/superadmin/roleslist`}
                      >
                        <CNavLink style={{ cursor: "pointer" }}>Roles</CNavLink>
                      </Link>
                    </CNavItem>
                    <CNavItem>
                      <Link
                        style={{ cursor: "pointer", textDecoration: "none" }}
                        to={`/superadminadmin/activeinactiveroles`}
                      >
                        <CNavLink active style={{ cursor: "pointer" }}>
                          <strong>Role Assignment</strong>
                        </CNavLink>
                      </Link>
                    </CNavItem>
                  </CNav>
                </CCardHeader>
                <CCardBody>
                  <div className="d-flex justify-content-end">
                    <CRow>
                      <CCol md={12}>
                        <CFormSelect
                          id="floatingSelect"
                          aria-label="Floating label select example"
                          onChange={(e) => setOrganizationId(e.target.value)}
                        >
                          <option value="0">Select Organization</option>
                          {Organisation.map((item) => (
                            <option
                              key={item.organizationId}
                              value={item.organizationId}
                            >
                              {item.organizationName}
                            </option>
                          ))}
                        </CFormSelect>
                      </CCol>
                    </CRow>
                  </div>
                  <CRow>
                    <CCol xs={12} style={{ marginTop: "1rem" }}>
                      <table className="table table-hover table-outline mb-0 d-none d-sm-table">
                        {loading4 === true ? (
                          <thead className="thead-light">
                            <tr>
                              <th className="text-center">
                                {rolesList.length > 0 && (
                                  <CFormCheck
                                    className="form-check"
                                    type="checkbox"
                                    id="checkbox"
                                    checked={selectAllCheck}
                                    name="checkbox"
                                    onChange={(e) => selectAll(e)}
                                  />
                                )}
                              </th>
                              <th className="text-center">Role Name</th>
                              <th className="text-center">
                                Organisation Role Name
                              </th>
                            </tr>
                          </thead>
                        ) : (
                          <></>
                        )}
                        <tbody style={{ marginTop: "0.1rem" }}>
                          {rolesList.length > 0 ? (
                            <>
                              {rolesList.map((item) => (
                                <tr key={item.roleId}>
                                  <td className="text-center py-2">
                                    <CFormCheck
                                      className="form-check"
                                      type="checkbox"
                                      id="checkbox"
                                      name="checkbox"
                                      checked={item.isChecked}
                                      value={item.roleId}
                                      onChange={(e) => onClick(e)}
                                    />
                                  </td>
                                  <td className="text-center py-2">
                                    {item.superAdminRoleName}
                                  </td>
                                  <td className="text-center py-1">
                                    <CFormInput
                                      id="floatingInput"
                                      type="text"
                                      placeholder="Organisation Role Name"
                                      value={item.roleName}
                                      onChange={(e) => {
                                        const { value } = e.target;
                                        const index = rolesList.findIndex(
                                          (x) => x.roleId == item.roleId
                                        );
                                        if (index > -1) {
                                          rolesList[index].roleName = value;
                                          setRolesList([...rolesList]);
                                        }
                                      }}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </>
                          ) : (
                            <h2
                              style={{ textAlign: "center", padding: "1rem 0" }}
                            >
                              Select Organization to check roles assigned to the
                              company.
                            </h2>
                          )}
                        </tbody>
                      </table>
                    </CCol>
                  </CRow>
                  <CCardFooter>
                    {!dropDownList && (
                      <div className="buttons d-flex justify-content-end">
                        <Link
                          to="/superadmin/roleslist"
                          className={`btn btn-primary saveButtonTheme${themes} me-2`}
                        >
                          Back
                        </Link>
                        <CButton
                          className={`btn btn-primary saveButtonTheme${themes} me-2`}
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
                    )}
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

export default ActiveInActiveRoles;
