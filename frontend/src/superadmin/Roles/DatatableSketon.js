import { Skeleton } from "@mui/material";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";

function DatatableSketon() {
  const items = Array.from({ length: 10 }, (v, i) => i);

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };
  return (
    <div>
      <DataTable value={items} showGridlines className="p-datatable-striped">
        <Column
          field="roleName"
          header="Role Name"
          sortable
          style={{ width: "25%" }}
          body={bodyTemplate}
        ></Column>
        <Column
          field="description"
          header="Description"
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

export default DatatableSketon;
