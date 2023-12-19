import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect } from "react";

const TranscriptHistory = () => {
  const getTranscriptList = async (id) => {
    // try {
    //   const response = await getApiCall("viewCreditListByUserId", id);
    //   setCourseData(response);
    // } catch (error) {
    //   // Handle errors
    //   console.error("Error fetching history data:", error);
    // }
  };

  useEffect(() => {
    // getTranscriptList(userID);
  }, []);
  return (
    <div>
      <DataTable
        // value={responseData}
        removableSort
        showGridlines
        rowHover
        emptyMessage="No records found."
        dataKey="documentId"
        // filters={filters}
        // filterDisplay="row"
        globalFilterFields={[
          "courseName",
          "transcriptId",
          "category",
          "credits",
          "dateCreated",
          "notes",
          "status",
          "dueDate",
        ]}
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
          //  body={dateCreated}
          field="dateCreated"
          header="Date Created"
        />
        <Column field="dateCompleted" header="Date Completed"></Column>
        <Column
          //   body={dueDate}
          field="dueDate"
          header="Date Expiration"
        ></Column>
        <Column
          //  body={Status}
          field="status"
          header="Status"
        ></Column>
        <Column
          field="trainingType"
          header="Training Type"
          style={{ width: "12%" }}
        ></Column>
      </DataTable>
    </div>
  );
};

export default TranscriptHistory;
