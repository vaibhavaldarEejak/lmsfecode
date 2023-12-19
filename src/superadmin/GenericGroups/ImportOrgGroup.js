import React, { useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormLabel,
  CRow,
  CForm,
  CCardFooter,
} from "@coreui/react";
import { Link, useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import * as xlsx from "xlsx";
import { Container } from "react-bootstrap";
import postApiCall from "src/server/postApiCall";

const API_URL = process.env.REACT_APP_API_URL;

const ImportOrgGroup = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const navigate = useNavigate();
  const [excelData, setExcelData] = useState([]);
  const [importFile, setImportFile] = useState(null);
  const readExcel = async (e) => {
    const file = e.target.files[0];

    const data = await file.arrayBuffer(file);
    const excelfile = xlsx.read(data);
    const excelsheet = excelfile.Sheets[excelfile.SheetNames[0]];
    const exceljson = xlsx.utils.sheet_to_json(excelsheet);

    setExcelData(exceljson);
  };

  const [form, setForm] = useState({
    groupImportFile: "",
  });

  const downloadXLS = () => {
    const link = document.createElement("a");
    link.download = `BulkOrgGroupImportExcel.xlsx`;
    link.href = `${process.env.PUBLIC_URL}/bulkOrgGroups/BulkOrgGroupImportExcel.xlsx`;
    link.click();
  };

  const handleSave = async (e) => {
    const formData = new FormData();

    formData.append("groupImportFile", importFile);

    const data = {
      groupImportFile: importFile,
    };
    try {
      const res = await postApiCall("groupImport", data);
      navigate("/superadmin/genericgrouplist");
    } catch (err) {
      var errMsg = err?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
    }
  };
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  return (
    <CRow>
      <form>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Import Bulk Groups</strong>
            </CCardHeader>
            <CCardBody className="card-body border-top p-9">
              <CForm
                className={`row g-15 needs-validation  InputThemeColor${themes}`}
              >
                <CRow className="mb-3">
                  <CCol md={8}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-3 col-form-label fw-bolder fs-7"
                      >
                        Step 1
                      </CFormLabel>

                      <CFormLabel
                        htmlFor=""
                        className="col-sm-3 col-form-label fw-bolder fs-7"
                      >
                        Download Sample Excel
                      </CFormLabel>
                      <div className="d-flex justify-content-end">
                        <Link
                          className={`btn btn-primary me-2 saveButtonTheme${themes}`}
                          onClick={() => downloadXLS()}
                        >
                          Download XLS
                        </Link>
                        <Link
                          className={`btn btn-primary saveButtonTheme${themes}`}
                          onClick={() => downloadXLS()}
                        >
                          Download CSV
                        </Link>
                      </div>
                    </CRow>
                  </CCol>
                  <CCol md={8}>
                    <CRow className="mb-3">
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-3 col-form-label fw-bolder fs-7"
                      >
                        Step 2
                      </CFormLabel>
                      <CFormLabel
                        htmlFor=""
                        className="col-sm-3 col-form-label fw-bolder fs-7"
                      >
                        Upload your Bulk Users Data file here
                      </CFormLabel>
                      <input
                        type="file"
                        name="fileInput"
                        className="form-control"
                        onChange={(e) => {
                          readExcel(e);
                          setImportFile(e.target.files[0]);
                        }}
                      />
                      <div className="col-sm-5"></div>
                    </CRow>
                  </CCol>
                </CRow>

                <React.Fragment>
                  <Container className="content">
                    <div className="row fthight">
                      <div className="col-md-4 "></div>
                      <div className="col-md-12 mt-3">
                        {excelData.length > 1 && (
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Parent Group Name</th>
                                <th>Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {excelData.map((getdata, index) => (
                                <tr key={index}>
                                  <td>{getdata.groupName} </td>

                                  <td>{getdata.parentGroupName} </td>

                                  <td>{getdata.description} </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  </Container>
                </React.Fragment>
              </CForm>
            </CCardBody>
            <CCardFooter>
              <div className="d-flex justify-content-end">
                <Link
                  className={`btn btn-primary me-2 saveButtonTheme${themes}`}
                  onClick={() => handleSave()}
                >
                  Save
                </Link>
                <Link
                  to="/superadmin/genericgrouplist"
                  className={`btn btn-primary saveButtonTheme${themes}`}
                >
                  Back
                </Link>
              </div>
            </CCardFooter>
          </CCard>
        </CCol>
      </form>
    </CRow>
  );
};

export default ImportOrgGroup;
