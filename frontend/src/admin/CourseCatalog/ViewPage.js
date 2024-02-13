import React, { useEffect, useState, useRef, useMemo } from "react";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import {
  CCard,
  CCardBody,
  CModalBody,
  CCardHeader,
  CCol,
  CButton,
  CForm,
  CFormLabel,
  CRow,
  CModal,
  CModalHeader,
  CModalFooter,
  CCardFooter,
  CTable,
  CTableBody,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableCaption,
} from "@coreui/react";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";
import "../../scss/required.scss";
import Player from "./Player";
import axios from "axios";
import { Rating } from "primereact/rating";
import { Card } from "primereact/card";
import "../../css/form.css";
const API_URL = process.env.REACT_APP_API_URL;

const ViewPage = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  // const trainingId = window.location.href.split("?")[1];
  let trainingId = "";
  useEffect(() => {
    trainingId = localStorage.getItem("courseLibraryId");
  }, []);
  let assignid = "";
  useEffect(() => {
    assignid = localStorage.getItem("assignId");
  }, []);
  const [courseDetail, setcourseDetail] = useState("");
  const [quizVisible, setQuizVisible] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState([{}]);
  const [visible, setVisible] = useState(false);
  const [extension, setExtension] = useState("");
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaName, setMediaName] = useState("");
  const [form, setform] = useState({
    trainingId: "",
    courseTitle: "",
    certificateName: "",
    trainingType: "",
    description: "",
    trainingStatus: "",
    imageId: "",
  });
  const [imgData, setImgData] = useState(null);

  const [loading, setLoading] = useState(false);

  const [classes, setClasses] = useState([]);
  useEffect(() => {
    if (courseDetail) {
      setform({
        trainingId: courseDetail.trainingId,
        courseTitle: courseDetail.courseTitle,
        quizType: courseDetail.quizType,
        certificateName: courseDetail.certificateName,
        trainingType: courseDetail.trainingType,
        description: courseDetail.description,
        trainingStatus: courseDetail.trainingStatus,
        imageId: courseDetail.imageId,
        displayType: courseDetail.displayType,
      });
      setCurrentQuiz(
        courseDetail.questionAnswer && [
          courseDetail.questionAnswer[currentQuestion],
        ]
      );
    }
  }, [courseDetail]);

  const handleNextButtonClick = (e) => {
    e.preventDefault();
    setCurrentQuiz([courseDetail.questionAnswer[currentQuestion + 1]]);
    setCurrentQuestion(currentQuestion + 1);

    if (currentQuestion >= courseDetail.questionAnswer.length - 1) {
      alert("No More Questions");
      setCurrentQuiz([courseDetail.questionAnswer[currentQuestion]]);
      setCurrentQuestion(currentQuestion);
    }
  };

  const handlePreviousButtonClick = (e) => {
    e.preventDefault();
    setCurrentQuiz([courseDetail.questionAnswer[currentQuestion - 1]]);
    setCurrentQuestion(currentQuestion - 1);

    if (0 === currentQuestion) {
      alert("No More Questions");
      setCurrentQuiz([courseDetail.questionAnswer[currentQuestion]]);
      setCurrentQuestion(currentQuestion);
    }
  };

  const courseDetailApi = (id) => {
    let url = "";
    if (assignid === "") {
      url = `${API_URL}/getCourseCatalogById/${trainingId}`;
    } else {
      url = `${API_URL}/getCourseLibraryById/${trainingId}`;
    }
    setLoading(true);
    axios
      .get(url, {
        headers: { Authorization: token },
      })
      .then((response) => {
        setcourseDetail(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const getClassesById = async (id) => {
    try {
      const response = await axios.get(
        `${API_URL}/getClassesAndSessionsByCourseId/${id} `,
        {
          headers: { Authorization: token },
        }
      );
      setClasses(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (trainingId) {
      courseDetailApi(Number(trainingId));
      getClassesById(Number(trainingId));
    }
  }, [trainingId]);
  const handlePreview = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };

  const UrlBackButton = window.location.href.split("?").slice(-1)[0];
  const [backButtonUrl, setBackButtonUrl] = useState();

  useEffect(() => {
    setBackButtonUrl(UrlBackButton);
  }, []);
  const navigate = useNavigate();
  const handoutPreview1 = (arr, idx) => {
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
            marginTop: "1rem",
            marginLeft: "-2rem",
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
              marginTop: "2rem",
              marginLeft: "-2rem",
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
              marginTop: "1rem",
              marginLeft: "-2rem",
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
            marginTop: "1rem",
            marginLeft: "-2rem",
          }}
          src={arr[idx]?.blob}
          alt="Handout Preview"
        ></img>
      );
    }
  };
  const [currentQuestion11, setCurrentQuestion1] = useState(0);
  const prevHandout = () => {
    setCurrentQuestion1(currentQuestion11 - 1);
    if (0 === currentQuestion11) {
      alert("No More Handouts");
      setCurrentQuestion1(currentQuestion11);
    }
  };

  const nextHandout = () => {
    setCurrentQuestion1(currentQuestion11 + 1);
    if (currentQuestion11 >= courseDetail.handouts?.length - 1) {
      alert("No More Handouts");
      setCurrentQuestion1(currentQuestion11);
    }
  };
  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>{/* <strong>Course Details</strong> */}</CCardHeader>
            <CCardBody className="card-body org border-top p-9">
              <CModal
                visible={quizVisible}
                onClose={() => setQuizVisible(false)}
                size="lg"
              >
                <CModalHeader>
                  <strong>{courseDetail.quizType}</strong>
                </CModalHeader>
                <CModalBody>
                  <div className="container">
                    {courseDetail?.displayType === 0 && currentQuiz ? (
                      /* Quiz Questions modal */
                      <>
                        {currentQuiz.map((e, idx) => (
                          <div className="row" key={idx}>
                            {/* Quiz Questions */}
                            <div className="col-md-9">
                              <div className="card">
                                {e?.questionType === "Text Answer" ||
                                e?.questionType === "Fill in the Blanks" ||
                                e?.questionType === "Numeric Response" ? (
                                  <div className="card-body">
                                    <h5 className="card-title">
                                      Question {currentQuestion + 1}:
                                    </h5>
                                    <p className="card-text">
                                      {e?.questionText}
                                    </p>
                                    {e?.answer &&
                                      e?.answer.map((ans) => (
                                        <div
                                          className="form-group"
                                          key={ans.value}
                                        >
                                          <label htmlFor="exampleInputEmail1">
                                            Answer
                                          </label>
                                          <input
                                            className="form-control"
                                            type="text"
                                            name="answer"
                                            value={ans?.value}
                                            disabled
                                          />
                                        </div>
                                      ))}
                                  </div>
                                ) : (
                                  <div className="card-body">
                                    <h5 className="card-title">
                                      Question {currentQuestion + 1}:
                                    </h5>
                                    <p className="card-text">
                                      {e?.questionText}
                                    </p>
                                    {e?.answer &&
                                      e?.answer.map((ans) => (
                                        <div
                                          className="form-check"
                                          key={ans.value}
                                        >
                                          <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="answer"
                                            checked={ans.value}
                                            disabled
                                          />
                                          <label className="form-check-label">
                                            {ans.label}
                                          </label>
                                        </div>
                                      ))}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Question Score */}
                            <div className="col-md-3">
                              <div className="card">
                                <div className="card-body d-flex align-items-center">
                                  <h5 className="card-title me-2">Score:</h5>
                                  <p
                                    className="card-text mb-0"
                                    style={{ marginTop: "-5px" }}
                                  >
                                    {e?.questionScore}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Navigation Buttons */}
                        <div className="row">
                          <div className="col-md-12 text-center">
                            <button
                              type="button"
                              className="btn btn-primary me-2 mt-3"
                              id="previousButton"
                              onClick={handlePreviousButtonClick}
                            >
                              Previous
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary me-2 mt-3"
                              id="nextButton"
                              onClick={handleNextButtonClick}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </>
                    ) : courseDetail?.displayType === 1 &&
                      courseDetail?.questionAnswer ? (
                      /* List view modal */
                      <CModalBody>
                        <div className="container">
                          {courseDetail.questionAnswer.map((question, idx) => (
                            <div className="row" key={idx}>
                              {/* Quiz Questions */}
                              <div className="col-md-9">
                                <div className="card my-2">
                                  {question?.questionType === "Text Answer" ||
                                  question?.questionType ===
                                    "Fill in the Blanks" ||
                                  question?.questionType ===
                                    "Numeric Response" ? (
                                    <div className="card-body">
                                      <h5 className="card-title">
                                        Question {idx + 1}:
                                      </h5>
                                      <p className="card-text">
                                        {question?.questionText}
                                      </p>
                                      {question?.answer &&
                                        question?.answer.map((ans) => (
                                          <div
                                            className="form-group"
                                            key={ans.value}
                                          >
                                            <label htmlFor="exampleInputEmail1">
                                              Answer
                                            </label>
                                            <input
                                              className="form-control"
                                              type="text"
                                              name="answer"
                                              value={ans?.value}
                                              disabled
                                            />
                                          </div>
                                        ))}
                                    </div>
                                  ) : (
                                    <div className="card-body">
                                      <h5 className="card-title">
                                        Question {idx + 1}:
                                      </h5>
                                      <p className="card-text">
                                        {question?.questionText}
                                      </p>
                                      {question?.answer &&
                                        question?.answer.map((ans) => (
                                          <div
                                            className="form-check"
                                            key={ans.value}
                                          >
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              name="answer"
                                              checked={ans.value}
                                              disabled
                                            />
                                            <label className="form-check-label">
                                              {ans.label}
                                            </label>
                                          </div>
                                        ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Question Score */}
                              <div className="col-md-3">
                                <div className="card my-2">
                                  <div className="card-body d-flex align-items-center">
                                    <h5 className="card-title me-2">Score:</h5>
                                    <p
                                      className="card-text mb-0"
                                      style={{ marginTop: "-1px" }}
                                    >
                                      {question?.questionScore}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* No Navigation Buttons */}
                        </div>
                      </CModalBody>
                    ) : null}
                  </div>
                </CModalBody>
              </CModal>

              {/*Course Model*/}

              <CModal visible={visible} onClose={handleClose} size="lg">
                <CModalHeader>
                  <strong>Preview</strong>
                </CModalHeader>
                <CModalBody>
                  <div id="divToPrint" className="ql-editor">
                    {courseDetail.trainingMedia?.length < 0 ? (
                      <h1 className="fw-bold">No Media</h1>
                    ) : (
                      <span className="fw-bold fs-6">
                        <Player
                          extension={extension}
                          mediaUrl={mediaUrl}
                          mediaName={mediaName}
                        />
                      </span>
                    )}
                  </div>
                </CModalBody>
                <CModalFooter>
                  <CButton color="primary" onClick={handleClose}>
                    Close
                  </CButton>
                </CModalFooter>
              </CModal>
              <div style={{ display: "flex" }}>
                <CForm
                  className="row g-15 needs-validation ps-4"
                  form={form}
                  onFinish={courseDetailApi}
                >
                  <CRow className="mb-3">
                    <CCol md={12}>
                      <CRow className="mb-3">
                        <div className="col-sm-12 py-2">
                          {courseDetail.imageUrl ? (
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <>
                                <img
                                  style={{
                                    objectFit: "contain",
                                    width: "100px",
                                    height: "100px",
                                    marginTop: "10px",
                                  }}
                                  src={courseDetail.imageUrl}
                                  alt="Course Image"
                                />

                                <span
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "24px",
                                    marginTop: "10px",
                                  }}
                                  className="py-4 px-2"
                                >
                                  {courseDetail.courseTitle}
                                </span>
                              </>
                            </div>
                          ) : (
                            <>
                              <Skeleton
                                shape="square"
                                width="100px"
                                height="100px"
                                style={{ marginTop: "10px" }}
                              ></Skeleton>
                            </>
                          )}
                        </div>
                      </CRow>
                    </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CCol md={12}>
                      <CRow className="mb-3">
                        {courseDetail && courseDetail.courseTitle ? (
                          <div
                            className="col-sm-12"
                            dangerouslySetInnerHTML={{
                              __html: courseDetail.description,
                            }}
                          ></div>
                        ) : (
                          <Skeleton height="100px"></Skeleton>
                        )}
                      </CRow>
                    </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CCol md={6}>
                      {courseDetail ? (
                        <CTable responsive bordered caption="top">
                          <CTableCaption style={{ fontWeight: "bold" }}>
                            {/* Course Details */}
                          </CTableCaption>

                          <CTableBody>
                            <CTableRow>
                              <CTableHeaderCell scope="col">
                                Training Type
                              </CTableHeaderCell>
                              <CTableDataCell>
                                {courseDetail?.credits}{" "}
                                {courseDetail?.trainingType}
                              </CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableHeaderCell scope="col">
                                Category
                              </CTableHeaderCell>
                              <CTableDataCell>
                                {courseDetail?.category
                                  .map((category) => category.categoryName)
                                  .join(", ")}
                              </CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              {/* <CTableDataCell>
                              {courseDetail?.certificateName}
                            </CTableDataCell> */}
                            </CTableRow>

                            {courseDetail?.creditsVisible === 1 && (
                              <CTableRow>
                                <CTableHeaderCell scope="col">
                                  Credit
                                </CTableHeaderCell>
                                <CTableDataCell>
                                  {courseDetail?.credits}
                                </CTableDataCell>
                              </CTableRow>
                            )}
                            {courseDetail?.pointVisibility === 1 && (
                              <CTableRow>
                                <CTableHeaderCell scope="col">
                                  Score
                                </CTableHeaderCell>
                                <CTableDataCell>
                                  {courseDetail?.totalScore}
                                </CTableDataCell>
                              </CTableRow>
                            )}

                            {/* <CTableRow>
                            <CTableHeaderCell scope="col">
                              Expiration Length
                            </CTableHeaderCell>
                            <CTableDataCell>
                              {courseDetail?.credits}
                            </CTableDataCell>
                          </CTableRow> */}
                            <CTableRow>
                              <CTableHeaderCell scope="col">
                                Training Length
                              </CTableHeaderCell>
                              <CTableDataCell>
                                {`${courseDetail?.hours} hours ${courseDetail?.minutes} minutes`}
                              </CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableHeaderCell scope="col">
                                Media type
                              </CTableHeaderCell>
                              <CTableDataCell>
                                {courseDetail?.contentType}
                              </CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableHeaderCell scope="col">
                                Ratings
                              </CTableHeaderCell>
                              <CTableDataCell>
                                <Rating
                                  className="mx-auto"
                                  id="rating"
                                  value={courseDetail?.studentRating}
                                  disabled
                                  cancel={false}
                                  stars={5}
                                />
                              </CTableDataCell>
                            </CTableRow>
                          </CTableBody>
                        </CTable>
                      ) : (
                        <CTable responsive bordered caption="top">
                          <CTableCaption style={{ fontWeight: "bold" }}>
                            {/* Course Details */}
                          </CTableCaption>

                          <CTableBody>
                            <CTableRow>
                              <CTableHeaderCell scope="col">
                                Credit Score
                              </CTableHeaderCell>
                              <CTableDataCell>
                                <Skeleton></Skeleton>
                              </CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableHeaderCell scope="col">
                                Certificate
                              </CTableHeaderCell>
                              <CTableDataCell>
                                <Skeleton></Skeleton>
                              </CTableDataCell>
                            </CTableRow>
                            <CTableRow>
                              <CTableHeaderCell scope="col">
                                Training Type
                              </CTableHeaderCell>
                              <CTableDataCell>
                                <Skeleton></Skeleton>
                              </CTableDataCell>
                            </CTableRow>
                            {/* <CTableRow>
                            <CTableHeaderCell scope="col">
                              Ratings
                            </CTableHeaderCell>
                            <CTableDataCell>
                              <Skeleton></Skeleton>
                            </CTableDataCell>
                          </CTableRow> */}
                          </CTableBody>
                        </CTable>
                      )}
                    </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CCol md={6}>
                      {courseDetail.questionAnswer && (
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor=""
                            className="col col-form-label fw-bolder fs-7 "
                          >
                            {/* Questions Click to Preview: */}
                          </CFormLabel>
                          <div
                            className="col-sm-7 py-2"
                            style={{ marginRight: "500px" }}
                          >
                            <CButton
                              className={`btn btn-light-info text-light saveButtonTheme${themes}`}
                              title="Preview"
                              color="primary"
                              onClick={() => {
                                setQuizVisible(true);
                              }}
                            >
                              Preview Questions
                            </CButton>
                          </div>
                        </CRow>
                      )}

                      {courseDetail.zoomLink && (
                        <CRow className="mb-3">
                          <CFormLabel
                            htmlFor=""
                            className="col-sm-2 col-form-label fw-bolder fs-7 "
                          >
                            Meeting Link:
                          </CFormLabel>
                          <div className="col-sm-7 py-2">
                            <Link to={courseDetail.zoomLink} target="__blank">
                              <CButton
                                className={`btn btn-light-info text-light saveButtonTheme${themes}`}
                                title="Preview"
                                color="primary"
                              >
                                Click to Join the Meeting
                              </CButton>
                            </Link>
                          </div>
                        </CRow>
                      )}
                    </CCol>
                  </CRow>

                  <CRow className="mb-3">
                    <CCol md={6}>
                      {courseDetail.trainingType === "eLearning" && (
                        <CRow className="mb-3">
                          {courseDetail.trainingMedia &&
                          courseDetail.trainingMedia.length > 1 ? (
                            <CTable responsive bordered caption="top">
                              <CTableCaption style={{ fontWeight: "bold" }}>
                                Training Media
                              </CTableCaption>
                              <CTableHead>
                                <CTableRow>
                                  <CTableHeaderCell scope="col">
                                    #
                                  </CTableHeaderCell>
                                  <CTableHeaderCell scope="col">
                                    Name
                                  </CTableHeaderCell>
                                  <CTableHeaderCell scope="col">
                                    Preview
                                  </CTableHeaderCell>
                                </CTableRow>
                              </CTableHead>
                              <CTableBody>
                                {courseDetail.trainingMedia.map((data, idx) => (
                                  <CTableRow>
                                    <CTableHeaderCell>
                                      {idx + 1}
                                    </CTableHeaderCell>
                                    <CTableDataCell>
                                      {courseDetail.contentType ===
                                        "Link(URL)" ||
                                      courseDetail.contentType ===
                                        "Embedded Code"
                                        ? "Link/Code Preview:"
                                        : data?.mediaName}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                      <CButton
                                        className="btn btn-light-info text-light"
                                        title="Preview"
                                        color="primary"
                                        onClick={() => {
                                          // setVisible(true);
                                          // setExtension(data?.mediaType);
                                          // setMediaUrl(data?.mediaUrl);
                                          // setMediaName(data?.mediaName);
                                          navigate(
                                            `/admin/player?${courseDetail.trainingId}`
                                          );
                                        }}
                                      >
                                        Click to preview
                                      </CButton>
                                    </CTableDataCell>
                                  </CTableRow>
                                ))}
                              </CTableBody>
                            </CTable>
                          ) : (
                            <>
                              {courseDetail.trainingMedia.length === 1 && (
                                <>
                                  <CFormLabel
                                    htmlFor=""
                                    className="col-lg-4 col-form-label fw-bolder fs-7"
                                  >
                                    Training Media:
                                  </CFormLabel>

                                  <CRow className="mb-3">
                                    <CCol md={12}>
                                      <CRow className="mb-3">
                                        <CFormLabel
                                          htmlFor=""
                                          className="col-lg-4 col-form-label fw-bolder fs-7"
                                        >
                                          {courseDetail.contentType ===
                                            "Link(URL)" ||
                                          courseDetail.contentType ===
                                            "Embedded Code"
                                            ? "Link/Code Preview:"
                                            : courseDetail.trainingMedia[0]
                                                ?.mediaName}
                                        </CFormLabel>
                                        <div className="col-sm-7">
                                          <CButton
                                            className="btn btn-light-info text-light"
                                            title="Preview"
                                            color="primary"
                                            onClick={() => {
                                              // setVisible(true);
                                              // setExtension(
                                              //   courseDetail.trainingMedia[0]
                                              //     ?.mediaType
                                              // );
                                              // setMediaUrl(
                                              //   courseDetail.trainingMedia[0]
                                              //     ?.mediaUrl
                                              // );
                                              // setMediaName(
                                              //   courseDetail.trainingMedia[0]
                                              //     ?.mediaName
                                              // );
                                              navigate(
                                                `/admin/player?${courseDetail.trainingId}`
                                              );
                                            }}
                                          >
                                            Click to preview
                                          </CButton>
                                        </div>
                                      </CRow>
                                    </CCol>
                                  </CRow>
                                </>
                              )}
                            </>
                          )}
                        </CRow>
                      )}
                    </CCol>
                  </CRow>
                  {classes && classes.length > 0 && (
                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CTable responsive bordered caption="top">
                          <CTableCaption style={{ fontWeight: "bold" }}>
                            Classes
                          </CTableCaption>
                          <CTableBody>
                            {classes &&
                              classes.length > 0 &&
                              classes.map((data, idx) => (
                                <>
                                  <CTableRow>
                                    <CTableHeaderCell scope="col">
                                      Class Name
                                    </CTableHeaderCell>
                                    <CTableDataCell>
                                      {data?.className}
                                    </CTableDataCell>
                                  </CTableRow>
                                  <CTableRow>
                                    <CTableHeaderCell scope="col">
                                      Sessions
                                    </CTableHeaderCell>
                                    <CTableDataCell>
                                      <ul>
                                        {data?.sessions?.length > 0 &&
                                          data?.sessions?.map(
                                            (session, idx) => (
                                              <div>
                                                <li>
                                                  {session?.date} -{" "}
                                                  {session?.startTime}
                                                </li>
                                              </div>
                                            )
                                          )}
                                      </ul>
                                    </CTableDataCell>
                                  </CTableRow>
                                </>
                              ))}
                          </CTableBody>
                        </CTable>
                      </CCol>
                    </CRow>
                  )}
                </CForm>
                <div>
                  {courseDetail.handouts?.length > 0 && (
                    <CCol>
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col-sm-3 col-form-label fw-bolder fs-7"
                        >
                          Handouts
                        </CFormLabel>

                        <>
                          {handoutPreview1(
                            courseDetail?.handouts,
                            currentQuestion11
                          )}

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
                      </CRow>
                    </CCol>
                  )}
                </div>
              </div>
            </CCardBody>
            <CCardFooter>
              <div className="d-flex justify-content-end">
                <Link
                  to={`/admin/${backButtonUrl}`}
                  className="btn btn-primary"
                  onClick={() => {
                    localStorage.removeItem("courseLibraryId");
                  }}
                >
                  Back
                </Link>
              </div>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default ViewPage;
