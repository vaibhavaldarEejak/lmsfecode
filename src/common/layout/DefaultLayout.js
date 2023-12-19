import React, { useState, useEffect } from "react";
import {
  AppContent,
  AppSidebar,
  AppFooter,
  AppHeader,
} from "../../components/index";
import { useNavigate } from "react-router-dom";
import getApiCall from "src/server/getApiCall";

const DefaultLayout = () => {
  const navigate = useNavigate();

  const userRole = localStorage.getItem("RoleType");

  const [role, setRole] = useState(
    localStorage.getItem("RoleType") || userRole
  );

  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role]);

  const handleChangeRole = (newRole) => {
    setRole(newRole);
  };
  const [notificationList, setNotificationList] = useState(null);
  const [notificationListCount, setNotificationListCount] = useState(null);
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const API_URL = process.env.REACT_APP_API_URL;

  const notificationDropdown = async () => {
    try {
      const response = await getApiCall("getDisplayNotificationList");
      setNotificationListCount(response.length);
      setNotificationList(response);
    } catch (err) {}
  };
  const adminNotificationDropdown = async () => {
    try {
      const response = await getApiCall("getOrganizationNotificationList");
      setNotificationListCount(response.length);
      setNotificationList(response);
    } catch (err) {}
  };
  const windLocation = window.location.href;
  const newLocation = windLocation.split("/");
  const arrayLength = newLocation.length - 1;
  const endPoint = windLocation.split("/")[arrayLength];

  useEffect(() => {
    const url = "/" + window.location.href.split("/")[3];
    if (localStorage.getItem("ApiToken") === null) {
      navigate("/login");
    } else if (localStorage.getItem("ApiToken")) {
      roleLogin(url);
    }
    if (userRole === "role_super_admin") {
      if (endPoint !== "login") {
        if (token !== "Bearer null") {
          notificationDropdown();
        }
      }
    } else if (userRole === "role_system_admin") {
      if (endPoint !== "login") {
        if (token !== "Bearer null") {
          adminNotificationDropdown();
        }
      }
    }
  }, []);

  const roleLogin = (url) => {
    if (userRole === "role_system_admin" && url === "/superadmin") {
      navigate("/admin");
    } else if (userRole === "role_user_students" && url === "/superadmin") {
      navigate("/student/dashboard");
    } else if (userRole === "role_user_students" && url === "/admin") {
      navigate("/student/dashboard");
    }
  };
  const colorName = localStorage.getItem("ThemeColor");

  const [themes, setThemes] = useState(colorName);
  const [themes1, setThemes1] = useState();

  const getThemes = async () => {
    try {
      const response = await getApiCall("getThemeList");
      response.map((item, i) => {
        if (item.isDeafult != 0) {
          localStorage.setItem("ThemeColor", item.themeName);
          setThemes(item.themeName);
          setThemes1(item.themeName);
        }
      });
    } catch (err) {}
  };
  useEffect(() => {
    if (endPoint !== "login") {
      if (token !== "Bearer null") {
        getThemes();
      }
    }
  }, []);

  return (
    <div>
      <AppSidebar Theme={themes1} />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader
          onChangeRole={handleChangeRole}
          count={notificationListCount}
          notificationList={notificationList}
          Theme={themes}
        />
        <div className="body flex-grow-1">
          <AppContent handleNotification={notificationListCount} />
        </div>
        <AppFooter />
      </div>
    </div>
  );
};

export default DefaultLayout;
