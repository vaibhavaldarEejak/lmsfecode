import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import getApiCall from "src/server/getApiCall";

function RequirmentLearningPlanModelTable({ userID }) {
  const [learningPlanData, setLearningData] = useState();

  //   New Api
  const getRequirementPopupApi = async (id) => {
    try {
      const response = await getApiCall("getTeamCreditRequirementPopup", id);
      setLearningData(response.learning);
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
        value={learningPlanData}
        showGridlines
        rowHover
        emptyMessage="No records found."
        responsiveLayout="scroll"
      >
        <Column
          style={{ minWidth: "10rem" }}
          field="learningPlanName"
          header="Learning Plan"
        ></Column>
        <Column field="dueDate" header="Due Date"></Column>
        <Column field="trainingName" header="Training Name"></Column>
        <Column field="requirementType" header="Training Type"></Column>
        <Column
          body={(rowData) => <>{rowData?.categoryName?.join(",")}</>}
          field="trainingCategory"
          header="Training Category"
        ></Column>
      </DataTable>
    </div>
  );
}

export default RequirmentLearningPlanModelTable;
