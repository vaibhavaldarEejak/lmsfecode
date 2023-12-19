import React, { useEffect, useState } from "react";
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
  CInputGroup,
  CInputGroupText,
  CCardFooter,
  CButton,
} from "@coreui/react";
import { Link, useNavigate } from "react-router-dom";
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";

const Editsubadmin = () => {
  const navigate = useNavigate(),
    [roleList, setRoleList] = useState([]),
    [organizationList, setOrganizationList] = useState([]),
    [userDetail, setUserDetail] = useState(""),
    userId = window.location.href.split("?")[1],
    [isloading, setLoading1] = useState(false);

  const [form, setForm] = useState({
    role: "",
    //  organization : "",
    organizationId: "",
    firstName: "",
    lastName: "",
    jobTitle: "",
    emailAddress: "",
    barcode: "",
    phoneNumber: "",
    division: "",
    area: "",
    location: "",
    role: "",
    userName: "",
    password: "",
    isActive: 1,
  });

  useEffect(() => {
    if (userDetail) {
      setForm({
        firstName: userDetail.firstName,
        lastName: userDetail.lastName,
        jobTitle: userDetail.jobTitle,
        role: userDetail.role,
        organizationId: userDetail.organizationId,
        emailAddress: userDetail.emailAddress,
        barcode: userDetail.barcode,
        division: userDetail.userdivision,
        area: userDetail.userarea,
        location: userDetail.userlocation,
        userName: userDetail.useruserName,
        phoneNumber: userDetail.phoneNumber,
        password: userDetail.password,
        userId: userDetail.userId,
      });
    }
  }, [userDetail]);

  useEffect(() => {
    if (userId) {
      userDetailApi(Number(userId));
    }
  }, [userId]);

  const userDetailApi = async (id) => {
    try {
      const res = await getApiCall("getUserById", id);
      setUserDetail(res);
    } catch (err) {}
  };

  const EditSubAdmin = async () => {
    let formData = new FormData();

    formData.append("firstName", form.firstName);
    formData.append("lastName", form.lastName);
    formData.append("jobTitle", form.jobTitle);
    formData.append("role", form.role);
    formData.append("organizationId", form.organizationId);
    formData.append("emailAddress", form.emailAddress);
    formData.append("barcode", form.barcode);
    formData.append("division", form.division);
    formData.append("area", form.area);
    formData.append("location", form.location);
    formData.append("userName", form.userName);
    formData.append("phoneNumber", form.phoneNumber);
    formData.append("password", form.password);
    formData.append("isActive", form.isActive);
    setLoading1(true);
    try {
      const res = await postApiCall("updateUser", formData);
      navigate("/admin/userlist");
    } catch (err) {}
  };

  const roleListApi = async () => {
    try {
      const res = await getApiCall("getRoleList");
      setRoleList(res);
    } catch (err) {}
  };

  const organizationListApi = async (id) => {
    try {
      const res = await getApiCall("getOrganizationOptionsList");
      setOrganizationList(res);
    } catch (err) {}
  };

  useEffect(() => {
    roleListApi();
    organizationListApi();
  }, []);

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Add New User</strong>
          </CCardHeader>
          <CCardBody className="card-body border-top p-9">
            <CForm className="row g-15 needs-validation">
              <CRow className="mb-3">
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-3 col-form-label fw-bolder fs-7"
                    >
                      Full Name
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CInputGroup>
                        <CInputGroupText>First & last name</CInputGroupText>
                        <CFormInput
                          aria-label="First name"
                          value={form.firstName}
                          onChange={(e) =>
                            setForm({ ...form, firstName: e.target.value })
                          }
                        />
                        <CFormInput
                          aria-label="Last name"
                          value={form.lastName}
                          onChange={(e) =>
                            setForm({ ...form, lastName: e.target.value })
                          }
                        />
                      </CInputGroup>
                    </div>
                  </CRow>
                </CCol>
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-3 col-form-label fw-bolder fs-7"
                    >
                      User Email Id
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        value={form.emailAddress}
                        onChange={(e) =>
                          setForm({ ...form, emailAddress: e.target.value })
                        }
                        placeholder="User Email Id"
                        required
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
                      className="col-sm-3 col-form-label fw-bolder fs-7"
                    >
                      Contact Number
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        value={form.phoneNumber}
                        onChange={(e) =>
                          setForm({ ...form, phoneNumber: e.target.value })
                        }
                        placeholder="Contact Number"
                        required
                      />
                    </div>
                  </CRow>
                </CCol>
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-3 col-form-label fw-bolder fs-7"
                    >
                      Bar Code
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        value={form.barcode}
                        onChange={(e) =>
                          setForm({ ...form, barcode: e.target.value })
                        }
                        placeholder="barcode"
                        required
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
                      className="col-sm-3 col-form-label fw-bolder fs-7"
                    >
                      Job Title
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        placeholder="Job Title"
                        required
                      />
                    </div>
                  </CRow>
                </CCol>
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-3 col-form-label fw-bolder fs-7"
                    >
                      Area
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        placeholder="Area"
                        required
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
                      className="col-sm-3 col-form-label fw-bolder fs-7"
                    >
                      Division
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        placeholder="Note"
                        required
                      />
                    </div>
                  </CRow>
                </CCol>

                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-3 col-form-label fw-bolder fs-7"
                    >
                      User Role
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormSelect
                        required
                        value={form.role}
                        onChange={(f) =>
                          setForm({ ...form, role: f.target.value })
                        }
                        aria-label="select example"
                      >
                        <option disabled value={""}>
                          Select
                        </option>
                        {roleList.map((e) => (
                          <option key={e.roleId} value={e.roleId}>
                            {e.roleName}
                          </option>
                        ))}
                        {/* {roleId: 7, roleName:""} */}
                      </CFormSelect>
                    </div>
                  </CRow>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-3 col-form-label fw-bolder fs-7"
                    >
                      Location
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        placeholder="Note"
                        required
                      />
                    </div>
                  </CRow>
                </CCol>
                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-3 col-form-label fw-bolder fs-7"
                    >
                      Password
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="password"
                        id="validationCustom01"
                        value={form.password}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                        placeholder="Password"
                        required
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
                      className="col-sm-3 col-form-label fw-bolder fs-7"
                    >
                      Username
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormInput
                        type="text"
                        id="validationCustom01"
                        value={form.userName}
                        onChange={(e) =>
                          setForm({ ...form, userName: e.target.value })
                        }
                        placeholder="Username"
                        required
                      />
                    </div>
                  </CRow>
                </CCol>

                <CCol md={6}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-3 col-form-label fw-bolder fs-7"
                    >
                      Organization Name
                    </CFormLabel>
                    <div className="col-sm-7">
                      <CFormSelect
                        required
                        value={form.organizationId}
                        onChange={(f) =>
                          setForm({ ...form, organizationId: f.target.value })
                        }
                        aria-label="select example"
                      >
                        <option disabled value={""}>
                          Select
                        </option>
                        {organizationList.map((e) => (
                          <option
                            key={e.organizationId}
                            value={e.organizationId}
                          >
                            {e.organizationName}
                          </option>
                        ))}
                      </CFormSelect>
                    </div>
                  </CRow>
                </CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={12}>
                  <CRow className="mb-3">
                    <CFormLabel
                      htmlFor=""
                      className="col-sm-2 col-form-label fw-bolder"
                    >
                      Status
                    </CFormLabel>
                    <div className="col-sm-6">
                      <CFormSwitch
                        size="xl"
                        id="formSwitchCheckDefaultXL"
                        checked={form.isActive === 1}
                        onChange={(e) =>
                          e.target.checked
                            ? setForm({ ...form, isActive: 1 })
                            : setForm({ ...form, isActive: 0 })
                        }
                      />
                    </div>
                  </CRow>
                </CCol>

                <CRow className="mb-3">
                  <CCol md={6}>
                    <CRow className="mb-3"></CRow>
                  </CCol>
                </CRow>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}></CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}></CCol>
              </CRow>

              <CRow className="mb-3">
                <CCol md={6}></CCol>
              </CRow>
            </CForm>
          </CCardBody>
          <CCardFooter>
            <div className="d-flex justify-content-end">
              <CButton
                className="btn btn-primary me-2"
                onClick={() => EditSubAdmin()}
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
              <Link to="/admin/userlist" className="btn btn-primary">
                Back
              </Link>
            </div>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default Editsubadmin;
