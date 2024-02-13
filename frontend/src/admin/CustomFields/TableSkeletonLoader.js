import { Skeleton } from "@mui/material";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";

function TableSkeletonLoader() {
  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };
  const items = Array.from({ length: 10 }, (v, i) => i);
  return (
    <div>
      <DataTable value={items} showGridlines className="p-datatable-striped">
        <Column
          field="fieldName"
          header="Field Name"
          sortable
          style={{ width: "25%" }}
          body={bodyTemplate}
        ></Column>
        <Column
          field="fieldLabel"
          header="Field Label"
          style={{ width: "25%" }}
          body={bodyTemplate}
        ></Column>
        <Column
          field="fieldType"
          header="Field Type"
          style={{ width: "25%" }}
          body={bodyTemplate}
        ></Column>
        <Column
          field="status"
          header="Status"
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
  );
}

export default TableSkeletonLoader;
