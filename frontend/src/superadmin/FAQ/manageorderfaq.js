import React, { useRef, useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CNavItem,
  CNav,
  CBadge,
  CNavLink,
  CButton,
  CTabContent,
  CTabPane,
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
import generalDeleteApiCall from "src/server/generalDeleteApiCall";
import postApiCall from "src/server/postApiCall";
import "./../../css/themes.css";
const API_URL = process.env.REACT_APP_API_URL;

const faq = () => {
  const colorName = localStorage.getItem("ThemeColor"),
    [themes, setThemes] = useState(colorName),
    [filters, setFilters] = useState(null),
    [globalFilterValue, setGlobalFilterValue] = useState(""),
    [deleteProductDialog, setDeleteProductDialog] = useState(false),
    [selectedProduct, setSelectedProduct] = useState(null),
    [orderPayload, setOrderPayload] = useState({}),
    [shouldUpdateOrder, setShouldUpdateOrder] = useState(false),
    token = "Bearer " + localStorage.getItem("ApiToken"),
    toast = useRef(null),
    [loading, setLoading] = useState(true),
    [responseData, setResponseData] = useState([]),
    dt = useRef(null);

  useEffect(() => {
    if (token !== "Bearer null") {
      getFaqList();
      initFilters();
    }
  }, []);

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      faqTitle: { value: null, matchMode: FilterMatchMode.CONTAINS },
      category: { value: null, matchMode: FilterMatchMode.CONTAINS },
      documentLink: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });
    setGlobalFilterValue("");
  };

  const getFaqList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/getFaqList`, {
        headers: { Authorization: token },
      });
      setResponseData(response.data.data);
    } catch (error) {
      console.error("Error fetching FAQ list:", error);
    } finally {
      setLoading(false);
    }
  };

  const buttonTemplate = (responseData) => {
    const isFirst = isFirstItem(responseData);
    const isLast = isLastItem(responseData);
  
    return (
      <div style={{ display: "flex" }}>
        {!isFirst && (
          <div onClick={() => moveItemUp(responseData)} style={{ cursor: "pointer" }} title="Move Up">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
              <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
            </svg>
          </div>
        )}
        {!isLast && (
          <div onClick={() => moveItemDown(responseData)} style={{ cursor: "pointer" }} title="Move Down">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
            </svg>
          </div>
        )}
      </div>
    );
  };
  const moveItemUp = (itemToMove) => {
    const currentIndex = responseData.indexOf(itemToMove);
    if (currentIndex > 0) {
      const newOrder = { ...orderPayload };
      const newArray = [...responseData];
      const temp = newArray[currentIndex];
      newArray[currentIndex] = newArray[currentIndex - 1];
      newArray[currentIndex - 1] = temp;
      newArray.forEach((item, index) => {
        newOrder[item.faqId] = index + 1;
      });

      setResponseData(newArray);
      setOrderPayload(newOrder);
      setShouldUpdateOrder(true); // Set the flag to true
    }
  };

  const moveItemDown = (itemToMove) => {
    const currentIndex = responseData.indexOf(itemToMove);
    if (currentIndex < responseData.length - 1) {
      const newOrder = { ...orderPayload };
      const newArray = [...responseData];

      const temp = newArray[currentIndex];
      newArray[currentIndex] = newArray[currentIndex + 1];
      newArray[currentIndex + 1] = temp;
      newArray.forEach((item, index) => {
        newOrder[item.faqId] = index + 1;
      });

      setResponseData(newArray);
      setOrderPayload(newOrder);
      setShouldUpdateOrder(true);
    }
  };

  const updateOrder = async () => {
    if (shouldUpdateOrder) {
      try {
        const res = await postApiCall("faqOrder", { orders: orderPayload });
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Order Updated Successfully",
          life: 3000,
        });
      } catch (errors) {
        let errorMessage = "An error occurred";
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: errorMessage,
          life: 3000,
        });
      }

      setShouldUpdateOrder(false);
    }
  };

  const isFirstItem = (item) => {
    return responseData.indexOf(item) === 0;
  };

  const isLastItem = (item) => {
    return responseData.indexOf(item) === responseData.length - 1;
  };


  const Deletedoc = async (faqId) => {
    const data = {
      faqId: faqId,
    };
    try {
      const response = await generalDeleteApiCall(
        `deleteFaqById/${faqId}`,
        data
      );

      const filteredData = responseData.filter((item) => item.faqId !== faqId);
      setResponseData(filteredData);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "FAQ Deleted successfully!",
        life: 3000,
      });
      setDeleteProductDialog(false);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error deleting FAQ",
        life: 3000,
      });
    }
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
        onClick={() => Deletedoc(selectedProduct.faqId)}
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

  const catTemplate = (rowData) => {
    const categories = rowData.category;

    if (categories && categories.length > 0) {
      return categories.join(", ");
    }

    return null;
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
                    <CNavLink active style={{ cursor: "pointer" }}>
                      <strong>FAQ</strong>
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
                          <Link
                            to={`/superadmin/addfaq`}
                            className={`me-md-2 btn btn-info saveButtonTheme${themes}`}
                            title="Add New  FAQ"
                          >
                            +
                          </Link>
                          <CButton
                            className={`me-md-2 btn btn-info saveButtonTheme${themes}`}
                            title="Update order"
                            onClick={updateOrder} // Make sure the onClick is bound to the updateOrder function
                          >
                            Update order
                          </CButton>
                        </div>
                      </div>
                    </div>
                  </CTabPane>
                </CTabContent>
              </CCardHeader>

              <CCardBody>
                <CCardBody>
                  <Toast ref={toast} />
                  <div className="">
                    {loading ? (
                      <div
                        className={`card tableThemeColor${themes} InputThemeColor${themes}`}
                      >
                        <DataTable
                          value={items}
                          showGridlines
                          className="p-datatable-striped"
                        >
                          <Column
                            field="faqTitle"
                            header="Name"
                            style={{ width: "25%" }}
                            body={bodyTemplate}
                          ></Column>
                          <Column
                            field="category"
                            header="Category"
                            style={{ width: "25%" }}
                            body={bodyTemplate}
                          ></Column>
                          <Column
                            field="isActive"
                            header="Status"
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
                          responsiveLayout="scroll"
                          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                          rows={10}
                          rowsPerPageOptions={[10, 20, 50]}
                          dataKey="faqId"
                          filters={filters}
                          filterDisplay="row"
                          globalFilterFields={[
                            "faqTitle",
                            "faqId",
                            "category",
                            "faqLink",
                            "isActive",
                          ]}
                        >
                          <Column
                            field="faqTitle"
                            header="Name"
                            sortable
                            showFilterMenu={false}
                            filter
                            filterElement={titleFilterTemplate}
                            filterPlaceholder="Search"
                          ></Column>
                          <Column
                            body={catTemplate}
                            field="category"
                            header="Category"
                            sortable
                            showFilterMenu={false}
                            filter
                            filterElement={categoryFilterTemplate}
                            filterPlaceholder="Search"
                          ></Column>

                          <Column
                            body={statusShow}
                            field="isActive"
                            header="Status"
                          ></Column>
                          <Column
                            field="Action"
                            header="Action"
                            body={buttonTemplate}
                          ></Column>
                        </DataTable>
                      </div>
                    )}

                    <Dialog
                      visible={deleteProductDialog}
                      style={{ width: "32rem" }}
                      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
                      header="Confirm"
                      modal
                      footer={deleteProductDialogFooter}
                      onHide={hideDeleteProductDialog}
                    >
                      <div className="confirmation-content">
                        <i
                          className="pi pi-exclamation-triangle me-3 mt-2"
                          style={{ fontSize: "1.5rem" }}
                        />
                        <span>Are you sure you want to delete ?</span>
                      </div>
                    </Dialog>
                  </div>
                </CCardBody>
              </CCardBody>
            </div>
            <div className="card-header border-0 d-flex align-items-right flex-row-reverse" >
              <div className="d-flex row align-items-center" style={{ marginRight: "20px" }}>
                <div className="col-md-6 col-xxl-6">
                  <Link to="/superadmin/sfaq">
                    <CButton
                      className={`me-md-2 btn btn-info saveButtonTheme${themes}`}
                      onClick={(e) => {
                        localStorage.removeItem("faqId");
                      }}
                    >
                      Back
                    </CButton>
                  </Link>
                </div>
              </div>
            </div>

          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};
export default faq;
