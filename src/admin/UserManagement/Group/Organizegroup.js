import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormLabel,
  CRow,
  CForm,
  CCardFooter,
  CFormCheck,
  CContainer,
  CButton,
} from "@coreui/react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../../scss/required.scss";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import "../../../css/table.css";

const API_URL = process.env.REACT_APP_API_URL;

const organizegroup = () => {
  const toast = useRef(null),
    [isloading, setLoading1] = useState(false),
    [isLoadingOrgSettings, setLoadingOrgSettings] = useState(false),
    token = "Bearer " + localStorage.getItem("ApiToken"),
    groupId = window.location.href.split("?")[1],
    navigate = useNavigate(),
    [organizationgroupList, setOrganizationgroupList] = useState([]),
    [groupDetail, setGroupDetail] = useState(""),
    [isLoading, setIsLoading] = useState(false),
    colorName = localStorage.getItem("ThemeColor"),
    [OrgSettingsList, setOrgSettingsList] = useState([]),
    [orgSettingsAdd, setorgSettingsAdd] = useState([]),
    [parentGroupList, setparentGroupList] = useState([]),
    [isModifyUserChecked, setIsModifyUserChecked] = useState(false),
    [changedGroupSettings, setChangedGroupSettings] = useState([]),
    [themes, setThemes] = useState(colorName),
    [groupsettings, setGroupsettings] = useState([
      {
        groupsetting: {
          groupsettingId: null,
          isActive: 0,
        },
      },
    ]),
    [form, setForm] = useState({
      groupName: "",
      groupCode: "",
      groupId: "",
      isActive: 1,
      parentGroup: "",
      organization: "",
      groupType: 1,
      description: "",
    });

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

  const groupDetailApi = (id) => {
    setIsLoading(true);
    axios
      .get(`${API_URL}/getOrgGroupById/${id}`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        setGroupDetail(res.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const organizationgroupListApi = (id) => {
    axios
      .get(`${API_URL}/getOrgGroupList`, {
        headers: { Authorization: token },
      })
      .then((res) => setOrganizationgroupList(res.data.data))
      .catch((err) => console.log(err));
  };

  const parentGroupListAPI = () => {
    axios
      .get(`${API_URL}/getOrgGroupOptionList`, {
        headers: { Authorization: token },
      })
      .then((res) => setparentGroupList(res.data.data))
      .catch((err) => console.log(err));
  };

  //OrganizationSettingsList & Add API
  const shouldRenderModifyUser = OrgSettingsList && OrgSettingsList.length > 0;
  const onClick = (e) => {
    const { value, checked } = e.target;
    const isChecked = checked ? 1 : 2;
    setGroupsettings([
      {
        groupsetting: {
          groupSettingId: value,
          isActive: isChecked,
        },
      },
    ]);

    const updatedOrgSettingsList = OrgSettingsList.map((e) => {
      if (e.groupSettingId == value) {
        return {
          ...e,
          isActive: isChecked,
        };
      }
      return e;
    });
    setOrgSettingsList(updatedOrgSettingsList);

    if (!changedGroupSettings.includes(value)) {
      setChangedGroupSettings((prevSettings) => [...prevSettings, value]);
    }
  };

  const onSave = () => {
    const groupSettingsPayload = changedGroupSettings.map((groupId) => {
      const isChecked = groupsettings[0].groupsetting.isActive;
      return {
        groupId,
        isChecked,
      };
    });
    axios
      .post(
        `${API_URL}/addOrganizationGroup`,
        { groups: groupSettingsPayload },
        {
          headers: { Authorization: token },
        }
      )
      .then((response) => {
        setorgSettingsAdd((orgSettingsAdd) => [
          ...orgSettingsAdd,
          ...changedGroupSettings,
        ]);
        orgGroupSettingListAPI();

        if (response) {
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Group Added Successfully",
            life: 3000,
          });
        }
        setTimeout(() => {
          navigate("/admin/autogroup");
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
        const errorMessage =
          error.response?.data?.errors || "An error occurred";
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: errorMessage,
          life: 3000,
        });
      })
      .finally(() => {
        setChangedGroupSettings([]);
      });
  };

  const orgGroupSettingListAPI = (id) => {
    setLoadingOrgSettings(true);
    axios
      .get(`${API_URL}/getOrganizationGroupList`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        setOrgSettingsList(res.data.data);
        setLoadingOrgSettings(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingOrgSettings(false);
      });
  };

  return (
    <div className="container">
      <div className="container-fluid">
        <CRow>
          <Toast ref={toast} />
          <CCol xs={12} style={{ padding: "1px" }}>
            <CContainer>
              <CCard className="mb-4">
                <CCardHeader className="p-0">
                  <strong>Organize User Group Based On:</strong>
                </CCardHeader>
                {isLoadingOrgSettings ? (
                  <CCardBody className="card-body border-top">
                    <CForm
                      className={`row g-15 needs-validation ps-4 InputThemeColor${themes}`}
                    >
                      <CRow className="mb-3">
                        <CCol lg={6}>
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-4 col-form-label fw-bolder fs-7"
                            >
                              <Skeleton width="85%" className="mr-2"></Skeleton>
                            </CFormLabel>
                          </CRow>
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-3 col-form-label fw-bolder fs-7"
                            >
                              <Skeleton width="85%" className="mr-2"></Skeleton>
                            </CFormLabel>
                            <div className="col-sm-7 py-2">
                              <Skeleton width="97%"></Skeleton>
                            </div>
                          </CRow>
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-3 col-form-label fw-bolder fs-7"
                            >
                              <Skeleton width="85%" className="mr-2"></Skeleton>
                            </CFormLabel>
                            <div className="col-sm-7 py-2">
                              <Skeleton width="97%"></Skeleton>
                            </div>
                          </CRow>
                          <CRow className="mb-4">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-3 col-form-label fw-bolder fs-7"
                            >
                              <Skeleton width="85%" className="mr-2"></Skeleton>
                            </CFormLabel>
                            <div className="col-sm-7 py-2">
                              <Skeleton width="97%"></Skeleton>
                            </div>
                          </CRow>
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-3 col-form-label fw-bolder fs-7"
                            >
                              <Skeleton width="85%" className="mr-2"></Skeleton>
                            </CFormLabel>
                            <div className="col-sm-7 py-2">
                              <Skeleton width="97%"></Skeleton>
                            </div>
                          </CRow>
                        </CCol>
                        <CCol md={6}>
                          <CRow className="col-sm-12 ps-5">
                            <CFormLabel
                              htmlFor=""
                              className=" col-form-label fw-bolder fs-7 mb-2"
                            >
                              <span className="">
                                <Skeleton
                                  width="50%"
                                  className="mr-2"
                                ></Skeleton>
                              </span>
                            </CFormLabel>
                            <div>
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
                  <CCardBody className="card-body border-top">
                    <CRow>
                      <CCol lg={6} className="mb-3"></CCol>

                      <CCol lg={12} className="mb-3">
                        <CCard className="h-100">
                          <CCardBody className="p-4">
                            <CForm
                              className={`row g-15 needs-validation ps-4 InputThemeColor${themes}`}
                            >
                              {OrgSettingsList &&
                                OrgSettingsList.map((e) => (
                                  <div
                                    key={e.groupSettingId}
                                    style={{ marginBottom: "10px" }}
                                  >
                                    <CFormCheck
                                      value={e.groupSettingId}
                                      checked={e.isActive === 1}
                                      onChange={onClick}
                                    />
                                    <span style={{ marginLeft: "10px" }}>
                                      {e.groupSettingName}
                                    </span>
                                  </div>
                                ))}
                            </CForm>
                          </CCardBody>
                        </CCard>
                      </CCol>
                    </CRow>
                  </CCardBody>
                )}
                {shouldRenderModifyUser && (
                  <div
                    className={`InputThemeColor${themes}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                      marginTop: "-23px",
                      marginLeft: "65px",
                    }}
                  >
                    <CFormCheck
                      value="Modify user"
                      checked={isModifyUserChecked}
                      onChange={(e) => setIsModifyUserChecked(e.target.checked)}
                    />
                    <span style={{ marginLeft: "10px" }}>Modify User</span>
                  </div>
                )}
                <CCardFooter>
                  <div className="buttons d-flex justify-content-end">
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
                    <Link to="/admin/autogroup" className="btn btn-primary">
                      Back
                    </Link>
                  </div>
                </CCardFooter>
              </CCard>
            </CContainer>
          </CCol>
        </CRow>
      </div>
    </div>
  );
};

export default organizegroup;
