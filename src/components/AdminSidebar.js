import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CImage, CSidebar, CSidebarBrand, CSidebarNav } from "@coreui/react";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";
import { AppSidebarNav } from "./AppSidebarNav";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./../css/themes.css";
import "./../css/fontSize.css";
import "./../css/sidebar.css";
import getApiCall from "src/server/getApiCall";
const AdminSidebar = ({ onChangeRole, adminListMenu }) => {
  const dispatch = useDispatch();
  const [isSuperadminOpen, setIsSuperadminOpen] = useState(false);
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
  //map adminList to adminMenuList

  const adminMenuList = [
    {
      component: CNavTitle,
      // name: "A D M I N",
      className: "admin-menu-item text-white",
    },
    //start object array from index 1
    ...adminListMenu?.map((e) => {
      if (e.menuId !== 0) {
        if (e.subMenus?.length > 0) {
          return {
            component: CNavGroup,
            name: e.displayName,
            icon: (
              <img
                src={`/media/icon/${e.fontIconName}`}
                style={{ paddingLeft: " 0.6rem", objectFit: "contain" }}
                className={`nav-icon sideBarIcons${themes}`}
              />
            ),
            items: e.subMenus.map((i) => {
              return {
                component: CNavItem,
                name: i.subMenuName,
                icon: (
                  <img
                    src={`/media/icon/${i.fontIconName}`}
                    style={{ paddingLeft: " 0.6rem", objectFit: "contain" }}
                    className={`nav-icon sideBarIcons${themes}`}
                  />
                ),
                to: `/admin/` + i.routeUrl,
              };
            }),
          };
        } else {
          return {
            component: CNavItem,
            name: e.displayName,
            to: `/admin/` + e.menuMasterRouteUrl,
            icon: (
              <img
                src={`/media/icon/${e.fontIconName}`}
                style={{ paddingLeft: " 0.6rem", objectFit: "contain" }}
                className={`nav-icon sideBarIcons${themes}`}
              />
            ),
          };
        }
      }
    }),
  ];

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
          {adminListMenu.length > 0 && <AppSidebarNav items={adminMenuList} />}
        </SimpleBar>
      </CSidebarNav>
    </CSidebar>
  );
};

export default AdminSidebar;
