import React, { useEffect, useState, useRef, useMemo } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CRow,
  CFormSelect,
  CFormSwitch,
  CForm,
  CCardFooter,
  CFormCheck,
  CButton,
  CFormTextarea,
  CImage,
  CInputGroup,
  CInputGroupText,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import "../../scss/required.scss";
import { useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { Toast } from "primereact/toast";
import axios from "axios";
import { Toolbar } from "primereact/toolbar";
import { Tooltip } from "primereact/tooltip";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputCustomEditor } from "../../superadmin/CourseLibrary/EditorBox/InputCustomEditor";
import * as pdfjsLib from "pdfjs-dist";
import getApiCall from "src/server/getApiCall";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
const API_URL = process.env.REACT_APP_API_URL;
import { ProgressBar } from "primereact/progressbar";
import postApiCall from "src/server/postApiCall";
const AddElearningCourseCatalog = () => {
  const [loadPage, setLoadPage] = useState(false);
  const toast = useRef(null);
  let filteredData = [];
  let fileTypesAllowed = [];

  const [activeIndex1, setActiveIndex1] = useState(0);
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const [courseCode, setCourseCode] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryListing, setCategoryListing] = useState([]);
  const [trainingListing, settrainingListing] = useState([]);
  const [certificateListing, setcertificateListing] = useState([]);
  const [learningDetails, setlearningDetails] = useState([]);
  const [trainingId, settrainingId] = useState();

  // const trainingId = window.location.href.split("?")[1];
  let trainingId1 = "";
  useEffect(() => {
    trainingId1 = localStorage.getItem("courseLibraryId");
    settrainingId(trainingId1);
  }, []);
  const assignid = window.location.href.split("?")[2];
  const [validationMessages, setValidationMessages] = useState({});
  const [showValidationMessages, setShowValidationMessages] = useState(false);
  const [imgData, setImgData] = useState(null);
  const [isSecondTabDisabled, setIsSecondTabDisabled] = useState(true);
  const [isThirdTabDisabled, setIsThirdTabDisabled] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(0);
  const [cat, setCat] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [mediaPayload, setMediaPayload] = useState([]);
  const [isloading, setLoading1] = useState(false);
  const [handoutData, setHandoutData] = useState([]);
  const [contentTypesId, setContentTypesId] = useState();
  const [courseType, setCourseType] = useState();
  const [isUploadMode, setIsUploadMode] = useState(0);
  const [fileFormat, setfileFormat] = useState([]);
  const onChangePicture = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgData(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setImgData(null);
    }
  };

  const navigate = useNavigate();
  const [form, setForm] = useState({
    trainingType: 1,
    courseTitle: "",
    description: "",
    category: [],
    trainingContent: 0,
    referenceCode: "",
    credit: "",
    creditVisibility: 0,
    point: "",
    pointVisibility: 0,
    certificate: "",
    isActive: 1,
    mediaUrl: null,
    media: [],
    passingScore: 0,
    sslForAicc: "",
    status: 0,
    courseImage: "",
    handout: [],
    video: null,
    expirationTime: "",
    expirationLength: "",
    hours: 0,
    customFields: "",
    minutes: 0,
  });

  const [mediaFile, setMediaFile] = useState();
  const [formLoading, setFormLoading] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    if (!trainingId && (!form.referenceCode || isNaN(form.referenceCode))) {
      setCourseCode(generateRandomCourseId());
    }
  }, [form.referenceCode, trainingId]);

  useEffect(() => {
    categoryList();
  }, []);

  useEffect(() => {
    if (token !== "Bearer null") {
      getCourseListing();
      categoryList();
      trainingList();
      certificateList();
      getStatusList();
      MediaOptionList();
      initFilters();
    }
    setForm({
      ...form,
      category: null,
      pointVisibility: 0,
      description: "",
    });
  }, []);

  const addELearning = (form) => {
    setLoading1(true);
    axios
      .post(`${API_URL}/addCourseCatalog`, form, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response) {
          if (contentTypesId == 3 || contentTypesId == 9) {
            uploadChunk();
          } else {
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Course Added Successfully",
              life: 3000,
            });

            setTimeout(() => {
              navigate("/admin/trainingLibraryInternal");
            }, 3000);
          }
        }
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error Adding Course",
          life: 3000,
        });
      });
  };
  const [newCustomField, setNewCustomField] = useState();

  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const clearFilter = () => {
    initFilters();
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue("");
  };

  const [checkedMediaOptionListing, setcheckedMediaOptionListing] = useState(
    []
  );

  // const getCourseListing = () => {
  //   setFormLoading(true);
  //   axios
  //     .get(`${API_URL}/getCourseCatalogList`, {
  //       headers: { Authorization: token },
  //     })
  //     .then((response) => {
  //       if (!trainingId) {
  //         if (
  //           (response.data.data.length > 0 &&
  //             response.data.data[0].referenceCode === null) ||
  //           response.data.data.length === 0
  //         ) {
  //           setForm({
  //             ...form,
  //             referenceCode: 100001,
  //             sslForAicc: `0`,
  //           });
  //         } else {
  //           setForm({
  //             ...form,
  //             referenceCode: parseInt(response.data.data[0].referenceCode) + 1,
  //             sslForAicc: `0`,
  //           });
  //         }
  //       }
  //     });
  // };
  const getCourseListing = async () => {
    try {
      const res = await getApiCall("getCourseCatalogList");
      if (!trainingId) {
        if (
          (res.length > 0 && res[0].referenceCode === null) ||
          res.length === 0
        ) {
          setForm({
            ...form,
            referenceCode: 100001,
          });
        } else {
          setForm({
            ...form,
            referenceCode: parseInt(res[0].referenceCode) + 1,
          });
        }
      }
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

  const getCourseDetailApi = (trainingId) => {
    // let url = "";
    // if (assignid === "") {
    //   url = `${API_URL}/getCourseCatalogById/${trainingId}`;
    // } else {
    //   url = `${API_URL}/getCourseLibraryById/${trainingId}`;
    // }
    axios
      .get(`${API_URL}/getCourseCatalogById/${trainingId}`, {
        headers: { Authorization: token },
      })
      .then((res) => {
        setlearningDetails(res.data.data);
        setImgData(res.data.data.imageUrl);
        // sethandoutData(res.data.data.handoutUrl);
        setCat(
          res.data.data.category.map((item) => ({
            value: item.categoryId,
            label: item.categoryName,
          }))
        );
        setHandoutData(
          res.data.data.handouts.map((e) => ({
            name: e.name,
            blob: e.blob,
            format: e.format,
          }))
        );
        setcheckedMediaOptionListing(
          res.data.data.trainingMedia.map((mediaData) => ({
            mediaId: mediaData.mediaId,
            mediaName: mediaData.mediaName,
            mediaType: mediaData.mediaType,
            mediaSize: mediaData.mediaSize,
          }))
        );
      })

      .catch((err) => {});
  };

  useEffect(() => {
    if (trainingId) {
      getCourseDetailApi(Number(trainingId));
    }
  }, [trainingId]);

  //Category list api

  //training
  const [loading, setLoading] = useState(false);
  const trainingList = () => {
    axios
      .get(`${API_URL}/getContentTypeList`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setLoading(true);
        settrainingListing(response.data.data);
      });
  };

  //certificate

  const certificateList = () => {
    axios
      .get(`${API_URL}/getOrgCertificateOptionList`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setcertificateListing(response.data.data);
      });
  };

  //Status

  const [statusListing, setStatusListing] = useState([]);

  const getStatusList = () => {
    axios
      .get(`${API_URL}/getTrainingStatusList`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setStatusListing(response.data.data);
        if (response.data.data.length > 0) {
          setForm({
            ...form,
            status: response.data.data[0].trainingStatusId,
          });
        }
      });
  };

  //category
  const categoryList = async () => {
    try {
      const res = await getApiCall("getOrganizationCategoryOptionList");
      setCategoryListing(
        res.map((e) => ({
          label: e.categoryName,
          value: e.categoryId,
        }))
      );
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

  const addCategoryApi = async (text) => {
    const data = { categoryName: text };
    try {
      const res = await postApiCall("addOrganizationCategory", data);
      categoryList();
      if (form.category == null) {
        setForm({
          ...form,
          category: [
            {
              value: res,
              label: text,
            },
          ],
        });
      } else {
        setForm({
          ...form,
          category: [
            ...form.category,
            {
              value: res,
              label: text,
            },
          ],
        });
      }
    } catch (err) {
      setLoading1(false);
      var errMsg = err?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
    }
  };

  const handleCreateCategory = (value) => {
    addCategoryApi(value);
  };

  const handleChangeCategory = (value) => {
    setForm({ ...form, category: value });
  };
  //Media

  const [MediaOptionListing, setMediaOptionListing] = useState([]);
  const MediaOptionList = () => {
    setFormLoading(true);
    axios
      .get(`${API_URL}/getMediaOptionList `, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setMediaOptionListing(
          response.data.data.map((mediaData) => ({
            mediaId: mediaData.mediaId,
            mediaName: mediaData.mediaName,
            mediaType: mediaData.mediaType,
            mediaSize: mediaData.mediaSize,
            checked: 0,
          }))
        );
        setFormLoading(false);
      });
  };

  const uploadChunk = async () => {
    try {
      const chunkSize = 1024 * 1024; // 1MB chunk size
      const fileSize = mediaFile?.size;
      const totalChunks = Math.ceil(fileSize / chunkSize);

      const fileName = mediaFile?.name.split(".")[0];
      const uniqueFileName = `${fileName}`;
      const withoutWhitespaces = uniqueFileName.replace(/\s/g, "");

      const formData = new FormData();
      formData.append("fileName", withoutWhitespaces);
      formData.append("totalChunks", totalChunks);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://18.190.114.28:3000/uploadChunk");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setValue1(progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          navigate("/admin/trainingLibraryInternal");
          if (trainingId) {
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Course Updated Successfully",
              life: 3000,
            });
          } else {
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Course Added Successfully",
              life: 3000,
            });
          }

          navigate("/admin/trainingLibraryInternal");
          // response = true;
        } else {
          console.error("Error uploading file:", xhr.statusText);

          // response = false;
        }
      };

      xhr.onerror = () => {
        console.error("Network error occurred while uploading the file.");
        // responseStatus = false;
      };
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(fileSize, start + chunkSize);
        const chunkBlob = mediaFile?.slice(start, end);

        const reader = new FileReader();
        reader.onload = function () {
          const chunkArrayBuffer = reader.result;
          formData.append("chunkData", new Blob([chunkArrayBuffer]));
          if (i === totalChunks - 1) {
            xhr.send(formData);
          }
        };

        reader.readAsArrayBuffer(chunkBlob);
      }
      navigate("/admin/trainingLibraryInternal");
    } catch (error) {
      navigate("/admin/trainingLibraryInternal");
      console.log("error", error);
    }
  };

  function handleCheckboxChange(e) {
    const selectedRows = e.value;

    setSelectedMedia(selectedRows);
    const updatedRows = MediaOptionListing.map((row) => {
      const isChecked = selectedRows && selectedRows.mediaId === row.mediaId;

      return { ...row, checked: isChecked ? 1 : 0 };
    });

    setMediaPayload(
      updatedRows.map((item) => ({
        mediaId: item.mediaId,
        checked: item.checked,
      }))
    );
  }
  const validateForm = (e) => {
    const messages = {};
    let isValid = true;

    if (!form.courseTitle) {
      messages.courseTitle = "Training Title is required";
      isValid = false;
    } else {
      messages.courseTitle = "";
    }

    // if (!form.referenceCode) {
    //   messages.referenceCode = "Course ID is required";
    //   isValid = false;
    // } else {
    //   messages.referenceCode = "";
    // }

    if (!form.category) {
      messages.category = "Categories is required";
      isValid = false;
    } else {
      messages.category = "";
    }

    if (!form.trainingContent && !form.contentTypesId) {
      messages.trainingContent = "Training Content is required";
      isValid = false;
    } else {
      messages.trainingContent = "";
    }
    if (!form.certificate) {
      messages.certificate = "Certificate is required";
      isValid = false;
    } else {
      messages.certificate = "";
    }

    if (!trainingId) {
      if (!form.courseImage) {
        messages.courseImage = "Training Image is required";
        isValid = false;
      } else {
        messages.courseImage = "";
      }
    }

    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };

  const validateForm2 = (e) => {
    const messages = {};
    let isValid = true;

    if (!trainingId) {
      // if (!form.video) {
      //   messages.video = "Media is required";
      //   isValid = false;
      // } else {
      //   messages.video = "";
      // }
    }

    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };
  //media checkbox
  const validateForm3 = (e) => {
    const messages = {};
    let isValid = true;
    if (!form.status) {
      messages.status = "Status is required";
      isValid = false;
    } else {
      messages.status = "";
    }

    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };
  const handleAddNew = (e) => {
    if (validateForm3()) {
      let formData = new FormData();
      formData.append("trainingType", 1);
      formData.append("courseTitle", form.courseTitle);
      formData.append("mediaUrl", form.mediaUrl);
      formData.append("description", form.description);
      formData.append(
        "category",
        form.category.map((e) => e.value)
      );
      formData.append("trainingContent", form.trainingContent);
      formData.append("referenceCode", form.referenceCode);
      formData.append("credit", parseFloat(form.credit));
      formData.append(
        "creditVisibility",
        form.creditVisibility === undefined ? 0 : form.creditVisibility
      );
      formData.append("point", form.point);
      formData.append(
        "pointVisibility",
        form.pointVisibility === undefined ? 0 : form.pointVisibility
      );
      formData.append("certificate", form.certificate);
      formData.append("isActive", 1);
      formData.append("passingScore", form.passingScore);
      formData.append("sslForAicc", form.sslForAicc);
      formData.append("status", form.status);
      let media = JSON.stringify(selectedMedia.mediaId);
      formData.append("media", media);
      formData.append(
        "courseImage",
        form.courseImage === undefined ? "" : form.courseImage
      );

      for (let i = 0; i < uploadedFiles.length; i++) {
        formData.append("handouts[]", uploadedFiles[i]);
      }
      formData.append("video", form.video);
      formData.append("isEnrolled", isEnrolled);
      formData.append("courseType", courseType);
      formData.append("expirationTime", form.expirationTime);
      formData.append("expirationLength", form.expirationLength);
      formData.append("hours", form.hours || "");
      formData.append("minutes", form.minutes || "");
      const fileName = form.video?.name?.split(".")[0];
      const uniqueFileName = `${fileName}`;
      const withoutWhitespaces = uniqueFileName.replace(/\s/g, "");
      formData.append("fileName", withoutWhitespaces);
      formData.append(
        "customFields",
        form.customFields ? JSON.stringify(form.customFields) : ""
      );
      if (formData) {
        addELearning(formData);
      }
    }
  };

  const handleContentTypeChange = (value) => {
    setContentTypesId(value);

    if (value == 0) {
    } else {
      fileTypesAllowed = trainingListing.filter(
        (e) => e.contentTypesId === value
      )[0]?.supportFormats;
      if (fileTypesAllowed) {
        fileTypesAllowed = fileTypesAllowed.replaceAll("|", ",");
        setfileFormat(fileTypesAllowed.split(","));
      }

      setForm((prevState) => ({
        ...prevState,
        trainingContent: value,
      }));
    }
  };

  const [value1, setValue1] = useState(0);

  useMemo(() => {
    if (learningDetails) {
      setForm({
        trainingType: learningDetails.trainingType,
        courseTitle: learningDetails.courseTitle,
        mediaUrl: learningDetails.mediaUrl,
        description: learningDetails.description || "",
        category: cat && cat.map((e) => ({ label: e.label, value: e.value })),
        trainingContent: learningDetails.contentTypesId,
        referenceCode: learningDetails.referenceCode,
        credit: learningDetails.credits,
        creditVisibility: learningDetails.creditsVisible,
        point: learningDetails.points,
        pointVisibility: learningDetails.pointVisibility,
        certificate: learningDetails.certificateId,
        isActive: learningDetails.isActive,
        passingScore: learningDetails.passingScore,
        sslForAicc: `${learningDetails.sslOnOff}`,
        status: learningDetails.trainingStatusId,
        courseImage: learningDetails.courseImage,
        handout: learningDetails.handout,
        expirationLength: learningDetails.expirationLength,
        expirationTime: learningDetails.expirationTime,
        hours: learningDetails.hours,
        minutes: learningDetails.minutes,
        customFields: learningDetails.customFields,
      });
      setContentTypesId(learningDetails.contentTypesId);
      setCourseType(learningDetails.courseType);
      setIsEnrolled(learningDetails.isEnrolled);
      handleContentTypeChange(learningDetails.contentTypesId);

      // handleContentTypeChange(2);
    }
  }, [learningDetails]);

  function handleTabChange(e) {
    setIsUploadMode(e.index);
  }

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <TabView activeIndex={isUploadMode} onTabChange={handleTabChange}>
          <TabPanel header="Upload New Media">
            {/* <Button
              label="Upload New Media"
              icon="pi pi-plus"
              severity="success"
              className="me-3"
            /> */}
          </TabPanel>
          <TabPanel header="Select Media From List">
            {/* <Button
              label="Select Media From List"
              icon="pi pi-check-circle"
              severity="info"
              // disabled={disabled}
            /> */}
          </TabPanel>
        </TabView>
      </div>
    );
  };
  useMemo(() => {
    handleContentTypeChange(parseInt(contentTypesId));
  }, [trainingId, contentTypesId, loading]);

  const handleUpdate = (e) => {
    if (validateForm3()) {
      e.preventDefault();
      let formData = new FormData();
      formData.append("trainingId", trainingId);
      formData.append("trainingType", 1);
      formData.append("courseTitle", form.courseTitle);
      formData.append("mediaurl", form.mediaUrl);
      formData.append("description", form.description);
      formData.append(
        "category",
        form.category && form.category.map((e) => e.value)
      );
      formData.append("trainingContent", form.trainingContent);
      formData.append("referenceCode", form.referenceCode);
      formData.append("credit", parseFloat(form.credit));
      formData.append(
        "creditVisibility",
        form.creditVisibility === undefined ? 0 : form.creditVisibility
      );
      formData.append("point", form.point);
      formData.append(
        "pointVisibility",
        form.pointVisibility === undefined ? 0 : form.pointVisibility
      );
      formData.append("certificate", form.certificate);
      formData.append("isActive", 1);
      formData.append("passingScore", form.passingScore);
      formData.append("sslForAicc", form.sslForAicc);
      formData.append("status", form.status);
      let media = JSON.stringify(selectedMedia.mediaId);
      formData.append("media", media);
      formData.append(
        "courseImage",
        form.courseImage === undefined ? "" : form.courseImage
      );
      for (let i = 0; i < uploadedFiles.length; i++) {
        formData.append("handouts[]", uploadedFiles[i]);
      }
      formData.append("isEnrolled", isEnrolled);
      formData.append("courseType", courseType);
      formData.append("expirationTime", form.expirationTime);
      formData.append("expirationLength", form.expirationLength);
      formData.append("hours", form.hours);
      formData.append("minutes", form.minutes);

      formData.append("video", form.video);
      formData.append(
        "customFields",
        JSON.stringify(newCustomField?.customField) || ""
      );

      const fileName = form.video?.name?.split(".")[0];
      const uniqueFileName = `${fileName}`;
      const withoutWhitespaces = uniqueFileName.replace(/\s/g, "");
      formData.append("fileName", withoutWhitespaces);
      if (formData) {
        setLoading1(true);
        axios
          .post(`${API_URL}/updateCourseCatalog/?_method=PUT`, formData, {
            headers: { Authorization: token },
          })
          .then((response) => {
            if (response) {
              if (contentTypesId == 3 || contentTypesId == 9) {
                uploadChunk();
              } else {
                toast.current.show({
                  severity: "success",
                  summary: "Successful",
                  detail: "Course Updated Successfully",
                  life: 3000,
                });

                setTimeout(() => {
                  navigate("/admin/trainingLibraryInternal");
                }, 3000);
              }
              localStorage.removeItem("courseLibraryId");
            }
          })
          .catch((error) => {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Error Updating Course",
              life: 3000,
            });
          });
      }
    }
  };

  const [totalSize, setTotalSize] = useState(0);

  const itemTemplate = (file, props) => {
    const fileName = file.name;
    const lastDotIndex = fileName.lastIndexOf(".");
    const ext = fileName.substring(lastDotIndex);
    if (fileFormat.includes(ext)) {
      return (
        <div className="d-flex align-items-center flex-wrap">
          <div className="d-flex align-items-center" style={{ width: "40%" }}>
            <img role="presentation" src={file.objectURL} width={100} />
            <span className="d-flex flex-column text-left ml-3">
              {file.name}
              <small>{new Date().toLocaleDateString()}</small>
            </span>
            <Tag value={"Success"} severity="success" className="mx-auto" />
          </div>

          <Button
            type="button"
            icon="pi pi-times"
            className="p-button-outlined p-button-rounded p-button-danger mx-auto"
            onClick={() => onTemplateRemove(file, props.onRemove)}
          />
        </div>
      );
    }
  };

  const onTemplateRemove = (file, callback) => {
    setForm({ ...form, video: "" });
    setTotalSize(totalSize - file.size);
    callback();
  };

  const header = (
    <div className="card-header border-0 d-flex justify-content-between">
      <div className="d-flex row align-items-center">
        <div className="col-md-12 col-xxl-12">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              style={{ height: "40px" }}
              className="p-input-sm"
            />
          </span>
        </div>
      </div>
    </div>
  );
  const headerTemplate = (options) => {
    const { className, chooseButton } = options;

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
      </div>
    );
  };

  const onSelect = (e) => {
    const fileName = e.files[0].name;
    const lastDotIndex = fileName.lastIndexOf(".");
    const ext = fileName.substring(lastDotIndex);

    if (fileFormat.includes(ext)) {
      setForm({
        ...form,
        video: e.files[0],
      });

      setMediaFile(e.files[0]);
      // extractZip(e.files[0]);
      setValidationMessages({
        ...validationMessages,
        video: e.files[0] ? "" : "Media is required",
      });
    } else {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Select Files of" + fileFormat,
        life: 3000,
      });
      return false;
    }
  };
  const emptyTemplate = () => {
    return (
      <div className="text-center">
        <div className="d-flex flex-column align-items-center">
          <i
            className="pi pi-image mt-3 p-5"
            style={{
              fontSize: "5em",
              borderRadius: "50%",
              backgroundColor: "var(--surface-b)",
              color: "var(--surface-d)",
            }}
          ></i>
          <span
            style={{
              fontSize: "1.2em",
              color: "var(--text-color-secondary)",
              marginTop: "1em",
            }}
          >
            Drag and Drop File Here
          </span>
        </div>
      </div>
    );
  };

  filteredData = MediaOptionListing.filter((item) =>
    fileFormat.map((ext) => ext.substring(1)).includes(item.mediaType)
  );

  //Generate CourseID

  const [num, setNum] = useState(0);

  const generateRandomCourseId = () => {
    return randomNumberInRange(100001, 999999);
  };

  function randomNumberInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const handleClick = () => {
    form.referenceCode = randomNumberInRange(889666, 897666);
    setNum(randomNumberInRange(1, 5));
  };

  const handleNextButtonInFirstTabClick = () => {
    if (validateForm()) {
      setActiveIndex1(1);
      setIsSecondTabDisabled(false);
    }
  };
  const handleNextButtonInSecondTabClick = () => {
    if (validateForm2()) {
      setActiveIndex1(2);

      if (contentTypesId == 3 || contentTypesId == 9) {
        setIsThirdTabDisabled(true);
      } else {
        setIsThirdTabDisabled(false);
      }
    }
  };

  const arr = [];
  const fileObjects = [];
  const handleHandoutChange = (e) => {
    const files = e.target.files;
    // setFile(files);

    if (files.length > 0) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
        "application/msword",
        "application/vnd.ms-powerpoint",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileType = file.type;
        const fileName = file.name;

        if (!allowedTypes.includes(fileType)) {
          alert("Please select a valid file type.");
          return;
        }

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onloadend = () => {
          const res = reader.result;
          if (fileType === "application/pdf") {
            loadPDF(URL.createObjectURL(file));
          } else if (
            fileType ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            fileType ===
              "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
            fileType ===
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            fileType === "application/msword" ||
            fileType === "application/vnd.ms-powerpoint" ||
            fileType === "application/vnd.ms-excel"
          ) {
            arr.push({ name: fileName, blob: "", format: "doc" });
            setHandoutData([...arr]);
          } else {
            // console.log(res);
            // arr.push(res);
            arr.push({ blob: reader.result, format: "img" });
            setHandoutData([...arr]);
          }

          fileObjects.push(file);
          // setForm({
          //   ...form,
          //   handout: e.target.files,
          // });
        };
      }
    }
  };

  const handleUploadFiles = (files) => {
    const uploaded = [...uploadedFiles];
    let limitExceeded = false;
    files.some((file) => {
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);
      }
    });
    if (!limitExceeded) setUploadedFiles(uploaded);
  };

  const handleFileEvent = (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
    handleHandoutChange(e);
  };

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const prevHandout = () => {
    setCurrentQuestion(currentQuestion - 1);
    if (0 === currentQuestion) {
      alert("No More Handouts");
      setCurrentQuestion(currentQuestion);
    }
  };

  const nextHandout = () => {
    setCurrentQuestion(currentQuestion + 1);
    if (currentQuestion >= handoutData.length - 1) {
      alert("No More Handouts");
      setCurrentQuestion(currentQuestion);
    }
  };

  function renderPage(page) {
    let imgData = "";
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
      imgData = canvas.toDataURL("image/png");
      arr.push({ blob: imgData, format: "pdf" });
      setHandoutData([...arr]);
      // handoutData.push(imgData);
    });
  }

  function loadPDF(url) {
    pdfjsLib.getDocument(url).promise.then((pdf) => {
      pdf.getPage(1).then((page) => {
        renderPage(page);
      });
    });
  }

  const [pdfPrev, setPdfPrev] = useState(null);

  async function loadPreview(url) {
    try {
      if (url) {
        const extension = url
          .substring(url.lastIndexOf("."))
          .substring(1)
          .toLowerCase();

        if (extension === "pdf") {
          const pdf = await pdfjsLib.getDocument(url).promise;
          const page = await pdf.getPage(1);

          const canvas = document.createElement("canvas");
          const viewport = page.getViewport({ scale: 1 });
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const context = canvas.getContext("2d");

          const renderTask = page.render({
            canvasContext: context,
            viewport: viewport,
          });

          await renderTask.promise;

          const imgData = canvas.toDataURL("image/png");
          setPdfPrev(imgData);
        } else {
          console.error("Invalid file type. Please select a PDF document.");
        }
      }
    } catch (error) {
      console.error("Error loading PDF:", error);
    }
  }

  const handoutPreview = (arr, idx) => {
    if (
      arr[idx]?.format === "docx" ||
      arr[idx]?.format === "pptx" ||
      arr[idx]?.format === "xlsx" ||
      arr[idx]?.format === "doc" ||
      arr[idx]?.format === "ppt" ||
      arr[idx]?.format === "xls"
    ) {
      return (
        <span
          style={{
            objectFit: "contain ",
            width: "300px",
            height: "200px",
            marginTop: "10px",
            marginLeft: "25%",
          }}
        >
          {arr[idx]?.name}
        </span>
      );
    } else if (arr[idx]?.format === "pdf") {
      const ig = loadPreview(arr[idx]?.blob);
      // console.log(ig);

      if (pdfPrev) {
        return (
          <img
            style={{
              objectFit: "contain ",
              width: "300px",
              height: "200px",
              marginTop: "10px",
              marginLeft: "25%",
            }}
            src={ig}
            alt="Handout Preview"
          ></img>
        );
      } else {
        return (
          <img
            style={{
              objectFit: "contain ",
              width: "300px",
              height: "200px",
              marginTop: "10px",
              marginLeft: "25%",
            }}
            src={arr[idx]?.blob}
            alt="Handout Preview"
          ></img>
        );
      }
    } else {
      return (
        <img
          style={{
            objectFit: "contain ",
            width: "300px",
            height: "200px",
            marginTop: "10px",
            marginLeft: "25%",
          }}
          src={arr[idx]?.blob}
          alt="Handout Preview"
        ></img>
      );
    }
  };
  const [customField, setCustomField] = useState([]);

  const getUserCustomFields = async () => {
    try {
      const res = await getApiCall("getTrainingCustomFieldList/1");
      setCustomField(res);
    } catch (err) {}
  };

  useEffect(() => {
    if (!trainingId) getUserCustomFields();
  }, []);

  const addCustomFields = (inputTextArr1) => {
    return inputTextArr1?.map((field, idx) => {
      if (field.customFieldType === "Dropdown") {
        return (
          <CCol md={6}>
            <CRow className="mb-3 ">
              <CFormLabel
                htmlFor=""
                className="col-sm-4 col-form-label fw-bolder fs-7"
              >
                {field.labelName}
              </CFormLabel>
              <div className="col-sm-7 ">
                <select
                  className="form-select"
                  onChange={(e) => {
                    onChanges(parseInt(e.target.value), idx);
                  }}
                  name={field.fieldName}
                  aria-label="select example"
                >
                  <option value={""}>Select</option>

                  {field.customNumberOfFields?.map((option, index) => {
                    return (
                      <option
                        name={option?.id}
                        value={option?.id}
                        selected={option.selected === "1"}
                        key={index}
                      >
                        {option.labelName}
                      </option>
                    );
                  })}
                </select>
              </div>
            </CRow>
          </CCol>
        );
      } else if (field.customFieldType === "Checkbox") {
        return (
          <CCol md={6}>
            <CRow className="mb-3 ">
              <CFormLabel
                htmlFor=""
                className="col-sm-4 col-form-label fw-bolder fs-7"
              >
                {field.labelName}
              </CFormLabel>
              <div
                className="col-sm-7 d-flex align-items-center"
                style={{ gap: "0.5rem" }}
              >
                {field.customNumberOfFields?.map((option, index) => {
                  return (
                    <>
                      <input
                        type="checkbox"
                        name={field.fieldName}
                        value={option[index]}
                        key={index}
                        checked={
                          field.selectedValue
                            ? option.id === field.selectedValue
                            : option.customFieldValue
                        }
                        onChange={(e) => {
                          onChanges(option.id, idx, e.target.checked);
                        }}
                      />
                      <label
                        for="html"
                        style={{
                          fontSize: "0.85rem",
                          paddingRight: " 0.5rem",
                          paddingTop: "0.2rem",
                        }}
                      >
                        {option.labelName}
                      </label>
                      <br></br>
                      {option[index]}
                    </>
                  );
                })}
              </div>
            </CRow>
          </CCol>
        );
      } else if (field.customFieldType === "Radio Button") {
        return (
          <CCol md={6}>
            <CRow className="mb-3 ">
              <CFormLabel
                htmlFor=""
                className="col-sm-4 col-form-label fw-bolder fs-7"
              >
                {field.labelName}
              </CFormLabel>
              <div
                className="col-sm-7 d-flex align-items-center"
                style={{ gap: "0.5rem" }}
              >
                {field.customNumberOfFields?.map((option, index) => {
                  return (
                    <>
                      <input
                        type="radio"
                        name={field.fieldName}
                        value={option[index]}
                        key={index}
                        checked={
                          field.selectedValue
                            ? option.id === field.selectedValue
                            : option.checked
                        }
                        onChange={(e) => {
                          onChanges(option.id, idx, e.target.checked);
                        }}
                      />
                      <label
                        for="html"
                        style={{
                          fontSize: "0.85rem",
                          paddingRight: " 0.5rem",
                          paddingTop: "0.2rem",
                        }}
                      >
                        {option.labelName}
                      </label>
                      <br></br>
                      {option[index]}
                    </>
                  );
                })}
              </div>
            </CRow>
          </CCol>
        );
      } else if (field.customFieldType === "Text") {
        return (
          <CCol md={6}>
            <CRow className="mb-3 ">
              <CFormLabel
                htmlFor=""
                className="col-sm-4 col-form-label fw-bolder fs-7"
              >
                {field.labelName}
              </CFormLabel>
              <div className="col-sm-7">
                <CFormInput
                  name={field.fieldName}
                  placeholder={field.labelName}
                  value={field.customFieldValue}
                  type="text"
                  onChange={(e) => {
                    onChangesText(field.id, e.target.value, idx);
                  }}
                />
              </div>
            </CRow>
          </CCol>
        );
      } else if (field.customFieldType === "Textarea") {
        return (
          <CCol md={6}>
            <CRow className="mb-3 ">
              <CFormLabel
                htmlFor=""
                className="col-sm-4 col-form-label fw-bolder fs-7"
              >
                {field.labelName}
              </CFormLabel>
              <div className="col-sm-7">
                <textarea
                  cols="32"
                  placeholder={field.labelName}
                  value={field.customFieldValue}
                  name={field.fieldName}
                  type="text"
                  onChange={(e) => {
                    onChangesText(field.id, e.target.value, idx);
                  }}
                />
              </div>
            </CRow>
          </CCol>
        );
      } else if (field.customFieldType === "Date") {
        return (
          <CCol md={6}>
            <CRow className="mb-3 ">
              <CFormLabel
                htmlFor=""
                className="col-sm-4 col-form-label fw-bolder fs-7"
              >
                {field.labelName}
              </CFormLabel>
              <div className="col-sm-7">
                <CFormInput
                  name={field.fieldName}
                  value={field.customFieldValue}
                  type="date"
                  id="birthday"
                  onChange={(e) => {
                    onChangesText(field.id, e.target.value, idx);
                  }}
                />
              </div>
            </CRow>
          </CCol>
        );
      }
    });
  };
  let updatedCustomFields = [];
  if (!trainingId) {
    updatedCustomFields = [...customField];
  }
  const onChangesText = (fieldID, text, index) => {
    if (!trainingId) {
      updatedCustomFields[index].value = text;
      updatedCustomFields[index].customFieldValue = text;

      const filteredData = updatedCustomFields.filter(
        (item) =>
          item.customFieldTypeId === 1 ||
          item.customFieldTypeId === 2 ||
          item.customFieldTypeId === 3
      );

      const filteredCustomFields = filteredData.filter((data) => data.value);

      setForm({
        ...form,
        customFields: {
          ...form.customFields,
          text: filteredCustomFields.map((data) => ({
            id: data.id,
            value: data.value,
          })),
        },
      });
    } else {
      let updatedCustomFields = [...learningDetails.customFields];
      updatedCustomFields[index].value = text;
      updatedCustomFields[index].customFieldValue = text;

      const filteredData = updatedCustomFields.filter(
        (item) =>
          item.customFieldTypeId === 1 ||
          item.customFieldTypeId === 2 ||
          item.customFieldTypeId === 3
      );

      const filteredCustomFields = filteredData.filter((data) => data.value);

      setNewCustomField({
        ...newCustomField,
        customField: {
          ...newCustomField?.customField,
          text: filteredCustomFields.map((data) => ({
            id: data.id,
            value: data.value,
          })),
        },
      });
    }
  };

  const onChanges = (optionId, index, checked) => {
    if (!trainingId) {
      updatedCustomFields[index].value = optionId;

      const filteredSelectData = updatedCustomFields.filter(
        (item) =>
          item.customFieldTypeId === 4 ||
          item.customFieldTypeId === 5 ||
          item.customFieldTypeId === 6
      );
      const filteredCustomFieldsArray = filteredSelectData.filter(
        (data) => data.value
      );
      setForm({
        ...form,
        customFields: {
          ...form.customFields,
          radio: filteredCustomFieldsArray.map((data) => ({
            id: data.id,
            value: data.value,
          })),
        },
      });
    } else {
      let updatedCustomFields1 = [...learningDetails.customFields];
      updatedCustomFields1[index].value = optionId;
      updatedCustomFields1[index].selectedValue = optionId;
      const filteredSelectData = updatedCustomFields1.filter(
        (item) =>
          item.customFieldTypeId === 4 ||
          item.customFieldTypeId === 5 ||
          item.customFieldTypeId === 6
      );
      const filteredCustomFieldsArray = filteredSelectData.filter(
        (data) => data.value
      );
      setNewCustomField({
        ...newCustomField,
        customField: {
          ...newCustomField?.customField,
          radio: filteredCustomFieldsArray.map((data) => ({
            id: data.id,
            value: data.value,
          })),
        },
      });
    }
  };
  return (
    <div className="card">
      <Toast ref={toast} />
      <TabView
        activeIndex={activeIndex1}
        onTabChange={(e) => setActiveIndex1(e.index)}
      >
        <TabPanel header="Activities">
          <CRow>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardBody className="card-body org border-top p-9">
                  {formLoading ? (
                    <div
                      className="pt-3 text-center"
                      style={{
                        height: "90vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <div className="spinner-border" role="status">
                        <span className="sr-only"></span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <CForm className="row g-15 needs-validation">
                        <CRow className="mb-3">
                          <CCol md={6}>
                            <CRow className="mb-3">
                              <CFormLabel
                                htmlFor=""
                                className="col-sm-4 col-form-label fw-bolder fs-7 required"
                              >
                                Training Title
                              </CFormLabel>
                              <div className="col-sm-7">
                                <CFormInput
                                  type="text"
                                  id="validationCustom01"
                                  required
                                  placeholder="Training Title"
                                  value={form.courseTitle}
                                  onChange={(e) => {
                                    setForm({
                                      ...form,
                                      courseTitle: e.target.value,
                                    });
                                    setValidationMessages({
                                      ...validationMessages,
                                      courseTitle: e.target.value
                                        ? ""
                                        : "Training Title is required",
                                    });
                                  }}
                                />
                                {showValidationMessages &&
                                  validationMessages.courseTitle && (
                                    <div
                                      className="fw-bolder"
                                      style={{ color: "red" }}
                                    >
                                      {validationMessages.courseTitle}
                                    </div>
                                  )}
                              </div>
                            </CRow>
                          </CCol>
                          <CCol md={6}>
                            <CRow className="mb-3">
                              <CFormLabel
                                htmlFor=""
                                className="col-sm-4 col-form-label fw-bolder fs-7 required"
                              >
                                Training Code
                              </CFormLabel>
                              <div className="col-sm-7">
                                <CFormInput
                                  type="number"
                                  // ...
                                  value={courseCode || form.referenceCode}
                                  onChange={(e) => {
                                    setForm({
                                      ...form,
                                      referenceCode: e.target.value,
                                    });
                                    setValidationMessages({
                                      ...validationMessages,
                                      referenceCode: e.target.value
                                        ? ""
                                        : "Training ID is required",
                                    });
                                  }}
                                />
                                {showValidationMessages &&
                                  validationMessages.referenceCode && (
                                    <div
                                      className="fw-bolder"
                                      style={{ color: "red" }}
                                    >
                                      {validationMessages.referenceCode}
                                    </div>
                                  )}
                              </div>
                              <div className="col-sm-1 py-1">
                                <CImage
                                  src="/media/icon/Reset.svg"
                                  alt="edit.svg"
                                  style={{ height: "25px", cursor: "pointer" }}
                                  className="me-2"
                                  onClick={() => {
                                    const newCourseCode =
                                      generateRandomCourseId();
                                    setForm({
                                      ...form,
                                      referenceCode: newCourseCode,
                                    });
                                    setCourseCode(newCourseCode);
                                  }}
                                  title="Reset"
                                />
                              </div>
                            </CRow>
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol md={12}>
                            <CRow className="mb-4">
                              <CFormLabel
                                htmlFor=""
                                className="col-sm-2 col-form-label fw-bolder fs-7"
                              >
                                Description
                              </CFormLabel>
                              <div className="col-sm-10">
                                <InputCustomEditor
                                  value={form.description}
                                  label="Description"
                                  required={true}
                                  onChange={(e) =>
                                    setForm({ ...form, description: e })
                                  }
                                />
                              </div>
                            </CRow>
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol md={6}>
                            <CRow className="mb-3">
                              <CFormLabel
                                htmlFor=""
                                className="col-sm-4 col-form-label fw-bolder fs-7 required"
                              >
                                Categories
                              </CFormLabel>
                              <div className="col-sm-7">
                                <CreatableSelect
                                  isClearable
                                  isMulti
                                  options={categoryListing}
                                  value={form.category}
                                  onCreateOption={handleCreateCategory}
                                  onChange={(e) => {
                                    handleChangeCategory(e);
                                    setValidationMessages({
                                      ...validationMessages,
                                      category: e
                                        ? ""
                                        : "Categories is required",
                                    });
                                  }}
                                  feedbackInvalid="location"
                                  id="validationCustom12"
                                  required
                                />
                                {showValidationMessages &&
                                  validationMessages.category && (
                                    <div
                                      className="fw-bolder"
                                      style={{ color: "red" }}
                                    >
                                      {validationMessages.category}
                                    </div>
                                  )}
                              </div>
                            </CRow>
                          </CCol>

                          <CCol md={6}>
                            <CRow className="mb-3">
                              <CFormLabel
                                htmlFor=""
                                className="col-sm-4 col-form-label fw-bolder fs-7 required"
                              >
                                Training Content
                              </CFormLabel>
                              <div className="col-sm-7">
                                <CFormSelect
                                  required
                                  disabled={trainingId ? true : false}
                                  value={form.trainingContent || 0}
                                  onChange={(f) => {
                                    handleContentTypeChange(f.target.value);
                                    setValidationMessages({
                                      ...validationMessages,
                                      trainingContent: f.target.value
                                        ? ""
                                        : "Training Content is required",
                                    });
                                  }}
                                  aria-label="select example"
                                >
                                  <option value={0}>Select</option>
                                  {trainingListing.map((e) => (
                                    <option
                                      selected
                                      key={e.contentTypesId}
                                      value={e.contentTypesId}
                                    >
                                      {e.contentType}
                                    </option>
                                  ))}
                                </CFormSelect>
                                {showValidationMessages &&
                                  validationMessages.trainingContent && (
                                    <div
                                      className="fw-bolder"
                                      style={{ color: "red" }}
                                    >
                                      {validationMessages.trainingContent}
                                    </div>
                                  )}
                              </div>
                            </CRow>
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CCol md={6}>
                            <CRow className="mb-3">
                              <CFormLabel
                                htmlFor=""
                                className="col-sm-4 col-form-label fw-bolder fs-7 required"
                              >
                                Certificate
                              </CFormLabel>
                              <div className="col-sm-7">
                                <CFormSelect
                                  required
                                  aria-label="select example"
                                  value={form.certificate}
                                  onChange={(f) => {
                                    setForm({
                                      ...form,
                                      certificate: f.target.value,
                                    });
                                    setValidationMessages({
                                      ...validationMessages,
                                      certificate: f.target.value
                                        ? ""
                                        : "Certificate is required",
                                    });
                                  }}
                                >
                                  <option value={0}>
                                    Select All Certificates
                                  </option>

                                  {certificateListing &&
                                    certificateListing.map(
                                      (e) =>
                                        e.certificateName && (
                                          <option
                                            key={e.certificateId}
                                            value={e.certificateId}
                                          >
                                            {e.certificateName}
                                          </option>
                                        )
                                    )}
                                </CFormSelect>
                                {showValidationMessages &&
                                  validationMessages.certificate && (
                                    <div
                                      className="fw-bolder"
                                      style={{ color: "red" }}
                                    >
                                      {validationMessages.certificate}
                                    </div>
                                  )}
                              </div>
                            </CRow>
                          </CCol>

                          <CCol md={6}>
                            <CRow className="mb-3">
                              <CFormLabel
                                htmlFor=""
                                className="col-sm-4 col-form-label fw-bolder fs-7 required"
                              >
                                Training Image
                              </CFormLabel>
                              <div className="col-sm-7">
                                <div className="input-group">
                                  <CFormInput
                                    type="file"
                                    id="formFile"
                                    accept=".jpeg, .jpg, .png"
                                    onChange={(e) => {
                                      setForm({
                                        ...form,
                                        courseImage: e.target.files[0],
                                      }),
                                        setValidationMessages({
                                          ...validationMessages,
                                          courseImage: e.target.value
                                            ? ""
                                            : "Training Image is required",
                                        });
                                      onChangePicture(e);
                                    }}
                                  />

                                  <label
                                    className="input-group-text"
                                    htmlFor="formFile"
                                  >
                                    <i
                                      className="custom-choose-btn2"
                                      data-pr-tooltip="Files Allowed: The course image must be of file type:
                          jpeg, jpg, png"
                                      data-pr-position="right"
                                      data-pr-at="right+5 top"
                                      data-pr-my="left center-2"
                                      style={{
                                        fontSize: ".9rem",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <img src="/media/icon/gen045.svg" />
                                    </i>
                                  </label>

                                  <Tooltip
                                    target=".custom-choose-btn2"
                                    content="Upload Only PDF,DOC,PPT,JPG,JPEG"
                                    position="bottom"
                                  ></Tooltip>
                                </div>
                                {showValidationMessages &&
                                  validationMessages.courseImage && (
                                    <div
                                      className="fw-bolder"
                                      style={{ color: "red" }}
                                    >
                                      {validationMessages.courseImage}
                                    </div>
                                  )}
                              </div>
                              {imgData && (
                                <img
                                  style={{
                                    objectFit: "contain ",
                                    width: "200px",
                                    height: "200px",
                                    marginTop: "20px",
                                    marginLeft: "35%",
                                  }}
                                  src={imgData}
                                ></img>
                              )}
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
                                Credits
                              </CFormLabel>
                              <div className="col-sm-7">
                                <CFormInput
                                  type="number"
                                  onKeyDown={(e) => {
                                    if (e.key === "e" || e.key === "E") {
                                      e.preventDefault();
                                    }
                                  }}
                                  id="validationCustom01"
                                  required
                                  placeholder="Credits"
                                  value={form.credit}
                                  onChange={(e) =>
                                    setForm({ ...form, credit: e.target.value })
                                  }
                                />
                              </div>
                            </CRow>
                          </CCol>

                          <CCol md={6}>
                            <CRow className="mb-3">
                              <CFormLabel
                                htmlFor=""
                                className="col-sm-4 col-form-label fw-bolder fs-7"
                              >
                                Credit Visibility
                              </CFormLabel>
                              <div className="col-sm-7">
                                <CFormSwitch
                                  size="xl"
                                  id="checkVisi"
                                  name="visibility"
                                  checked={form.creditVisibility}
                                  onChange={(e) => {
                                    e.target.checked
                                      ? setForm({
                                          ...form,
                                          creditVisibility: 1,
                                        })
                                      : setForm({
                                          ...form,
                                          creditVisibility: 0,
                                        });
                                  }}
                                />
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
                                Score
                              </CFormLabel>
                              <div className="col-sm-7">
                                <CFormInput
                                  type="number"
                                  onKeyDown={(e) => {
                                    if (e.key === "e" || e.key === "E") {
                                      e.preventDefault();
                                    }
                                  }}
                                  id="validationCustom01"
                                  required
                                  placeholder="Score"
                                  value={form.point}
                                  onChange={(e) =>
                                    setForm({ ...form, point: e.target.value })
                                  }
                                />
                              </div>
                            </CRow>
                          </CCol>

                          <CCol md={6}>
                            <CRow className="mb-3">
                              <CFormLabel
                                htmlFor=""
                                className="col-sm-4 col-form-label fw-bolder fs-7"
                              >
                                Score Visibility
                              </CFormLabel>
                              <div className="col-sm-7">
                                <CFormSwitch
                                  size="xl"
                                  id="checkVisi"
                                  name="visibility"
                                  checked={form.pointVisibility}
                                  onChange={(e) =>
                                    e.target.checked
                                      ? setForm({ ...form, pointVisibility: 1 })
                                      : setForm({ ...form, pointVisibility: 0 })
                                  }
                                />
                              </div>
                            </CRow>
                          </CCol>
                        </CRow>

                        <CRow className="mb-3">
                          <CCol md={6}>
                            <CRow className="mb-4">
                              <CFormLabel
                                htmlFor=""
                                className="col-sm-4 col-form-label fw-bolder fs-7"
                              >
                                Expiration Time (In Days)
                              </CFormLabel>
                              <div className="col-sm-7">
                                <CFormInput
                                  type="number"
                                  onKeyDown={(e) => {
                                    if (e.key === "e" || e.key === "E") {
                                      e.preventDefault();
                                    }
                                  }}
                                  id="validationCustom01"
                                  required
                                  placeholder="Expiration Time"
                                  value={form.expirationTime}
                                  onChange={(e) => {
                                    setForm({
                                      ...form,
                                      expirationTime: e.target.value,
                                    });
                                  }}
                                />
                              </div>
                            </CRow>
                          </CCol>

                          <CCol md={6}>
                            <CRow className="mb-4">
                              <CFormLabel
                                htmlFor=""
                                className="col-sm-4 col-form-label fw-bolder fs-7"
                              >
                                Expiration Length (In Years)
                              </CFormLabel>
                              <div className="col-sm-7">
                                <CFormInput
                                  type="number"
                                  onKeyDown={(e) => {
                                    if (e.key === "e" || e.key === "E") {
                                      e.preventDefault();
                                    }
                                  }}
                                  id="validationCustom01"
                                  required
                                  placeholder="Expiration Length"
                                  value={form.expirationLength}
                                  onChange={(e) => {
                                    setForm({
                                      ...form,
                                      expirationLength: e.target.value,
                                    });
                                  }}
                                />
                              </div>
                            </CRow>
                          </CCol>
                        </CRow>
                        <CRow className="md-3">
                          {trainingId
                            ? addCustomFields(learningDetails.customFields)
                            : addCustomFields(customField)}
                        </CRow>
                        <CRow className="mb-3">
                          {/* <CCol md={6}>
                            <CRow className="mb-3">
                              <CFormLabel
                                htmlFor=""
                                className="col-sm-4 col-form-label fw-bolder fs-7"
                              >
                                Display this Course in Student's Catalog?
                              </CFormLabel>
                              <div className="col-sm-7">
                                <CFormSwitch
                                  size="xl"
                                  id="formSwitchCheckDefaultXL"
                                  checked={isEnrolled}
                                  onChange={(e) =>
                                    e.target.checked
                                      ? setIsEnrolled(1)
                                      : setIsEnrolled(0)
                                  }
                                />
                              </div>
                            </CRow>
                          </CCol> */}

                          <CCol md={6}>
                            <CRow className="mb-3">
                              <CFormLabel
                                htmlFor=""
                                className="col-sm-4 col-form-label fw-bolder fs-7"
                              >
                                Training Length
                              </CFormLabel>
                              <div className="col-sm-7">
                                <CInputGroup>
                                  <CInputGroupText>
                                    Hours And Minutes
                                  </CInputGroupText>
                                  <CFormInput
                                    type="number"
                                    onKeyDown={(e) => {
                                      if (e.key === "e" || e.key === "E") {
                                        e.preventDefault();
                                      }
                                    }}
                                    value={form.hours}
                                    aria-label="Hours"
                                    onChange={(e) => {
                                      setForm({
                                        ...form,
                                        hours: e.target.value,
                                      });
                                    }}
                                  />
                                  <CFormInput
                                    type="number"
                                    onKeyDown={(e) => {
                                      if (e.key === "e" || e.key === "E") {
                                        e.preventDefault();
                                      }
                                    }}
                                    value={form.minutes}
                                    aria-label="Minutes"
                                    min="1"
                                    max="60"
                                    onChange={(e) => {
                                      if (e.target.value > 60) {
                                        e.target.value = 0;
                                      }
                                      setForm({
                                        ...form,
                                        minutes: e.target.value,
                                      });
                                    }}
                                  />
                                </CInputGroup>
                              </div>
                            </CRow>
                          </CCol>
                        </CRow>
                      </CForm>
                    </>
                  )}
                </CCardBody>
                <CCardFooter>
                  <div className="d-flex justify-content-end">
                    <CButton
                      // to="/admin/trainingLibraryInternal"
                      className="btn btn-primary me-2"
                      onClick={() => {
                        localStorage.removeItem("courseLibraryId");
                        navigate(-1);
                      }}
                    >
                      Back
                    </CButton>
                    <CButton
                      onClick={handleNextButtonInFirstTabClick}
                      className="btn btn-primary me-2"
                    >
                      Next
                    </CButton>
                  </div>
                </CCardFooter>
              </CCard>
            </CCol>
          </CRow>
        </TabPanel>
        <TabPanel header="Add Content" disabled={isSecondTabDisabled}>
          <CRow>
            <CCol xs={12}>
              <CCard className="mb-2">
                <div>
                  <CCardHeader className="">
                    <strong>Media Library</strong>
                  </CCardHeader>
                </div>
                <CCardBody>
                  <div>
                    <div className="module-outer">
                      <CForm className="row g-15 needs-validation">
                        {isUploadMode == 0 && (
                          <div>
                            {contentTypesId == 5 || contentTypesId == 8 ? (
                              <>
                                <Toolbar
                                  className="mb-4"
                                  left={leftToolbarTemplate}
                                ></Toolbar>
                                <CRow className="mb-3 mt-3">
                                  <CFormLabel
                                    htmlFor=""
                                    className="col-sm-2 col-form-label fw-bolder fs-7"
                                  >
                                    Embedded Course / Link (URL)
                                  </CFormLabel>
                                  <div className="col-sm-7">
                                    <CFormTextarea
                                      type="textarea"
                                      placeholder="Embedded Course / Link (URL)"
                                      value={form.mediaUrl}
                                      onChange={(e) => {
                                        setForm({
                                          ...form,
                                          video: e.target.value,
                                        });
                                      }}
                                    />
                                  </div>
                                </CRow>
                              </>
                            ) : (
                              <div>
                                <Toolbar
                                  className="mb-4"
                                  left={leftToolbarTemplate}
                                ></Toolbar>
                                <div className="module-outer">
                                  <CForm className="row g-15 needs-validation mt-4">
                                    <CRow className="mb-3">
                                      <CCol md={12}>
                                        <CRow className="mb-3">
                                          <div className="col-sm-5">
                                            <Tooltip
                                              target=".custom-choose-btn"
                                              content="Choose"
                                              position="bottom"
                                            />
                                            <FileUpload
                                              // disabled={disabled}
                                              accept={fileFormat}
                                              emptyTemplate={emptyTemplate}
                                              style={{ width: "247%" }}
                                              headerTemplate={headerTemplate}
                                              //chooseOptions={chooseOptions}
                                              onSelect={onSelect}
                                              itemTemplate={itemTemplate}
                                              chooseLabel="Upload New Media"
                                            />
                                            {showValidationMessages &&
                                              validationMessages.video && (
                                                <div
                                                  className="fw-bolder"
                                                  style={{ color: "red" }}
                                                >
                                                  {validationMessages.video}
                                                </div>
                                              )}
                                          </div>
                                        </CRow>
                                      </CCol>
                                    </CRow>
                                  </CForm>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {isUploadMode == 1 && (
                          <div>
                            {/* {contentTypesId != 5 ||
                              (contentTypesId != 8 && ( */}
                            <Toolbar
                              className="mb-4"
                              left={leftToolbarTemplate}
                            ></Toolbar>
                            {/* ))} */}
                            <div>
                              <DataTable
                                value={filteredData}
                                selection={selectedMedia}
                                onSelectionChange={(e) =>
                                  handleCheckboxChange(e)
                                }
                                selectionMode={false ? null : "checkbox"}
                                removableSort
                                paginator
                                showGridlines
                                dataKey="mediaId"
                                filters={filters}
                                filterDisplay="menu"
                                globalFilterFields={[
                                  "mediaName",
                                  "mediaType",
                                  "dateCreated",
                                ]}
                                rowHover
                                emptyMessage="No records found."
                                header={header}
                                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                                rows={10}
                                rowsPerPageOptions={[10, 20, 50]}
                              >
                                <Column
                                  selectionMode="single"
                                  headerStyle={{ width: "3rem" }}
                                ></Column>
                                <Column
                                  field="mediaName"
                                  sortable
                                  header="File Name"
                                ></Column>
                                <Column
                                  field="mediaType"
                                  sortable
                                  header="Format"
                                ></Column>
                                <Column
                                  body={(rowData) => (
                                    <span>
                                      {parseFloat(
                                        rowData.mediaSize / 1024000
                                      ).toFixed(3)}{" "}
                                      <span>MB</span>
                                    </span>
                                  )}
                                  sortable
                                  header="File Size"
                                ></Column>
                              </DataTable>
                            </div>
                          </div>
                        )}
                      </CForm>
                    </div>
                  </div>

                  {trainingId && (
                    <>
                      {checkedMediaOptionListing ? (
                        <DataTable
                          value={checkedMediaOptionListing}
                          showGridlines
                          dataKey="mediaId"
                          filterDisplay="menu"
                          globalFilterFields={[
                            "mediaName",
                            "mediaType",
                            "dateCreated",
                          ]}
                          rowHover
                          emptyMessage="No records found."
                          rows={10}
                        >
                          <Column
                            field="mediaName"
                            header="Selected File Name"
                          ></Column>
                          <Column field="mediaType" header="Format"></Column>
                          <Column
                            body={(rowData) => (
                              <span>
                                {parseFloat(
                                  rowData.mediaSize / 1024000
                                ).toFixed(3)}{" "}
                                <span>MB</span>
                              </span>
                            )}
                            header="File Size"
                          ></Column>
                        </DataTable>
                      ) : null}
                    </>
                  )}
                  {/* </DocsExample> */}
                  <CForm className="row g-15 needs-validation mt-4">
                    <CRow className="mb-3">
                      {contentTypesId != 8 || contentTypesId != 5 ? (
                        <></>
                      ) : (
                        <>
                          {form.video && (
                            <div className="alert alert-success">
                              <strong>File Selected: </strong>
                              {form.video.name}
                            </div>
                          )}
                        </>
                      )}
                      <CCol md={12}>
                        {form.video &&
                          (contentTypesId == 3 || contentTypesId == 9) && (
                            <ProgressBar value={value1}></ProgressBar>
                          )}
                      </CCol>
                      {/* Score */}
                      {contentTypesId === 3 && (
                        <CCol md={6} className="mt-3">
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-4 col-form-label fw-bolder fs-7"
                            >
                              Passing Score
                            </CFormLabel>
                            <div className="col-sm-7">
                              <CFormInput
                                type="Number"
                                onKeyDown={(e) => {
                                  if (e.key === "e" || e.key === "E") {
                                    e.preventDefault();
                                  }
                                }}
                                id="validationCustom01"
                                required
                                placeholder="Passing Score"
                                value={form.passingScore}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    passingScore: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </CRow>
                        </CCol>
                      )}
                      {/* AICC */}
                      {contentTypesId === 10 && (
                        <CCol md={6} className="mt-3">
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-4 col-form-label fw-bolder fs-7"
                            >
                              SSL for AICC
                            </CFormLabel>
                            <div className="col-sm-7 py-2">
                              <CFormCheck
                                inline
                                type="radio"
                                name="sslForAicc"
                                id="inlineCheckbox1"
                                value="1"
                                label="ON"
                                checked={form?.sslForAicc === "1"}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    sslForAicc: e.target.value,
                                  })
                                }
                              />
                              <CFormCheck
                                inline
                                type="radio"
                                name="sslForAicc"
                                id="inlineCheckbox2"
                                value="0"
                                label="OFF"
                                checked={form?.sslForAicc === "0"}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    sslForAicc: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </CRow>
                        </CCol>
                      )}
                      {contentTypesId === 9 && (
                        <CCol md={6} className="mt-3">
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-4 col-form-label fw-bolder fs-7"
                            >
                              SSL for AICC
                            </CFormLabel>
                            <div className="col-sm-7 py-2">
                              <CFormCheck
                                inline
                                type="radio"
                                name="sslForAicc"
                                id="inlineCheckbox1"
                                value="1"
                                label="ON"
                                checked={form?.sslForAicc === "1"}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    sslForAicc: e.target.value,
                                  })
                                }
                              />
                              <CFormCheck
                                inline
                                type="radio"
                                name="sslForAicc"
                                id="inlineCheckbox2"
                                value="0"
                                label="OFF"
                                checked={form?.sslForAicc === "0"}
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    sslForAicc: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </CRow>
                        </CCol>
                      )}
                    </CRow>
                  </CForm>
                </CCardBody>
                <CCardFooter>
                  <div className="d-flex justify-content-end">
                    <CButton
                      onClick={() => setActiveIndex1(0)}
                      className="btn btn-primary me-2"
                    >
                      Previous
                    </CButton>
                    <CButton
                      onClick={handleNextButtonInSecondTabClick}
                      disabled={isSecondTabDisabled}
                      className="btn btn-primary me-2"
                    >
                      Next
                    </CButton>
                  </div>
                </CCardFooter>
              </CCard>
            </CCol>
          </CRow>
        </TabPanel>
        <TabPanel header="Optional Items" disabled={isThirdTabDisabled}>
          <CRow>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardBody className="card-body org border-top p-9">
                  <CForm className="row g-15 needs-validation">
                    <CRow className="mb-2 py-3">
                      <CCol md={6}>
                        <CRow className="mb-2">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-3 col-form-label fw-bolder fs-7 required"
                          >
                            Status
                          </CFormLabel>
                          <div className="col-sm-7">
                            <CFormSelect
                              required
                              aria-label="select example"
                              value={form.status}
                              onChange={(f) => {
                                setForm({
                                  ...form,
                                  status: f.target.value,
                                });
                                setValidationMessages({
                                  ...validationMessages,
                                  status: f.target.value
                                    ? ""
                                    : "Status is required",
                                });
                              }}
                            >
                              <option value={0}>Select Status</option>

                              {statusListing &&
                                statusListing.map(
                                  (e) =>
                                    e.trainingStatus && (
                                      <option
                                        key={e.trainingStatusId}
                                        value={e.trainingStatusId}
                                      >
                                        {e.trainingStatus}
                                      </option>
                                    )
                                )}
                            </CFormSelect>
                            {showValidationMessages &&
                              validationMessages.status && (
                                <div
                                  className="fw-bolder"
                                  style={{ color: "red" }}
                                >
                                  {validationMessages.status}
                                </div>
                              )}
                          </div>
                        </CRow>
                      </CCol>
                      <CCol md={6}>
                        <CRow className="mb-2">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-3 col-form-label fw-bolder fs-7"
                          >
                            Handouts
                          </CFormLabel>
                          <div className="col-sm-7">
                            <div className="input-group">
                              <CFormInput
                                type="file"
                                multiple
                                accept=".jpg, .jpeg, .png, .doc, .docx, .pdf, .pptx,.ppt,.xls,.xlsx"
                                id="formFile"
                                onChange={(e) => {
                                  handleFileEvent(e);
                                }}
                              />
                              <label
                                className="input-group-text"
                                htmlFor="formFile"
                              >
                                <i
                                  className="custom-choose-btn "
                                  data-pr-tooltip="Files Allowed: The handout image must be of file type:
                          jpeg, jpg, png, docx, pdf , pptx , xlsx"
                                  data-pr-position="right"
                                  data-pr-at="right+5 top"
                                  data-pr-my="left center-2"
                                  style={{
                                    fontSize: ".9rem",
                                    cursor: "pointer",
                                  }}
                                >
                                  <img src="/media/icon/gen045.svg" />
                                </i>
                              </label>

                              <Tooltip
                                target=".custom-choose-btn"
                                content="Upload Only PDF,DOC,PPT,JPG,JPEG"
                                position="bottom"
                              ></Tooltip>
                            </div>
                          </div>
                          {handoutData.length > 0 && (
                            <>
                              {handoutPreview(handoutData, currentQuestion)}

                              <div className="d-flex justify-content-between">
                                <CButton
                                  onClick={prevHandout}
                                  className={`btn btn-primary me-2 align-items-end `}
                                >
                                  Previous
                                </CButton>
                                <CButton
                                  onClick={nextHandout}
                                  className={`btn btn-primary me-2 align-items-start `}
                                >
                                  Next
                                </CButton>
                              </div>
                            </>
                          )}
                        </CRow>
                      </CCol>
                    </CRow>

                    <CRow className="mb-2">
                      {/* <CCol md={6}>
                        <CRow className="mb-2">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-3 col-form-label fw-bolder fs-7"
                          >
                            Course Type (for Students) :
                          </CFormLabel>
                          <div className="col-sm-7">
                            <CFormSelect
                              required
                              aria-label="select example"
                              value={courseType}
                              onChange={(e) => {
                                setCourseType(e.target.value);
                              }}
                            >
                              <option value={""}>Select Status</option>
                              <option value={1}>Mandatory</option>
                              <option value={0}>Optional</option>
                            </CFormSelect>
                          </div>
                        </CRow>
                      </CCol>
                      */}
                    </CRow>
                  </CForm>
                </CCardBody>
                <CCardFooter>
                  <div className="d-flex justify-content-end">
                    <CButton
                      onClick={() => setActiveIndex1(1)}
                      className="btn btn-primary me-2"
                    >
                      Previous
                    </CButton>
                    {trainingId != null ? (
                      <>
                        <CButton
                          className="btn btn-primary me-2"
                          onClick={(e) => {
                            handleUpdate(e);
                          }}
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
                        </CButton>
                      </>
                    ) : (
                      <>
                        <CButton
                          className="btn btn-primary me-2"
                          onClick={(e) => handleAddNew(e)}
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
                        </CButton>
                      </>
                    )}
                  </div>
                </CCardFooter>
              </CCard>
            </CCol>
          </CRow>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default AddElearningCourseCatalog;
