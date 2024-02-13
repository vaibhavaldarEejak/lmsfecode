import AdminSidebar from "./AdminSidebar";
import StudentSidebar from "./StudentSidebar";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CSidebar, CSidebarBrand, CSidebarNav } from "@coreui/react";
import axios from "axios";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import "./../css/themes.css";
import SuperAdminSidebar from "./header/SuperAdminSidebar";
import getApiCall from "src/server/getApiCall";

const AppSidebar = ({ Theme }) => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const API_URL = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const [menuList, setMenuList] = useState([]);
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const studentList =
    menuList && menuList.filter((e) => e.menuRole.student === 1);
  const adminList = menuList && menuList.filter((e) => e.menuRole.admin === 1);
  const superAdminList =
    menuList && menuList.filter((e) => e.menuRole.superAdmin === 1);

  const getMenus = async () => {
    try {
      const res = await getApiCall("getMenuSubmenuList");
      setMenuList(res);
    } catch (err) {}
  };

  useEffect(() => {
    if (token !== "Bearer null") {
      getMenus();
    }
  }, []);

  const colorName = localStorage.getItem("ThemeColor");

  const [themes, setThemes] = useState(Theme || colorName);
  const [role1, setRole1] = useState(localStorage.getItem("RoleType"));
  const handleChangeRole = (newRole) => {
    setRole1(newRole);
    localStorage.setItem("role", newRole);
  };
  const userRole = localStorage.getItem("role");
  const windLocation = window.location.href;
  const newLocation = windLocation.split("/");
  const [admin, setAdmin] = useState(newLocation.includes("admin"));
  const [student, setStudent] = useState(newLocation.includes("student"));
  const [superadmin, setSuperAdmin] = useState(
    newLocation.includes("superadmin")
  );

  useEffect(() => {
    setAdmin(newLocation.includes("admin"));
    setStudent(newLocation.includes("student"));
    setSuperAdmin(newLocation.includes("superadmin"));
  }, [windLocation]);

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: "set", sidebarShow: visible });
      }}
      className={`themeSideBarColor${Theme || themes}`}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/"></CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          {(userRole === "role_super_admin" || superadmin === true) && (
            <>
              <SuperAdminSidebar
                onChangeRole={handleChangeRole}
                superAdminMenuList1={superAdminList}
              />
              {/* <AdminSidebar
              onChangeRole={handleChangeRole}
              adminListMenu={adminList}
              />
              <StudentSidebar
              onChangeRole={handleChangeRole}
              studentSideBarMenu={studentList}
              /> */}
            </>
          )}
          {(userRole === "role_system_admin" ||
            userRole === "role_sub_admin" ||
            userRole === "role_team_supervisor" ||
            userRole === "role_training_instructors" ||
            userRole === "role_hr_managers" ||
            admin === true) && (
            <>
              <AdminSidebar
                onChangeRole={handleChangeRole}
                adminListMenu={adminList}
              />
              {/* <StudentSidebar
             onChangeRole={handleChangeRole}
             studentSideBarMenu={studentList}
             /> */}
            </>
          )}
          {(userRole === "role_user_students" || student === true) && (
            <StudentSidebar
              onChangeRole={handleChangeRole}
              studentSideBarMenu={studentList}
            />
          )}
        </SimpleBar>
      </CSidebarNav>
    </CSidebar>
  );
};

export default AppSidebar;
