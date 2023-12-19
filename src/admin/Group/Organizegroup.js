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
import { useNavigate } from "react-router-dom";
import "../../scss/required.scss";
import { Skeleton } from "primereact/skeleton";
import { Toast } from "primereact/toast";
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";
const organizegroup = () => {
  const toast = useRef(null),
    token = "Bearer " + localStorage.getItem("ApiToken"),
    [isloading, setLoading1] = useState(false),

    groupId = window.location.href.split("?")[1],
    navigate = useNavigate(),
    colorName = localStorage.getItem("ThemeColor"),
    [themes, setThemes] = useState(colorName),
    [isLoadingOrgSettings, setLoadingOrgSettings] = useState(true),
    [organizationgroupList, setOrganizationgroupList] = useState([]),
    [groupDetail, setGroupDetail] = useState(""),
    [validationMessages, setValidationMessages] = useState({}),
    [showValidationMessages, setShowValidationMessages] = useState(false),
    [parentGroupList, setparentGroupList] = useState([]),
    [isModifyUserChecked, setIsModifyUserChecked] = useState(false),
    [isLoading, setIsLoading] = useState(false),
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


  const groupDetailApi = async (id) => {
    setIsLoading(true);
    try {
      const response = await getApiCall("getOrgGroupById", id);
      setGroupDetail(response);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  const updatedGroupSettings = [];
  const organizationgroupListApi = async (id) => {
    try {
      const response = await getApiCall("getOrgGroupList", id);
      setOrganizationgroupList(response);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  const parentGroupListAPI = async () => {
    try {
      const response = await getApiCall("getOrgGroupOptionList");
      setparentGroupList(response);
    } catch (error) { }
  };


  //OrganizationSettingsList & Add API
  const [OrgSettingsList, setOrgSettingsList] = useState([]);
  const [orgSettingsAdd, setorgSettingsAdd] = useState([]);
  const shouldRenderModifyUser = OrgSettingsList && OrgSettingsList.length > 0;
  const [groupsettings, setGroupsettings] = useState([
    {
      groupsetting: {
        groupsettingId: null,
        isActive: 0,
      },
    },
  ]);
  const [changedGroupSettings, setChangedGroupSettings] = useState([]);
  const onClick = (e) => {
    const { value, checked } = e.target;
    const isChecked = checked ? 1 : 0;
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

  const onSave = async () => {
    for (const setting of OrgSettingsList) {
      const isChecked = changedGroupSettings.includes(setting.groupSettingId)
        ? groupsettings[0].groupsetting.isActive
        : setting.isActive;

      updatedGroupSettings.push({
        groupId: setting.groupSettingId,
        isChecked: isChecked ? 1 : 0,
      });
    }
    const data = { groups: updatedGroupSettings };

    try {
      setLoading1(true);
      const res = await postApiCall("addOrganizationGroup", data);

      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Group Added Successfully",
        life: 3000,
      });


      setTimeout(() => {
        navigate("/admin/autogroup");
      }, 2000);
    } catch (error) {
      let errorMessage = "An error occurred";
      if (error.response && error.response.data && error.response.data.errors) {
        errorMessage = error.response.data.errors;
      }

      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errorMessage,
        life: 3000,
      });
    } finally {
      setLoading1(false);
    }

    setChangedGroupSettings([]);
  };
  const orgGroupSettingListAPI = async (id) => {
    setLoadingOrgSettings(true);
    try {
      const res = await getApiCall("getOrganizationGroupList");
      setOrgSettingsList(res);
      setLoadingOrgSettings(false);
    } catch (err) {
      setLoadingOrgSettings(false);
    }
  };
  return (
    <CRow>
      <Toast ref={toast} />
      <CCol xs={12}>
        <CContainer>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Organize User Group Based On:</strong>
            </CCardHeader>
            {isLoadingOrgSettings ? (
              <CCardBody className="card-body border-top">
                <CForm
                  className={`row g-15 needs-validation ps-4 InputThemeColor${themes}`}
                >
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <CRow className="col-sm-12 ps-5">
                        <CFormLabel
                          htmlFor=""
                          className=" col-form-label fw-bolder fs-7 mb-2"
                        ></CFormLabel>
                        <div>
                          <div className="mb-2">
                            <Skeleton width="75%"></Skeleton>
                          </div>
                          <div className="mb-2">
                            <Skeleton width="75%"></Skeleton>
                          </div>
                          <div className="mb-2">
                            <Skeleton width="75%"></Skeleton>
                          </div>
                          <div className="mb-2">
                            <Skeleton width="75%"></Skeleton>
                          </div>
                          <div className="mb-2">
                            <Skeleton width="75%"></Skeleton>
                          </div>
                          <div className="mb-2">
                            <Skeleton width="75%"></Skeleton>
                          </div>
                          <div className="mb-2">
                            <Skeleton width="75%"></Skeleton>
                          </div>
                          <div className="mb-2">
                            <Skeleton width="75%"></Skeleton>
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


                          {/* Rest of the "Organize User Group Based On" section */}
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
                <Link to="/admin/autogroup" className="btn btn-primary">
                  Back
                </Link>
                <div style={{ marginRight: '10px' }}></div>
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
          </CCard>
        </CContainer>
      </CCol>
    </CRow>
  );
};
export default organizegroup;
