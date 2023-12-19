import React, { useRef, useEffect, useState } from "react";
import {
    CCard,
    CCardBody,
    CFormCheck,
    CCardHeader,
    CCol,
    CRow,
    CNavItem,
    CNav,
    CBadge,
    CNavLink,
    CModal,
    CModalHeader,
    CModalBody,
    CModalFooter,
    CButton,
    CImage,
    CTabContent,
    CTabPane,
    CDropdown,
    CDropdownMenu,
    CDropdownItem,
    CDropdownToggle,
    CFormInput,
} from "@coreui/react";
import axios from "axios";
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Skeleton } from "primereact/skeleton";
import "./../../css/themes.css";
import { Accordion, AccordionTab } from 'primereact/accordion';
const API_URL = process.env.REACT_APP_API_URL;

const studentfaq = () => {

    const colorName = localStorage.getItem("ThemeColor");
    const [themes, setThemes] = useState(colorName);
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const token = "Bearer " + localStorage.getItem("ApiToken");
    const toast = useRef(null);
    const tableRef = useRef(null);
    const dt = useRef(null);
    const [loading, setLoading] = useState(true);

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    useEffect(() => {
        if (token !== "Bearer null") {
            getFaqList();
            initFilters();
        }
    }, []);

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            title: { value: null, matchMode: FilterMatchMode.CONTAINS },
            category: { value: null, matchMode: FilterMatchMode.CONTAINS },
            documentLink: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        });
        setGlobalFilterValue("");
    };

    const [responseData, setResponseData] = useState([]);

    const getFaqList = () => {
        setLoading(true);
        axios
            .get(`${API_URL}/getOrgFaqList`, {
                headers: { Authorization: token },
            })
            .then((response) => {
                setResponseData(response.data.data);
            })
            .catch((error) => {
                // Handle API call errors here if needed
                console.error("Error fetching FAQ list:", error);
            })
            .finally(() => {
                setLoading(false); // Set loading state to false after API call is completed (whether successful or not)
            });
    };

    const buttonTemplate = (responseData) => (
        <div style={{ display: "flex" }}>
            {/* <Link to={`/student/document/viewdocument?${responseData.documentId}`}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
            class={`bi bi-eye-fill iconTheme${themes}`}
            viewBox="0 0 16 16"
          >
            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
          </svg>
        </Link> */}

            <div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    style={{ margin: "0 0.5rem" }}
                    class={`bi bi-pencil-fill iconTheme${themes}`}
                    viewBox="0 0 16 16"
                >
                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                </svg>
            </div>
            <div style={{ marginRight: "5px" }}
                onClick={() => confirmDeleteProduct(responseData)}
            >

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="currentColor"
                    class={`bi bi-trash-fill iconTheme${themes}`}
                    viewBox="0 0 16 16"
                >
                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                </svg>
            </div>
            <div></div>
            <div
                // onClick={() => handleDownloadClick(responseData)}
                style={{ cursor: "pointer" }}
            >
                {" "}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    fill="currentColor"
                    class={`bi bi-download iconTheme${themes}`}
                    viewBox="0 0 16 16"
                >
                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                </svg>
            </div>
        </div>
    );


    const Deletedoc = (faqId) => {
        const token = "Bearer " + localStorage.getItem("ApiToken");

        const data = {
            documentLibraryId: faqId,
        };

        axios
            .delete(`${API_URL}/deleteDocumentLibraryById/${faqId}`, {
                headers: { Authorization: token },
                data: data,
            })
            .then((response) => {
                const filteredData = responseData.filter(
                    (item) => item.faqId !== faqId
                );
                setResponseData(filteredData);
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Document deleted successfully!",
                    life: 3000,
                });
            })
            .catch((error) => {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Error deleting Document",
                    life: 3000,
                });
            });

        setDeleteProductDialog(false);
    };


    const confirmDeleteProduct = (product) => {
        setSelectedProduct(product);
        setDeleteProductDialog(true);
    };
    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };
    const deleteProductDialogFooter = () => (
        <React.Fragment>
            <Button
                label="No"
                size="sm"
                icon="pi pi-times"
                outlined
                onClick={hideDeleteProductDialog}
            />
            <Button
                label="Yes"
                size="sm"
                icon="pi pi-check"
                severity="info"
                onClick={() => Deletedoc(selectedProduct.documentLibraryId)}
            />
        </React.Fragment>
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

    const statusShow = (responseData) => (
        <CBadge
            className={`badge badge-light-info text-info badgeColor${themes} `}
            color="light"
        >
            {responseData?.isActive === 1 ? "Active" : "In-Active"}
        </CBadge>
    );

    const titleFilterTemplate = (options) => {
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
    const categoryFilterTemplate = (options) => {
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
    const documentLinkFilterTemplate = (options) => {
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
    return (
        <div className="">
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-7">
                        <div>
                            <CCardHeader>
                                <CNav variant="tabs">
                                    <CNavItem>
                                        <Link
                                            style={{
                                                cursor: "pointer",
                                                textDecoration: "none",
                                            }}
                                            to={`/student/document`}
                                        >
                                            <CNavLink style={{ cursor: "pointer" }}>
                                                <strong> My Documents</strong>
                                            </CNavLink>{" "}
                                        </Link>
                                    </CNavItem>
                                    <CNavItem>
                                        <Link
                                            style={{ cursor: "pointer", textDecoration: "none" }}
                                            to={`/student/sfaq`}
                                        >
                                            <CNavLink active style={{ cursor: "pointer" }}>
                                                <strong>FAQ</strong>
                                            </CNavLink>{" "}
                                        </Link>
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
                                                {/* <div className="d-grid gap-2 d-md-flex">
                                                    <Link
                                                        to={`/superadmin/addfaq`}
                                                        className={`me-md-2 btn btn-info saveButtonTheme${themes}`}
                                                        title="Add New  FAQ"
                                                    >
                                                        +
                                                    </Link>
                                                </div> */}

                                            </div>
                                        </div>
                                    </CTabPane>
                                </CTabContent>
                            </CCardHeader>

                            <CCardBody>
                                {loading ? (
                                    // Show the skeleton loader while loading
                                    <div className="card">
                                        <div className="border-round border-1 surface-border p-4 surface-card">

                                            <Skeleton width="100%" height="40px"></Skeleton>
                                        </div>
                                        <div className="border-round border-1 surface-border p-4 surface-card" style={{ marginTop: '-25px' }}>

                                            <Skeleton width="100%" height="40px"></Skeleton></div>
                                        <div className="border-round border-1 surface-border p-4 surface-card" style={{ marginTop: '-25px' }}>

                                            <Skeleton width="100%" height="40px"></Skeleton></div>
                                        <div className="border-round border-1 surface-border p-4 surface-card" style={{ marginTop: '-25px' }}>

                                            <Skeleton width="100%" height="40px"></Skeleton></div>
                                        <div className="border-round border-1 surface-border p-4 surface-card" style={{ marginTop: '-25px' }}>

                                            <Skeleton width="100%" height="40px"></Skeleton></div>


                                    </div>
                                ) : responseData && responseData.length > 0 ? (
                                    // Display the Accordion if responseData is not null and has data
                                    <Accordion multiple activeIndex={[0]}>
                                        {responseData.map((item, index) => (
                                            <AccordionTab key={index} header={item.faqTitle}>
                                                <p className="m-0">{item.faqDescription ? item.faqDescription.replace(/<\/?p>/g, '') : ''}</p>
                                            </AccordionTab>
                                        ))}
                                    </Accordion>
                                ) : (
                                    // Show "No results found" if responseData is empty (no data)
                                    <div>No records found</div>
                                )}

                            </CCardBody>
                        </div>
                    </CCard>
                </CCol>
            </CRow>
        </div>
    );
};
export default studentfaq;
