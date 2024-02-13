import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import getApiCall from "src/server/getApiCall";

function RequirmentAssessmentTableModel({ userID }) {
  const [requirementData, setRequirement] = useState([]);

  //   New Api
  const getRequirementPopupApi = async (id) => {
    try {
      const response = await getApiCall("getTeamCreditRequirementPopup", id);
      setRequirement(response.requirement);
    } catch (error) {
      // Handle errors
      console.error("Error fetching history data:", error);
    }
  };

  useEffect(() => {
    getRequirementPopupApi(userID);
  }, []);
  return (
    <div>
      <DataTable
        value={requirementData}
        showGridlines
        rowHover
        emptyMessage="No records found."
        responsiveLayout="scroll"
      >
        <Column
          style={{ minWidth: "10rem" }}
          field="assignmentName"
          header="Assessment Name"
        ></Column>
        <Column field="dueDate" header="Due Date"></Column>
        <Column field="trainingName" header="Training Name"></Column>
        <Column field="trainingTypeName" header="Training Type"></Column>
        <Column
          field="trainingCategory"
          body={(rowData) => <>{rowData?.categoryName?.join(",")}</>}
          header="Training Category"
        ></Column>
      </DataTable>
    </div>
  );
}

export default RequirmentAssessmentTableModel;
