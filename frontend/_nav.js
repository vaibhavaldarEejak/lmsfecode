import React from "react";
import CIcon from "@coreui/icons-react";
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from "@coreui/icons";
import { CNavGroup, CNavItem, CNavTitle } from "@coreui/react";

const _nav = [
  {
    component: CNavTitle,
    name: "Admin",
  },
  {
    component: CNavItem,
    name: "Admin Dashboard",
    to: "/dashboard",
    // icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // },
  },
  {
    component: CNavGroup,
    name: "Credit Management",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Team Approvals",
        to: "/notifications/alerts",
      },
      {
        component: CNavItem,
        name: "Team Credit",
        to: "/CreditManagement/TeamCredit/teamCreditList",
      },
    ],
  },

  {
    component: CNavGroup,
    name: "System Management",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Category",
        to: "/SystemManagement/Category/CategoryList",
      },
      {
        component: CNavItem,
        name: "Notifications",
        to: "/SystemManagement/Notifications/Notifications",
      },
    ],
  },

  {
    component: CNavGroup,
    name: "Training Management",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "Course Catalog",
        to: "/TrainingManagement/CourseCatalog/CourseCatalog",
      },
      {
        component: CNavItem,
        name: "Credentials",
        to: "/TrainingManagement/Credentials/Credentials",
      },
      {
        component: CNavItem,
        name: "Learning Plan",
        to: "/TrainingManagement/LearningPlan/LearningPlan",
      },
      {
        component: CNavItem,
        name: "Training Library",
        to: "/TrainingManagement/TrainingLibrary/TrainingLibrary",
      },
    ],
  },

  {
    component: CNavGroup,
    name: "User Management",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: "User List",
        to: "/UserManagement/User/UserList",
      },
      {
        component: CNavItem,
        name: "Group List",
        to: "/UserManagement/Group/GroupList",
      },
      {
        component: CNavItem,
        name: "Subadmin",
        to: "/UserManagement/SubAdmin/Subadmin",
      },
      {
        component: CNavItem,
        name: "Intructor/Trainer List",
        to: "/UserManagement/Instructor/Instructor",
      },
    ],
  },

  {
    component: CNavTitle,
    name: "Student",
  },
  {
    component: CNavItem,
    name: "Dashboard",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    to: "/Student/Dashboard/dashbard",
  },
  {
    component: CNavItem,
    name: "Requirements",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    to: "/Student/Requirements/requirements",
  },
  {
    component: CNavItem,
    name: "Enrollments",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    to: "/Student/Enrollments/enrollments",
  },
  {
    component: CNavItem,
    name: "Catalog",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    to: "/Student/Catalog/catalog",
  },
  {
    component: CNavItem,
    name: "Documents",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    to: "/Student/Documents/documents",
  },
  {
    component: CNavItem,
    name: "Transcripts",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    to: "/Student/Transcripts/transcripts",
  },

  {
    component: CNavTitle,
    name: "SuperAdmin",
  },

  {
    component: CNavItem,
    name: "Organization",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    to: "/SuperAdmin/Organization/organization",
  },
  {
    component: CNavItem,
    name: "Roles",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    to: "/SuperAdmin/Roles/roles",
  },
  {
    component: CNavItem,
    name: "Module",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    to: "/SuperAdmin/Module/manageModule",
  },
  {
    component: CNavItem,
    name: "Action Permission",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    to: "/SuperAdmin/ActionPermission/actionPermission",
  },
  {
    component: CNavItem,
    name: "Menu",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    to: "/SuperAdmin/Menu/menu",
  },
  {
    component: CNavItem,
    name: "Menu Permissions",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    to: "/SuperAdmin/MenuPermissions/menuPermissions",
  },
  {
    component: CNavItem,
    name: "Theme",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    to: "/SuperAdmin/Theme/theme",
  },
  {
    component: CNavItem,
    name: "Notifications",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    to: "/SuperAdmin/Notifications/notifications",
  },
  {
    component: CNavItem,
    name: "Generic Category",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    to: "/SuperAdmin/GenericCategory/genericCategory",
  },
  {
    component: CNavItem,
    name: "Generic Groups",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    to: "/SuperAdmin/GenericGroups/genericGroups",
  },
  {
    component: CNavItem,
    name: "Media Library",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    to: "/SuperAdmin/MediaLibrary/mediaLibrary",
  },
  {
    component: CNavItem,
    name: "Course Library",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    to: "/SuperAdmin/CourseLibrary/courseLibrary",
  },

  {
    component: CNavItem,
    name: "Certificate",
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    to: "/SuperAdmin/Certificate/certificate",
  },
];

export default _nav;
