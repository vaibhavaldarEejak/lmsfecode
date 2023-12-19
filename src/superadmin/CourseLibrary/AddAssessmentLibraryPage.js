import React, { useEffect, useMemo, useState, useRef } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { useNavigate } from "react-router-dom";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import {
  CCard,
  CCardBody,
  CCol,
  CFormInput,
  CFormLabel,
  CRow,
  CFormSelect,
  CFormSwitch,
  CForm,
  CCardFooter,
  CFormCheck,
  CInputGroup,
  CInputGroupText,
  CButton,
  CImage,
} from "@coreui/react";
import { InputCustomEditor } from "./EditorBox/InputCustomEditor";
import { Toast } from "primereact/toast";
import { Link } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import "../../scss/required.scss";
import { Tooltip } from "primereact/tooltip";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";
import generalUpdateApi from "src/server/generalUpdateApi";
const API_URL = process.env.REACT_APP_API_URL;
import "../../css/form.css";

const AddAssessmentLibraryPage = (questionDto) => {
  const navigate = useNavigate();
  const [trainingId1, settrainingId1] = useState();

  let trainingId = "";
  useEffect(() => {
    trainingId = localStorage.getItem("courseLibraryId");
    settrainingId1(trainingId);
  }, []);

  const toast = useRef(null),
    [handoutData, setHandoutData] = useState([]),
    [imgData, setImgData] = useState(null),
    [pdfPrev, setPdfPrev] = useState(null),
    [uploadedFiles, setUploadedFiles] = useState([]),
    token = "Bearer " + localStorage.getItem("ApiToken"),
    [activeIndex1, setActiveIndex1] = useState(0),
    [questionList, setQuestionList] = useState([]),
    [questionType2, setQuestionType2] = useState([]),
    // trainingId = window.location.href.split("?")[1],
    [assessmentDetails, setassessmentDetails] = useState([]),
    [isloading, setLoading1] = useState(false),
    [courseStatus, setCourseStatus] = useState(1),
    [statusListing, setstatusListing] = useState([]);
  const [form, setForm] = useState({
    assessmentSettingId: null,
    trainingType: 3,
    trainingId: trainingId1,
    courseTitle: "",
    description: "",
    category: [],
    courseTime: "",
    referenceCode: "",
    credit: "",
    creditVisibility: 1,
    displayQuestion: 0,
    point: "",
    quizType: "",
    pointVisibility: 1,
    randomizeQuestion: 1,
    certificate: "",
    isActive: 1,
    courseImage: "",
    handout: "",
    status: 1,
    requirePassingScore: 1,
    passingPercentage: 0,
    displayQuestion: 0,
    hideAfterCompleted: 1,
    attempt: 0,
    learnerCanViewResult: 1,
    postQuizAction: "",
    timerOn: 1,
    hours: 0,
    minutes: 0,
    questionAnswer: questionList && JSON.stringify(questionList),
  });
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

  const generateRandomCourseId = () => {
    const min = 100001;
    const max = 999999;
    const rand = Math.floor(min + Math.random() * (max - min));
    return rand;
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
            pointVisibility: 1,
            creditVisibility: 1,
            requirePassingScore: 1,
            displayQuestion: 0,
            randomizeQuestion: 1,
            timerOn: 1,
            passingPercentage: "",
            learnerCanViewResult: 1,
            hideAfterCompleted: 1,
            postQuizAction: -1,
            description: "",
            status: 1,
          });
        } else {
          setForm({
            ...form,
            referenceCode: parseInt(res[0].referenceCode) + 1,
            pointVisibility: 1,
            creditVisibility: 1,
            requirePassingScore: 1,
            displayQuestion: 0,
            randomizeQuestion: 1,
            timerOn: 1,
            passingPercentage: "",
            learnerCanViewResult: 1,
            hideAfterCompleted: 1,
            postQuizAction: -1,
            description: "",
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

  const addSkill = () => {
    setQuestionList([
      ...questionList,
      {
        id: questionList.length + 1,
        questionType: "",
        questionText: "",
        randomizeAnswer: 0,
        answer: [],
        questionScore: 0,
      },
    ]);
  };

  const addAnswer = (index) => {
    questionList[index].answer.push({
      answerId: questionList[index].answer.length + 1,
      value: "",
      label: "",
    });

    setQuestionList((prevData) => {
      const updatedData = [...prevData];
      const { baseTitle } = prevData[0];

      updatedData[index] = { ...updatedData[index] };

      return updatedData;
    });
  };

  const deleteSkill = (id) => {
    setQuestionList(
      questionList
        .filter((i) => i?.id !== id)
        .map((res, index) => ({ ...res, id: index + 1 }))
    );
  };

  const deleteAnswerSkill = async (index, id) => {
    setQuestionList((prevData) => {
      const updatedData = [...prevData];
      const { baseTitle } = prevData[0];
      updatedData[index] = {
        ...updatedData[index],
        answer: updatedData[index].answer
          .filter((i) => i?.answerId !== id)
          .map((res, index) => ({ ...res, answerId: index + 1 })),
      };

      return updatedData;
    });
  };

  const handleChangeRadioAnswer = async (e, index, ansIndex) => {
    const { checked } = e?.target;

    setQuestionList((prevData) => {
      const updatedData = [...prevData];
      const { baseTitle } = prevData[0];

      updatedData[index] = {
        ...updatedData[index],
        answer: updatedData[index].answer.map((res, index) => ({
          ...res,
          value: index === ansIndex ? checked : false,
        })),
      };

      return updatedData;
    });
  };

  const handleChangeAnswer = (e, index, ansIndex) => {
    const { name, value, checked, type } = e?.target;

    questionList[index].answer[ansIndex][name] =
      type === "checkbox" ? checked : value;

    setQuestionList((prevData) => {
      const updatedData = [...prevData];
      const { baseTitle } = prevData[0];

      updatedData[index] = { ...updatedData[index] };

      return updatedData;
    });
  };

  const getCourseDetailApi = async (trainingId) => {
    try {
      const res = await getApiCall("getCourseLibraryById", trainingId);
      setassessmentDetails(res);
      setQuestionList(
        res.questionAnswer.map((e, index) => ({
          id: index + 1,
          questionId: e.questionId,
          questionType: e.questionTypeId,
          questionText: e.questionText,
          randomizeAnswer: e.randomizeAnswer,
          questionScore: e.questionScore,
          answer: e.answer.map((f) => f),
        }))
      );
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

  const getQuestionType = async () => {
    try {
      const res = await getApiCall("getQuestionTypeList");
      setQuestionType2(res);
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

  const handleChange = (e, index) => {
    const { name, value, checked, type } = e?.target;
    questionList[index][name] = type === "checkbox" ? (checked ? 1 : 0) : value;
    if (name === "questionType") {
      questionList[index].answer = [];
      switch (Number.parseInt(e?.target.value)) {
        case 7:
          questionList[index].answer.push({
            answerId: questionList[index].answer.length + 1,
            value: "",
            label: "",
          });
          break;
        case 6:
          questionList[index].answer.push({
            answerId: questionList[index].answer.length + 1,
            value: "",
            label: "",
          });
          break;
        case 5:
          questionList[index].answer.push({
            answerId: questionList[index].answer.length + 1,
            value: "",
            label: "",
          });
          break;

        case 4:
          questionList[index].answer.push(
            {
              answerId: questionList[index].answer.length + 1,
              value: "",
              label: "Yes",
            },
            {
              answerId: questionList[index].answer.length + 2,
              value: "",
              label: "No",
            }
          );
          break;
        case 3:
          questionList[index].answer.push(
            {
              answerId: questionList[index].answer.length + 1,
              value: "",
              label: "True",
            },
            {
              answerId: questionList[index].answer.length + 2,
              value: "",
              label: "False",
            }
          );
          break;
        case 2:
          questionList[index].answer = [];
          break;
        case 1:
          questionList[index].answer = [];
          break;
      }
    }

    setQuestionList((prevData) => {
      const updatedData = [...prevData];
      const { baseTitle } = prevData[0];

      updatedData[index] = { ...updatedData[index] };

      return updatedData;
    });
  };

  useEffect(() => {
    setForm({
      ...form,
      questionAnswer: questionList,
    });

    setTimeout(() => {
      setLoader(true);
    }, 3000);

    if (form.courseImage === undefined) {
      setForm({
        ...form,
        courseImage: "",
      });
    }
  }, [questionList, form.courseImage, trainingId1]);

  useEffect(() => {
    if (token !== "Bearer null") {
      if (!trainingId1) {
        getCourseListing();
      }

      if (trainingId1) {
        getCourseDetailApi(trainingId1);
      }

      getcategories();
      getcertificates();
      getQuestionType();
      getStatusList();
    }
  }, [trainingId1]);

  const [loader, setLoader] = useState(false);

  //Validations

  const [validationMessages, setValidationMessages] = useState({});
  const [showValidationMessages, setShowValidationMessages] = useState(false);

  const [isSecondTabDisabled, setIsSecondTabDisabled] = useState(true);
  const [isThirdTabDisabled, setIsThirdTabDisabled] = useState(true);
  const [isFourthTabDisabled, setIsFourthTabDisabled] = useState(true);

  const validateForm = (e) => {
    const messages = {};
    let isValid = true;

    if (!form.courseTitle) {
      messages.courseTitle = "Course Title is required";
      isValid = false;
    } else {
      messages.courseTitle = "";
    }

    if (!form.quizType) {
      messages.quizType = "Please select at least one Quiz Type";
      isValid = false;
    } else {
      messages.quizType = "";
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

    if (form.quizType === "Quiz") {
      if (!form.point) {
        messages.point = "Score is required";
        isValid = false;
      } else {
        messages.point = "";
      }

      if (!form.credit) {
        messages.credit = "Credits is required";
        isValid = false;
      } else {
        messages.credit = "";
      }
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
    if (form.quizType === "Quiz") {
      if (!form.passingPercentage) {
        messages.passingPercentage = "Passing Percentage is Required";
        isValid = false;
      } else {
        messages.passingPercentage = "";
      }

      if (!form.postQuizAction) {
        messages.postQuizAction = "Post Quiz Action is Required";
        isValid = false;
      } else {
        messages.postQuizAction = "";
      }

      if (!form.hours) {
        messages.hours = "Course Time is Required";
        isValid = false;
      } else {
        messages.hours = "";
      }
    }

    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };

  const validateForm3 = (e) => {
    const messages = {};
    let isValid = true;

    if (!trainingId) {
      if (!form.questionAnswer) {
        messages.questionAnswer = "Question is required";
        isValid = false;
      } else {
        messages.questionAnswer = "";
      }
    }

    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };

  const validateForm4 = (e) => {
    const messages = {};
    let isValid = true;

    setValidationMessages(messages);
    setShowValidationMessages(!isValid);

    return isValid;
  };

  const handleNextButtonInFirstTabClick = () => {
    if (trainingId1 || validateForm()) {
      setActiveIndex1(1);
      setIsSecondTabDisabled(false);
    }
  };
  const handleNextButtonInSecondTabClick = () => {
    if (trainingId1 || validateForm2()) {
      setActiveIndex1(2);
      setIsThirdTabDisabled(false);
    }
  };

  const handleNextButtonInThirdTabClick = () => {
    if (trainingId1 || validateForm3()) {
      setActiveIndex1(3);
      setIsFourthTabDisabled(false);
    }
  };

  const addCouseButton = (e) => {
    if (validateForm4()) {
      const formdata = new FormData();

      formdata.append("assessmentSettingId", form.assessmentSettingId);
      formdata.append("trainingType", 3);
      formdata.append("trainingId", trainingId);
      formdata.append("courseTitle", form.courseTitle);
      formdata.append("courseImage", form.courseImage);
      formdata.append("description", form.description);
      formdata.append(
        "category",
        form.category && form.category.map((e) => e.value)
      );
      formdata.append("referenceCode", form.referenceCode);
      formdata.append("credit", form.credit);
      formdata.append("creditVisibility", form.creditVisibility || 1);
      formdata.append("displayQuestion", form.displayQuestion);
      formdata.append("point", form.point);
      formdata.append("quizType", form.quizType);
      formdata.append("pointVisibility", form.pointVisibility || 1);
      formdata.append("randomizeQuestion", parseInt(form.randomizeQuestion));
      formdata.append("certificate", form.certificate);
      formdata.append("isActive", 1);

      for (let i = 0; i < uploadedFiles.length; i++) {
        formdata.append("handouts[]", uploadedFiles[i]);
      }

      formdata.append("status", courseStatus ? courseStatus : 1);
      formdata.append("requirePassingcore", parseInt(form.requirePassingScore));
      formdata.append(
        "passingPercentage",
        parseInt(form.passingPercentage) || 0
      );
      formdata.append("hideAfterCompleted", form.hideAfterCompleted);
      formdata.append("attempt", parseInt(form.attempt));
      formdata.append("learnerCanViewResult", form.learnerCanViewResult);
      formdata.append("postQuizAction", form.postQuizAction || "");
      formdata.append("timerOn", form.timerOn);
      formdata.append("hours", form.hours);
      formdata.append("minutes", form.minutes);
      formdata.append("questionAnswer", JSON.stringify(form.questionAnswer));

      addAssessment(e, formdata);
    }
  };

  const updateButton = (e) => {
    let updateFormData = new FormData();
    if (validateForm4()) {
      updateFormData.append("assessmentSettingId", form.assessmentSettingId);
      updateFormData.append("trainingType", 3);
      updateFormData.append("trainingId", trainingId1);
      updateFormData.append("courseTitle", form.courseTitle);
      updateFormData.append(
        "courseImage",
        form.courseImage === "" ? "" : form.courseImage
      );
      updateFormData.append("description", form.description);
      updateFormData.append(
        "category",
        form.category && form.category.map((e) => e.value)
      );
      updateFormData.append("referenceCode", form.referenceCode);
      updateFormData.append("credit", form.credit);
      updateFormData.append("creditVisibility", form.creditVisibility || 1);
      updateFormData.append("displayQuestion", form.displayQuestion);
      updateFormData.append("point", form.point);
      updateFormData.append("quizType", form.quizType);
      updateFormData.append("pointVisibility", form.pointVisibility || 1);
      updateFormData.append(
        "randomizeQuestion",
        parseInt(form.randomizeQuestion)
      );
      updateFormData.append("certificate", form.certificate);
      updateFormData.append("isActive", 1);

      for (let i = 0; i < uploadedFiles.length; i++) {
        updateFormData.append("handouts[]", uploadedFiles[i]);
      }
      updateFormData.append("status", courseStatus);
      updateFormData.append(
        "requirePassingcore",
        parseInt(form.requirePassingScore)
      );
      updateFormData.append(
        "passingPercentage",
        parseInt(form.passingPercentage) || 0
      );
      updateFormData.append("hideAfterCompleted", form.hideAfterCompleted);
      updateFormData.append("attempt", parseInt(form.attempt));
      updateFormData.append("learnerCanViewResult", form.learnerCanViewResult);
      updateFormData.append("postQuizAction", form.postQuizAction || "");
      updateFormData.append("timerOn", form.timerOn);
      updateFormData.append("hours", form.hours);
      updateFormData.append("minutes", form.minutes);
      updateFormData.append("questionAnswer", JSON.stringify(questionList));
      updateAssessment(updateFormData);
    }
  };

  useMemo(() => {
    if (assessmentDetails) {
      setForm({
        assessmentSettingId: assessmentDetails.assessmentSettingId,
        courseTitle: assessmentDetails.courseTitle,
        description: assessmentDetails.description || "",
        category:
          assessmentDetails.category &&
          assessmentDetails.category.map((e) => ({
            label: e.categoryName,
            value: e.categoryId,
          })),
        referenceCode: assessmentDetails.referenceCode,
        credit: assessmentDetails.credit,
        creditVisibility: assessmentDetails.creditVisibility,
        displayQuestion: assessmentDetails.displayType,
        quizType: assessmentDetails.quizType,
        randomizeQuestion: assessmentDetails.randomizeQuestion,
        certificate: assessmentDetails.certificateId,
        //handout: assessmentDetails.handoutUrl,
        status: assessmentDetails.trainingStatusId,
        passingPercentage: assessmentDetails.passingPercentage,
        hideAfterCompleted: assessmentDetails.hideAfterCompleted,
        attempt: assessmentDetails.attempt,
        learnerCanViewResult: assessmentDetails.learnerCanViewResult,
        point: assessmentDetails.points,
        credit: assessmentDetails.credits,
        creditVisibility: assessmentDetails.creditsVisible,
        pointVisibility: assessmentDetails.pointVisibility,
        requirePassingScore: assessmentDetails.requirePassingScore,
        attempt: assessmentDetails.attemptCount,
        timerOn: assessmentDetails.timerOn,
        hours: assessmentDetails.hours,
        minutes: assessmentDetails.minutes,
        postQuizAction: `${assessmentDetails.postQuizAction}`,
      });
      setCourseStatus(assessmentDetails.trainingStatusId);
    }
    setImgData(assessmentDetails.imageUrl);
  }, [assessmentDetails]);

  //Reference code API

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
    } catch (err) {}
  };

  const addCategoryApi = async (text) => {
    const data = {
      categoryName: text,
    };
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
    } catch (err) {}
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
    } catch (err) {}
  };

  const addAssessment = async (e, form) => {
    e.preventDefault();
    setLoading1(true);

    try {
      const res = await postApiCall("addCourseLibrary", form);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Course Added Successfully",
        life: 3000,
      });
      setLoading1(false);
      setTimeout(() => {
        navigate("/superadmin/courselibrarylist");
      }, 1000);
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Adding Course",
        life: 3000,
      });
      setLoading1(false);
    }
  };

  const updateAssessment = async (form) => {
    setLoading1(true);
    localStorage.removeItem("courseLibraryId");
    try {
      const res = await generalUpdateApi("updateCourseLibrary", form);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Course Updated Successfully",
        life: 3000,
      });
      localStorage.removeItem("courseLibraryId");
      setTimeout(() => {
        navigate("/superadmin/courselibrarylist");
      }, 3000);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Updating Course",
        life: 3000,
      });
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
      arr.push({ pdfPrev: imgData, format: "pdf" });
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
                            {/* {loader ? ( */}
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
                                    : "Course Title is required",
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
                            Quiz Type
                          </CFormLabel>
                          <div className="col-sm-7 mt-2">
                            <CFormCheck
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  quizType: e.target.value,
                                });
                                setValidationMessages({
                                  ...validationMessages,
                                  quizType: e.target.value
                                    ? ""
                                    : "Please select at least one Quiz Type",
                                });
                              }}
                              inline
                              checked={form.quizType === "Servey"}
                              type="radio"
                              name="orientation"
                              id="inlineCheckbox1"
                              value="Servey"
                              label="Survey"
                            />
                            <CFormCheck
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  quizType: e.target.value,
                                });
                                setValidationMessages({
                                  ...validationMessages,
                                  quizType: e.target.value
                                    ? ""
                                    : "Please select at least one Quiz Type",
                                });
                              }}
                              inline
                              type="radio"
                              checked={form.quizType === "Quiz"}
                              name="orientation"
                              id="inlineCheckbox2"
                              value="Quiz"
                              label="Quiz"
                            />

                            {showValidationMessages &&
                              validationMessages.quizType && (
                                <div
                                  className="fw-bolder"
                                  style={{ color: "red" }}
                                >
                                  {validationMessages.quizType}
                                </div>
                              )}
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
                            Course Code
                          </CFormLabel>
                          <div className="col-sm-7">
                            <CFormInput
                              required
                              disabled
                              aria-label="select example"
                              placeholder="Course Code"
                              value={form.referenceCode}
                              onChange={(f) => {
                                setForm({
                                  ...form,
                                  referenceCode: f.target.value,
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
                    </CRow>
                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-4 col-form-label fw-bolder fs-7 required"
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
                              onChange={(e) => {
                                setForm({ ...form, point: e.target.value });
                                setValidationMessages({
                                  ...validationMessages,
                                  point: e ? "" : "Score is required",
                                });
                              }}
                            />

                            {showValidationMessages &&
                              validationMessages.point && (
                                <div
                                  className="fw-bolder"
                                  style={{ color: "red" }}
                                >
                                  {validationMessages.point}
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
                            Score Visibility
                          </CFormLabel>
                          <div className="col-sm-7">
                            <CFormSwitch
                              size="xl"
                              id="formSwitchCheckDefaultXL"
                              checked={form.pointVisibility ? true : false}
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
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-4 col-form-label fw-bolder fs-7 required"
                          >
                            Credits
                          </CFormLabel>
                          <div className="col-sm-7">
                            {/* {loader ? ( */}
                            <CFormInput
                              type="number"
                              onKeyDown={(e) => {
                                if (e.key === "e" || e.key === "E") {
                                  e.preventDefault();
                                }
                              }}
                              id="validationCustom01"
                              required
                              checked={form.creditVisibility === 1}
                              placeholder="Credits"
                              value={form.credit}
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  credit: e.target.value,
                                });
                                setValidationMessages({
                                  ...validationMessages,
                                  credit: e ? "" : "Credits is required",
                                });
                              }}
                            />

                            {showValidationMessages &&
                              validationMessages.credit && (
                                <div
                                  className="fw-bolder"
                                  style={{ color: "red" }}
                                >
                                  {validationMessages.credit}
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
                            Credit Visibility
                          </CFormLabel>
                          <div className="col-sm-7">
                            <CFormSwitch
                              size="xl"
                              defaultChecked
                              id="formSwitchCheckDefaultXL"
                              checked={form.creditVisibility === 1}
                              onChange={(e) =>
                                e.target.checked
                                  ? setForm({ ...form, creditVisibility: 1 })
                                  : setForm({ ...form, creditVisibility: 0 })
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
                      <CCol md={6}></CCol>
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
        <TabPanel header="Setting" disabled={isSecondTabDisabled}>
          <CRow>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardBody className="card-body org border-top p-9">
                  <CForm
                    className={`row g-15 needs-validation InputThemeColor${themes}`}
                  >
                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-10 col-form-label fw-bolder fs-7"
                          >
                            <span className="required">
                              Must receive a passing score to achieve completed
                              status
                            </span>
                            :
                          </CFormLabel>
                          <div className="col-sm-2">
                            <CFormSwitch
                              size="xl"
                              name="requirePassingScore"
                              id="formSwitchCheckDefaultXL"
                              checked={form.requirePassingScore}
                              onChange={(e) =>
                                e.target.checked
                                  ? setForm({ ...form, requirePassingScore: 1 })
                                  : setForm({ ...form, requirePassingScore: 0 })
                              }
                            />
                          </div>
                        </CRow>
                      </CCol>
                      <CCol md={6}>
                        <CRow className="mb-3">
                          <div className="col-sm-11">
                            <CFormInput
                              type="number"
                              onKeyDown={(e) => {
                                if (e.key === "e" || e.key === "E") {
                                  e.preventDefault();
                                }
                              }}
                              id="validationCustom01"
                              required
                              placeholder="Passing Score"
                              value={form.passingPercentage}
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  passingPercentage: e.target.value,
                                });

                                setValidationMessages({
                                  ...validationMessages,
                                  passingPercentage: e.target.value
                                    ? ""
                                    : "Passing Percentage is Required",
                                });
                              }}
                            />
                            {showValidationMessages &&
                              validationMessages.passingPercentage && (
                                <div
                                  className="fw-bolder"
                                  style={{ color: "red" }}
                                >
                                  {validationMessages.passingPercentage}
                                </div>
                              )}
                          </div>
                        </CRow>
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={12}>
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-5 col-form-label fw-bolder fs-7 required"
                          >
                            Randomize Questions :
                          </CFormLabel>
                          <div className="col-sm-7">
                            <CFormSwitch
                              size="xl"
                              id="formSwitchCheckDefaultXL"
                              checked={form.randomizeQuestion}
                              onChange={(e) =>
                                e.target.checked
                                  ? setForm({ ...form, randomizeQuestion: 1 })
                                  : setForm({ ...form, randomizeQuestion: 0 })
                              }
                            />
                          </div>
                        </CRow>
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={12}>
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-5 col-form-label fw-bolder fs-7 required"
                          >
                            Display Questions :
                          </CFormLabel>
                          <div className="col-sm-7">
                            <CFormCheck
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  displayQuestion: e.target.checked ? 0 : 1,
                                })
                              }
                              inline
                              defaultChecked
                              checked={form.displayQuestion === 0}
                              type="radio"
                              //name="displayQuestion"
                              id="inlineCheckbox1"
                              value="0"
                              label="Slide View"
                            />
                            <CFormCheck
                              onChange={(e) =>
                                setForm({
                                  ...form,
                                  displayQuestion: e.target.checked ? 1 : 0,
                                })
                              }
                              inline
                              checked={form.displayQuestion === 1}
                              type="radio"
                              id="inlineCheckbox2"
                              value="1"
                              label="List View"
                            />
                          </div>
                        </CRow>
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={12}>
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-5 col-form-label fw-bolder fs-7 required"
                          >
                            Hide completed assessment after being recorded on
                            transcript :
                          </CFormLabel>
                          <div className="col-sm-7">
                            <CFormSwitch
                              size="xl"
                              id="formSwitchCheckDefaultXL"
                              checked={form.hideAfterCompleted}
                              onChange={(e) =>
                                e.target.checked
                                  ? setForm({ ...form, hideAfterCompleted: 1 })
                                  : setForm({ ...form, hideAfterCompleted: 0 })
                              }
                            />
                          </div>
                        </CRow>
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={12}>
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-5 col-form-label fw-bolder fs-7"
                          >
                            <span className="required"># of Attempts</span> :
                          </CFormLabel>
                          <div className="col-sm-6">
                            <CFormInput
                              type="number"
                              onKeyDown={(e) => {
                                if (e.key === "e" || e.key === "E") {
                                  e.preventDefault();
                                }
                              }}
                              id="validationCustom01"
                              required
                              value={form.attempt}
                              placeholder="No. of Attempts"
                              onChange={(e) => {
                                setForm({ ...form, attempt: e.target.value });
                              }}
                            />
                            {showValidationMessages &&
                              validationMessages.attempt && (
                                <div
                                  className="fw-bolder"
                                  style={{ color: "red" }}
                                >
                                  {validationMessages.attempt}
                                </div>
                              )}
                          </div>
                        </CRow>
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={12}>
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-5 col-form-label fw-bolder fs-7"
                          >
                            Allow learner to view the results :
                          </CFormLabel>
                          <div className="col-sm-7">
                            <CFormSwitch
                              size="xl"
                              id="formSwitchCheckDefaultXL"
                              checked={form.learnerCanViewResult === 1}
                              onChange={(e) =>
                                e.target.checked
                                  ? setForm({
                                      ...form,
                                      learnerCanViewResult: 1,
                                    })
                                  : setForm({
                                      ...form,
                                      learnerCanViewResult: 0,
                                    })
                              }
                            />
                          </div>
                        </CRow>
                      </CCol>
                    </CRow>

                    <CRow className="mb-3">
                      <CCol md={12}>
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-5 col-form-label fw-bolder fs-7 required"
                          >
                            Post-Quiz Action :
                          </CFormLabel>
                          <div className="col-sm-7">
                            <CFormCheck
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  postQuizAction: e.target.checked ? "0" : "1",
                                });

                                setValidationMessages({
                                  ...validationMessages,
                                  postQuizAction: (e.target.checked ? "0" : "1")
                                    ? ""
                                    : "Post Quiz Action is Required",
                                });
                              }}
                              inline
                              type="radio"
                              checked={form.postQuizAction === "0"}
                              value={0}
                              name="postQuizAction"
                              label="Display Total Score and Pass/Fail Status Only"
                            />
                            <CFormCheck
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  postQuizAction: e.target.checked ? "1" : "0",
                                });

                                setValidationMessages({
                                  ...validationMessages,
                                  postQuizAction: (e.target.checked ? "1" : "0")
                                    ? ""
                                    : "Post Quiz Action is Required",
                                });
                              }}
                              inline
                              type="radio"
                              checked={form.postQuizAction === "1"}
                              name="postQuizAction"
                              value={1}
                              label="Display Score/Status and Correct Answers"
                            />
                            {showValidationMessages &&
                              validationMessages.postQuizAction && (
                                <div
                                  className="fw-bolder"
                                  style={{ color: "red" }}
                                >
                                  {validationMessages.postQuizAction}
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
                            className="col-sm-10 col-form-label fw-bolder fs-7"
                          >
                            <span className="required">Time Limit</span> :
                          </CFormLabel>
                          <div className="col-sm-2">
                            <CFormSwitch
                              size="xl"
                              id="formSwitchCheckDefaultXL"
                              checked={form.timerOn === 1}
                              onChange={(e) =>
                                e.target.checked
                                  ? setForm({
                                      ...form,
                                      timerOn: 1,
                                    })
                                  : setForm({
                                      ...form,
                                      timerOn: 0,
                                    })
                              }
                            />
                          </div>
                        </CRow>
                      </CCol>
                      <CCol md={6}>
                        <CRow className="mb-3">
                          <div className="col-sm-11">
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

                                  setValidationMessages({
                                    ...validationMessages,
                                    hours: form.hours
                                      ? ""
                                      : "Course Time is Required",
                                  });
                                }}
                              />
                              <CFormInput
                                type="number"
                                value={form.minutes}
                                onKeyDown={(e) => {
                                  if (e.key === "e" || e.key === "E") {
                                    e.preventDefault();
                                  }
                                }}
                                min="1"
                                max="60"
                                aria-label="Minutes"
                                onChange={(e) => {
                                  if (e.target.value > 60) {
                                    e.target.value = 0;
                                  }
                                  setForm({
                                    ...form,
                                    minutes: e.target.value,
                                  });

                                  setValidationMessages({
                                    ...validationMessages,
                                    hours: form.minutes
                                      ? ""
                                      : "Course Time is Required",
                                  });
                                }}
                              />
                            </CInputGroup>
                            {showValidationMessages &&
                              validationMessages.hours && (
                                <div
                                  className="fw-bolder"
                                  style={{ color: "red" }}
                                >
                                  {validationMessages.hours}
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
        <TabPanel header="Question" disabled={isThirdTabDisabled}>
          <CRow>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardBody className="card-body org border-top p-9">
                  <CForm
                    className={`row g-15 needs-validation InputThemeColor${themes}`}
                  >
                    <CRow className="mb-3">
                      <CCol md={12}>
                        <div className="col-sm-12">
                          <div
                            className="accordion"
                            id="accordionPanelsStayOpenExample"
                          >
                            {questionList &&
                              questionList.map((i, index) => (
                                <div
                                  className="accordion-item mt-2"
                                  key={index}
                                >
                                  <h2
                                    className="accordion-header d-flex"
                                    id="panelsStayOpen-headingTwo"
                                  >
                                    <button
                                      className={`accordion-button collapsed accordion-header-q saveButtonTheme${themes}`}
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target={`#panelsStayOpen-collapseTwo${index}`}
                                      aria-expanded="false"
                                      aria-controls="panelsStayOpen-collapseTwo"
                                    >
                                      Question # {i?.id}
                                    </button>
                                    <button
                                      className={`close-button btn btn-light saveButtonTheme${themes}`}
                                      type="button"
                                      onClick={() => deleteSkill(i?.id)}
                                    >
                                      X
                                    </button>
                                  </h2>
                                  <div
                                    id={`panelsStayOpen-collapseTwo${index}`}
                                    className="accordion-collapse collapse"
                                    aria-labelledby="panelsStayOpen-headingTwo"
                                  >
                                    <CRow className="ps-5 py-5">
                                      <CCol xs={12}>
                                        <CRow className="mb-3">
                                          <CCol md={12}>
                                            <CRow className="mb-3">
                                              <CFormLabel
                                                htmlFor=""
                                                className="col-sm-2 col-form-label fw-bolder fs-7 ms-1"
                                              >
                                                Question :
                                              </CFormLabel>
                                              <div className="col-lg-9">
                                                <CFormInput
                                                  type="text"
                                                  id="validationCustom01"
                                                  required
                                                  value={i?.questionText}
                                                  name="questionText"
                                                  size="md"
                                                  placeholder="Question"
                                                  onChange={(e) =>
                                                    handleChange(e, index)
                                                  }
                                                />
                                              </div>
                                            </CRow>
                                          </CCol>
                                        </CRow>

                                        <CRow className="mb-3">
                                          <CCol md={12}>
                                            <CRow className="mb-3">
                                              <CFormLabel
                                                htmlFor=""
                                                className="col-sm-2 col-form-label fw-bolder"
                                              >
                                                Question Type :
                                              </CFormLabel>
                                              <div className="col-sm-9">
                                                <CFormSelect
                                                  name="questionType"
                                                  id="cars"
                                                  size="md"
                                                  className="form-control form-control-white m-1 filter-menu form-select form-select-solid"
                                                  onChange={(e) => {
                                                    handleChange(e, index);
                                                    setValidationMessages({
                                                      ...validationMessages,
                                                      questionType: e
                                                        ? ""
                                                        : "Question Type is required",
                                                    });
                                                  }}
                                                  value={i?.questionType || ""}
                                                >
                                                  <option value="" key="0">
                                                    Select Question type
                                                  </option>
                                                  {questionType2?.map((i) => (
                                                    <option
                                                      value={i?.questionTypeId}
                                                      key={i?.questionTypeId}
                                                    >
                                                      {i?.questionType}
                                                    </option>
                                                  ))}
                                                </CFormSelect>
                                                {showValidationMessages &&
                                                  validationMessages.questionType && (
                                                    <div
                                                      className="fw-bolder"
                                                      style={{ color: "red" }}
                                                    >
                                                      {
                                                        validationMessages.questionType
                                                      }
                                                    </div>
                                                  )}
                                              </div>
                                            </CRow>
                                          </CCol>
                                        </CRow>

                                        <CRow className="mb-3">
                                          <CCol md={12}>
                                            <CRow className="mb-3">
                                              <CFormLabel
                                                htmlFor=""
                                                className="col-sm-2 col-form-label fw-bolder fs-7 ms-1"
                                              >
                                                Score Per Question:
                                              </CFormLabel>
                                              <div className="col-lg-9">
                                                <CFormInput
                                                  type="number"
                                                  onKeyDown={(e) => {
                                                    if (
                                                      e.key === "e" ||
                                                      e.key === "E"
                                                    ) {
                                                      e.preventDefault();
                                                    }
                                                  }}
                                                  id="validationCustom01"
                                                  required
                                                  value={i?.questionScore}
                                                  name="questionScore"
                                                  size="md"
                                                  placeholder="Passing Score"
                                                  onChange={(e) => {
                                                    handleChange(e, index);
                                                  }}
                                                />
                                              </div>
                                            </CRow>
                                          </CCol>
                                        </CRow>
                                        {(Number.parseInt(i?.questionType) ===
                                          2 ||
                                          Number.parseInt(i?.questionType) ===
                                            1 ||
                                          i?.answer.length > 0) && (
                                          <CRow className="mb-3">
                                            <CCol md={6}>
                                              <CRow className="mb-3">
                                                <CFormLabel
                                                  htmlFor=""
                                                  className="col-sm-4 col-form-label fw-bolder fs-7"
                                                >
                                                  Answer :
                                                </CFormLabel>
                                                <div className="col-lg-10 fv-row">
                                                  {i?.answer.map(
                                                    (ans, ansIndex) => (
                                                      <span
                                                        className="fw-bold fs-6"
                                                        key={ansIndex}
                                                      >
                                                        {Number.parseInt(
                                                          i?.questionType
                                                        ) === 7 && (
                                                          <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="fill in the blank"
                                                            name="value"
                                                            onChange={(e) =>
                                                              handleChangeAnswer(
                                                                e,
                                                                index,
                                                                ansIndex
                                                              )
                                                            }
                                                            value={
                                                              ans?.value || ""
                                                            }
                                                          />
                                                        )}
                                                        {Number.parseInt(
                                                          i?.questionType
                                                        ) === 6 && (
                                                          <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Enter Number"
                                                            name="value"
                                                            onChange={(e) =>
                                                              handleChangeAnswer(
                                                                e,
                                                                index,
                                                                ansIndex
                                                              )
                                                            }
                                                            value={
                                                              ans?.value || ""
                                                            }
                                                            onKeyDown={(e) => {
                                                              if (
                                                                e.key === "e" ||
                                                                e.key === "E"
                                                              ) {
                                                                e.preventDefault();
                                                              }
                                                            }}
                                                          />
                                                        )}
                                                        {Number.parseInt(
                                                          i?.questionType
                                                        ) === 5 && (
                                                          <input
                                                            type="text"
                                                            className="form-control"
                                                            name="value"
                                                            onChange={(e) =>
                                                              handleChangeAnswer(
                                                                e,
                                                                index,
                                                                ansIndex
                                                              )
                                                            }
                                                            value={
                                                              ans?.value || ""
                                                            }
                                                          />
                                                        )}
                                                        {(Number.parseInt(
                                                          i?.questionType
                                                        ) === 3 ||
                                                          Number.parseInt(
                                                            i?.questionType
                                                          ) === 4) && (
                                                          <label className="form-check form-check-inline form-check-solid me-5">
                                                            <CFormCheck
                                                              size="xl"
                                                              className="form-check-input"
                                                              name="value"
                                                              type="checkbox"
                                                              value={ans?.value}
                                                              checked={
                                                                ans?.value
                                                              }
                                                              onChange={(e) =>
                                                                handleChangeRadioAnswer(
                                                                  e,
                                                                  index,
                                                                  ansIndex
                                                                )
                                                              }
                                                            />
                                                            <span className="fw-bold ps-2 fs-6">
                                                              {ans?.label}
                                                            </span>
                                                          </label>
                                                        )}

                                                        {Number.parseInt(
                                                          i?.questionType
                                                        ) === 2 && (
                                                          <div className="form-check d-flex align-items-center">
                                                            <CFormCheck
                                                              className="form-check-input widget-9-check"
                                                              type="checkbox"
                                                              size="lg"
                                                              checked={
                                                                ans?.value
                                                              }
                                                              value={ans?.value}
                                                              name="value"
                                                              onChange={(e) =>
                                                                handleChangeAnswer(
                                                                  e,
                                                                  index,
                                                                  ansIndex
                                                                )
                                                              }
                                                            />

                                                            <input
                                                              type="text"
                                                              className="form-control mt-3 m-3"
                                                              name="label"
                                                              onChange={(e) =>
                                                                handleChangeAnswer(
                                                                  e,
                                                                  index,
                                                                  ansIndex
                                                                )
                                                              }
                                                              value={
                                                                ans?.label || ""
                                                              }
                                                            />
                                                            <button
                                                              className="m-3 btn btn-sm btn btn-light"
                                                              type="button"
                                                              onClick={() =>
                                                                deleteAnswerSkill(
                                                                  index,
                                                                  ans?.answerId
                                                                )
                                                              }
                                                            >
                                                              X
                                                            </button>
                                                          </div>
                                                        )}
                                                        {Number.parseInt(
                                                          i?.questionType
                                                        ) === 1 && (
                                                          <div className="form-check d-flex align-items-center">
                                                            <CFormCheck
                                                              key={ansIndex}
                                                              className="form-check-input"
                                                              name="value"
                                                              type="checkbox"
                                                              value={ans?.value}
                                                              checked={
                                                                ans?.value ===
                                                                ""
                                                                  ? 0
                                                                  : ans?.value
                                                              }
                                                              onChange={(e) =>
                                                                handleChangeRadioAnswer(
                                                                  e,
                                                                  index,
                                                                  ansIndex
                                                                )
                                                              }
                                                            />

                                                            <input
                                                              type="text"
                                                              className="form-control mt-3 m-3"
                                                              name="label"
                                                              onChange={(e) =>
                                                                handleChangeAnswer(
                                                                  e,
                                                                  index,
                                                                  ansIndex
                                                                )
                                                              }
                                                              value={
                                                                ans?.label || ""
                                                              }
                                                            />
                                                            <button
                                                              className={`m-3 btn btn-sm btn btn-light saveButtonTheme${themes}`}
                                                              type="button"
                                                              onClick={() =>
                                                                deleteAnswerSkill(
                                                                  index,
                                                                  ans?.answerId
                                                                )
                                                              }
                                                            >
                                                              X
                                                            </button>
                                                          </div>
                                                        )}
                                                      </span>
                                                    )
                                                  )}
                                                  <div className="col-sm-7">
                                                    {(Number.parseInt(
                                                      i?.questionType
                                                    ) === 2 ||
                                                      Number.parseInt(
                                                        i?.questionType
                                                      ) === 1) && (
                                                      <CButton
                                                        className="btn btn-sm btn-light-primary mt-5"
                                                        type="button"
                                                        onClick={() =>
                                                          addAnswer(index)
                                                        }
                                                      >
                                                        Answer
                                                      </CButton>
                                                    )}
                                                  </div>
                                                </div>
                                              </CRow>
                                            </CCol>
                                          </CRow>
                                        )}
                                        {(Number.parseInt(i?.questionType) ===
                                          2 ||
                                          Number.parseInt(i?.questionType) ===
                                            1) && (
                                          <CRow className="mb-3">
                                            <CCol md={6}>
                                              <CRow className="mb-3">
                                                <CFormLabel
                                                  htmlFor=""
                                                  className="col-sm-4 col-form-label fw-bolder fs-7"
                                                >
                                                  Randomize Answer :
                                                </CFormLabel>
                                                <div className="col-sm-7 py-1">
                                                  <CFormSwitch
                                                    type="checkbox"
                                                    size="xl"
                                                    checked={i?.randomizeAnswer}
                                                    onChange={(e) =>
                                                      handleChange(e, index)
                                                    }
                                                    name="randomizeAnswer"
                                                    id="formSwitchCheckDefaultXL"
                                                  />
                                                </div>
                                              </CRow>
                                            </CCol>
                                          </CRow>
                                        )}
                                      </CCol>
                                    </CRow>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                        <CButton
                          onClick={() => addSkill()}
                          className={`mt-2 saveButtonTheme${themes}`}
                          color="primary"
                        >
                          Add Questions
                        </CButton>
                        {showValidationMessages &&
                          validationMessages.questionAnswer && (
                            <div className="fw-bolder" style={{ color: "red" }}>
                              {validationMessages.questionAnswer}
                            </div>
                          )}
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
                    <CButton
                      onClick={handleNextButtonInThirdTabClick}
                      disabled={isThirdTabDisabled}
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
        <TabPanel header="Optional Items" disabled={isFourthTabDisabled}>
          <CRow>
            <CCol xs={12}>
              <CCard className="mb-4">
                <CCardBody className="card-body org border-top p-9">
                  <CForm
                    className={`row g-15 needs-validation InputThemeColor${themes}`}
                  >
                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CRow className="mb-3">
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
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-3 col-form-label fw-bolder fs-7 required"
                          >
                            Status
                          </CFormLabel>
                          <div className="col-sm-7">
                            <CFormSelect
                              required
                              value={courseStatus}
                              aria-label="select example"
                              onChange={(e) => {
                                setCourseStatus(e.target.value);
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
                          </div>
                        </CRow>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
                <CCardFooter>
                  <div className="d-flex justify-content-end">
                    <CButton
                      onClick={() => setActiveIndex1(2)}
                      className={`btn btn-primary me-2 saveButtonTheme${themes}`}
                    >
                      Previous
                    </CButton>
                    {trainingId1 === null ? (
                      <CButton
                        className={`btn btn-primary me-2 saveButtonTheme${themes}`}
                        onClick={addCouseButton}
                        disabled={isloading}
                      >
                        {isloading && (
                          <span
                            class="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        )}
                        Submit
                      </CButton>
                    ) : (
                      <CButton
                        className={`btn btn-primary me-2 saveButtonTheme${themes}`}
                        onClick={() => {
                          localStorage.removeItem("courseLibraryId");
                          updateButton();
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
                        Submit
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

export default AddAssessmentLibraryPage;
