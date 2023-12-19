import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Skeleton } from "primereact/skeleton";
import React from "react";

function DatatableSkeleton() {
  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };
  return (
    <div>
      <DataTable showGridlines className="p-datatable-striped">
        <Column
          field="className"
          header="class Name"
          body={bodyTemplate}
        ></Column>
        <Column
          field="startDate"
          header="Start Date"
          body={bodyTemplate}
        ></Column>
        <Column
          field="deliveryType"
          header="Delivery Type"
          body={bodyTemplate}
        ></Column>
        <Column
          field="totalHours"
          header="Total Hours"
          body={bodyTemplate}
        ></Column>
        <Column
          field="maxSeats"
          header="Max Seats"
          body={bodyTemplate}
        ></Column>
        <Column field="Action" header="Action" body={bodyTemplate}></Column>
      </DataTable>
    </div>
  );
}

export default DatatableSkeleton;
