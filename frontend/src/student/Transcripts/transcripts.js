import React, { useEffect, useState, useRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CImage,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CButton,
  CBadge,
  CFormInput,
} from "@coreui/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import html2canvas from "html2canvas";
import getApiCall from "src/server/getApiCall";
import { jsPDF } from "jspdf";
import "../../css/table.css";
const API_URL = process.env.REACT_APP_API_URL;
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
const transcripts = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken"),
    colorName = localStorage.getItem("ThemeColor"),
    [themes, setThemes] = useState(colorName),
    [filters, setFilters] = useState(null),
    [globalFilterValue, setGlobalFilterValue] = useState(""),
    [showModalP, setShowModalP] = useState(false),
    [certUrl, setCertUrl] = useState(""),
    [certStructure, setCertStructure] = useState("");

  const toast = useRef(null);
  const tableRef = useRef(null);
  const dt = useRef(null);

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  useEffect(() => {
    if (token !== "Bearer null") {
      getTranscriptList();
      initFilters();
    }
  }, []);

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      courseName: { value: null, matchMode: FilterMatchMode.CONTAINS },
      credits: { value: null, matchMode: FilterMatchMode.CONTAINS },
      notes: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      dateCreated: { value: null, matchMode: FilterMatchMode.CONTAINS },
      dueDate: { value: null, matchMode: FilterMatchMode.CONTAINS },
      notes: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });
    setGlobalFilterValue("");
  };
  const courseNameFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search"
        className="p-column-filter"
        showClear
        style={{
          height: "2rem",
          maxWidth: "10rem",
          lineHeight: "4px",
        }}
      />
    );
  };
  const creditsFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search"
        className="p-column-filter"
        showClear
        style={{
          height: "2rem",
          maxWidth: "10rem",
          lineHeight: "4px",
        }}
      />
    );
  };
  const notesFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search"
        className="p-column-filter"
        showClear
        style={{
          height: "2rem",
          maxWidth: "10rem",
          lineHeight: "4px",
        }}
      />
    );
  };
  const dateCreatedFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search"
        className="p-column-filter"
        showClear
        style={{
          height: "2rem",
          maxWidth: "10rem",
          lineHeight: "4px",
        }}
      />
    );
  };
  const dueDateFilterTemplate = (options) => {
    return (
      <CFormInput
        value={options.value}
        onChange={(e) => options.filterApplyCallback(e.target.value)}
        placeholder="Search"
        className="p-column-filter"
        showClear
        style={{
          height: "2rem",
          maxWidth: "10rem",
          lineHeight: "4px",
        }}
      />
    );
  };


  const courseName = (responseData) => (
    <>{responseData.courseName ? responseData.courseName : "-"}</>
  );

  const notes = (responseData) => (
    <>{responseData.notes ? responseData.notes : "-"}</>
  );

  const dateCreated = (responseData) => (
    <>{responseData.dateCreated ? responseData.dateCreated : "-"}</>
  );

  const dueDate = (responseData) => (
    <>{responseData.dueDate ? responseData.dueDate : "-"}</>
  );

  const Status = (responseData) => (
    <>{responseData.status ? responseData.status : "-"}</>
  );

  const credits = (responseData) => (
    <>
      <div style={{ textAlign: "center" }}>
        <CBadge className="badge badge-light-info text-info" color="light">
          {responseData.credits ? responseData.credits : "-"}
        </CBadge>
      </div>
    </>
  );
  const [responseData, setResponseData] = useState([]);

  const getTranscriptList = async () => {
    try {
      const res = await getApiCall("getTanscriptList");
      setResponseData(res);
    } catch (err) { }
  };
  const onDownloadClick = (url) => {
    const input = document.getElementById("certi");

    if (input) {
      html2canvas(input, { logging: true, useCORS: true }).then((canvas) => {

        const extension = url?.substring(url.lastIndexOf(".")).substring(1);
        if (extension === "pdf") {
          const imgurl = canvas.toDataURL("image/png");
          pdfDown(imgurl);
        } else {
          const a = document.createElement("a");
          const imgurl = canvas.toDataURL("image/png");
          pdfDown(imgurl);
        }
      });
    }
  };

  const handleClose = () => {
    setShowModalP(false);
  };
  const previewModal = () => {
    return (
      <CModal
        visible={showModalP}
        onClose={handleClose}
        alignment="center"
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>Preview</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div id="divToPrint" className="ql-editor">
            <div id="certi">
              <div
                style={{
                  backgroundImage: `url(${certUrl})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                <div
                  style={{ height: "550px" }}
                  dangerouslySetInnerHTML={{ __html: certStructure }}
                />
              </div>
            </div>
          </div>
        </CModalBody>
        <CModalFooter>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleClose}
          >
            Close
          </button>
        </CModalFooter>
      </CModal>
    );
  };

  const donwnloadCertificate = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = "certificate.pdf";
    a.click();
  };

  const crtImg = document.getElementById("crtImg");
  const getByTranscriptId = async (id) => {

    try {
      const res = await getApiCall("getTanscriptById", id);
      donwnloadCertificate(res.certificateLink);
    } catch (err) { }
  };

  function pdfDown(imgUrl) {
    var doc = new jsPDF();
    var img = new Image();

    img.src = imgUrl;
    img.onload = function () {
      //doc image in sqaure
      doc.addImage(img, "PNG", 10, 10, 180, 0);
      doc.save("certificate.pdf");
    };
  }
  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div>
        <CImage
          src="/custom_icon/eye.svg"
          style={{ height: "28px", cursor: "pointer" }}
          alt="eye_icon"
          onClick={() => {
            getByTranscriptId(responseData?.transcriptId);
          }}
          className="me-2"
          title="View"
        />
      </div>
    </div>
  );

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const items = Array.from({ length: 10 }, (v, i) => i);

  const bodyTemplate = () => {
    return <Skeleton></Skeleton>;
  };

  function renderPage(page) {
    const canvas = document.createElement("canvas");
    const viewport = page.getViewport({ scale: 1 });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext("2d");

    const renderTask = page.render({
      canvasContext: context,
      viewport: viewport,
    });
    renderTask.promise.then(() => {
      const imgData = canvas.toDataURL("image/png");
      setCertUrl(imgData);
    });
  }

  function loadPDF(url) {
    pdfjsLib.getDocument(url).promise.then((pdf) => {
      pdf.getPage(1).then((page) => {
        renderPage(page);
      });
    });
  }

  function loadPreview(url) {
    if (url) {
      const extension = url.substring(url.lastIndexOf(".")).substring(1);
      if (extension === "pdf") {
        loadPDF(url);
      }
      setCertUrl(url);
    }
  }

  useEffect(() => {
    if (certUrl) {
      loadPreview(certUrl);
    }
  }, [certUrl]);

  return (
    <div className="">
      <div className="container">
        <div className="container-fluid">
          <CRow>
            <CCol xs={12} style={{ padding: "1px" }}>
              <CCard className="mb-7 card-ric">
                {previewModal()}
                <div>
                  <CCardHeader className="p-0">
                    <CNav variant="tabs">
                      <CNavItem>
                        <CNavLink active style={{ cursor: "pointer" }}>
                          <strong>Transcripts</strong>
                        </CNavLink>
                      </CNavItem>
                    </CNav>
                    <CTabContent className="rounded-bottom">
                      <CTabPane className="p-3 preview" visible>
                        <div className="card-header border-0 d-flex justify-content-between">
                          <div className="d-flex row align-items-center">
                            <div
                              className={`col-md-12 col-xxl-12 searchBarBox${themes}`}
                            >
                              <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText
                                  value={globalFilterValue}
                                  onChange={onGlobalFilterChange}
                                  style={{ height: "40px" }}
                                  className="p-input-sm"
                                  placeholder="Search..."
                                />
                              </span>
                            </div>
                          </div>
                          <div className="d-flex justify-content-end">
                            <div className="d-grid gap-2 d-md-flex">
                              <Button
                                title="Export Documents"
                                style={{ height: "40px" }}
                                icon="pi pi-upload"
                                className="btn btn-info"
                                onClick={exportCSV}
                              />
                            </div>
                          </div>
                        </div>
                      </CTabPane>
                    </CTabContent>
                  </CCardHeader>

                  <CCardBody>
                    <Toast ref={toast} />
                    <div className="">
                      {!responseData ? (
                        <div
                          className={`card tableThemeColor${themes} InputThemeColor${themes}`}
                        >
                          <DataTable
                            value={items}
                            showGridlines
                            className="p-datatable-striped"
                          >
                            <Column
                              field="courseName"
                              header="Course Name"
                              style={{ width: "25%" }}
                              body={bodyTemplate}
                            ></Column>
                            <Column
                              field="credits"
                              header="Credits"
                              style={{ width: "25%" }}
                              body={bodyTemplate}
                            ></Column>

                            <Column
                              field="notes"
                              header="Notes"
                              style={{ width: "25%" }}
                              body={bodyTemplate}
                            ></Column>
                            <Column
                              field="dateCreated"
                              header="Date Created"
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
                      ) : (
                        <div
                          className={`card responsiveClass tableThemeColor${themes} InputThemeColor${themes}`}
                        >
                          <DataTable
                            ref={dt}
                            value={responseData}
                            removableSort
                            paginator
                            showGridlines
                            rowHover
                            emptyMessage="No records found."
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                            rows={10}
                            rowsPerPageOptions={[10, 20, 50]}
                            dataKey="documentId"
                            filters={filters}
                            filterDisplay="row"
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
                              body={courseName}
                              field="courseName"
                              header="Course Name"
                              sortableshowFilterMenu={false}
                              filter
                              filterElement={courseNameFilterTemplate}
                              filterPlaceholder="Search"
                              style={{ width: "15%" }}
                            ></Column>
                            <Column
                              body={credits}
                              field="credits"
                              header="Credits"
                              sortableshowFilterMenu={false}
                              filter
                              filterElement={creditsFilterTemplate}
                              filterPlaceholder="Search"
                            ></Column>
                            <Column
                              body={notes}
                              field="notes"
                              header="Notes"
                              showFilterMenu={false}
                              filter
                              filterElement={notesFilterTemplate}
                              filterPlaceholder="Search"
                            ></Column>
                            <Column
                              body={dateCreated}
                              field="dateCreated"
                              header="Date Created"
                              sortableshowFilterMenu={false}
                              filter
                              filterElement={dateCreatedFilterTemplate}
                              filterPlaceholder="Search"
                            ></Column>
                            <Column

                              field="dateCompleted"
                              header="Date Completed"
                              sortableshowFilterMenu={false}
                              filter
                              filterElement={dateCreatedFilterTemplate}
                              filterPlaceholder="Search"
                            ></Column>
                            <Column
                              body={dueDate}
                              field="dueDate"
                              header="Date Expiration"
                              showFilterMenu={false}
                              filter
                              filterElement={dueDateFilterTemplate}
                              filterPlaceholder="Search"
                            ></Column>
                            <Column body={Status} field="status" header="Status" showFilterMenu={false}
                              filter
                              filterPlaceholder="Search"></Column>
                            <Column field="trainingType" header="Training Type" style={{ width: "12%" }}></Column>
                            <Column
                              field="Action"
                              header="Action"
                              style={{ width: "10%", alignItems: "center" }}
                              body={buttonTemplate}
                            ></Column>
                          </DataTable>
                        </div>
                      )}
                    </div>
                  </CCardBody>
                </div>
              </CCard>
            </CCol>
          </CRow>
        </div>
      </div>
    </div>
  );
};
export default transcripts;
