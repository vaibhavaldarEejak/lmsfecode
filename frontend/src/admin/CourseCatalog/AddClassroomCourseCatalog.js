import React, { useEffect, useState, useRef, useMemo } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { ProgressBar } from "primereact/progressbar";
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
import axios from "axios";
import { InputCustomEditor } from "../../superadmin/CourseLibrary/EditorBox/InputCustomEditor";
import { useNavigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
import { Tooltip } from "primereact/tooltip";
import getApiCall from "src/server/getApiCall";
import "../../css/form.css";
import postApiCall from "src/server/postApiCall";
const AddClassroomCourseCatalog = () => {
  const [notificationPop, setNotificationPop] = useState("false");
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const assignid = window.location.href.split("?")[2];
  const [checked, setChecked] = useState(false);
  const [eClassDetails, setEClassDetails] = useState();
  const [learningDetails, setlearningDetails] = useState([]);

  const [trainingId1, settrainingId1] = useState();

  // const trainingId = window.location.href.split("?")[1];
  let trainingId = "";
  useEffect(() => {
    trainingId = localStorage.getItem("courseLibraryId");
    settrainingId1(trainingId);
  }, []);

  const [activeIndex1, setActiveIndex1] = useState(0);
  const toast = useRef(null);
  const navigate = useNavigate();
  const [isSecondTabDisabled, setIsSecondTabDisabled] = useState(true);
  const [isThirdTabDisabled, setIsThirdTabDisabled] = useState(true);
  const [imgData, setImgData] = useState(null);
  const [handoutData, setHandoutData] = useState([]);
  const [validationMessages, setValidationMessages] = useState({});
  const [isloading, setLoading1] = useState(false);
  const [showValidationMessages, setShowValidationMessages] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(0);
  const [courseType, setCourseType] = useState();
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({
    activityReviews: 1,
    trainingType: 2,
    courseTitle: "",
    description: "",
    category: [],
    referenceCode: "",
    courseImage: "",
    credit: "",
    creditVisibility: 0,
    point: "",
    pointVisibility: 0,
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
    sslForAicc: "",
    trainingContent: 0,
    passingScore: 0,
    media: "",
    Video: "",
    expirationTime: "",
    expirationLength: "",
    hours: 0,
    customFields: "",
    minutes: 0,
  });
  const [refCode, setRefCode] = useState();
  const [refCode1, setRefCode1] = useState();
  const getCourseListing = async () => {
    setFormLoading(true);
    try {
      const res = await getApiCall("getCourseCatalogList");
      if (!trainingId) {
        if (
          (res.length > 0 && res[0].referenceCode === null) ||
          res.length === 0
        ) {
          setRefCode1(100001);
          setForm({
            ...form,
            referenceCode: 100001,
            isActive: 1,
            creditVisibility: 1,
            pointVisibility: 1,
            unenrollment: 1,
            activityReviews: 1,
            category: null,
          });
        } else {
          let newNumber = parseInt(res[0].referenceCode);
          setRefCode(`${newNumber + 1}`);
          setForm({
            ...form,
            // referenceCode: newNumber + 1,
            isActive: 1,
            creditVisibility: 1,
            pointVisibility: 1,
            unenrollment: 1,
            activityReviews: 1,
            category: null,
          });
        }
      }
    } catch (err) {}
  };
  const [changeState, setChangeState] = useState(true);
  useEffect(() => {
    if (changeState === true) {
      setForm({
        ...form,
        referenceCode: refCode ? refCode : refCode1,
      });
      setChangeState(false);
    }
    console.log({ refCode });
  }, [refCode, changeState]);
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

  const [uploadedFiles, setUploadedFiles] = useState([]);

  const [newCustomField, setNewCustomField] = useState();

  useEffect(() => {
    if (token !== "Bearer null") {
      getCourseListing();
      // getreferenceCode();
      categoryList();
      getcertificates();
      getiltAssessment();
      getStatusList();
      getnotificationList();
      if (trainingId) {
        getEclassDetails(trainingId);
      }
    }
  }, []);

  const getEclassDetails = async (trainingId) => {
    axios
      .get(`${API_URL}/getCourseCatalogById/${trainingId}`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        setEClassDetails(response.data.data);
        setImgData(response.data.data.imageUrl);
        setHandoutData(
          response.data.data.handouts.map((e) => ({
            name: e.name,
            blob: e.blob,
            format: e.format,
          }))
        );
      })
      .catch((error) => {});
  };

  //Reference code API

  const [refListing, setrefListing] = useState([]);
  const getreferenceCode = () => {
    axios
      .get(`${API_URL}/getReferenceCodeOptionList`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setrefListing(response.data.data);
      });
  };

  //Category List API

  const categoryList = () => {
    axios
      .get(`${API_URL}/getOrganizationCategoryOptionList`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setCategoryListing(
          response.data.data.map((e) => ({
            label: e.categoryName,
            value: e.categoryId,
          }))
        );
      });
  };
  const [categoryListing, setCategoryListing] = useState();
  const addCategoryApi = async (text) => {
    try {
      const res = await axios.post(
        `${API_URL}/addOrganizationCategory`,
        { categoryName: text },
        {
          headers: { Authorization: token },
        }
      );

      if (res && res.data.data) {
        const { categoryId, categoryName } = res.data.data;

        // Update the state correctly
        setCategoryListing((prevCategories) => [
          ...prevCategories,
          { label: categoryName, value: categoryId },
        ]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCreateCategory = async (text) => {
    await addCategoryApi(text);

    // Use categoryListing to get category IDs
    const categoryIds = categoryListing.map((category) => category.value);

    // Update the state correctly
    setForm((prevForm) => ({
      ...prevForm,
      category: [
        ...(prevForm.category || []),
        {
          value: categoryIds[categoryIds.length - 1], // Use the last added category ID
          label: text,
        },
      ],
    }));
  };

  const handleChangeCategory = (value) => {
    setForm({ ...form, category: value });
  };

  //Certificate Listing API
  const [certificateList, setcertificateList] = useState([]);

  const getcertificates = () => {
    axios
      .get(`${API_URL}/getOrgCertificateOptionList`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setcertificateList(response.data.data);
      });
  };

  //ILT Assessment Listing

  const [iltAssessment, setiltAssessment] = useState([]);

  const getiltAssessment = () => {
    axios
      .get(`${API_URL}/getIltEnrollmentList`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setiltAssessment(response.data.data);
      });
  };

  //Status listing

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

  //Notification Listing

  const [notificationListing, setnotificationListing] = useState([]);
  const [notification1, setnotification1] = useState([]);

  const getnotificationList = () => {
    setFormLoading(true);
    axios
      .get(`${API_URL}/getTrainingNotificationList`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setnotificationListing(response.data.data);
        setnotification1(
          response.data.data.map((e) => ({
            trainingNotificationId: e.notificationId,
            notificationName: e.notificationName,
            notificationType: e.notificationType,
            notificationOn: 0,
            isActive: 1,
          }))
        );
        setFormLoading(false);
      });
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
    setForm({
      ...form,
      courseTitle: eClassDetails?.courseTitle,
      description: eClassDetails?.description || "",
      category: eClassDetails?.category.map((e) => ({
        label: e.categoryName,
        value: e.categoryId,
      })),
      referenceCode: eClassDetails?.referenceCode,
      credit: eClassDetails?.credits,
      creditVisibility: eClassDetails?.creditVisibility,
      certificate: eClassDetails?.certificateId,
      isActive: eClassDetails?.isActive,
      iltAssessment: eClassDetails?.iltEnrollmentId,
      activityReviews: eClassDetails?.activityReviews,
      enrollmentType: eClassDetails?.enrollmentType,
      notifications: eClassDetails?.notifications,
      status: eClassDetails?.trainingStatusId,
      unenrollment: eClassDetails?.unenrollment,
      expirationLength: eClassDetails?.expirationLength,
      expirationTime: eClassDetails?.expirationTime,
      hours: eClassDetails?.hours,
      customFields: eClassDetails?.customFields,
      minutes: eClassDetails?.minutes,
    });
    if (eClassDetails?.notifications?.length > 0) {
      eClassDetails?.notifications.map((item) => {
        if (item.notificationOn === 1) {
          setChecked(true);
          setNotificationPop("true");
        }
      });
    }
    setIsEnrolled(eClassDetails?.isEnrolled);
    setCourseType(eClassDetails?.courseType);
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

  const addClassroom = (form) => {
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
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Classroom Added Successfully",
            life: 3000,
          });
        }
        setTimeout(() => {
          navigate("/admin/trainingLibraryInternal");
        }, 1000);
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

  const updateClassroom = (form) => {
    let url = "";

    url = `${API_URL}/updateCourseCatalog/?_method=PUT`;

    setLoading1(true);
    axios
      .post(url, form, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setLoading1(false);
        if (response) {
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Classroom Updated Successfully",
            life: 3000,
          });
        }
        setTimeout(() => {
          navigate("/admin/trainingLibraryInternal");
        }, 3000);
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error Updating Course",
          life: 3000,
        });
      });
  };
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
      formData.append("referenceCode", refCode ? refCode : refCode1);
      formData.append("credit", form.credit);
      formData.append("creditVisibility", 1);
      formData.append("point", form.point);
      formData.append("pointVisibility", form.pointVisibility);
      formData.append("certificate", form.certificate);
      formData.append("isActive", 1);
      formData.append("passingScore", form.passingScore);
      formData.append("sslForAicc", form.sslForAicc);
      formData.append("status", form.status);
      formData.append("media", form.media);
      formData.append(
        "courseImage",
        form.courseImage === undefined ? "" : form.courseImage
      );
      formData.append("iltAssessment", form.iltAssessment);
      formData.append("activityReviews", form.activityReviews);
      formData.append("enrollmentType", form.enrollmentType);
      formData.append("unenrollment", form.unenrollment);
      formData.append("notifications", JSON.stringify(updatedData));
      for (let i = 0; i < uploadedFiles.length; i++) {
        formData.append("handouts[]", uploadedFiles[i]);
      }

      formData.append("Video", form.Video);
      formData.append("isEnrolled", isEnrolled);
      formData.append("courseType", courseType);
      formData.append("expirationTime", form.expirationTime);
      formData.append("expirationLength", form.expirationLength);
      formData.append("hours", form.hours);
      formData.append("minutes", form.minutes);
      formData.append(
        "customFields",
        form.customFields ? JSON.stringify(form.customFields) : ""
      );
      if (formData) {
        addClassroom(formData);
      }
    }
  };

  const updatedData = notification1.map((item) => {
    const updatedItem = { ...item }; // create a copy of the item object
    const match =
      form.notifications &&
      form.notifications.find(
        (d) => d.trainingNotificationId === item.trainingNotificationId
      ); // find the matching object in data2
    if (match) {
      updatedItem.notificationOn = match.notificationOn; // update the isChecked property
    }
    return updatedItem; // return the updated object
  });

  const handleUpdate = () => {
    if (validateForm3()) {
      if (form.courseImage === undefined) {
        setForm({
          ...form,
          courseImage: "",
        });
      }
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
      formData.append("status", form.status);
      formData.append("media", form.media);
      formData.append("iltAssessment", form.iltAssessment);
      formData.append("activityReviews", form.activityReviews);
      formData.append("enrollmentType", form.enrollmentType);
      formData.append("unenrollment", form.unenrollment);

      formData.append("notifications", JSON.stringify(updatedData));
      formData.append("courseImage", form.courseImage);

      for (let i = 0; i < uploadedFiles.length; i++) {
        formData.append("handouts[]", uploadedFiles[i]);
      }
      formData.append("Video", form.Video);
      formData.append("isEnrolled", isEnrolled);
      formData.append("courseType", courseType);
      formData.append("expirationTime", form.expirationTime);
      formData.append("expirationLength", form.expirationLength);
      formData.append("hours", form.hours);
      formData.append("minutes", form.minutes);
      formData.append(
        "customFields",
        JSON.stringify(newCustomField?.customField) || ""
      );
      if (formData) {
        updateClassroom(formData);
        localStorage.removeItem("courseLibraryId");
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
  const validateForm = (e) => {
    const messages = {};
    let isValid = true;

    if (!form.courseTitle) {
      messages.courseTitle = "Training Title is required";
      isValid = false;
    } else {
      messages.courseTitle = "";
    }

    // if (!refCode) {
    //   messages.referenceCode = "Training Code is required";
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
  const handleNextButtonInFirstTabClick = () => {
    if (validateForm()) {
      setActiveIndex1(1);
      setIsSecondTabDisabled(false);
    }
  };
  const handleNextButtonInSecondTabClick = () => {
    if (validateForm2()) {
      setActiveIndex1(2);
      setIsThirdTabDisabled(false);
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
              // console.log(imgData);
              // setPdfData(imgData);
              setPdfPrev(imgData);
              // handoutData.push(imgData);
            });
          });
        });
        return pdfPrev;
      }
    }
  }

  const handoutPreview = (arr, idx) => {
    console.log({ arr });
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

  const generateRandomCourseId = () => {
    const min = 100001;
    const max = 999999;
    const rand = Math.floor(min + Math.random() * (max - min));
    return rand;
  };
  const [customField, setCustomField] = useState([]);

  const getUserCustomFields = async () => {
    try {
      const res = await getApiCall("getTrainingCustomFieldList/2");
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
                        value={option?.checked}
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
                    <CForm
                      className="row g-15 needs-validation"
                      onFinish={addClassroom}
                    >
                      <CRow className="mb-1">
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
                                required
                                disabled
                                placeholder="Training Code"
                                aria-label="select example"
                                value={
                                  refCode
                                    ? refCode
                                    : form?.referenceCode || refCode1
                                }
                                onChange={(f) => {
                                  // setForm({
                                  //   ...form,
                                  //   referenceCode: refCode,
                                  // });
                                  setValidationMessages({
                                    ...validationMessages,
                                    referenceCode: refCode
                                      ? ""
                                      : "Training Code is required",
                                  });
                                }}
                              ></CFormInput>
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
                      <CRow className="mb-1">
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
                      <CRow className="mb-1">
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

                      <CRow className="mb-1">
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

                      <CRow className="mb-1">
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
                                defaultChecked
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

                      <CRow className="mb-1">
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

                      <CRow className="mb-1">
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
                      <CRow className="mb-1">
                        {/* <CCol md={6}>
                          <CRow className="mb-3">
                            <CFormLabel
                              htmlFor=""
                              className="col-sm-4 col-form-label fw-bolder fs-7"
                            >
                              Display this Training in Student's Catalog?
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
                      <CRow className="md-1">
                        {trainingId
                          ? addCustomFields(learningDetails.customFields)
                          : addCustomFields(customField)}
                      </CRow>
                    </CForm>
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
        <TabPanel header="Notification" disabled={isSecondTabDisabled}>
          <CRow>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardHeader>
                  <strong>Notifications</strong>
                </CCardHeader>
                <CCardBody className="card-body org border-top p-9">
                  <CForm className="row g-15 needs-validation">
                    <CRow className="mb-1">
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
                      <CRow className="mb-1">
                        <CCol md={4}>
                          <CRow className="mb-3">
                            <div className="col-sm-12">
                              <CCard className="">
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
                                  <CForm className="row g-15 needs-validation">
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
                                              onChange={(e) => {
                                                handleNotifications(e, d);
                                              }}
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
                    <CRow className="mb-1 py-3">
                      {/* <CCol md={6}>
                        <CRow className="mb-2">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-3 col-form-label fw-bolder fs-7"
                          >
                            Training Type (for Students) :
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
                      </CCol> */}
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
                    </CRow>
                    <CRow className="mb-1">
                      {/* <CCol md={6}>
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
                                  // disabled={isSecondTabDisabled}
                                  className={`btn btn-primary me-2 align-items-start `}
                                >
                                  Next
                                </CButton>
                              </div>
                            </>
                          )}
                        </CRow>
                      </CCol> */}
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
                    {trainingId1 != null ? (
                      <>
                        <CButton
                          className="btn btn-primary me-2"
                          onClick={(e) => handleUpdate(e)}
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

export default AddClassroomCourseCatalog;
