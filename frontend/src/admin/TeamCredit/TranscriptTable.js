import { CBadge } from "@coreui/react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import getApiCall from "src/server/getApiCall";

function TranscriptTable({ userID }) {
  //   New Api
  const [response, setResponseData] = useState();
  const getCreditHistoryByUserId = async (id) => {
    try {
      const response = await getApiCall("creditHistoryByUserId", id);
      setResponseData(response);
    } catch (error) {
      // Handle errors
      console.error("Error fetching history data:", error);
    }
  };

  useEffect(() => {
    getCreditHistoryByUserId(userID);
  }, []);
  const statusShow2 = (responseData) => (
    <CBadge className={`badge badge-light-info text-info `} color="light">
      {responseData?.progress}
    </CBadge>
  );
  return (
    <div>
      <DataTable
        value={response}
        removableSort
        showGridlines
        rowHover
        emptyMessage="No records found."
        dataKey="documentId"
        // filters={filters}
        // filterDisplay="row"
      >
        <Column
          //   body={courseName}
          field="courseName"
          header="Training Name"
        ></Column>
        <Column
          //  body={credits}
          field="credits"
          header="Credits"
        ></Column>
        <Column
          // body={notes}
          field="notes"
          header="Notes"
        ></Column>
        <Column
          // body={dateCreated}
          field="dateCreated"
          header="Date Created"
        />
        <Column field="completionDate" header="Date Completed"></Column>
        <Column
          //   body={dueDate}
          field="dueDate"
          header="Date Expiration"
        ></Column>
        <Column body={statusShow2} field="progress" header="Status"></Column>
        <Column
          field="trainingType"
          header="Training Type"
          style={{ width: "12%" }}
        ></Column>
      </DataTable>
    </div>
  );
}

export default TranscriptTable;
