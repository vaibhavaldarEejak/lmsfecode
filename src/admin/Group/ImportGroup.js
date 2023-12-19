import React, { useEffect, useState, useRef } from "react";
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
import axios from "axios";
import * as xlsx from "xlsx";
import { Container } from "react-bootstrap";
import { Toast } from "primereact/toast";

const API_URL = process.env.REACT_APP_API_URL;

const ImportGroup = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const navigate = useNavigate();
  const [importFile, setImportFile] = useState(null);
  const [isloading, setLoading1] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const toast = useRef(null);
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
    link.href = `${process.env.PUBLIC_URL}/bulkGroups/BulkOrgGroupImportExcel.xlsx`;
    link.click();
  };

  const handleSave = (e) => {
    const formData = new FormData();

    if (!importFile) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "The group import file field is required.",
        life: 3000,
      });
    }

    formData.append("groupImportFile", importFile);
    setLoading1(true);
    axios
      .post(
        `${API_URL}/groupOrgImport`,
        {
          groupImportFile: importFile,
        },
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        if (response) {
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Groups Added Successfully",
            life: 3000,
          });
        }
        setTimeout(() => {
          navigate("/admin/grouplist");
        }, 3000);
      })

      .catch((error) => {
        setLoading1(false);
        let errorMessage = "An error occurred";

        if (error.response && error.response.data && error.response.data.errors) {
          const errors = error.response.data.errors;

          if (Array.isArray(errors)) {
            errorMessage = errors
              .map((error) => {
                const { rowNumber, groupName, parentGroupName } = error;
                const errorMessages = [];

                if (!groupName) {
                  errorMessages.push(`Row ${rowNumber}: Add Group Name`);
                } else {
                  errorMessages.push(`Row ${rowNumber}: Group Name - ${groupName}`);
                }
                if (parentGroupName) {
                  errorMessages.push(
                    `Row ${rowNumber}: Parent Group Name - ${parentGroupName}`
                  );
                }

                return errorMessages.join(", ");
              })
              .join("\n");
          }
        }

        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: errorMessage,
          life: 3000,
        });
      });
  }

  return (
    <CRow>
      <Toast ref={toast} />
      <form>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Import Bulk Groups</strong>
            </CCardHeader>
            <CCardBody className="card-body border-top p-9" style={{ paddingTop: '50px' }}>
              <CForm className="row g-15 needs-validation">
                <CRow className="mb-3">
                  <CCol md={8}>
                    <CRow className="mb-3 align-items-center">
                      <div className="col-sm-3">
                        <CFormLabel htmlFor="" className="fw-bolder fs-7">
                          Step 1
                        </CFormLabel>
                      </div>
                      <div className="col-sm-3">
                        <CFormLabel htmlFor="" className="fw-bolder fs-7">
                          Download Sample Excel
                        </CFormLabel>
                      </div>
                      <div className="col-sm-6 d-flex justify-content-end">
                        <Link className="btn btn-primary me-2" onClick={() => downloadXLS()}>
                          Download XLS
                        </Link>
                        <Link className="btn btn-primary" onClick={() => downloadXLS()}>
                          Download CSV
                        </Link>
                      </div>
                    </CRow>
                  </CCol>
                  <CCol md={8}>
                    <CRow className="mb-3 align-items-center">
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
                        Upload your Bulk Groups Data file here
                      </CFormLabel>
                      <div className="col-sm-4" style={{ marginLeft: '110px' }}>
                        <input
                          type="file"
                          name="fileInput"
                          className="form-control"
                          onChange={(e) => {
                            readExcel(e);
                            setImportFile(e.target.files[0]);
                          }}
                        />
                      </div>
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
                                <th>GroupName</th>

                                <th>Parent Group Name</th>

                                <th>Description</th>
                                <th>User Name</th>
                              </tr>
                            </thead>
                            <tbody>
                              {excelData.map((getdata, index) => (
                                <tr key={index}>
                                  <td>{getdata.groupName} </td>

                                  <td>{getdata.parentGroupName} </td>

                                  <td>{getdata.description} </td>
                                  <td>{getdata.username}</td>
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
                  to={`/admin/grouplist`}
                  className="btn btn-primary me-2"
                >
                  Back
                </Link>
                <Link
                  className="btn btn-primary me-2"
                  onClick={() => handleSave()}
                  disabled={isloading}
                >
                  {isloading && (
                    <span
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
                  Save
                </Link>
              </div>
            </CCardFooter>
          </CCard>
        </CCol>
      </form>
    </CRow>
  );
};

export default ImportGroup;
