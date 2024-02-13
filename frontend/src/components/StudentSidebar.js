import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CImage,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
} from "@coreui/react";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";
import { AppSidebarNav } from "./AppSidebarNav";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import "./../css/themes.css";
import "./../css/fontSize.css";
import "./../css/sidebar.css";
import getApiCall from "src/server/getApiCall";

const StudentSidebar = ({ onChangeRole, studentSideBarMenu }) => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const [logoImg, setLogoImg] = useState(localStorage.getItem("UserLogo"));
  const [orgLogoText, setOrgLogoText] = useState(
    localStorage.getItem("logoText")
  );
  const [themes, setThemes] = useState();
  const getThemes = async () => {
    try {
      const res = await getApiCall("getThemeList");
      res?.map((item, i) => {
        if (item.isDeafult != 0) {
          setThemes(item.themeName);
        }
      });
    } catch (err) {}
  };
  useEffect(() => {
    getThemes();
  }, []);
  const studentMenuList = [
    {
      component: CNavTitle,
      // name: "S T U D E N T",
      className: "student-menu-item text-white",
    },

    //start object array from index 1
    ...studentSideBarMenu?.map((e) => {
      return {
        component: CNavItem,
        name: e.displayName,
        icon: (
          <img
            src={`/media/icon/${e.fontIconName}`}
            style={{ paddingLeft: " 0.6rem", objectFit: "contain" }}
            className={`nav-icon sideBarIcons${themes}`}
          />
        ),
        to: `/student/` + e.menuMasterRouteUrl,
      };
    }),
  ];

  const [isSuperadminOpen, setIsSuperadminOpen] = useState(false);

  const [activeLink, setActiveLink] = useState(
    localStorage.getItem("activeLink") || "/superadmin/dashboard"
  );

  useEffect(() => {
    localStorage.setItem("activeLink", activeLink);
  }, [activeLink]);
  const handleRoleChange = (role, link) => {
    onChangeRole(role);
    setActiveLink(link);
    localStorage.setItem("role", role);
  };
  const oldUserRole = localStorage.getItem("RoleType");
  const role = localStorage.getItem("role");
  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onMouseEnter={() => setIsSuperadminOpen(true)}
      onMouseLeave={() => setIsSuperadminOpen(false)}
      onVisibleChange={(visible) => {
        dispatch({ type: "set", sidebarShow: visible });
      }}
    >
      {role === "role_super_admin" ? (
        <>
          <CSidebarBrand className="d-none d-md-flex">
            <CImage
              className="sidebar-brand-full rounded"
              style={{ objectFit: "cover", width: "80%", height: "80%" }}
              src={logoImg}
              alt={logoImg}
              height={35}
            />
            <CImage
              className="sidebar-brand-narrow rounded"
              src="/media/module/logo-1.png"
              height={35}
            />
          </CSidebarBrand>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              color: "white",
            }}
          >
            <p className="logo-text">{orgLogoText}</p>
          </div>
        </>
      ) : (
        <>
          <CSidebarBrand className="d-none d-md-flex">
            <CImage
              className="sidebar-brand-full rounded"
              style={{
                objectFit: "cover",
                width: "80%",
                height: "80%",
              }}
              src={logoImg}
              alt={logoImg}
              height={35}
            />
            <CImage
              className="sidebar-brand-narrow rounded"
              src={logoImg}
              height={35}
            />
          </CSidebarBrand>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              color: "white",
            }}
          >
            <p className="logo-text">{orgLogoText}</p>
          </div>
        </>
      )}

      <CSidebarNav>
        <SimpleBar>
          {studentSideBarMenu.length > 0 && (
            <AppSidebarNav items={studentMenuList} />
          )}
        </SimpleBar>
      </CSidebarNav>
    </CSidebar>
  );
};

export default StudentSidebar;
