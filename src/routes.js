import React from "react";
import Inactiveuser from "./admin/User/Inactiveuser";
import RoleManagement from "./admin/RoleManagement/RoleManagement";
import EditRoleManagement from "./admin/RoleManagement/EditRoleManagement";
// import ScormPlayer from "./student/Requirements/ScormPlayer";
import ScormPlayer from "./student/Enrollments/Player/ScormPlayer";
import CustomFields from "./admin/CustomFields/CustomFields";
import AddCustomFields from "./admin/CustomFields/AddCustomFields";
import ViewCustomFields from "./admin/CustomFields/ViewCustomFields";
import editCustomField from "./admin/CustomFields/editCustomField";

const StudentDashboard = React.lazy(() =>
  import("./student/Dashboard/StudentDashboard")
);

const TrainingLibraryInternal = React.lazy(() =>
  import("./admin/TrainingLibrary/TrainingLibraryInternal")
);

const TrainingLibraryExternal = React.lazy(() =>
  import("./admin/TrainingLibrary/TrainingLibraryExternal")
);

const AddEditClasses = React.lazy(() =>
  import("./admin/Classes/AddEditClasses")
);
const EditClass = React.lazy(() => import("./admin//Classes/EditClass"));
const Elearning = React.lazy(() => import("./admin/Elearning/Elearning"));

const Classroom = React.lazy(() => import("./admin/Classroom/Classroom"));

const Assessment = React.lazy(() => import("./admin/Assessment/Assessment"));
const Addassignment = React.lazy(() =>
  import("./admin/Assignments/Addassignment")
);
const UpdateAssignment = React.lazy(() =>
  import("./admin/Assignments/Updateassignments")
);
const SuperAdmin = React.lazy(() =>
  import("./superadmin/SuperAdmin/SuperAdmin")
);

const CompanySettings = React.lazy(() =>
  import("./admin/CompanySettings/CompanySettings")
);

const ActiveInActiveRoles = React.lazy(() =>
  import("./superadmin/Roles/ActiveInActiveRoles")
);

const GeneralSettings = React.lazy(() =>
  import("./admin/CompanySettings/GeneralSettings")
);

const TrainingMediaLibrary = React.lazy(() =>
  import("./admin/TrainingMediaLibrary/TrainingMediaLibraryList")
);

const AddEditTrainingMediaLibrary = React.lazy(() =>
  import("./admin/TrainingMediaLibrary/AddEditTrainingMediaLibrary")
);

const ViewTrainingMediaLibrary = React.lazy(() =>
  import("./admin/TrainingMediaLibrary/ViewTrainingMediaLibrary")
);

const SuperAdminDashboard = React.lazy(() =>
  import("./superadmin/Dashboard/SuperadminDashboard")
);
const OrganizationList = React.lazy(() =>
  import("./superadmin/Organization/ManageOrganizationActiveListing")
);
const AddEditOrganization = React.lazy(() =>
  import("./superadmin/Organization/AddEditOrganization")
);
const InactiveOrganization = React.lazy(() =>
  import("./superadmin/Organization/ManageOrganizationInactiveListing")
);
const RolesList = React.lazy(() =>
  import("./superadmin/Roles/ManageRolesListingWidget")
);
const EditRoles = React.lazy(() => import("./superadmin/Roles/AddEditRoles"));
const ViewRoles = React.lazy(() => import("./superadmin/Roles/ViewRolesPage"));
const ModuleList = React.lazy(() =>
  import("./superadmin/Module/ManageModuleListingWidget")
);
const AddUpdateViewModule = React.lazy(() =>
  import("./superadmin/Module/AddEditModule")
);
const ViewMediaLibrary = React.lazy(() =>
  import("./superadmin/MediaLibrary/ViewMediaLibraryList")
);
const AddEditViewActions = React.lazy(() =>
  import("./superadmin/Module/AddEditModule")
);
const ModuleActionList = React.lazy(() =>
  import("./superadmin/Module/ManageModuleListingWidget")
);
const ActionPermission = React.lazy(() =>
  import("./superadmin/Action/ManageActionPermissionWidget")
);
const AddUpdateViewMenu = React.lazy(() => import("./superadmin/Menu/AddMenu"));
const MenuList = React.lazy(() => import("./superadmin/Menu/MenuListing"));
const ViewMenu = React.lazy(() => import("./superadmin/Menu/ViewMenu"));
const MenuPermissionList = React.lazy(() =>
  import("./superadmin/MenuPermission/ManageMenuPermissionListingWidget")
);
const ThemeList = React.lazy(() => import("./superadmin/Theme/Colors"));
const Documentlibrary = React.lazy(() =>
  import("./superadmin/DocumentLibrary/documentlibrary")
);
const Documentlibraryadmin = React.lazy(() =>
  import("./admin/DocumentLibrary/documentlibrarylist")
);

const ManageDocumentOrder = React.lazy(() =>
  import("./superadmin/DocumentLibrary/managedocumentorder")
);

const ViewDocumentlibraryadmin = React.lazy(() =>
  import("./admin/DocumentLibrary/viewdocumentlibrary")
);

const ViewDocumentlibrarystudent = React.lazy(() =>
  import("./student/Documents/Viewdocument")
);
const Adddocument = React.lazy(() =>
  import("./superadmin/DocumentLibrary/adddocument")
);
const Updatedocument = React.lazy(() =>
  import("./superadmin/DocumentLibrary/updatedocument")
);

const GenericNotificationList = React.lazy(() =>
  import("./superadmin/Notifications/ManageNotificationsListingWidget")
);
const AssignNotification = React.lazy(() =>
  import("./superadmin/Notifications/AssignNotifications")
);
const GenericAddUpdateViewNotification = React.lazy(() =>
  import("./superadmin/Notifications/AddEditNotifications")
);

const GenericViewNotification = React.lazy(() =>
  import("./superadmin/Notifications/ViewNotifications")
);

const CompanyNotification = React.lazy(() =>
  import("./superadmin/Notifications/CompanyNotification")
);
const GenericCategoryList = React.lazy(() =>
  import("./superadmin/GenericCategory/GenericCategoryListing")
);
const AddUpdateViewGenericCategory = React.lazy(() =>
  import("./superadmin/GenericCategory/AddEditCategory")
);

const ViewGenericCategory = React.lazy(() =>
  import("./superadmin/GenericCategory/ViewGenericCategory")
);

const ViewOrganizationCategory = React.lazy(() =>
  import("./superadmin/GenericCategory/ViewOrganizationcategory")
);

const AddUpdateOrganizationCategory = React.lazy(() =>
  import("./superadmin/GenericCategory/AddOrganizationCategory")
);
const GenericGroupList = React.lazy(() =>
  import("./superadmin/GenericGroups/ManageGroupListingWidgets")
);
const AddUpdateViewGenericGroup = React.lazy(() =>
  import("./superadmin/GenericGroups/AddNewGroup")
);
const ViewGenericGroup = React.lazy(() =>
  import("./superadmin/GenericGroups/ViewGenericGroup")
);

const ImportGenericGroup = React.lazy(() =>
  import("./superadmin/GenericGroups/ImportOrgGroup")
);

const MediaLibraryList = React.lazy(() =>
  import("./superadmin/MediaLibrary/ManageMediaLibraryListingWidget")
);
const AddUpdateMediaLibrary = React.lazy(() =>
  import("./superadmin/MediaLibrary/AddEditMediaLibrary")
);
const CourseLibraryList = React.lazy(() =>
  import("./superadmin/CourseLibrary/ManageCourseLibraryListingWidget")
);
const AddUpdateViewElearningCourseLibrary = React.lazy(() =>
  import("./superadmin/CourseLibrary/AddElearningLibraryPage")
);
const AddUpdateViewClassroomCourseLibrary = React.lazy(() =>
  import("./superadmin/CourseLibrary/AddClassRoomLibraryPage")
);
const AddUpdateViewAssessmentCourseLibrary = React.lazy(() =>
  import("./superadmin/CourseLibrary/AddAssessmentLibraryPage")
);
const ViewCourseLibrary = React.lazy(() =>
  import("./superadmin/CourseLibrary/ManageCourseLibraryViewPage")
);
const CertificateList = React.lazy(() =>
  import("./superadmin/Certificate/ManageCertificateListingWidget")
);
const AddUpdateViewCertificate = React.lazy(() =>
  import("./superadmin/Certificate/AddEditCertificate")
);

const ViewCertificate = React.lazy(() =>
  import("./superadmin/Certificate/ManageCertificateViewPage")
);

const AssignCertificate = React.lazy(() =>
  import("./superadmin/Certificate/AssignedCertificate")
);

const CredentialList = React.lazy(() =>
  import("./superadmin/Credentials/CredentialList")
);

const AddSACredentials = React.lazy(() =>
  import("./superadmin/Credentials/AddCredentials")
);

const UpdateCredentials = React.lazy(() =>
  import("./superadmin/Credentials/UpdateCredentials")
);

const ViewSACredentials = React.lazy(() =>
  import("./superadmin/Credentials/ViewCredentials")
);

const ArchivedCredentialList = React.lazy(() =>
  import("./superadmin/Credentials/ArchievedList")
);

const DeletedCredentialList = React.lazy(() =>
  import("./superadmin/Credentials/DeletedList")
);

const AdminDashboard = React.lazy(() =>
  import("./admin/Dashboard/AdminDashboard")
);
const UserManagement = React.lazy(() =>
  import("./admin/UserManagement/UserManagement")
);
const TrainingManagement = React.lazy(() =>
  import("./admin/TrainingManagement/TrainingManagement")
);
const SystemManagement = React.lazy(() =>
  import("./admin/SystemManagement/SystemManagement")
);
const CreditManagement = React.lazy(() =>
  import("./admin/CreditManagement/CreditManagement")
);

const UserList = React.lazy(() => import("./admin/User/UserList"));
const ArchivedUserList = React.lazy(() => import("./admin/User/Archiveduser"));
const DeletedUserList = React.lazy(() => import("./admin/User/Deleteduser"));
const OrganizeGroup = React.lazy(() => import("./admin/Group/Organizegroup"));
const AddUpdateViewUser = React.lazy(() => import("./admin/User/AddUser"));
const Autogroups = React.lazy(() => import("./admin/Group/Autogroups"));
const Manualgroups = React.lazy(() => import("./admin/Group/Manualgroups"));

const Organizegroup = React.lazy(() => import("./admin/Group/Organizegroup"));
const UpdateUser = React.lazy(() => import("./admin/User/Updateuser"));

const ViewUser = React.lazy(() => import("./admin/User/ViewUser"));
const ImportUsers = React.lazy(() => import("./admin/User/Importuser"));

const ImportGroups = React.lazy(() => import("./admin/Group/ImportGroup"));
const ExportUsers = React.lazy(() => import("./admin/User/UserList"));

const SubAdminList = React.lazy(() => import("./admin/SubAdmin/Subadmin"));
const SubAdminViewList = React.lazy(() =>
  import("./admin/SubAdmin/SubadminViewList")
);
const AddRemoveGroup = React.lazy(() => import("./admin/Group/AddGroup"));

// const ViewGroup = React.lazy(() => import("./admin/Group/Viewgroup"));
const GroupList = React.lazy(() => import("./admin/Group/Grouplist"));
const AddUserAsSubadmin = React.lazy(() => import("./admin/SubAdmin/Subadmin"));
const InstructorTraininerList = React.lazy(() =>
  import("./admin/Instructor/Instructor")
);
const InstructorTraininerViewList = React.lazy(() =>
  import("./admin/Instructor/ViewInstructor")
);
const TeamCreditList = React.lazy(() =>
  import("./admin/TeamCredit/TeamCreditList")
);
const ExportTeamCredit = React.lazy(() =>
  import("./admin/TeamCredit/TeamCreditList")
);
const GiveCredit = React.lazy(() =>
  import("./admin/TeamCredit/TeamCreditList")
);
const TeamApprovalReportList = React.lazy(() =>
  import("./admin/TeamApproval/TeamApproval")
);
const TrainingLibraryList = React.lazy(() =>
  import("./admin/TrainingLibrary/TrainingLibrary")
);
const ImportCourseToLibrary = React.lazy(() =>
  import("./superadmin/CourseLibrary/ManageCourseLibraryListingWidget")
);
const ExportCourseLibrary = React.lazy(() =>
  import("./superadmin/CourseLibrary/ManageCourseLibraryListingWidget")
);
const AddUpdateViewTrainingLibrary = React.lazy(() =>
  import("./admin/TrainingLibrary/TrainingLibrary")
);
const CourseCatalogList = React.lazy(() =>
  import("./admin/CourseCatalog/CourseCatalog")
);
const AddUpdateViewElearningCourseCatalog = React.lazy(() =>
  import("./admin/CourseCatalog/AddElearningCourseCatalog")
);
const AddUpdateViewClassroomCourseCatalog = React.lazy(() =>
  import("./admin/CourseCatalog/AddClassroomCourseCatalog")
);
const AddUpdateViewAssessmentCourseCatalog = React.lazy(() =>
  import("./admin/CourseCatalog/AddAssessmentCourseCatalog")
);
const ViewCourseCatalog = React.lazy(() =>
  import("./admin/CourseCatalog/ViewPage")
);

const Credentials = React.lazy(() => import("./admin/Credentials/Credentials"));

const AddCredentials = React.lazy(() =>
  import("./admin/Credentials/AddCredentials")
);

const EditCredentials = React.lazy(() =>
  import("./admin/Credentials/EditCredentials")
);

const ViewCredentials = React.lazy(() =>
  import("./admin/Credentials/ViewCredentials")
);

const ArchivedCredentials = React.lazy(() =>
  import("./admin/Credentials/ArchivedList")
);

const DeletedCredentials = React.lazy(() =>
  import("./admin/Credentials/DeletedList")
);

// const LearningPlan = React.lazy(() =>
//   import("./admin/LearningPlan/LearningPlan")
// );

const OrganizationLearningPlan = React.lazy(() =>
  import("./admin/LearningPlan/OrganizationLearningPlan")
);

const AddOrgLearningPlan = React.lazy(() =>
  import("./admin/LearningPlan/AddOrgLearningPlan")
);

const CategoryList = React.lazy(() => import("./admin/Category/CategoryList"));
const AssignedCategoryList = React.lazy(() =>
  import("./admin/Category/AssignedCategory")
);
const AddUpdateViewCategoryList = React.lazy(() =>
  import("./admin/Category/AddCategory")
);
const ViewCategoryList = React.lazy(() =>
  import("./admin/Category/ViewCategory")
);
const NotificationList = React.lazy(() =>
  import("./admin/Notifications/Notifications")
);
const AddUpdateViewNotification = React.lazy(() =>
  import("./admin/Notifications/AddNotifications")
);

const ViewNotification = React.lazy(() =>
  import("./admin/Notifications/ViewNotifications")
);

const AdminCertificateList = React.lazy(() =>
  import("./admin/Certificate/ManageCertificateListingWidget")
);
const AdminAddCertificate = React.lazy(() =>
  import("./admin/Certificate/AddEditCertificate")
);
const AdminViewCertificate = React.lazy(() =>
  import("./admin/Certificate/ManageCertificateViewPage")
);

const AdminMyCertificates = React.lazy(() =>
  import("./admin/Certificate/MyCertificateList")
);

const Requirements = React.lazy(() =>
  import("./admin/TrainingSettings/RequirementSettings")
);

const Inprogress = React.lazy(() => import("./student/Inprogress/InProgress"));

const ElearningInprogress = React.lazy(() =>
  import("./student/Inprogress/ElearningInprogressCourseListing")
);
const ClassroomInprogress = React.lazy(() =>
  import("./student/Inprogress/ClassroomInprogressCourseListing")
);
const AssessmentInprogress = React.lazy(() =>
  import("./student/Inprogress/AssessmentInprogressCourseListing")
);
const CredentialsInprogress = React.lazy(() =>
  import("./student/Inprogress/CredentialsInprogressCourseListing")
);
const LearningPlanInprogress = React.lazy(() =>
  import("./student/Inprogress/LearningPlanInprogressCourseListing")
);

const TrainingCatalogSettings = React.lazy(() =>
  import("./admin/TrainingSettings/TrainingCatalogSettings")
);

const Requirement = React.lazy(() =>
  import("./student/Requirements/requirements")
);

const StudentLearningPlan = React.lazy(() =>
  import("./student/Requirements/StudentLearningPlan")
);

const StudentAssignments = React.lazy(() =>
  import("./student/Requirements/Assignments")
);

const Enrollment = React.lazy(() =>
  import("./student/Enrollments/enrollments")
);
const Catalog = React.lazy(() => import("./student/Catalog/catalog"));
const Transcript = React.lazy(() =>
  import("./student/Transcripts/transcripts")
);
const ViewDetail = React.lazy(() =>
  import("./student/Catalog/ViewCatalogCourseDetail")
);

const Document = React.lazy(() => import("./student/Documents/documents"));
const AddDocument = React.lazy(() => import("./student/Documents/Adddocument"));

const UserProfile = React.lazy(() => import("./admin/User/UserProfile"));

const Quiz = React.lazy(() => import("./student/Catalog/Quiz"));

const FAQ = React.lazy(() => import("./superadmin/FAQ/superadminfaq"));
const FAQstudent = React.lazy(() => import("./student/Documents/studentfaq"));

const FAQorder = React.lazy(() => import("./superadmin/FAQ/manageorderfaq"));
const FAQadmin = React.lazy(() => import("./admin/FAQ/adminfaq"));

const Addfaq = React.lazy(() => import("./superadmin/FAQ/addfaq"));
const Updatefaq = React.lazy(() => import("./superadmin/FAQ/updatefaq"));

const UserNotificationHead = React.lazy(() =>
  import("./common/Notification/UserNotificationDisplay")
);

const Viewdocument = React.lazy(() =>
  import("./student/Documents/Viewdocument")
);

const Assignments = React.lazy(() => import("./admin/Assignments/Assignments"));

const routes = [
  { path: "/", exact: true, name: "Home" },

  {
    path: "/Notification/UserNotificationDisplay",
    name: "User Notifications",
    element: UserNotificationHead,
  },

  {
    path: "/superadmin",
    name: "Super Admin",
    element: SuperAdminDashboard,
  },
  {
    path: "/superadmin/dashboard",
    name: "SuperAdmin Dashboard",
    element: SuperAdminDashboard,
  },
  {
    path: "/admin",
    name: "Admin",
    element: AdminDashboard,
  },
  {
    path: "/admin/admindashboard",
    name: "Admin Dashboard",
    element: AdminDashboard,
  },

  {
    path: "/student",
    name: "Student Dashboard",
    element: StudentDashboard,
  },

  {
    path: "/student/studentdashboard",
    name: "Student Dashboard",
    element: StudentDashboard,
  },
  {
    path: "/superadmin/organizationlist",
    name: "Organization List",
    element: OrganizationList,
  },
  {
    path: "/superadmin/organizationlist/addorganization",
    name: "Add Organization",
    element: AddEditOrganization,
  },
  {
    path: "/superadmin/organizationlist/editorganization",
    name: "Edit Organization",
    element: AddEditOrganization,
  },
  {
    path: "/superadmin/inactiveorganizationlist",
    name: "Inactive Organization",
    element: InactiveOrganization,
  },
  { path: "/superadmin/roleslist", name: "Roles List", element: RolesList },
  {
    path: "/superadmin/roleslist/editroles",
    name: "Edit Roles",
    element: EditRoles,
  },
  {
    path: "/superadmin/roleslist/viewroles",
    name: "View Roles",
    element: ViewRoles,
  },
  { path: "/superadmin/modulelist", name: "Module List", element: ModuleList },
  {
    path: "/superadmin/modulelist/addeditmodule",
    name: "Add Edit Module",
    element: AddUpdateViewModule,
  },
  {
    path: "/superadmin/addeditviewactions",
    name: "AddEditViewActions",
    element: AddEditViewActions,
  },
  {
    path: "/superadmin/moduleactionlist",
    name: "ModuleActionList",
    element: ModuleActionList,
  },
  {
    path: "/superadmin/actionpermission",
    name: "Action Permission",
    element: ActionPermission,
  },
  {
    path: "/superadmin/menulist/addmenu",
    name: "Add Menu",
    element: AddUpdateViewMenu,
  },
  {
    path: "/superadmin/menulist/editmenu",
    name: "Edit Menu",
    element: AddUpdateViewMenu,
  },
  { path: "/superadmin/menulist", name: "Menu List", element: MenuList },
  { path: "/superadmin/menulist/view", name: "View Menu", element: ViewMenu },
  {
    path: "/superadmin/menupermissionlist",
    name: "Menu Permission List",
    element: MenuPermissionList,
  },
  { path: "/superadmin/themelist", name: "Theme List", element: ThemeList },

  {
    path: "/superadmin/documentlibrary",
    name: "Document Library",
    element: Documentlibrary,
  },

  {
    path: "/admin/documentreference",
    name: "Document Library",
    element: Documentlibraryadmin,
  },
  {
    path: "/admin/viewdocumentlibrary",
    name: "Document Library",
    element: ViewDocumentlibraryadmin,
  },
  {
    path: "/student/viewdocument",
    name: "Document Library",
    element: ViewDocumentlibrarystudent,
  },

  {
    path: "/superadmin/documentlibrary/manageorder",
    name: "Manage Reference Order",
    element: ManageDocumentOrder,
  },

  {
    path: "/superadmin/documentlibrary/adddocument",
    name: "Document Library / Add Document",
    element: Adddocument,
  },
  {
    path: "/superadmin/documentlibrary/updatedocument",
    name: "Update Document",
    element: Updatedocument,
  },
  {
    path: "/superadmin/notificationlisting",
    name: "Notification List",
    element: GenericNotificationList,
  },
  {
    path: "/superadmin/notificationlist/addeditnotification",
    name: "Add Edit Notification",
    element: GenericAddUpdateViewNotification,
  },

  {
    path: "/superadmin/notificationlist/assignNotifications",
    name: "Assign Notification",
    element: AssignNotification,
  },

  {
    path: "/superadmin/notificationlist/ViewNotifications",
    name: "View Notification",
    element: GenericViewNotification,
  },
  {
    path: "/superadmin/notificationlist/CompanyNotifications",
    name: "Company Notification",
    element: CompanyNotification,
  },
  {
    path: "/superadmin/genericcategorylist",
    name: "Category List",
    element: GenericCategoryList,
  },
  {
    path: "/superadmin/addorganizationcategory",
    name: "AddUpdateOrganizationCategory",
    element: AddUpdateOrganizationCategory,
  },

  {
    path: "/superadmin/medialibrarylist/viewmedialibrary",
    name: "View media library",
    element: ViewMediaLibrary,
  },

  {
    path: "/superadmin/genericcategorylist/viewgenericcategory",
    name: "View Generic Category",
    element: ViewGenericCategory,
  },

  {
    path: "/superadmin/vieworganizationcategory",
    name: "ViewOrganizationCategory",
    element: ViewOrganizationCategory,
  },

  {
    path: "/superadmin/genericcategorylist/addgenericcategory",
    name: "Add Category",
    element: AddUpdateViewGenericCategory,
  },
  {
    path: "/superadmin/genericcategorylist/editgenericcategory",
    name: "Edit Category",
    element: AddUpdateViewGenericCategory,
  },
  {
    path: "/superadmin/genericgrouplist",
    name: "Generic Group List",
    element: GenericGroupList,
  },
  {
    path: "/superadmin/genericgrouplist/addeditgenericgroup",
    name: "Add Edit Generic Group",
    element: AddUpdateViewGenericGroup,
  },
  {
    path: "/superadmin/genericgrouplist/viewGenericGroup",
    name: "View Generic Group",
    element: ViewGenericGroup,
  },

  {
    path: "/superadmin/GenericGroups/ImportOrgGroup",
    name: "Import Generic Group",
    element: ImportGenericGroup,
  },
  {
    path: "/superadmin/medialibrarylist",
    name: "Media Library List",
    element: MediaLibraryList,
  },
  {
    path: "/superadmin/medialibrarylist/addmedialibrary",
    name: "Add Media Library",
    element: AddUpdateMediaLibrary,
  },
  {
    path: "/superadmin/medialibrarylist/editmedialibrary",
    name: "Edit Media Library",
    element: AddUpdateMediaLibrary,
  },
  {
    path: "/superadmin/courselibrarylist",
    name: "Course Library List",
    element: CourseLibraryList,
  },
  {
    path: "/superadmin/courselibrarylist/addelearningcourselibrary",
    name: "Add Elearning Course Library",
    element: AddUpdateViewElearningCourseLibrary,
  },
  {
    path: "/superadmin/courselibrarylist/editelearningcourselibrary",
    name: "Edit Elearning Course Library",
    element: AddUpdateViewElearningCourseLibrary,
  },
  {
    path: "/superadmin/courselibrarylist/addclassroomcourselibrary",
    name: "Add Classroom Course Library",
    element: AddUpdateViewClassroomCourseLibrary,
  },
  {
    path: "/superadmin/courselibrarylist/editclassroomcourselibrary",
    name: "Edit Classroom Course Library",
    element: AddUpdateViewClassroomCourseLibrary,
  },
  {
    path: "/superadmin/courselibrarylist/addassessmentcourselibrary",
    name: "Add Assessment Course Library",
    element: AddUpdateViewAssessmentCourseLibrary,
  },
  {
    path: "/superadmin/courselibrarylist/editassessmentcourselibrary",
    name: "Edit Assessment Course Library",
    element: AddUpdateViewAssessmentCourseLibrary,
  },
  {
    path: "/superadmin/courselibrarylist/viewcourselibrary",
    name: "View Course Library",
    element: ViewCourseLibrary,
  },
  {
    path: "/superadmin/certificatelist",
    name: "Certificate List",
    element: CertificateList,
  },
  {
    path: "/superadmin/certificatelist/addcertificate",
    name: "Add/Edit Certificate",
    element: AddUpdateViewCertificate,
  },

  {
    path: "/superadmin/certificatelist/viewcertificate",
    name: "View Certificate",
    element: ViewCertificate,
  },

  {
    path: "/superadmin/certificatelist/assigncertificate",
    name: "Assigned Certificate List",
    element: AssignCertificate,
  },

  // SA Credentials

  {
    path: "/superadmin/credentiallist",
    name: "CredentialList",
    element: CredentialList,
  },
  {
    path: "/superadmin/deletedlist",
    name: "DeletedCredentialList",
    element: DeletedCredentialList,
  },
  {
    path: "/superadmin/archivedlist",
    name: "ArchivedCredentialList",
    element: ArchivedCredentialList,
  },

  {
    path: "/superadmin/addcredentials",
    name: "AddCredentials",
    element: AddSACredentials,
  },

  {
    path: "/superadmin/updatecredentials",
    name: "UpdateCredentials",
    element: UpdateCredentials,
  },

  {
    path: "/superadmin/viewcredentials",
    name: "ViewCredentials",
    element: ViewSACredentials,
  },

  {
    path: "/admin",
    name: "User Management",
    element: UserManagement,
  },
  {
    path: "/admin/trainingmanagement",
    name: "Training Management",
    element: AdminDashboard,
  },
  {
    path: "/admin/systemmanagement",
    name: "System Management",
    element: AdminDashboard,
  },
  {
    path: "/admin/creditmanagement",
    name: "Credit Management",
    element: AdminDashboard,
  },
  {
    path: "/admin/userlist",
    name: "User List",
    element: UserList,
  },
  {
    path: "/admin/deleteduserlist",
    name: "Deleted User List",
    element: DeletedUserList,
  },
  {
    path: "/admin/inactiveuserlist",
    name: "Deleted User List",
    element: Inactiveuser,
  },

  {
    path: "/admin/organizegroup",
    name: "Deleted User List",
    element: OrganizeGroup,
  },
  {
    path: "/admin/archiveduserlist",
    name: "Archived User List",
    element: ArchivedUserList,
  },
  {
    path: "/admin/userlist/addeditviewuser",
    name: "Add Edit User",
    element: AddUpdateViewUser,
  },
  {
    path: "/admin/autogroup",
    name: "Auto groups",
    element: Autogroups,
  },
  {
    path: "/admin/manualgroup",
    name: "Auto groups",
    element: Manualgroups,
  },
  {
    path: "/admin/autogroup/organizegroup",
    name: "Organize group",
    element: Organizegroup,
  },

  {
    path: "/admin/userlist/edituser",
    name: "Edit User",
    element: UpdateUser,
  },

  {
    path: "/admin/userlist/viewuser",
    name: "ViewUser",
    element: ViewUser,
  },
  {
    path: "/admin/userlist/importusers",
    name: "ImportUsers",
    element: ImportUsers,
  },

  {
    path: "/admin/grouplist/importgroups",
    name: "ImportGroups",
    element: ImportGroups,
  },
  {
    path: "/admin/exportusers",
    name: "ExportUsers",
    element: ExportUsers,
  },

  {
    path: "/admin/grouplist",
    name: "Groups",
    element: GroupList,
  },

  {
    path: "/admin/subadminlist",
    name: "Sub Admin List",
    element: SubAdminList,
  },
  {
    path: "/admin/subadminlist/subadminviewlist",
    name: "Sub Admin View List",
    element: SubAdminViewList,
  },

  {
    path: "/admin/grouplist/addeditgroup",
    name: "Add Edit Group",
    element: AddRemoveGroup,
  },
  {
    path: "/admin/usermangement/adduserassubadmin",
    name: "Add User As Subadmin",
    element: AddUserAsSubadmin,
  },
  {
    path: "/admin/instructortrainerlist",
    name: "Instructor Traininer List",
    element: InstructorTraininerList,
  },
  {
    path: "/admin/instructortrainerViewlist",
    name: "Instructor Traininer View List",
    element: InstructorTraininerViewList,
  },
  {
    path: "/admin/teamcreditlist",
    name: "My Team",
    element: TeamCreditList,
  },
  {
    path: "/admin/exportteamcredit",
    name: "Export Team Credit",
    element: ExportTeamCredit,
  },
  {
    path: "/admin/givecredit",
    name: "Give Credit",
    element: GiveCredit,
  },
  {
    path: "/admin/teamapprovalreportlist",
    name: "Team Approval Report List",
    element: TeamApprovalReportList,
  },
  {
    path: "/admin/traininglibrarylist",
    name: "Training Library List",
    element: TrainingLibraryList,
  },
  {
    path: "/admin/importcoursetolibrary",
    name: "ImportCourseToLibrary",
    element: ImportCourseToLibrary,
  },
  {
    path: "/admin/exportcourselibrary",
    name: "ExportCourseLibrary",
    element: ExportCourseLibrary,
  },
  {
    path: "/admin/trainingmangagement/addedittraininglibrary",
    name: "Add Edit Training Library",
    element: AddUpdateViewTrainingLibrary,
  },
  {
    path: "/admin/coursecataloglist",
    name: "Course Catalog List",
    element: CourseCatalogList,
  },

  {
    path: "/admin/trainingmedialibrary",
    name: "Training Media Library",
    element: TrainingMediaLibrary,
  },

  {
    path: "/admin/addedittrainingmedialibrary",
    name: "Add Edit Media Library",
    element: AddEditTrainingMediaLibrary,
  },
  {
    path: "/admin/viewtrainingmedialibrary",
    name: "View Media Library",
    element: ViewTrainingMediaLibrary,
  },
  {
    path: "/admin/coursecataloglist/addeditviewelearningcoursecatalog",
    name: "Add Edit Elearning CourseCatalog",
    element: AddUpdateViewElearningCourseCatalog,
  },
  {
    path: "/admin/coursecataloglist/addeditviewclassroomcoursecatalog",
    name: "Add Edit Classroom Course Catalog",
    element: AddUpdateViewClassroomCourseCatalog,
  },
  {
    path: "/admin/coursecataloglist/addeditviewassessmentcoursecatalog",
    name: "Add Edit Assessment Course Catalog",
    element: AddUpdateViewAssessmentCourseCatalog,
  },
  {
    path: "/admin/coursecataloglist/viewcoursecatalog",
    name: "View Course Catalog",
    element: ViewCourseCatalog,
  },
  {
    path: "/admin/credentials",
    name: "Credentials",
    element: Credentials,
  },
  {
    path: "/admin/addcredentials",
    name: "AddCredentials",
    element: AddCredentials,
  },

  {
    path: "/admin/editcredentials",
    name: "EditCredentials",
    element: EditCredentials,
  },

  {
    path: "/admin/viewcredentials",
    name: "ViewCredentials",
    element: ViewCredentials,
  },

  {
    path: "/admin/archivedlist",
    name: "ArchivedCredentials",
    element: ArchivedCredentials,
  },

  {
    path: "/admin/deletedlist",
    name: "DeletedCredentials",
    element: DeletedCredentials,
  },
  // {
  //   path: "/admin/learningplan",
  //   name: "Learning Plan",
  //   element: LearningPlan,
  // },

  {
    path: "/admin/organizationlearningplan",
    name: "Organization Learning Plan",
    element: OrganizationLearningPlan,
  },

  {
    path: "/admin/organizationlearningplan/addlearningplan",
    name: "Add Learning Plan",
    element: AddOrgLearningPlan,
  },

  {
    path: "/admin/assignments",
    name: "Assignments",
    element: Assignments,
  },

  {
    path: "/admin/categorylist",
    name: "Category List",
    element: CategoryList,
  },

  {
    path: "/admin/category/assignedcategory",
    name: "Assigned Category List",
    element: AssignedCategoryList,
  },
  {
    path: "/admin/categorylist/addeditcategory",
    name: "Add Edit Category List",
    element: AddUpdateViewCategoryList,
  },

  {
    path: "/admin/categorylist/ViewCategory",
    name: "View Category List",
    element: ViewCategoryList,
  },
  {
    path: "/admin/notificationlist",
    name: "Notification List",
    element: NotificationList,
  },
  {
    path: "/admin/addeditviewnotification",
    name: "AddUpdateViewNotification",
    element: AddUpdateViewNotification,
  },
  {
    path: "/admin/viewnotification",
    name: "ViewNotification",
    element: ViewNotification,
  },

  {
    path: "/admin/certificatelist",
    name: "Admin Certificate List",
    element: AdminCertificateList,
  },
  {
    path: "/admin/certificatelist/addcertificate",
    name: "AdminAddCertificate",
    element: AdminAddCertificate,
  },
  {
    path: "/admin/certificatelist/editcertificate",
    name: "AdminEditCertificate",
    element: AdminAddCertificate,
  },
  {
    path: "/admin/certificatelist/viewcertificate",
    name: "AdminViewCertificate",
    element: AdminViewCertificate,
  },

  {
    path: "/admin/certificatelist/mycertificatelist",
    name: "My Certificates",
    element: AdminMyCertificates,
  },

  {
    path: "/admin/trainingsettings",
    name: "Requirements",
    element: Requirements,
  },
  {
    path: "/student/inprogress",
    name: "Inprogress",
    element: Inprogress,
  },

  {
    path: "/student/elearninginprogress",
    name: "ElearningInprogress",
    element: ElearningInprogress,
  },
  {
    path: "/student/classroominprogress",
    name: "ClassroomInprogress",
    element: ClassroomInprogress,
  },

  {
    path: "/student/assessmentinprogress",
    name: "AssessmentInprogress",
    element: AssessmentInprogress,
  },

  {
    path: "/admin/assigntraining/addassignment",
    name: "Addassignment",
    element: Addassignment,
  },
  {
    path: "/admin/assigntraining/viewassignment",
    name: "Updateassignment",
    element: UpdateAssignment,
  },
  {
    path: "/student/credentialsinprogress",
    name: "CredentialsInprogress",
    element: CredentialsInprogress,
  },
  {
    path: "/student/learningplaninprogress",
    name: "LearningPlanInprogress",
    element: LearningPlanInprogress,
  },

  {
    path: "/admin/trainingcatalogsettings",
    name: "TrainingCatalogSettings",
    element: TrainingCatalogSettings,
  },
  {
    path: "/admin/customfields",
    name: "CustomFields",
    element: CustomFields,
  },
  {
    path: "/admin/addeditcustomfield",
    name: "Add Edit Custom Field",
    element: AddCustomFields,
  },
  {
    path: "/admin/editcustomfield",
    name: "Edit Custom Field",
    element: editCustomField,
  },
  {
    path: "/admin/customfieldview",
    name: "View Custom Field",
    element: ViewCustomFields,
  },
  {
    path: "/userprofile",
    name: "Profile",
    element: UserProfile,
  },
  {
    path: "/student/catalog/quiz",
    name: "Quiz",
    element: Quiz,
  },

  {
    path: "/superadmin/sfaq",
    name: "FAQ",
    element: FAQ,
  },

  {
    path: "/student/faq",
    name: "FAQ",
    element: FAQstudent,
  },
  {
    path: "/superadmin/managefaqorder",
    name: "Manage FAQ Reference",
    element: FAQorder,
  },
  {
    path: "/admin/afaq",
    name: "FAQ",
    element: FAQadmin,
  },
  {
    path: "/superadmin/addfaq",
    name: "AddFAQ",
    element: Addfaq,
  },
  {
    path: "/superadmin/updatefaq",
    name: "UpdateFAQ",
    element: Updatefaq,
  },

  { path: "/student/requirements", name: "Requirement", element: Requirement },
  {
    path: "/student/studentlearningplan",
    name: "StudentLearningPlan",
    element: StudentLearningPlan,
  },
  {
    path: "/student/studentassignments",
    name: "StudentAssignments",
    element: StudentAssignments,
  },
  { path: "/student/enrollments", name: "Enrollment", element: Enrollment },
  { path: "/student/catalog", name: "Catalog", element: Catalog },
  {
    path: "/student/view-detail",
    name: "View Detail",
    element: ViewDetail,
  },
  { path: "/student/transcripts", name: "Transcript", element: Transcript },
  { path: "/student/document", name: "Document", element: Document },
  {
    path: "/student/document/adddocument",
    name: "Document",
    element: AddDocument,
  },

  {
    path: "/student/document/viewdocument",
    name: "Document",
    element: Viewdocument,
  },

  {
    path: "/admin/companysettings",
    name: "Company Settings",
    element: CompanySettings,
  },
  {
    path: "/admin/generalsettings",
    name: "General Settings",
    element: GeneralSettings,
  },

  {
    path: "/superadmin/activeinactiveroles",
    name: "Active Inactive Roles",
    element: ActiveInActiveRoles,
  },

  {
    path: "/admin/rolemanagement",
    name: "Role Management",
    element: RoleManagement,
  },

  {
    path: "/admin/editrolemanagement",
    name: "Edit Role Management",
    element: EditRoleManagement,
  },

  {
    path: "/student/player",
    name: "Player",
    element: ScormPlayer,
  },

  {
    path: "/admin/trainingLibraryInternal",
    name: "Training Library Internal",
    element: TrainingLibraryInternal,
  },

  {
    path: "/admin/trainingLibraryExternal",
    name: "Training Library External",
    element: TrainingLibraryExternal,
  },

  {
    path: "/admin/elearning",
    name: "Elearning",
    element: Elearning,
  },

  {
    path: "/admin/classrooms",
    name: "Classroom",
    element: Classroom,
  },
  {
    path: "/admin/classrooms/edit",
    name: "EditClass",
    element: EditClass,
  },

  {
    path: "/admin/assessment",
    name: "Assessment",
    element: Assessment,
  },

  {
    path: "/admin/assigntraining",
    name: "Assign Training",
    element: Assignments,
  },

  {
    path: "/admin/classrooms/addclasses",
    name: "Add Classes",
    element: AddEditClasses,
  },

  {
    path: "/admin/classrooms/editclasses",
    name: "Edit Classes",
    element: AddEditClasses,
  },
];

export default routes;
