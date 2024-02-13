import React, { useEffect, useState, useRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CNavItem,
  CNav,
  CNavLink,
  CImage,
  CTabContent,
  CTabPane,
  CModal,
  CButton,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CBadge,
} from "@coreui/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import { Link } from "react-router-dom";
import axios from "axios";
import { Toast } from "primereact/toast";
import { Skeleton } from "primereact/skeleton";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import getApiCall from "src/server/getApiCall";
import generalDeleteApiCall from "src/server/generalDeleteApiCall";
import postApiCall from "src/server/postApiCall";

import { ProgressBar } from "primereact/progressbar";
import "../../css/table.css";

const OrganizationLearningPlan = () => {
  const [responseData, setResponseData] = useState(null);
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const colorName = localStorage.getItem("ThemeColor");
  const [userVisible, setUserVisible] = useState(false);
  const [globalFilterValue2, setGlobalFilterValue2] = useState("");
  const [filters2, setFilters2] = useState(null);
  const [rowClick, setRowClick] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userLearningData, setUserLearningData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [learningPlanIds, setLearningPlanIds] = useState([]);
  const [selectedContent, setSelectedContent] = useState([]);
  const [courseListvisible, setcourseListvisible] = useState(false);
  const [themes, setThemes] = useState(colorName);
  const [responseData2, setResponseData2] = useState(null);
  const [learningPlanPayload, setLearningPlanPayload] = useState([
    {
      learningPlanIds: null,
      users: null,
    },
  ]);
  const toast = useRef(null);
  const [oldAssignDays, setOldAssignDays] = useState(0);

  //API's
  useEffect(() => {
    localStorage.removeItem("learningPlanId");
    getOrgLearningPlanList();
  }, []);

  const getOrgLearningPlanList = async () => {
    try {
      const response = await getApiCall("getOrgLearningPlanList");
      setResponseData(response);
    } catch (error) {
      console.log(error);
    }
  };
  const [expirationTime1, setExpirationTime] = useState(0); // used for due date    expiration length is saved in years
  const [expirationLength1, setExpirationLength] = useState(0); //use for expiration

  const ViewLearningPlanApi = async (id) => {
    try {
      const response = await getApiCall(`getOrgLearningPlanById/${id}`);
      setResponseData2(response.learningPlanRequirements);
      setOldAssignDays(
        response.learningPlanRequirements
          .filter((item) => item.fromDateOfAssign === 1)
          .map((item) => item.dueDateValue)
      );
      response.learningPlanRequirements.map((item) => {
        setExpirationTime(item.expirationTime);
        setExpirationLength(item.expirationLength);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteLearningPlan = async (id) => {
    try {
      const response = await generalDeleteApiCall(
        "deleteOrgLearningPlanById",
        {},
        id
      );

      const filteredData = responseData.filter(
        (item) => item.learningPlanId !== id
      );
      setResponseData(filteredData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Credentials deleted successfully!",
        life: 3000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Deleting Credentials",
        life: 3000,
      });
    }

    setDeleteProductDialog(false);
  };

  const addContentToOrg = async () => {
    try {
      const response = await postApiCall(
        "learningPlanUserAssignment",
        learningPlanPayload[0]
      );
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Content Assigned To Organization Successfully!",
        life: 3000,
      });
      setUserVisible(false);
      // getOrgLearningPlanList();
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Assigning Content To Organizaton",
        life: 3000,
      });
    }
  };
  //Functions
  const items = Array.from({ length: 10 }, (v, i) => i);

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };

  const confirmDeleteProduct = (product) => {
    setSelectedProduct(product);
    setDeleteProductDialog(true);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  function handleSelectAll(event) {
    const isChecked = event.target.checked ? 1 : 0;
    const updatedData = userLearningData.map((row) => ({
      ...row,
      isChecked: isChecked,
    }));
    setUserLearningData(updatedData);
    setSelectAll(event.checked);
    setLearningPlanPayload([
      {
        learningPlanIds: learningPlanIds,
        users: updatedData,
      },
    ]);
  }

  function handleCheckboxChange(rowData, field, event) {
    const isChecked = event.target.checked ? 1 : 0;
    const updatedRow = { ...rowData, [field]: isChecked };
    const updatedData = userLearningData.map((row) =>
      row.userId === rowData.userId ? updatedRow : row
    );
    setUserLearningData(updatedData);
    setLearningPlanPayload([
      {
        learningPlanIds: [learningPlanIds],
        users: updatedData.map((data) => ({
          id: data.userId,
          isChecked: data.isChecked,
        })),
      },
    ]);
  }

  const deleteProductDialogFooter = () => (
    <React.Fragment>
      <Button
        label="No"
        size="sm"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Yes"
        size="sm"
        icon="pi pi-check"
        severity="info"
        onClick={() => deleteLearningPlan(selectedProduct.learningPlanId)}
      />
    </React.Fragment>
  );

  const progressBarTemplate = (responseData) => {
    return (
      <div style={{ position: "relative" }}>
        <ProgressBar
          value={responseData.progress === 0 ? 1 : responseData.progress}
          className="p-progress-rounded"
          displayValueTemplate={() => {}}
        />
        <div
          style={{ top: 0, position: "absolute", left: "50%", fontWeight: 800 }}
        >
          {responseData.progress}%
        </div>
      </div>
    );
  };
  const addDaystoDate = (days) => {
    var myDate = new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000);
    //trim the date to get only dd-mm-yyyy
    myDate = myDate.toISOString().split("T")[0];
    return myDate;
  };
  const checkboxHeader = (
    <input
      class="form-check-input"
      type="checkbox"
      checked={selectAll}
      onChange={handleSelectAll}
    />
  );
  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <Link
        onClick={() => {
          setcourseListvisible(true);
          ViewLearningPlanApi(responseData.learningPlanId);
        }}
      >
        <CImage
          src="/custom_icon/eye.svg"
          alt="eye.svg"
          style={{ height: "25px" }}
          className="me-2"
          title="View Learning Plan"
        />
      </Link>
      <Link
        to={`/admin/organizationlearningplan/addlearningplan`}
        onClick={() => {
          localStorage.setItem("learningPlanId", responseData.learningPlanId);
        }}
      >
        <CImage
          src="/custom_icon/edit.svg"
          alt="edit.svg"
          style={{ height: "25px" }}
          className="me-2"
          title="Edit Notification"
        />
      </Link>
      <CImage
        src="/custom_icon/bin.svg"
        className="me-3"
        alt="bin.svg"
        style={{ height: "24px", cursor: "pointer" }}
        onClick={() => confirmDeleteProduct(responseData)}
        title="Delete Credential"
      />
      {/* <div
          title="Assign User"
          style={{ height: "25px", cursor: "pointer" }}
          onClick={(e) => {
            setLearningPlanIds(responseData.id);
            console.log("responseData", responseData);
            getUserListByLearningPlanId(responseData.id);
            console.log(responseData.id);
            setLearningPlanPayload([
              {
                learningPlanIds: [responseData.id],
                users: null,
              },
            ]);
            console.log(responseData.id);
            setUserVisible(!userVisible);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
            class={`bi bi-plus-circle-fill iconTheme${themes}`}
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z" />
          </svg>
        </div> */}
    </div>
  );
  const onGlobalFilterChange2 = (e) => {
    const value = e.target.value;
    let _filters2 = { ...filters2 };
    _filters2["global"].value = value;

    setFilters2(_filters2);
    setGlobalFilterValue2(value);
  };
  const expiryShow = (responseData, props) => (
    <>
      {responseData?.expirationDateValue === null ? (
        <>
          <CBadge
            className={`badge badge-light-info text-info badgeColor${themes} `}
            color="light"
          >
            Never
          </CBadge>
        </>
      ) : (
        <>
          <div>
            {responseData?.expirationDateValue} days from date of assignment
          </div>
        </>
      )}
    </>
  );
  const dueDateShow = (responseData, props) => (
    <>
      {responseData?.dueDateValue === null ? (
        <>
          <CBadge
            className={`badge badge-light-info text-info badgeColor${themes} `}
            color="light"
          >
            Never
          </CBadge>
        </>
      ) : (
        <>
          <div
            className={`badge badge-light-info text-info badgeColor${themes} `}
            color="light"
          >
            {responseData?.dueDateValue} days from date of assignment
          </div>
        </>
      )}
    </>
  );
  return (
    <div>
      <div className="Subadminlisting">
        <div className="container">
          <div className="container-fluid">
            <CRow>
              <CCol xs={12} style={{ padding: "1px" }}>
                <CCard className="mb-4 card-ric">
                  <div>
                    <CCardHeader className="p-0">
                      <CNav variant="tabs">
                        <CNavItem>
                          <CNavLink active style={{ cursor: "pointer" }}>
                            <strong>Learning page</strong>
                          </CNavLink>
                        </CNavItem>
                      </CNav>
                      <CTabContent className="rounded-bottom">
                        <CTabPane className="p-3 preview" visible>
                          <div className="card-header border-0 d-flex justify-content-between">
                            <div className="d-flex row align-items-center">
                              <div className="col-md-12 col-xxl-12">
                                <span className="p-input-icon-left">
                                  <i className="pi pi-search" />
                                  <InputText
                                    // value={globalFilterValue}
                                    style={{ height: "40px" }}
                                    // onChange={onGlobalFilterChange}
                                    className="p-input-sm"
                                    placeholder="Search..."
                                  />
                                </span>
                              </div>
                            </div>
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                              <div
                                className="d-grid gap-2 d-md-flex"
                                onClick={() => {
                                  localStorage.removeItem("learningPlanId");
                                }}
                              >
                                <Link
                                  to={`/admin/organizationlearningplan/addlearningplan`}
                                  className="me-md-2 btn btn-info"
                                  title="Add User as Subadmin"
                                  onClick={() => {
                                    localStorage.removeItem("learningPlanId");
                                  }}
                                >
                                  Add New Learning Plan
                                </Link>
                              </div>
                              {/* <CButton color="light">Add User as Subadmin</CButton> */}
                            </div>
                          </div>
                        </CTabPane>
                      </CTabContent>
                    </CCardHeader>
                  </div>
                  <CCardBody>
                    <Toast ref={toast} />
                    <CModal
                      size="md"
                      visible={userVisible}
                      onClose={() => setUserVisible(false)}
                      scrollable
                    >
                      <CModalHeader closeButton={true}>
                        <CTabContent className="rounded-bottom">
                          <CTabPane className="p-3 preview" visible>
                            <div className="card-header border-0 d-flex justify-content-between">
                              <div className="d-flex row align-items-center">
                                <div className="col-md-12 col-xxl-12">
                                  <span className="p-input-icon-left">
                                    <i className="pi pi-search" />
                                    <InputText
                                      value={globalFilterValue2}
                                      onChange={onGlobalFilterChange2}
                                      style={{ height: "40px" }}
                                      className="p-input-sm"
                                      placeholder="Search..."
                                    />
                                  </span>
                                </div>
                              </div>
                              <div className="d-grid gap-2 d-md-flex justify-content-md-end"></div>
                            </div>
                          </CTabPane>
                        </CTabContent>
                      </CModalHeader>
                      <CModalBody>
                        <DataTable
                          selectionMode={rowClick ? null : "checkbox"}
                          selection={selectedUsers}
                          value={userLearningData}
                          removableSort
                          showGridlines
                          rowHover
                          emptyMessage="-"
                          dataKey="userId"
                          filters={filters2}
                          filterDisplay="menu"
                          globalFilterFields2={["firstName"]}
                        >
                          <Column
                            field="isChecked"
                            header={checkboxHeader}
                            body={(rowData) => (
                              <input
                                class="form-check-input"
                                type="checkbox"
                                value={rowData.isChecked == 1 ? true : false}
                                checked={rowData.isChecked == 1}
                                onChange={(event) =>
                                  handleCheckboxChange(
                                    rowData,
                                    "isChecked",
                                    event
                                  )
                                }
                                selectionMode={rowClick ? null : "checkbox"}
                                selection={selectedContent}
                              />
                            )}
                          />
                          <Column
                            field="firstName"
                            header="First Name"
                            sortable
                          ></Column>
                          <Column
                            field="lastName"
                            header="Last Name"
                            sortable
                          ></Column>
                        </DataTable>
                      </CModalBody>
                      <CModalFooter>
                        <CButton
                          className="btn btn-primary"
                          onClick={() => addContentToOrg()}
                          type="button"
                          // disabled={checkUser}
                        >
                          Assign Learning Plan
                        </CButton>
                        <CButton
                          className="btn btn-primary"
                          onClick={() => setUserVisible(false)}
                        >
                          Cancel
                        </CButton>
                      </CModalFooter>
                    </CModal>
                    {!responseData ? (
                      <div className="card">
                        <DataTable
                          value={items}
                          showGridlines
                          className="p-datatable-striped"
                        >
                          <Column
                            field="learningPlanName"
                            header="Title"
                            sortable
                            style={{ width: "25%" }}
                            body={bodyTemplate}
                          ></Column>
                          <Column
                            field="progress"
                            header="Progress"
                            style={{ width: "25%" }}
                            body={bodyTemplate}
                          ></Column>

                          <Column
                            field="Action"
                            header="Action"
                            style={{ width: "25%" }}
                            body={bodyTemplate}
                          ></Column>
                        </DataTable>
                      </div>
                    ) : (
                      <DataTable
                        value={responseData}
                        removableSort
                        paginator
                        showGridlines
                        rowHover
                        emptyMessage="No records found."
                        responsiveLayout="scroll"
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                        rows={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        dataKey="id"
                        globalFilterFields={[
                          "libraryName",
                          "libraryType",
                          "Expiry",
                        ]}
                      >
                        {/* <CheckBox type="multiselect"></CheckBox> */}
                        <Column
                          field="learningPlanName"
                          header="Title"
                          sortable
                          showFilterMenu={false}
                          filter
                          // filterElement={libraryNameFilterTemplate}
                          filterPlaceholder="Search"
                        ></Column>
                        <Column
                          field="progress"
                          header="Progress"
                          showFilterMenu={false}
                          filter
                          // sortable
                          body={progressBarTemplate}
                          // filterElement={libraryTypeFilterTemplate}
                          filterPlaceholder="Search"
                        ></Column>

                        <Column
                          field="Action"
                          header="Action"
                          body={buttonTemplate}
                        ></Column>
                      </DataTable>
                    )}
                    <Dialog
                      visible={deleteProductDialog}
                      style={{ width: "32rem" }}
                      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                      header="Confirm"
                      modal
                      footer={deleteProductDialogFooter}
                      onHide={hideDeleteProductDialog}
                    >
                      <div className="confirmation-content">
                        <i
                          className="pi pi-exclamation-triangle me-3 mt-2"
                          style={{ fontSize: "1.5rem" }}
                        />
                        <span>Are you sure you want to delete ?</span>
                      </div>
                    </Dialog>
                  </CCardBody>

                  <CModal
                    size="lg"
                    visible={courseListvisible}
                    onClose={() => setcourseListvisible(false)}
                    scrollable
                  >
                    <CModalHeader closeButton={true}>
                      <CTabContent className="rounded-bottom">
                        <strong>Learning Plan Requirements</strong>
                      </CTabContent>
                    </CModalHeader>
                    <CModalBody>
                      <div className={`InputThemeColor${themes}`}>
                        <DataTable
                          value={responseData2}
                          removableSort
                          showGridlines
                          rowHover
                          emptyMessage="No records found."
                          dataKey="requirementId"
                          filterDisplay="menu"
                          globalFilterFields2={["organizationName"]}
                        >
                          <Column
                            field="requirementName"
                            header="Course Title"
                            sortable
                          ></Column>
                          <Column
                            field="typeName"
                            header="Course Type"
                            sortable
                          ></Column>
                          <Column
                            field="dueDate"
                            header="Due Date"
                            showFilterMenu={false}
                            filter
                            sortable
                            body={dueDateShow}
                            // body={dueDateShow}
                          ></Column>
                          <Column
                            field="expiry"
                            header="Expiration"
                            showFilterMenu={false}
                            filter
                            sortable
                            body={expiryShow}
                            // body={expiryShow}
                          ></Column>
                        </DataTable>
                      </div>
                    </CModalBody>
                  </CModal>
                </CCard>
              </CCol>
            </CRow>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationLearningPlan;
