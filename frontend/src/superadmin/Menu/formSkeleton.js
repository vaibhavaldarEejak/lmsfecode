import { CCol, CForm, CFormLabel, CRow } from "@coreui/react";
import { Skeleton } from "@mui/material";
import React from "react";

function formSkeleton() {
  return (
    <div>
      <CForm className={`row g-15 needs-validation InputThemeColor${themes}`}>
        <CRow className="mb-3">
          <CCol md={6}>
            <CRow className="mb-3">
              <CFormLabel
                htmlFor=""
                className="col-sm-4 col-form-label fw-bolder fs-7"
              >
                <Skeleton width="85%" className="mr-2"></Skeleton>
              </CFormLabel>
              <div className="col-sm-7 py-2">
                <Skeleton width="97%"></Skeleton>
              </div>
            </CRow>
          </CCol>

          <CCol md={6}>
            <CRow className="mb-3">
              <CFormLabel
                htmlFor=""
                className="col-sm-4 col-form-label fw-bolder fs-7"
              >
                <Skeleton width="85%" className="mr-2"></Skeleton>
              </CFormLabel>
              <div className="col-sm-7 py-2">
                <Skeleton width="97%"></Skeleton>
              </div>
            </CRow>
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol md={6}>
            <CRow className="mb-3">
              <CFormLabel
                htmlFor=""
                className="col-sm-4 col-form-label fw-bolder fs-7"
              >
                <Skeleton width="85%" className="mr-2"></Skeleton>
              </CFormLabel>
              <div className="col-sm-7 py-2">
                <Skeleton width="97%"></Skeleton>
              </div>
            </CRow>
          </CCol>

          <CCol md={6}>
            <CRow className="mb-3">
              <CFormLabel
                htmlFor=""
                className="col-sm-4 col-form-label fw-bolder fs-7"
              >
                <Skeleton width="85%" className="mr-2"></Skeleton>
              </CFormLabel>
              <div className="col-sm-7 py-2">
                <Skeleton width="97%"></Skeleton>
              </div>
            </CRow>
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol md={6}>
            <CRow className="mb-3">
              <CFormLabel
                htmlFor=""
                className="col-sm-4 col-form-label fw-bolder fs-7"
              >
                <Skeleton width="85%" className="mr-2"></Skeleton>
              </CFormLabel>
              <div className="col-sm-7 py-2">
                <Skeleton width="97%"></Skeleton>
              </div>
            </CRow>
          </CCol>

          <CCol md={6}>
            <CRow className="mb-3">
              <CFormLabel
                htmlFor=""
                className="col-sm-4 col-form-label fw-bolder fs-7"
              >
                <Skeleton width="85%" className="mr-2"></Skeleton>
              </CFormLabel>
              <div className="col-sm-7 py-2">
                <Skeleton width="97%"></Skeleton>
              </div>
            </CRow>
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol md={6}>
            <CRow className="mb-3">
              <CFormLabel
                htmlFor=""
                className="col-sm-4 col-form-label fw-bolder fs-7"
              >
                <Skeleton width="85%" className="mr-2"></Skeleton>
              </CFormLabel>
              <div className="col-sm-7 py-2">
                <Skeleton width="97%"></Skeleton>
              </div>
            </CRow>
          </CCol>

          <CCol md={6}>
            <CRow className="mb-3">
              <CFormLabel
                htmlFor=""
                className="col-sm-4 col-form-label fw-bolder fs-7"
              >
                <Skeleton width="85%" className="mr-2"></Skeleton>
              </CFormLabel>
              <div className="col-sm-7 py-2">
                <Skeleton width="97%"></Skeleton>
              </div>
            </CRow>
          </CCol>
        </CRow>
        <CRow className="mb-3">
          <CCol md={6}>
            <CRow className="mb-3">
              <CFormLabel
                htmlFor=""
                className="col-sm-4 col-form-label fw-bolder fs-7"
              >
                <Skeleton width="85%" className="mr-2"></Skeleton>
              </CFormLabel>
              <div className="col-sm-7 py-2">
                <Skeleton width="97%"></Skeleton>
              </div>
            </CRow>
          </CCol>
        </CRow>
      </CForm>
    </div>
  );
}

export default formSkeleton;
