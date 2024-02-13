import React, { useEffect, useState } from "react";
import getApiCall from "src/server/getApiCall";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CImage,
  CBadge,
} from "@coreui/react";
import { DataTable } from "primereact/datatable";
import DatatableSkeleton from "./DatatableSkeleton";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useRef } from "react";
import { Toast } from "primereact/toast";
import generalDeleteApiCall from "src/server/generalDeleteApiCall";

function EditClass() {
  const [loading, setLoading] = useState(false);
  const [classroomId, setClassroomId] = useState("");
  let classroomId1 = "";
  useEffect(() => {
    classroomId1 = localStorage.getItem("CLASSid");
    setClassroomId(classroomId1);
  }, [classroomId1]);
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  const [responseData, setResponseData] = useState();
  const [deleteClassDialog, setDeleteClassDialog] = useState(false);
  const [selectedProduct, setSelectedClass] = useState(null);
  const toast = useRef(null);

  const getOrgClassList = async (id) => {
    setLoading(true);
    try {
      const response = await getApiCall(`getOrgClassList`, id);
      setResponseData(response);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    if (classroomId != "") {
      getOrgClassList(parseInt(classroomId));
    }
  }, [classroomId]);
  const confirmDeleteClass = (product) => {
    setSelectedClass(product);
    setDeleteClassDialog(true);
  };
  const hideDeleteClassDialog = () => {
    setDeleteClassDialog(false);
  };
  const deleteClass = async (id) => {
    try {
      const response = await generalDeleteApiCall("deleteOrgClassById", {}, id);
      const filteredData = responseData.filter((item) => item.classId !== id);
      setResponseData(filteredData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Course deleted successfully!",
        life: 3000,
      });
      getOrgClassList();
    } catch (error) {}
    setDeleteClassDialog(false);
  };

  const deleteClassDialogFooter = () => (
    <React.Fragment>
      <Button
        label="No"
        size="sm"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteClassDialog}
      />
      <Button
        label="Yes"
        size="sm"
        icon="pi pi-check"
        severity="info"
        onClick={() => deleteClass(selectedProduct)}
      />
    </React.Fragment>
  );
  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <Link
        to={`/admin/classrooms/addclasses`}
        onClick={() => {
          localStorage.setItem("classId1", responseData.classId);
        }}
      >
        <CImage
          src="/custom_icon/edit.svg"
          alt="edit.svg"
          style={{ height: "25px", cursor: "pointer" }}
          className="me-2"
          title="Edit Class"
        />
      </Link>
      <CImage
        src="/custom_icon/bin.svg"
        className="me-3"
        alt="bin.svg"
        style={{ height: "24px", cursor: "pointer" }}
        onClick={() => confirmDeleteClass(responseData.classId)}
        title="Delete Credential"
      />
    </div>
  );

  const deliveryType = (responseData) => (
    <div>
      {responseData.deliveryType === 0 ? (
        <div>Classroom</div>
      ) : (
        <div>Virtual Classroom</div>
      )}
    </div>
  );

  return (
    <CRow>
      <Toast ref={toast} />
      <CCol xs={12}>
        <CCard className="mb-6">
          <div>
            <CCardHeader>
              <CNav variant="tabs">
                <CNavItem>
                  <CNavLink active style={{ cursor: "pointer" }}>
                    <strong>Class</strong>
                  </CNavLink>
                </CNavItem>
              </CNav>
            </CCardHeader>
          </div>
          <CCardBody>
            {loading ? (
              <div className="card">
                <DatatableSkeleton />
              </div>
            ) : (
              <DataTable
                value={responseData}
                showGridlines
                // rowHover
                // filterDisplay="row"
              >
                <Column
                  style={{ width: "10rem" }}
                  field="className"
                  header="class Name"
                ></Column>
                <Column field="sessionDate" header="Start Date"></Column>
                <Column
                  field="deliveryType"
                  header="Delivery Type"
                  body={deliveryType}
                ></Column>
                <Column field="totalHours" header="Total Hours"></Column>
                <Column field="maxSeats" header="Max Seats"></Column>
                <Column
                  field="Action"
                  header="Action"
                  body={buttonTemplate}
                ></Column>
              </DataTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>
      <Dialog
        visible={deleteClassDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteClassDialogFooter}
        onHide={hideDeleteClassDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle me-3 mt-2"
            style={{ fontSize: "1.5rem" }}
          />
          <span>Are you sure you want to delete ?</span>
        </div>
      </Dialog>
    </CRow>
  );
}

export default EditClass;
