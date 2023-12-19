import { Skeleton } from "@mui/material";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";

function DataTableSkeleton() {
  const items = Array.from({ length: 10 }, (v, i) => i);

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };
  return (
    <div>
      <DataTable value={items} showGridlines className="p-datatable-striped">
        <Column
          field="moduleName"
          header="Module Name"
          sortable
          style={{ width: "25%" }}
          body={bodyTemplate}
        ></Column>
        <Column
          field="methodName"
          header="Method Name"
          style={{ width: "25%" }}
          body={bodyTemplate}
        ></Column>
        <Column
          field="parentModuleName"
          header="Parent Module Name"
          style={{ width: "25%" }}
          body={bodyTemplate}
        ></Column>
        <Column
          field="isActive"
          header="Status"
          style={{ width: "10%" }}
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

export default DataTableSkeleton;
