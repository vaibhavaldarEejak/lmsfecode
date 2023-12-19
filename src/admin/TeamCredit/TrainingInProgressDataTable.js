import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import getApiCall from "src/server/getApiCall";

function TrainingInProgressDataTable({ userID, indexValue }) {
  const [responseData, setResponseData] = useState();

  const getViewCreditListByUserId = async (id) => {
    try {
      const response = await getApiCall("getUserTrainingProgress", id);

      if (indexValue === 0) {
        setResponseData(
          response?.filter((items) => items?.trainingTypeId === 1)
        );
      } else if (indexValue === 1) {
        setResponseData(
          response?.filter((items) => items?.trainingTypeId === 2)
        );
      } else if (indexValue === 2) {
        setResponseData(
          response?.filter((items) => items?.trainingTypeId === 3)
        );
      } else if (indexValue === 3) {
        //  call credit
      }
    } catch (error) {
      // Handle errors
      console.error("Error fetching history data:", error);
    }
  };

  useEffect(() => {
    getViewCreditListByUserId(userID);
  }, []);
  const progressBarTemplate = (responseData) => {
    return (
      <div style={{ position: "relative" }}>
        <ProgressBar
          value={responseData.progress === 0 ? 1 : responseData.userProgressId}
          className="p-progress-rounded"
          style={{ height: "1.4rem" }}
          displayValueTemplate={() => {}}
        />
        <div
          style={{ top: 0, position: "absolute", left: "50%", fontWeight: 800 }}
        >
          {responseData.userProgressId}%
        </div>
      </div>
    );
  };
  return (
    <div>
      <DataTable
        value={responseData}
        showGridlines
        rowHover
        emptyMessage="No records found."
        responsiveLayout="scroll"
      >
        <Column
          style={{ minWidth: "10rem" }}
          field="trainingName"
          header="Training Name"
        ></Column>

        <Column field="trainingTypeName" header="Training Type"></Column>
        <Column
          body={(rowData) => <>{rowData?.categoryName?.join(",")}</>}
          field="trainingCategory"
          header="Training Category"
        ></Column>

        <Column
          body={progressBarTemplate}
          field="userProgressId"
          header="Progress Status"
        ></Column>
      </DataTable>
    </div>
  );
}

export default TrainingInProgressDataTable;
