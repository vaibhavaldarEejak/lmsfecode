import React, { useEffect, useState, useRef, useMemo } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
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
  CModal,
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
import { Tooltip } from "primereact/tooltip";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputCustomEditor } from "./EditorBox/InputCustomEditor";
import postApiCall from "src/server/postApiCall";
import getApiCall from "src/server/getApiCall";
import generalUpdateApi from "src/server/generalUpdateApi";
import axios from "axios";
import "../../css/form.css";
import { ProgressBar } from "primereact/progressbar";
import { FALSE } from "sass";
const AddElearningLibraryPage = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  let filteredData = [];
  let filteredData1 = [];
  const toast = useRef(null);
  const [currentQuestion, setCurrentQuestion] = useState(0),
    [isUploadMode, setIsUploadMode] = useState(0),
    [loading, setLoading] = useState(false),
    [isloading, setLoading1] = useState(false),
    [activeIndex1, setActiveIndex1] = useState(0),
    [isSecondTabDisabled, setIsSecondTabDisabled] = useState(true),
    [isThirdTabDisabled, setIsThirdTabDisabled] = useState(true),
    [loadPage, setLoadPage] = useState(false),
    [categoryListing, setcategoryListing] = useState([]),
    [trainingListing, settrainingListing] = useState([]),
    [certificateListing, setcertificateListing] = useState([]),
    [learningDetails, setlearningDetails] = useState([]),
    // trainingId = window.location.href.split("?")[1],
    [contentId, setContentId] = useState(),
    [imgData, setImgData] = useState(null),
    [selectedMedia, setSelectedMedia] = useState([]),
    [mediaPayload, setMediaPayload] = useState([]),
    [disabled, setDisabled] = useState(true),
    [uploadedFiles, setUploadedFiles] = useState([]),
    [courseStatus, setCourseStatus] = useState(1);
  const navigate = useNavigate(),
    [showError, setshowError] = useState(false),
    [displaycourseImgError, setdisplaycourseImgError] = useState(),
    [displayhandoutError, setdisplayhandoutError] = useState(),
    [form, setForm] = useState({
      trainingType: 1,
      courseTitle: "",
      description: "",
      category: null,
      trainingContent: 0,
      referenceCode: "",
      credit: "",
      creditVisibility: 1,
      point: "",
      pointVisibility: 0,
      certificate: "",
      isActive: 1,
      media: [],
      passingScore: "",
      sslForAicc: 0,
      status: "",
      courseImage: "",
      handout: [],
      video: "",
      expirationTime: "",
      expirationLength: "",
      hours: 0,
      minutes: 0,
    }),
    [handoutData, setHandoutData] = useState([]),
    [mediaFile, setMediaFile] = useState();

  const [trainingId, settrainingId] = useState();
  let trainingId1 = "";
  useEffect(() => {
    trainingId1 = localStorage.getItem("courseLibraryId");
    settrainingId(trainingId1);
  }, []);

  const generateRandomCourseId = () => {
    const min = 100001;
    const max = 999999;
    const rand = Math.floor(min + Math.random() * (max - min));
    return rand;
  };

  const onChangePicture = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      setForm({
        ...form,
        courseImage: file,
      });
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImgData(reader.result);
      };
    } else {
      alert(
        "The selected file is invalid. Please select a file that is a JPEG or PNG image"
      );
    }
  };

  useEffect(() => {
    if (trainingId) {
      getCourseDetailApi(Number(trainingId));
    }

    if (isUploadMode.index === 0) {
      setTab(true);
    } else if (isUploadMode.index === 1) {
      setTab(false);
    }

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
      sslForAicc: 0,
    });
  }, [trainingId, isUploadMode]);

  const validateForm3 = (e) => {
    const messages = {};
    let isValid = true;

    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };

  const getCourseListing = async () => {
    try {
      const res = await getApiCall("getCourseLibraryList");
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
  const [value1, setValue1] = useState(0);
  const uploadChunk = async () => {
    try {
      const chunkSize = 1024 * 1024; // 1MB chunk size
      const fileSize = mediaFile?.size;
      const totalChunks = Math.ceil(fileSize / chunkSize);

      const fileName = mediaFile?.name?.split(".")[0];
      const uniqueFileName = `${fileName}`;
      const withoutWhitespaces = uniqueFileName.replace(/\s/g, "");

      const formData = new FormData();
      formData.append("fileName", withoutWhitespaces);
      formData.append("totalChunks", totalChunks);
      // formData.append("file", mediaPayload.mediaUrl);

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

          navigate("/superadmin/courselibrarylist");
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
        const chunkBlob = mediaPayload.mediaUrl?.slice(start, end);

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
      navigate("/superadmin/courselibrarylist");
    } catch (error) {
      navigate("/superadmin/courselibrarylist");
      console.log("error", error);
    }
  };
  const addELearning = async (form) => {
    setLoading1(true);

    try {
      const res = await postApiCall(
        "addCourseLibrary",
        form,
        "multipart/form-data"
      );

      if (contentId == 3 || contentId == 9) {
        uploadChunk();
      } else {
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Course Added Successfully",
          life: 3000,
        });

        setTimeout(() => {
          navigate("/superadmin/courselibrarylist");
        }, 3000);
      }

      setLoading1(false);
    } catch (err) {
      var errMsg = err?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });

      if (err) {
        setdisplaycourseImgError(err[0]);
        setdisplayhandoutError(err[1]);
      }

      setshowError(true);
      setLoading1(false);
    }
  };

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
  const getCourseDetailApi = async (trainingId) => {
    try {
      const res = await getApiCall("getCourseLibraryById", trainingId);
      setlearningDetails(res);
      setImgData(res.imageUrl);
      setHandoutData(
        res.handouts.map((e) => ({
          name: e.name,
          blob: e.blob,
          format: e.format,
        }))
      );

      setcheckedMediaOptionListing(
        res.trainingMedia.map((mediaData) => ({
          trainingMediaId: mediaData.trainingMediaId,
          mediaId: mediaData.mediaId,
          mediaName: mediaData.mediaName,
          mediaType: mediaData.mediaType,
          mediaSize: mediaData.mediaSize,
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

  const [tab, setTab] = useState(true);
  //Category list api

  //training

  const trainingList = async () => {
    try {
      const res = await getApiCall("getContentTypeList");

      settrainingListing(res);
      setLoading(true);
    } catch (err) {
      setLoading(false);
      var errMsg = err?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
    }
  };

  //certificate

  const certificateList = async () => {
    try {
      const res = await getApiCall("getCertificateOptionList");
      setcertificateListing(res);
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

  //Status

  const [statusListing, setstatusListing] = useState([]);

  const getStatusList = async () => {
    try {
      const res = await getApiCall("getTrainingStatusList");
      setstatusListing(res);
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

  //category

  const categoryList = async () => {
    try {
      const res = await getApiCall("getCategoryOptionList");
      setcategoryListing(
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
      const res = await postApiCall("addNewCategory", data);
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
  const [loading11, setLoading11] = useState(false);
  const [MediaOptionListing, setMediaOptionListing] = useState([]);
  const MediaOptionList = async () => {
    setLoading11(true);
    try {
      const res = await getApiCall("getMediaOptionList");
      setMediaOptionListing(
        res.map((mediaData) => ({
          mediaId: mediaData.mediaId,
          mediaName: mediaData.mediaName,
          mediaType: mediaData.mediaType,
          mediaSize: mediaData.mediaSize,
          checked: 0,
        }))
      );
      setLoading11(false);
    } catch (err) {
      var errMsg = err?.response?.data?.error;
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: errMsg,
        life: 3000,
      });
      setLoading11(false);
    }
  };

  function handleCheckboxChange(e) {
    const selectedRows = e.value;

    setSelectedMedia(selectedRows);

    setValidationMessages({
      ...validationMessages,
      video: selectedMedia?.mediaId ? "" : "Media is required",
    });
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

  //Validations

  const [validationMessages, setValidationMessages] = useState({});
  const [showValidationMessages, setShowValidationMessages] = useState(false);

  const validateForm = (e) => {
    const messages = {};
    let isValid = true;

    if (!form.courseTitle) {
      messages.courseTitle = "Course Title is required";
      isValid = false;
    } else {
      messages.courseTitle = "";
    }

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
        messages.courseImage = "Course Image is required";
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
    }

    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
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
      if (contentId == 3 || contentId == 9) {
        setIsThirdTabDisabled(true);
      } else {
        setIsThirdTabDisabled(false);
      }
    }
  };

  const handleAddNew = (e) => {
    if (validateForm3()) {
      let formData = new FormData();
      formData.append("trainingType", 1);
      formData.append("courseTitle", form.courseTitle);
      formData.append("description", form.description || "");
      formData.append(
        "category",
        form.category && form.category.map((e) => e.value)
      );
      formData.append("trainingContent", form.trainingContent || "");
      formData.append("referenceCode", form.referenceCode);
      formData.append("credit", form.credit);
      formData.append(
        "creditVisibility",
        form.creditVisibility === undefined ? 0 : form.creditVisibility
      );
      formData.append("point", form.point);
      formData.append(
        "pointVisibility",
        form.pointVisibility === undefined ? 0 : form.pointVisibility
      );
      formData.append("certificate", form.certificate || "");
      formData.append("isActive", 1);
      formData.append("passingScore", form.passingScore);
      formData.append(
        "sslForAicc",
        form.sslForAicc === undefined ? 0 : form.sslForAicc
      );
      formData.append("status", courseStatus ? courseStatus : 1);
      let media = selectedMedia.mediaId;
      formData.append("media", media);
      formData.append("courseImage", form.courseImage || " ");
      for (let i = 0; i < uploadedFiles.length; i++) {
        formData.append("handouts[]", uploadedFiles[i]);
      }

      formData.append("video", form.video);
      const fileName = form.video?.name?.split(".")[0];
      const uniqueFileName = `${fileName}`;
      const withoutWhitespaces = uniqueFileName.replace(/\s/g, "");
      formData.append(
        "fileName",
        contentId === 5 || contentId === 8
          ? form.courseTitle
          : withoutWhitespaces
      );
      formData.append("expirationTime", form.expirationTime);
      formData.append("expirationLength", form.expirationLength);
      formData.append("hours", form.hours || "");
      formData.append("minutes", form.minutes || "");

      if (formData) {
        addELearning(formData);
      }
    }
  };

  const [showMediaModal, setShowMediaModal] = useState(false);
  const handleUpdate = async (e) => {
    localStorage.removeItem("courseLibraryId");

    if (validateForm3()) {
      e.preventDefault();
      let formData = new FormData();
      formData.append("trainingId", trainingId);
      formData.append("trainingType", 1);
      formData.append("courseTitle", form.courseTitle || "");
      formData.append("description", form.description || "");
      formData.append(
        "category",
        form.category && form.category.map((e) => e.value)
      );
      formData.append("trainingContent", form.trainingContent || "");
      formData.append("referenceCode", form.referenceCode);
      formData.append("credit", form.credit);
      formData.append(
        "creditVisibility",
        form.creditVisibility === undefined ? 0 : form.creditVisibility
      );
      formData.append("point", form.point);
      formData.append(
        "pointVisibility",
        form.pointVisibility === undefined ? 0 : form.pointVisibility
      );
      formData.append("certificate", form.certificate || "");
      formData.append("isActive", 1);
      formData.append("passingScore", form.passingScore);
      formData.append(
        "sslForAicc",
        form.sslForAicc === undefined ? 0 : form.sslForAicc
      );
      formData.append("status", courseStatus);
      let media = selectedMedia.mediaId;
      formData.append("media", media);
      formData.append(
        "courseImage",
        form.courseImage === undefined ? "" : form.courseImage
      );

      for (let i = 0; i < uploadedFiles.length; i++) {
        formData.append("handouts[]", uploadedFiles[i]);
      }

      formData.append("video", form.video);
      formData.append("expirationTime", form.expirationTime);
      formData.append("expirationLength", form.expirationLength);
      formData.append("hours", form.hours || "");
      formData.append("minutes", form.minutes || "");
      const fileName = form.video?.name?.split(".")[0];
      const uniqueFileName = `${fileName}`;
      const withoutWhitespaces = uniqueFileName.replace(/\s/g, "");
      formData.append(
        "fileName",
        contentId === 5 || contentId === 8
          ? form.courseTitle
          : withoutWhitespaces
      );

      if (formData) {
        setLoading1(true);
        try {
          const res = await generalUpdateApi("updateCourseLibrary", formData);

          if (contentId == 3 || contentId == 9) {
            uploadChunk();
          } else {
            toast.current.show({
              severity: "success",
              summary: "Successful",
              detail: "Course Updated Successfully",
              life: 3000,
            });

            setLoading1(false);

            navigate("/superadmin/courselibrarylist");
            localStorage.removeItem("courseLibraryId");
          }
        } catch (err) {
          setLoading1(false);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Error Updating Course Course",
            life: 3000,
          });
        }
      }
    }
  };
  useMemo(() => {
    if (learningDetails) {
      setForm({
        trainingType: learningDetails.trainingType,
        courseTitle: learningDetails.courseTitle,
        description: learningDetails.description,
        category:
          learningDetails.category &&
          learningDetails.category.map((e) => ({
            label: e.categoryName,
            value: e.categoryId,
          })),
        trainingContent: learningDetails.contentTypesId,
        referenceCode: learningDetails.referenceCode,
        credit: learningDetails.credits,
        creditVisibility: learningDetails.creditsVisible,
        point: learningDetails.points,
        pointVisibility: learningDetails.pointVisibility,
        certificate: learningDetails.certificateId,
        isActive: learningDetails.isActive,
        passingScore: learningDetails.passingScore,
        sslForAicc: learningDetails.sslOnOff,
        status: learningDetails.trainingStatusId,
        expirationLength: learningDetails.expirationLength,
        expirationTime: learningDetails.expirationTime,
        hours: learningDetails.hours,
        minutes: learningDetails.minutes,
      });
      setContentId(learningDetails.contentTypesId);
      setCourseStatus(learningDetails.trainingStatusId);
    }
  }, [learningDetails]);

  const [totalSize, setTotalSize] = useState(0);
  const [totalSizeUpdatedMedia, setTotalSizeUpdatedMedia] = useState(0);

  const itemTemplate = (file, props) => {
    const fileName = file.name;
    const lastDotIndex = fileName.lastIndexOf(".");
    const ext = fileName.substring(lastDotIndex);
    if (fileFormat.includes(ext)) {
      return (
        <>
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
        </>
      );
    }
  };

  const itemTemplateUpdatedMedia = (file, props) => {
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
            onClick={(e) =>
              onTemplateRemoveUpdatedMedia(e, file, props.onRemove)
            }
          />
          <ProgressBar value={100} />
        </div>
      );
    }
  };

  const onTemplateRemove = (file, callback) => {
    setForm({ ...form, video: "" });
    setTotalSize(totalSize - file.size);
    callback();
  };

  const onTemplateRemoveUpdatedMedia = (e, file, callback) => {
    e.preventDefault();
    setUpdatedMedia({ ...updatedMedia, mediaUrl: "" });
    setTotalSizeUpdatedMedia(totalSizeUpdatedMedia - file.size);
    callback();
  };

  function handleUploadButtonClick() {
    setIsUploadMode(true);
  }

  function handleSelectMediaButtonClick() {
    setIsUploadMode(false);
  }

  function handleTabChange(e) {
    setIsUploadMode(e.index);
  }

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
            arr.push({ blob: reader.result, format: "img" });
            setHandoutData([...arr]);
          }

          fileObjects.push(file);
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
    });
  }

  function loadPDF(url) {
    pdfjsLib.getDocument(url).promise.then((pdf) => {
      pdf.getPage(1).then((page) => {
        renderPage(page);
      });
    });
  }

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
        className={`${className} saveButtonTheme1${themes}`}
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

  const headerTemplateUpdatedMedia = (options) => {
    const { className, chooseButton } = options;

    return (
      <div
        className={`${className} saveButtonTheme1${themes}`}
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

  const [updatedMedia, setUpdatedMedia] = useState({
    mediaUrl: "",
    trainingMediaId: "",
    trainingContent: "",
  });

  const onSelectUpdateMedia = (e) => {
    const fileName = e.files[0].name;
    const lastDotIndex = fileName.lastIndexOf(".");
    const ext = fileName.substring(lastDotIndex);

    if (fileFormat.includes(ext)) {
      setUpdatedMedia({
        ...updatedMedia,
        mediaUrl: e.files[0],
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

  const emptyTemplateUpdatedMedia = () => {
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

  let fileTypesAllowed = [];
  const [fileFormat, setfileFormat] = useState([]);

  const handleContentTypeChange = (value) => {
    setContentId(value);
    if (value == 0) {
      setDisabled(true);
    } else {
      setDisabled(false);

      fileTypesAllowed = trainingListing.filter(
        (e) => e.contentTypesId === value
      )[0]?.supportFormats;

      if (fileTypesAllowed) {
        fileTypesAllowed = fileTypesAllowed.replaceAll("|", ",");
        setfileFormat(fileTypesAllowed?.split(","));
      }

      setForm((prevState) => ({
        ...prevState,
        trainingContent: value,
      }));
    }
  };

  filteredData = MediaOptionListing.filter((item) =>
    fileFormat.map((ext) => ext.substring(1)).includes(item.mediaType)
  );
  if (contentId === 8) {
    filteredData = MediaOptionListing.filter(
      (item) => item.mediaType === "URL"
    );
  } else if (contentId === 5) {
    filteredData = MediaOptionListing.filter(
      (item) => item.mediaType === "all"
    );
  }
  //Generate CourseID

  useMemo(() => {
    handleContentTypeChange(parseInt(contentId));
  }, [trainingId, contentId, loading]);

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

  const submitUpdatedMedia = async () => {
    if (validateForm3()) {
      let formData = new FormData();
      formData.append("mediaUrl", updatedMedia.mediaUrl);
      formData.append("trainingMediaId", updatedMedia.trainingMediaId);
      formData.append("trainingContent", updatedMedia.trainingContent);

      if (formData) {
        setLoading1(true);
        try {
          const res = await postApiCall("updateTrainingMedia", formData);
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Media Updated Successfully",
            life: 3000,
          });
          getCourseDetailApi(trainingId);
          setLoading1(false);
        } catch (err) {
          setLoading1(false);
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Error Updating Media",
            life: 3000,
          });
        }
      }
    }
  };

  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  return (
    <div className="card">
      <Toast ref={toast} />
      <CModal
        visible={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        size="lg"
      >
        <CCard>
          <CCardHeader>
            <h4>Update Media</h4>
          </CCardHeader>
          <CCardBody>
            <FileUpload
              className="m-0"
              accept={fileFormat}
              emptyTemplate={emptyTemplateUpdatedMedia}
              headerTemplate={headerTemplateUpdatedMedia}
              onSelect={onSelectUpdateMedia}
              itemTemplate={itemTemplateUpdatedMedia}
            />
          </CCardBody>
          <CCardFooter>
            <div className="d-flex justify-content-end">
              <CButton
                type="button"
                className="py-2 me-3"
                color="secondary"
                onClick={() => setShowMediaModal(false)}
              >
                Cancel
              </CButton>
              <CButton
                type="button"
                className="py-2 me-3"
                color="primary"
                onClick={submitUpdatedMedia}
                disabled={isloading}
              >
                {isloading && (
                  <span
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                Update
              </CButton>
            </div>
          </CCardFooter>
        </CCard>
      </CModal>
      <TabView
        activeIndex={activeIndex1}
        onTabChange={(e) => setActiveIndex1(e.index)}
      >
        <TabPanel header="Activities">
          <CRow>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardBody className="card-body org border-top p-9">
                  {loading11 ? (
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
                    <CForm
                      className={`row g-15 needs-validation InputThemeColor${themes}`}
                    >
                      <CRow className="mb-3">
                        <CCol md={6}>
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-4 col-form-label fw-bolder fs-7 required"
                            >
                              Course Title
                            </CFormLabel>
                            <div className="col-sm-7">
                              <CFormInput
                                type="text"
                                id="validationCustom01"
                                required
                                placeholder="Course Title"
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
                                      : "Course Name is required",
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
                              Course Code
                            </CFormLabel>
                            <div className="col-sm-7">
                              <CFormInput
                                type="number"
                                disabled
                                onKeyDown={(e) => {
                                  if (e.key === "e" || e.key === "E") {
                                    e.preventDefault();
                                  }
                                }}
                                id="validationCustom01"
                                required
                                placeholder="Course Code"
                                value={form.referenceCode}
                                onChange={(e) => {
                                  setForm({
                                    ...form,
                                    referenceCode: e.target.value,
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
                                  setForm({
                                    ...form,
                                    referenceCode: generateRandomCourseId(),
                                  });
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
                                  console.log({ e });
                                  handleChangeCategory(e);
                                  setValidationMessages({
                                    ...validationMessages,
                                    category: e ? "" : "Categories is required",
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
                                value={form.trainingContent || 0}
                                disabled={trainingId ? true : false}
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
                              Course Image
                            </CFormLabel>
                            <div className="col-sm-7">
                              <div className="input-group">
                                <CFormInput
                                  type="file"
                                  id="formFile"
                                  accept=".jpeg, .jpg, .png"
                                  onChange={(e) => {
                                    setValidationMessages({
                                      ...validationMessages,
                                      courseImage: e.target.value
                                        ? ""
                                        : "Course Image is required",
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

                              {showError ||
                                displaycourseImgError ===
                                "The course image must be a file of type: jpeg, jpg, png." ? (
                                <div
                                  className="fw-bolder"
                                  style={{ color: "red" }}
                                >
                                  {" "}
                                  Please Select an image
                                  <br />
                                  {displaycourseImgError}
                                </div>
                              ) : (
                                <></>
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
                                  setForm({
                                    ...form,
                                    credit: e.target.value,
                                  })
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
                                name="creditVisibility"
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
                              className="col-sm-4 col-form-label fw-bolder fs-7 "
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
                                name="visibility"
                                checked={form.pointVisibility}
                                onChange={(e) => {
                                  console.log({ x: e.target.checked });

                                  e.target.checked
                                    ? setForm({ ...form, pointVisibility: 1 })
                                    : setForm({ ...form, pointVisibility: 0 });
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
                              className="col-sm-4 col-form-label fw-bolder fs-7 "
                            >
                              Course Length
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

                        {/* <CCol md={6}>
                          <CRow className="mb-3">
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
                                onChange={(e) =>
                                  setForm({
                                    ...form,
                                    expirationTime: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </CRow>
                        </CCol> */}

                        {/* <CCol md={6}>
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
                        </CCol> */}
                      </CRow>
                    </CForm>
                  )}
                </CCardBody>
                <CCardFooter>
                  <div className="d-flex justify-content-end">
                    <Link
                      to="/superadmin/courselibrarylist"
                      onClick={() => {
                        localStorage.removeItem("courseLibraryId");
                      }}
                      className={`btn btn-primary me-2 saveButtonTheme${themes}`}
                    >
                      Back
                    </Link>
                    <CButton
                      onClick={handleNextButtonInFirstTabClick}
                      className={`btn btn-primary me-2 saveButtonTheme${themes}`}
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

                <CCardBody className="org">
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
                                {rowData.mediaSize ? (
                                  `${(parseFloat(rowData.mediaSize) / (1024 * 1024)).toFixed(3)} MB`
                                ) : (
                                  "N/A"
                                )}
                              </span>
                            )}
                            header="File Size"
                          />
                          <Column
                            header="Action"
                            body={(rowData) => (
                              <div>
                                <CImage
                                  src="/media/icon/arr031.svg"
                                  style={{
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    setShowMediaModal(true);
                                    setUpdatedMedia({
                                      ...updatedMedia,
                                      trainingMediaId: rowData.trainingMediaId,
                                      trainingContent: contentId,
                                    });
                                  }}
                                ></CImage>
                              </div>
                            )}
                          ></Column>
                        </DataTable>
                      ) : null}
                    </>
                  )}
                  {isUploadMode == 0 && (
                    <div>
                      {contentId == 5 || contentId == 8 ? (
                        <div>
                          <TabView
                            activeIndex={isUploadMode}
                            onTabChange={handleTabChange}
                          >
                            <TabPanel header=" Embedded Code / Link (URL)">
                              <CRow className="mb-3 mt-3">
                                <CFormLabel
                                  htmlFor=""
                                  className="col-sm-2 col-form-label fw-bolder fs-7"
                                >
                                  Embedded Code / Link (URL)
                                </CFormLabel>
                                <div className="col-sm-7">
                                  <CFormTextarea
                                    type="textarea"
                                    value={form.video}
                                    placeholder="Embedded Code / Link (URL)"
                                    onChange={(e) => {
                                      setForm({
                                        ...form,
                                        video: e.target.value,
                                      });
                                    }}
                                  />
                                </div>
                              </CRow>
                            </TabPanel>
                            <TabPanel header="Select Media From List ">
                              <div className={` InputThemeColor${themes}`}>
                                <DataTable
                                  value={filteredData1}
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
                                        {rowData.mediaSize ? (
                                          `${(parseFloat(rowData.mediaSize) / (1024 * 1024)).toFixed(3)} MB`
                                        ) : (
                                          "N/A"
                                        )}
                                      </span>
                                    )}
                                    header="File Size"
                                  />
                                </DataTable>
                              </div>
                            </TabPanel>
                          </TabView>
                        </div>
                      ) : (
                        <div>
                          <TabView
                            activeIndex={isUploadMode}
                            onTabChange={handleTabChange}
                          >
                            <TabPanel header="Upload New Media">
                              <FileUpload
                                className="m-0"
                                accept={fileFormat}
                                emptyTemplate={emptyTemplate}
                                headerTemplate={headerTemplate}
                                onSelect={onSelect}
                                itemTemplate={itemTemplate}
                              />
                            </TabPanel>
                            <TabPanel header="Select Media From List">
                              <div className={` InputThemeColor${themes}`}>
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
                            </TabPanel>
                          </TabView>
                        </div>
                      )}
                    </div>
                  )}

                  {isUploadMode == 1 && (
                    <div>
                      <TabView
                        activeIndex={isUploadMode}
                        onTabChange={handleTabChange}
                      >
                        <TabPanel
                          header={
                            contentId === 5 || contentId === 8
                              ? "  Embedded Code / Link (URL)"
                              : "Upload New Media"
                          }
                        >
                          <FileUpload
                            className="m-0"
                            accept={fileFormat}
                            emptyTemplate={emptyTemplate}
                            headerTemplate={headerTemplate}
                            onSelect={onSelect}
                            itemTemplate={itemTemplate}
                          />
                        </TabPanel>
                        <TabPanel header="Select Media From List ">
                          <div className={` InputThemeColor${themes}`}>
                            <DataTable
                              value={filteredData}
                              selection={selectedMedia}
                              onSelectionChange={(e) => handleCheckboxChange(e)}
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
                                    {rowData.mediaSize ? (
                                      `${(parseFloat(rowData.mediaSize) / (1024 * 1024)).toFixed(3)} MB`
                                    ) : (
                                      "N/A"
                                    )}
                                  </span>
                                )}
                                header="File Size"
                              />
                            </DataTable>
                          </div>
                        </TabPanel>
                      </TabView>
                    </div>
                  )}

                  {/* </DocsExample> */}
                  <CForm
                    className={`row g-15 needs-validation mt-4 InputThemeColor${themes}`}
                  >
                    <CRow className="mb-3">
                      {contentId != 8 || contentId != 5 ? (
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
                        {form.video && (contentId == 3 || contentId == 9) && (
                          <ProgressBar value={value1}></ProgressBar>
                        )}
                      </CCol>
                      {contentId === 3 && (
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
                      {contentId === 10 && (
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
                                checked={form?.sslForAicc == "1"}
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
                                checked={form?.sslForAicc == "0"}
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
                      {contentId === 9 && (
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
                                checked={form?.sslForAicc == "1"}
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
                                checked={form?.sslForAicc == "0"}
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
                      className={`btn btn-primary me-2 saveButtonTheme${themes}`}
                    >
                      Previous
                    </CButton>
                    <CButton
                      onClick={handleNextButtonInSecondTabClick}
                      disabled={isSecondTabDisabled}
                      className={`btn btn-primary me-2 saveButtonTheme${themes}`}
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
                  <CForm
                    className={`row g-15 needs-validation InputThemeColor${themes}`}
                  >
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
                              value={courseStatus}
                              onChange={(f) => {
                                setCourseStatus(f.target.value);
                              }}
                            >
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
                            className="col-sm-3 col-form-label fw-bolder fs-7 p-overlay-badge"
                          >
                            Handouts
                          </CFormLabel>
                          <div className="col-sm-7">
                            <div className="input-group">
                              <CFormInput
                                className="custom-tooltip-btn"
                                type="file"
                                id="formFile"
                                multiple
                                accept=".jpg, .jpeg, .png, .doc, .docx, .pdf, .pptx,.ppt,.xls,.xlsx"
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

                              {showError &&
                                displayhandoutError ===
                                "The handout must be a file of type: jpeg, jpg, png, pdf." ? (
                                <div
                                  className="fw-bolder"
                                  style={{ color: "red" }}
                                >
                                  {displayhandoutError}
                                </div>
                              ) : (
                                <></>
                              )}
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
                                  className={`btn btn-primary me-2 align-items-end saveButtonTheme${themes}`}
                                >
                                  Previous
                                </CButton>
                                <CButton
                                  onClick={nextHandout}
                                  className={`btn btn-primary me-2 align-items-start saveButtonTheme${themes}`}
                                >
                                  Next
                                </CButton>
                              </div>
                            </>
                          )}
                        </CRow>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
                <CCardFooter>
                  <div className="d-flex justify-content-end">
                    <CButton
                      onClick={() => setActiveIndex1(1)}
                      className={`btn btn-primary me-2 saveButtonTheme${themes}`}
                    >
                      Previous
                    </CButton>
                    {trainingId != null ? (
                      <CButton
                        className={`btn btn-primary me-2 saveButtonTheme${themes}`}
                        onClick={(e) => {
                          {
                            localStorage.removeItem("courseLibraryId");
                            handleUpdate(e);
                          }
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
                    ) : (
                      <CButton
                        className={`btn btn-primary me-2 saveButtonTheme${themes}`}
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

export default AddElearningLibraryPage;
