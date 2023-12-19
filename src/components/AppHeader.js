import React, { useState, useEffect, activeLink } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CDropdownMenu,
  CDropdown,
  CDropdownToggle,
  CDropdownItem,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from "@coreui/icons";
import { AppBreadcrumb } from "./index";
import { AppHeaderDropdown } from "./header/index";
import { logo } from "src/assets/brand/logo";
import { Link } from "react-router-dom";
import "../css/themes.css";
import getApiCall from "src/server/getApiCall";

const AppHeader = ({ onChangeRole, count, notificationList, Theme }) => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const [orgList, setOrgList] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [visible, setvisible] = useState(false);

  const OrgDropdown = async () => {
    try {
      const res = await getApiCall("parentChildOrgList", id);
      setOrgList(res);
    } catch (err) {}
  };

  const [activeLink, setActiveLink] = useState(
    localStorage.getItem("activeLink") || "/student/dashboard"
  );
  useEffect(() => {
    localStorage.setItem("activeLink", activeLink);
  }, [activeLink]);

  const handleRoleChange = (role, link) => {
    onChangeRole(role);
    setActiveLink(link);
    localStorage.setItem("role", role);
  };
  const colorName = localStorage.getItem("ThemeColor");

  const [themes, setThemes] = useState(Theme || colorName);

  const windLocation = window.location.href;
  const newLocation = windLocation.split("/");
  const arrayLength = newLocation.length - 1;
  const endPoint = windLocation.split("/")[arrayLength];
  useEffect(() => {
    if (endPoint !== "login") {
      if (token !== "Bearer null") {
        const fetchData = async () => {
          await Promise.all([OrgDropdown()]);
        };
        fetchData();
      }
    }
  }, []);
  const userRole = localStorage.getItem("role");
  const oldUserRole = localStorage.getItem("RoleType");

  return (
    <CHeader position="sticky">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: "set", sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CIcon icon={logo} height={48} alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          {oldUserRole === "role_super_admin" && (
            <Link to={`/superadmin/dashboard`}>
              <CNavItem
                href={`/superadmin/dashboard`}
                onClick={() =>
                  handleRoleChange("role_super_admin", "/superadmin/dashboard")
                }
                className={"nav nav-pills me-1"}
              >
                <span className="nav-item">
                  <button
                    icon="pi pi-user"
                    className={`${
                      userRole === "role_super_admin" &&
                      endPoint === "dashboard"
                        ? `btn btn-primary active  HeaderTheme${
                            Theme || themes
                          }`
                        : "btn btn-light"
                    } `}
                    style={{ fontSize: "12px" }}
                  >
                    {/* <img
                      src="/media/icon/user2.svg"
                      width="28"
                      height="28"
                    ></img> */}
                    Super Admin
                  </button>
                </span>
              </CNavItem>
            </Link>
          )}
          {(oldUserRole === "role_super_admin" ||
            oldUserRole === "role_system_admin" ||
            oldUserRole === "role_sub_admin" ||
            oldUserRole === "role_training_instructors" ||
            oldUserRole === "role_hr_managers" ||
            oldUserRole === "role_team_supervisor" ||
            userRole === "role_team_supervisor" ||
            userRole === "role_system_admin" ||
            userRole === "role_sub_admin") && (
            <>
              <Link to={`/admin/admindashboard`}>
                <CNavItem
                  href={`/admin/admindashboard`}
                  onClick={() =>
                    handleRoleChange(
                      "role_system_admin",
                      "/admin/admindashboard"
                    )
                  }
                  className={"nav nav-pills me-1"}
                  style={{
                    display:
                      oldUserRole === "role_super_admin" ||
                      oldUserRole === "role_system_admin" ||
                      oldUserRole === "role_sub_admin" ||
                      oldUserRole === "role_training_instructors" ||
                      oldUserRole === "role_hr_managers" ||
                      oldUserRole === "role_team_supervisor" ||
                      userRole === "role_sub_admin" ||
                      userRole === "role_training_instructors" ||
                      userRole === "role_hr_managers" ||
                      userRole === "role_team_supervisor" ||
                      userRole === "role_system_admin"
                        ? "block"
                        : "none",
                  }}
                >
                  <span className="nav-item">
                    <button
                      className={`${
                        userRole === "role_system_admin" ||
                        userRole === "role_sub_admin" ||
                        userRole === "role_training_instructors" ||
                        userRole === "role_hr_managers" ||
                        userRole === "role_team_supervisor"
                          ? `btn btn-primary active  HeaderTheme${
                              Theme || themes
                            }`
                          : "btn btn-light"
                      } `}
                      style={{ fontSize: "12px" }}
                    >
                      Admin
                    </button>
                  </span>
                </CNavItem>
              </Link>
            </>
          )}
          {(oldUserRole === "role_super_admin" ||
            oldUserRole === "role_system_admin" ||
            userRole === "role_system_admin" ||
            oldUserRole === "role_sub_admin" ||
            userRole === "role_sub_admin" ||
            userRole === "role_training_instructors" ||
            userRole === "role_hr_managers" ||
            userRole === "role_team_supervisor" ||
            userRole === "role_user_students") && (
            <>
              <Link to={`/student/studentdashboard`}>
                <CNavItem
                  href={`/student/studentdashboard`}
                  className={"nav nav-pills"}
                  onClick={() =>
                    handleRoleChange(
                      "role_user_students",
                      "/student/studentdashboard"
                    )
                  }
                  style={{
                    display:
                      oldUserRole === "role_super_admin" ||
                      oldUserRole === "role_system_admin" ||
                      userRole === "role_system_admin" ||
                      oldUserRole === "role_sub_admin" ||
                      userRole === "role_sub_admin" ||
                      userRole === "role_training_instructors" ||
                      userRole === "role_hr_managers" ||
                      userRole === "role_team_supervisor" ||
                      userRole === "role_user_students"
                        ? "block"
                        : "none",
                  }}
                >
                  <span className="nav-item">
                    <button
                      className={
                        userRole === "role_user_students"
                          ? `btn btn-primary active ;
                          HeaderTheme${Theme || themes}`
                          : "btn btn-light"
                      }
                      style={{ fontSize: "12px" }}
                    >
                      Student
                    </button>
                  </span>
                </CNavItem>
              </Link>
            </>
          )}
        </CHeaderNav>
        <CHeaderNav>
          <CDropdown>
            <CDropdownToggle color="white">
              <CIcon
                icon={cilBell}
                size="lg"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              <div
                style={{
                  background: "red",
                  borderRadius: "50%",
                  width: " 1.3rem ",
                  color: "#fff",
                  height: "1.3rem",
                  fontSize: " 0.7rem",
                  fontWeight: "700",
                  position: "absolute",
                  top: "-0.3rem",
                  left: " 1.4rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {count && count}
              </div>
            </CDropdownToggle>
            <CDropdownMenu>
              {notificationList &&
                notificationList?.map((e) => (
                  <CDropdownItem
                    style={{ paddingLeft: "0.9rem" }}
                    href={`/Notification/UserNotificationDisplay?${e?.notificationId}`}
                    className="dropdown-item-with-border"
                    title="Notification"
                    key={e?.notificationId}
                    onClick={() => {
                      {
                        setvisible(!visible);
                      }
                    }}
                  >
                    {e.subject}{" "}
                  </CDropdownItem>
                ))}
            </CDropdownMenu>
          </CDropdown>

          <CDropdown>
            <CDropdownToggle color="white">
              <CIcon
                icon={cilList}
                size="lg"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
            </CDropdownToggle>
            <CDropdownMenu>
              {orgList &&
                orgList.map((e) => (
                  <CDropdownItem key={e.organizationId}>
                    {e.organizationName}
                  </CDropdownItem>
                ))}
            </CDropdownMenu>
          </CDropdown>

          <CNavLink href="#">
            <CIcon icon={cilEnvelopeOpen} size="lg" />
          </CNavLink>
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;
