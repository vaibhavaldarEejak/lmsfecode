import React from "react";
// import { CTable } from '@coreui/react'
// import CTable from '@coreui/react/src/components/table/CTable'

import {
  CTable,
  CTableDataCell,
  CTableRow,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
} from "@coreui/react";

const studentDashboard = () => {
  return (
    <div>
      <CTable responsive="sm">
        <CTableBody>
          <CTableRow>
            <CTableHeaderCell colSpan={4}>
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Header</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Header</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Header</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableHeaderCell scope="row">A</CTableHeaderCell>
                    <CTableDataCell>First</CTableDataCell>
                    <CTableDataCell>Last</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row">B</CTableHeaderCell>
                    <CTableDataCell>First</CTableDataCell>
                    <CTableDataCell>Last</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row">C</CTableHeaderCell>
                    <CTableDataCell>First</CTableDataCell>
                    <CTableDataCell>Last</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CTableHeaderCell>
          </CTableRow>
          {/* <CTableRow>
            <CTableHeaderCell scope="row">3</CTableHeaderCell>
            <CTableDataCell colSpan={2}>Larry the Bird</CTableDataCell>
            <CTableDataCell>@twitter</CTableDataCell>
          </CTableRow> */}
        </CTableBody>
      </CTable>
    </div>
  );
};

export default studentDashboard;
