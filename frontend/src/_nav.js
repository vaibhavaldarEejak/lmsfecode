import React from "react";
import "./css/sidebar.css";
import { CImage, CNavGroup, CNavItem, CNavTitle } from "@coreui/react";

const MenuList = () => {};

const _nav = [
  {
    component: CNavTitle,
    name: "A D M I N",
    class: "bg-info rh text-dark ",
    // style:{innerWidth:'10rem'}
  },
  {
    component: CNavItem,
    name: "Dashboard",
    to: "/dashboard",
    icon: <CImage src="/media/icon/art002.svg " customClassName="nav-icon" />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // },
  },
  {
    component: CNavGroup,
    name: "Credit Management",
    icon: <CImage src="/media/icon/gen020.svg " customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Team Credit",
        icon: (
          <CImage src="/media/icon/com005.svg " customClassName="nav-icon" />
        ),
        to: "/CreditManagement/TeamCredit/TeamCreditList",
      },
      {
        component: CNavItem,
        name: "Team Approval",
        icon: (
          <CImage src="/media/icon/com014.svg " customClassName="nav-icon" />
        ),
        to: "/Admin/CreditManagement/TeamApproval/TeamApproval",
      },
    ],
  },

  {
    component: CNavGroup,
    name: "System Management",
    icon: <CImage src="/media/icon/cod001.svg " customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Category",
        icon: (
          <CImage src="/media/icon/com005.svg " customClassName="nav-icon" />
        ),
        to: "/Admin/systemManagement/category",
      },
      // {
      //   component: CNavItem,
      //   name: "My Team",
      //   to: "/creditManagement/myTeamCreditReport",
      // },
      {
        component: CNavItem,
        name: "Notification",
        icon: (
          <CImage src="/media/icon/com010.svg " customClassName="nav-icon" />
        ),
        to: "/Admin/systemManagement/notifications",
      },
    ],
  },

  {
    component: CNavGroup,
    name: "Training Management",
    icon: <CImage src="/media/icon/gen026.svg " customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Course Catalog",
        icon: (
          <CImage src="/media/icon/com014.svg " customClassName="nav-icon" />
        ),
        to: "/trainingManagement/courseCatalog",
      },
      {
        component: CNavItem,
        name: "Credentials",
        icon: (
          <CImage src="/media/icon/com014.svg " customClassName="nav-icon" />
        ),
        to: "/UserManagement/Instructor/Instructor",
      },
      {
        component: CNavItem,
        name: "Learning Plan",
        icon: (
          <CImage src="/media/icon/com014.svg " customClassName="nav-icon" />
        ),
        to: "/UserManagement/SubAdmin/Subadmin",
      },
      {
        component: CNavItem,
        name: "Training Library",
        icon: (
          <CImage src="/media/icon/com005.svg " customClassName="nav-icon" />
        ),
        to: "/Admin/trainingManagement/TrainingLibrary",
      },
    ],
  },

  {
    component: CNavGroup,
    name: "User Management",
    icon: <CImage src="/media/icon/gen019.svg " customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "User List",
        icon: (
          <CImage src="/media/icon/com005.svg " customClassName="nav-icon" />
        ),
        to: "/Admin/UserManagement/User/UserList",
      },
      {
        component: CNavItem,
        name: "Group List",
        icon: (
          <CImage src="/media/icon/com014.svg " customClassName="nav-icon" />
        ),
        to: "/Admin/UserManagement/Group/GroupList",
      },
      {
        component: CNavItem,
        name: "Subadmin",
        icon: (
          <CImage src="/media/icon/com006.svg " customClassName="nav-icon" />
        ),
        to: "/Admin/UserManagement/SubAdmin/Subadmin",
      },
      {
        component: CNavItem,
        name: "Intructor/Trainer List",
        icon: (
          <CImage src="/media/icon/com004.svg " customClassName="nav-icon" />
        ),
        to: "/Admin/UserManagement/Instructor/Instructor",
      },
    ],
  },

  {
    component: CNavTitle,
    name: "S T U D E N T",
    class: "bg-info rh text-dark",
  },
  {
    component: CNavItem,
    name: "Dashboard",
    icon: <CImage src="/media/icon/art002.svg " customClassName="nav-icon" />,
    to: "/dashboard",
  },
  {
    component: CNavItem,
    name: "Requirements",
    icon: <CImage src="/media/icon/fil024.svg " customClassName="nav-icon" />,
    to: "/Requirements",
  },
  {
    component: CNavItem,
    name: "Enrollments",
    icon: <CImage src="/media/icon/cod002.svg " customClassName="nav-icon" />,
    to: "/Enrollments",
  },
  {
    component: CNavItem,
    name: "Catalog",
    icon: <CImage src="/media/icon/com005.svg " customClassName="nav-icon" />,
    to: "/Catalog",
  },
  {
    component: CNavItem,
    name: "Documents",
    icon: <CImage src="/media/icon/fil001.svg " customClassName="nav-icon" />,
    to: "/Documents",
  },
  {
    component: CNavItem,
    name: "Transcripts",
    icon: <CImage src="/media/icon/gen025.svg " customClassName="nav-icon" />,
    to: "/Transcripts",
  },

  {
    component: CNavTitle,
    name: "S U P E R  A D M I N",
    class: "bg-info rh text-dark",
  },

  {
    component: CNavItem,
    name: "Dashboard",
    icon: <CImage src="/media/icon/art002.svg " customClassName="nav-icon" />,
    to: "/dashboard",
  },
  {
    component: CNavItem,
    name: "Organization",
    icon: <CImage src="/media/icon/com001.svg " customClassName="nav-icon" />,
    to: "/SuperAdmin/manageActiveOrganization",
  },
  {
    component: CNavItem,
    name: "Roles",
    icon: <CImage src="/media/icon/com009.svg " customClassName="nav-icon" />,
    to: "/SuperAdmin/manageRoles",
  },
  {
    component: CNavItem,
    name: "Module",
    icon: <CImage src="/media/icon/fin001.svg " customClassName="nav-icon" />,
    to: "/SuperAdmin/manageModule",
  },
  {
    component: CNavItem,
    name: "Action Permission",
    icon: <CImage src="/media/icon/com012.svg " customClassName="nav-icon" />,
    to: "/SuperAdmin/manageActionPermissionWidget",
  },
  {
    component: CNavItem,
    name: "Menu",
    icon: <CImage src="/media/icon/com004.svg " customClassName="nav-icon" />,
    to: "/SuperAdmin/menuListing",
  },
  {
    component: CNavItem,
    name: "Menu Permissions",
    icon: <CImage src="/media/icon/com006.svg " customClassName="nav-icon" />,
    to: "/SuperAdmin/manageMenuPermissionListingWidget",
  },
  {
    component: CNavItem,
    name: "Theme",
    icon: <CImage src="/media/icon/com007.svg " customClassName="nav-icon" />,
    to: "/SuperAdmin/theme",
  },
  {
    component: CNavItem,
    name: "Notifications",
    icon: <CImage src="/media/icon/com010.svg " customClassName="nav-icon" />,
    to: "/SuperAdmin/manageNotifications",
  },
  {
    component: CNavItem,
    name: "Generic Category",
    icon: <CImage src="/media/icon/com008.svg " customClassName="nav-icon" />,
    to: "/SuperAdmin/manageCategory",
  },
  {
    component: CNavItem,
    name: "Generic Groups",
    icon: <CImage src="/media/icon/com009.svg " customClassName="nav-icon" />,
    to: "/SuperAdmin/manageGroups",
  },
  {
    component: CNavItem,
    name: "Media Library",
    icon: <CImage src="/media/icon/elc001.svg " customClassName="nav-icon" />,
    to: "/SuperAdmin/manageMediaLibrary",
  },
  {
    component: CNavItem,
    name: "Course Library",
    icon: <CImage src="/media/icon/art005.svg " customClassName="nav-icon" />,
    to: "/SuperAdmin/manageCourseLibrary",
  },

  {
    component: CNavItem,
    name: "Certificate",
    icon: <CImage src="/media/icon/fil012.svg " customClassName="nav-icon" />,
    to: "/SuperAdmin/manageCertificate",
  },
];

export { _nav, MenuList };
