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
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "../../css/themes.css";
import "../../css/sidebar.css";
import { AppSidebarNav } from "../AppSidebarNav";
import "../../css/fontSize.css";
import getApiCall from "src/server/getApiCall";

const SuperAdminSidebar = ({ superAdminMenuList1 }) => {
  const token = "Bearer " + localStorage.getItem("ApiToken"),
    API_URL = process.env.REACT_APP_API_URL,
    dispatch = useDispatch(),
    [isSuperadminOpen, setIsSuperadminOpen] = useState(false),
    [menuList, setMenuList] = useState([]),
    unfoldable = useSelector((state) => state.sidebarUnfoldable),
    sidebarShow = useSelector((state) => state.sidebarShow),
    superAdminList =
      menuList &&
      menuList.filter(
        (e) => e.menuMasterRouteUrl.split("/")[1] === "superadmin"
      ),
    [logoImg, setLogoImg] = useState(localStorage.getItem("UserLogo")),
    [orgLogoText, setOrgLogoText] = useState(
      localStorage.getItem("orgLogoText")
    ),
    [themes, setThemes] = useState(),
    role = localStorage.getItem("RoleType");
  useEffect(() => {
    localStorage.setItem("logoText", orgLogoText);
  }, [orgLogoText]);

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

  //map superAdminMenuList to adminMenuList
  const superAdminMenuList = [
    {
      component: CNavTitle,
      // name: "S U P E R  A D M I N",
      className: "super-admin-menu-item text-white",
    },
    //start object array from index 1
    ...superAdminMenuList1?.map((e) => {
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
                to: `/superadmin/` + i.routeUrl,
              };
            }),
            CNavItem,
          };
        } else {
          return {
            component: CNavItem,
            name: e.displayName,
            to: `/superadmin/` + e.menuMasterRouteUrl,
            icon: (
              <img
                src={`/media/icon/${e.fontIconName}`}
                style={{ paddingLeft: " 0.6rem", objectFit: "contain" }}
                className={`nav-icon sideBarIcons${themes}`}
              />
            ),
          };
        }
        CNavItem;
      }
    }),
  ];
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
      {/* <div> */}
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
          {superAdminMenuList1.length > 0 && (
            <AppSidebarNav items={superAdminMenuList} />
          )}
        </SimpleBar>
      </CSidebarNav>
    </CSidebar>
  );
};

export default SuperAdminSidebar;
