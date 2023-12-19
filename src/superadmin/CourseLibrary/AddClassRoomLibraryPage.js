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
  CImage,
  CInputGroup,
  CInputGroupText,
} from "@coreui/react";
import { Link } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { Toast } from "primereact/toast";
import "../../scss/required.scss";
import { InputCustomEditor } from "./EditorBox/InputCustomEditor";
import { useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
import { Tooltip } from "primereact/tooltip";
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";
import generalUpdateApi from "src/server/generalUpdateApi";
import "../../css/form.css";

const AddClassRoomLibraryPage = (props) => {
  const [trainingId1, settrainingId1] = useState();

  let trainingId = "";
  useEffect(() => {
    trainingId = localStorage.getItem("courseLibraryId");
    settrainingId1(trainingId);
  }, []);

  const token = "Bearer " + localStorage.getItem("ApiToken"),
    [eClassDetails, setEClassDetails] = useState({
      category: [
        {
          categoryId: 0,
          categoryName: "",
        },
      ],
    }),
    [checked, setChecked] = useState(false),
    [activeIndex1, setActiveIndex1] = useState(0),
    [isloading, setLoading1] = useState(false),
    [uploadedFiles, setUploadedFiles] = useState([]),
    [notificationPop, setNotificationPop] = useState("false"),
    toast = useRef(null),
    navigate = useNavigate(),
    [handoutData, setHandoutData] = useState([]),
    //Image data
    [form, setForm] = useState({
      activityReviews: 1,
      trainingType: 2,
      courseTitle: "",
      description: "",
      category: null,
      referenceCode: "",
      courseImage: "",
      credit: "",
      creditVisibility: 1,
      point: "",
      pointVisibility: 1,
      certificate: "",
      iltAssessment: "",
      enrollmentType: "",
      unenrollment: 0,
      notifications: [
        {
          trainingNotificationId: 0,
          notificationName: "",
          notificationType: "",
          notificationOn: 0,
          isActive: 0,
        },
      ],
      isActive: 1,
      handout: "",
      status: 1,
      sslForAicc: 0,
      trainingContent: 0,
      passingScore: 0,
      media: "",
      Video: "",
      expirationTime: "",
      expirationLength: "",
      hours: 0,
      minutes: 0,
    }),
    [courseStatus, setCourseStatus] = useState(1),
    [imgData, setImgData] = useState(null),
    allowedTypes = ["image/jpeg", "image/png", "image/jpg"],
    maxSize = 10485760;

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
            category: null,
            unenrollment: 1,
            isActive: 1,
            activityReviews: 1,
            description: "",
          });
        } else {
          setForm({
            ...form,
            referenceCode: parseInt(res[0].referenceCode) + 1,
            category: null,
            unenrollment: 1,
            isActive: 1,
            activityReviews: 1,
            description: "",
          });
        }
      }
    } catch (err) {}
  };

  useEffect(() => {
    setForm({
      ...form,
      category: null,
      unenrollment: 1,
      isActive: 1,
      activityReviews: 1,
      description: "",
    });
  }, []);

  useEffect(() => {
    if (token !== "Bearer null") {
      getCourseListing();
      getcertificates();
      getiltAssessment();
      getStatusList();
      getnotificationList();
      getcategories();
      if (trainingId) {
        getEclassDetails(trainingId);
      }
    }
  }, []);

  const generateRandomCourseId = () => {
    const min = 100001;
    const max = 999999;
    const rand = Math.floor(min + Math.random() * (max - min));
    return rand;
  };

  const getEclassDetails = async (trainingId) => {
    try {
      const res = await getApiCall("getCourseLibraryById", trainingId);
      setEClassDetails(res);
      setImgData(res.imageUrl);
      setHandoutData(
        res.handouts.map((e) => ({
          name: e.name,
          blob: e.blob,
          format: e.format,
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

  //Reference code API

  const [refListing, setrefListing] = useState([]);
  const getreferenceCode = async () => {
    try {
      const res = await getApiCall("getReferenceCodeOptionList");
      setrefListing(res);
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

  //Category List API

  const [categoryList, setcategoryList] = useState([]);

  const getcategories = async () => {
    try {
      const res = await getApiCall("getCategoryOptionList");
      setcategoryList(
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
      getcategories();
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

  //Certificate Listing API
  const [certificateList, setcertificateList] = useState([]);

  const getcertificates = async () => {
    try {
      const res = await getApiCall("getCertificateOptionList");
      setcertificateList(res);
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

  //ILT Assessment Listing

  const [iltAssessment, setiltAssessment] = useState([]);

  const getiltAssessment = async () => {
    try {
      const res = await getApiCall("getIltEnrollmentList");
      setiltAssessment(res);
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

  //Status listing

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

  //Notification Listing

  const [notification1, setnotification1] = useState([]);

  const getnotificationList = async () => {
    try {
      const res = await getApiCall("getTrainingNotificationList");
      setnotification1(
        res.map((e) => ({
          trainingNotificationId: e.notificationId,
          notificationName: e.notificationName,
          notificationType: e.notificationType,
          notificationOn: 0,
          isActive: 1,
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

  // console.log("Form", JSON.stringify(form));

  useMemo(() => {
    setForm({
      ...form,
      courseTitle: eClassDetails.courseTitle,
      description: eClassDetails.description,
      category: eClassDetails.category.map((e) => ({
        label: e.categoryName,
        value: e.categoryId,
      })),
      referenceCode: eClassDetails.referenceCode,
      credit: eClassDetails.credits,
      creditVisibility: eClassDetails.creditVisibility,
      certificate: eClassDetails.certificateId,
      iltAssessment: eClassDetails.iltEnrollmentId,
      activityReviews: eClassDetails.activityReviews,
      enrollmentType: eClassDetails.enrollmentType,
      notifications: eClassDetails.notifications,
      status: eClassDetails.trainingStatusId,
      unenrollment: eClassDetails.unenrollment,
      expirationLength: eClassDetails.expirationLength,
      expirationTime: eClassDetails.expirationTime,
      hours: eClassDetails.hours,
      minutes: eClassDetails.minutes,
    });

    if (eClassDetails.notifications?.length > 0) {
      eClassDetails.notifications.map((item) => {
        if (item.notificationOn === 1) {
          setChecked(true);
          setNotificationPop("true");
        }
      });
    }
    setCourseStatus(eClassDetails.trainingStatusId);
    // console.log("categroy", );
  }, [eClassDetails]);

  const getNotificationCheck = (id) => {
    let not =
      form.notifications &&
      form.notifications.find((e) => e.trainingNotificationId === id);

    let not2 =
      notification1 &&
      notification1.find((e) => e.trainingNotificationId === id);

    if (not) {
      return not.notificationOn === 1;
    } else if (not2) {
      return not2.notificationOn === 1;
    }
  };

  const addClassroom = async (form) => {
    setLoading1(true);
    try {
      const res = await postApiCall("addCourseLibrary", form);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Classroom Added Successfully",
        life: 3000,
      });
      setLoading1(false);
      setTimeout(() => {
        navigate("/superadmin/courselibrarylist");
      }, 1500);
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

  const updateClassroom = async (form) => {
    setLoading1(true);
    try {
      const res = await generalUpdateApi("updateCourseLibrary", form);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Classroom Updated Successfully",
        life: 3000,
      });
      setLoading1(false);
      localStorage.removeItem("courseLibraryId");
      setTimeout(() => {
        navigate("/superadmin/courselibrarylist");
      }, 3000);
    } catch (err) {
      setLoading1(false);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Updating Course Course",
        life: 3000,
      });
    }
  };

  //Validations

  const [validationMessages, setValidationMessages] = useState({});
  const [showValidationMessages, setShowValidationMessages] = useState(false);
  const [isSecondTabDisabled, setIsSecondTabDisabled] = useState(true);
  const [isThirdTabDisabled, setIsThirdTabDisabled] = useState(true);

  const validateForm = (e) => {
    const messages = {};
    let isValid = true;

    if (!form.courseTitle) {
      messages.courseTitle = "Course Title is required";
      isValid = false;
    } else {
      messages.courseTitle = "";
    }

    if (!form.referenceCode) {
      messages.referenceCode = "Course Code is required";
      isValid = false;
    } else {
      messages.referenceCode = "";
    }

    if (!form.category) {
      messages.category = "Categories is required";
      isValid = false;
    } else {
      messages.category = "";
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
    if (notificationPop === "true") {
      if (!checked) {
        messages.notificationPop = "Please select at least one Notification";
        isValid = false;
      }
    }

    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };

  const validateForm3 = (e) => {
    const messages = {};
    let isValid = true;
    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };

  const handleAdd = () => {
    if (validateForm3()) {
      let formData = new FormData();

      formData.append("trainingType", form.trainingType);
      formData.append("courseTitle", form.courseTitle);
      formData.append("description", form.description);
      formData.append(
        "category",
        form.category && form.category.map((e) => e.value)
      );

      formData.append("trainingContent", form.trainingContent);
      formData.append("referenceCode", form.referenceCode);
      formData.append("credit", form.credit);
      formData.append("creditVisibility", 1);
      formData.append("point", form.point);
      formData.append("pointVisibility", form.pointVisibility);
      formData.append("certificate", form.certificate);
      formData.append("isActive", form.isActive);
      formData.append("passingScore", form.passingScore);
      formData.append("sslForAicc", form.sslForAicc);
      formData.append("status", courseStatus ? courseStatus : 1);
      formData.append("media", form.media);
      formData.append("courseImage", form.courseImage);
      formData.append("iltAssessment", form.iltAssessment);
      formData.append("activityReviews", form.activityReviews);
      formData.append("enrollmentType", form.enrollmentType);
      formData.append("unenrollment", form.unenrollment);
      formData.append("notifications", JSON.stringify(updatedData));
      for (let i = 0; i < uploadedFiles.length; i++) {
        formData.append("handouts[]", uploadedFiles[i]);
      }

      formData.append("Video", form.Video);
      formData.append("expirationTime", form.expirationTime);
      formData.append("expirationLength", form.expirationLength);
      formData.append("hours", form.hours);
      formData.append("minutes", form.minutes);

      if (formData) {
        addClassroom(formData);
      }
    }
  };

  const updatedData = notification1.map((item) => {
    const updatedItem = { ...item };
    const match =
      form.notifications &&
      form.notifications.find(
        (d) => d.trainingNotificationId === item.trainingNotificationId
      );
    if (match) {
      updatedItem.notificationOn = match.notificationOn;
    }
    return updatedItem;
  });

  const handleUpdate = () => {
    localStorage.removeItem("courseLibraryId");

    if (validateForm3()) {
      let formData = new FormData();
      formData.append("trainingId", trainingId1);
      formData.append("trainingType", form.trainingType);
      formData.append("courseTitle", form.courseTitle);
      formData.append("description", form.description);
      formData.append(
        "category",
        form.category && form.category.map((e) => e.value)
      );
      formData.append("trainingContent", form.trainingContent);
      formData.append("referenceCode", form.referenceCode);
      formData.append("credit", form.credit);
      formData.append("creditVisibility", 1);
      formData.append("point", form.point);
      formData.append("pointVisibility", form.pointVisibility);
      formData.append("certificate", form.certificate);
      formData.append("isActive", form.isActive);
      formData.append("passingScore", form.passingScore);
      formData.append("sslForAicc", form.sslForAicc);
      formData.append("status", courseStatus);
      formData.append("media", form.media);
      formData.append("iltAssessment", form.iltAssessment);
      formData.append("activityReviews", form.activityReviews);
      formData.append("enrollmentType", form.enrollmentType);
      formData.append("unenrollment", form.unenrollment);

      formData.append("notifications", JSON.stringify(updatedData));
      formData.append(
        "courseImage",
        form.courseImage === undefined ? "" : form.courseImage
      );

      for (let i = 0; i < uploadedFiles.length; i++) {
        formData.append("handouts[]", uploadedFiles[i]);
      }

      formData.append("Video", form.Video);
      formData.append("expirationTime", form.expirationTime);
      formData.append("expirationLength", form.expirationLength);
      formData.append("hours", form.hours);
      formData.append("minutes", form.minutes);

      if (formData) {
        updateClassroom(formData);
      }
    }
  };

  const handleNotifications = (e, rowData) => {
    const { value, checked } = e.target;
    setChecked(checked);
    const isChecked = checked ? 1 : 0;

    setnotification1(
      notification1.map((item) =>
        item.trainingNotificationId === parseInt(value)
          ? { ...item, notificationOn: isChecked }
          : item
      )
    );

    setForm({
      ...form,
      notifications:
        form.notifications &&
        form.notifications.map((item) =>
          item.trainingNotificationId === parseInt(value)
            ? { ...item, notificationOn: isChecked }
            : item
        ),
    });
  };

  const handleNextButtonInFirstTabClick = () => {
    if (trainingId1 ||validateForm()) {
      setActiveIndex1(1);
      setIsSecondTabDisabled(false);
    }
  };
  const handleNextButtonInSecondTabClick = () => {
    if (trainingId1 ||validateForm2()) {
      setActiveIndex1(2);
      setIsThirdTabDisabled(false);
    }
  };

  const arr = [];
  const fileObjects = [];
  const handleHandoutChange = (e) => {
    const files = e.target.files;

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

  function loadPreview(url) {
    let imgData = "";
    if (url) {
      const extension = url.substring(url.lastIndexOf(".")).substring(1);
      if (extension) {
        pdfjsLib.getDocument(url).promise.then((pdf) => {
          pdf.getPage(1).then((page) => {
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
              setPdfPrev(imgData);
            });
          });
        });
        return pdfPrev;
      }
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

  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
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
                  <CForm
                    className={`row g-15 needs-validation InputThemeColor${themes}`}
                    onFinish={addClassroom}
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

                          {/* generateCourseId button */}
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
                            className="col-sm-2 col-form-label fw-bolder fs-7 "
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
                              options={categoryList}
                              value={form.category}
                              onCreateOption={handleCreateCategory}
                              onChange={(e) => {
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
                              onKeyDown={(e) => {
                                if (e.key === "e" || e.key === "E") {
                                  e.preventDefault();
                                }
                              }}
                              type="number"
                              id="validationCustom01"
                              required
                              placeholder="Credits"
                              value={form.credit}
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  credit: e.target.value,
                                });
                              }}
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
                            Credits Visibility
                          </CFormLabel>
                          <div className="col-sm-7">
                            <CFormSwitch
                              size="xl"
                              checked={form.isActive === 1}
                              onChange={(e) =>
                                e.target.checked
                                  ? setForm({ ...form, isActive: 1 })
                                  : setForm({ ...form, isActive: 0 })
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
                              <option value={0}>Select Certificate</option>

                              {certificateList &&
                                certificateList.map(
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
                            className="col-sm-4 col-form-label fw-bolder fs-7"
                          >
                            Unenrollment
                          </CFormLabel>
                          <div className="col-sm-7">
                            <CFormSwitch
                              size="xl"
                              value={form.unenrollment}
                              checked={form.unenrollment === 1}
                              onChange={(e) =>
                                e.target.checked
                                  ? setForm({ ...form, unenrollment: 1 })
                                  : setForm({ ...form, unenrollment: 0 })
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
                            className="col-sm-4 col-form-label fw-bolder fs-7"
                          >
                            Enrollment
                          </CFormLabel>
                          <div className="col-sm-7">
                            <CFormSelect
                              required
                              aria-label="select example"
                              value={form.iltAssessment}
                              onChange={(f) =>
                                setForm({
                                  ...form,
                                  iltAssessment: f.target.value,
                                })
                              }
                            >
                              <option value={0}>Select Enrollment</option>

                              {iltAssessment &&
                                iltAssessment.map(
                                  (e) =>
                                    e.enrollmentType && (
                                      <option
                                        key={e.iltEnrollmentId}
                                        value={e.iltEnrollmentId}
                                      >
                                        {e.enrollmentType}
                                      </option>
                                    )
                                )}
                            </CFormSelect>
                          </div>
                        </CRow>
                      </CCol>
                      <CCol md={6}>
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-4 col-form-label fw-bolder fs-7"
                          >
                            Activity Reviews
                          </CFormLabel>
                          <div className="col-sm-7">
                            <CFormSwitch
                              size="xl"
                              id="formSwitchCheckDefaultXL"
                              defaultChecked
                              checked={form.activityReviews === 1}
                              onChange={(e) =>
                                e.target.checked
                                  ? setForm({ ...form, activityReviews: 1 })
                                  : setForm({ ...form, activityReviews: 0 })
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
                </CCardBody>
                <CCardFooter>
                  <div className="d-flex justify-content-end">
                    <Link
                      to="/superadmin/courselibrarylist"
                      className={`btn btn-primary me-2 saveButtonTheme${themes}`}
                      onClick={() => {
                        localStorage.removeItem("courseLibraryId");
                      }}
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
        <TabPanel header="Notification" disabled={isSecondTabDisabled}>
          <CRow>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>Notifications</strong>
                </CCardHeader>
                <CCardBody className="card-body org border-top p-9">
                  <CForm
                    className={`row g-15 needs-validation InputThemeColor${themes}`}
                  >
                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-5 col-form-label fw-bolder fs-7"
                          >
                            <span className="required">
                              Activity Notifications
                            </span>{" "}
                            :
                          </CFormLabel>
                          <div className="col-sm-7 py-2">
                            <CFormCheck
                              inline
                              type="radio"
                              name="sslForAicc"
                              id="inlineCheckbox1"
                              value={"true"}
                              label="Yes"
                              checked={notificationPop === "true"}
                              onChange={(e) => {
                                setNotificationPop(e.target.value);
                              }}
                            />
                            <CFormCheck
                              inline
                              type="radio"
                              name="sslForAicc"
                              id="inlineCheckbox2"
                              value={"false"}
                              label="No"
                              checked={notificationPop === "false"}
                              onChange={(e) => {
                                setNotificationPop(e.target.value);
                              }}
                            />
                            {showValidationMessages &&
                              validationMessages.notificationPop && (
                                <div
                                  className="fw-bolder"
                                  style={{ color: "red" }}
                                >
                                  {validationMessages.notificationPop}
                                </div>
                              )}
                          </div>
                        </CRow>
                      </CCol>
                    </CRow>
                    {notificationPop === "true" && (
                      <CRow className="mb-3">
                        <CCol md={4}>
                          <CRow className="mb-3">
                            <div className="col-sm-12">
                              <CCard className="mb-4">
                                <CCardHeader>
                                  <strong>User Notificatons</strong>
                                </CCardHeader>
                                <CCardBody className="card-body org border-top p-9">
                                  <CForm className="row g-15 needs-validation">
                                    {notification1 &&
                                      notification1
                                        .filter(
                                          (obj) =>
                                            obj.notificationType ==
                                            "User Notifications"
                                        )
                                        .map((d) => (
                                          <div>
                                            <input
                                              type="checkbox"
                                              className="form-check-input"
                                              id={d.trainingNotificationId}
                                              value={d.trainingNotificationId}
                                              checked={getNotificationCheck(
                                                d.trainingNotificationId
                                              )}
                                              defaultValue={false}
                                              onChange={(e) =>
                                                handleNotifications(e, d)
                                              }
                                            />{" "}
                                            {d.notificationName}
                                          </div>
                                        ))}
                                  </CForm>
                                </CCardBody>
                              </CCard>
                            </div>
                          </CRow>
                        </CCol>
                        <CCol md={4}>
                          <CRow className="mb-3">
                            <div className="col-sm-12">
                              <CCard className="mb-4">
                                <CCardHeader>
                                  <strong>Superviser Notifications</strong>
                                </CCardHeader>
                                <CCardBody
                                  className="card-body org border-top p-9"
                                  style={{ height: "14.1rem" }}
                                >
                                  <CForm className="row g-15 needs-validation">
                                    {notification1 &&
                                      notification1
                                        .filter(
                                          (obj) =>
                                            obj.notificationType ==
                                            "Supervisor Notifications"
                                        )
                                        .map((d) => (
                                          <div>
                                            <input
                                              type="checkbox"
                                              className="form-check-input"
                                              id={d.trainingNotificationId}
                                              value={d.trainingNotificationId}
                                              checked={getNotificationCheck(
                                                d.trainingNotificationId
                                              )}
                                              defaultValue={false}
                                              onChange={(e) =>
                                                handleNotifications(e, d)
                                              }
                                            />{" "}
                                            {d.notificationName}
                                          </div>
                                        ))}
                                  </CForm>
                                </CCardBody>
                              </CCard>
                            </div>
                          </CRow>
                        </CCol>
                        <CCol md={4}>
                          <CRow className="mb-3">
                            <div className="col-sm-12">
                              <CCard className="mb-4">
                                <CCardHeader>
                                  <strong>Instructor Notifications</strong>
                                </CCardHeader>
                                <CCardBody
                                  className="card-body org border-top p-9"
                                  style={{ height: "14.1rem" }}
                                >
                                  <CForm
                                    className={`row g-15 needs-validation InputThemeColor${themes}`}
                                  >
                                    {notification1 &&
                                      notification1
                                        .filter(
                                          (obj) =>
                                            obj.notificationType ==
                                            "Instructor Notifications"
                                        )
                                        .map((d) => (
                                          <div>
                                            <input
                                              type="checkbox"
                                              className="form-check-input"
                                              id={d.trainingNotificationId}
                                              value={d.trainingNotificationId}
                                              checked={getNotificationCheck(
                                                d.trainingNotificationId
                                              )}
                                              defaultValue={false}
                                              onChange={(e) =>
                                                handleNotifications(e, d)
                                              }
                                            />{" "}
                                            {d.notificationName}
                                          </div>
                                        ))}
                                  </CForm>
                                </CCardBody>
                              </CCard>
                            </div>
                          </CRow>
                        </CCol>
                      </CRow>
                    )}
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
                          jpeg, jpg, png, docx, pdf."
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
                                  // disabled={isSecondTabDisabled}
                                  className={`btn btn-primary me-2 align-items-start `}
                                >
                                  Next
                                </CButton>
                              </div>
                            </>
                          )}
                        </CRow>
                      </CCol>
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
                    {trainingId1 != null ? (
                      <CButton
                        className={`btn btn-primary me-2 saveButtonTheme${themes}`}
                        onClick={(e) => {
                          localStorage.removeItem("courseLibraryId");
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
                    ) : (
                      <CButton
                        className={`btn btn-primary me-2 saveButtonTheme${themes}`}
                        onClick={(e) => handleAdd(e)}
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

export default AddClassRoomLibraryPage;
