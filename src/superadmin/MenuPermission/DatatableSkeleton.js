import { Skeleton } from "@mui/material";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";

function DatatableSkeleton() {
  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };
  const items = Array.from({ length: 10 }, (v, i) => i);
  return (
    <div className="card">
      <DataTable
        value={Array(10).fill({})}
        showGridlines
        className="p-datatable-striped"
      >
        <Column
          field="moduleName"
          header="Menu Name"
          sortable
          style={{ width: "25%" }}
          body={bodyTemplate}
        ></Column>
        <Column
          field="methodName"
          header="Display Name"
          style={{ width: "25%" }}
          body={bodyTemplate}
        ></Column>
        <Column
          field="isActive"
          header="Status"
          style={{ width: "10%" }}
          body={bodyTemplate}
        ></Column>
      </DataTable>
    </div>
  );
}

export default DatatableSkeleton;
