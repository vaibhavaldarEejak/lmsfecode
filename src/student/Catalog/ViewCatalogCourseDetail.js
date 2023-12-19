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
  CModalTitle,
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
import { Link } from "react-router-dom";
import { Skeleton } from "primereact/skeleton";
import "../../scss/required.scss";
import { Toast } from "primereact/toast";
import Player from "./Player";
import axios from "axios";
import { Rating } from "primereact/rating";
import "../../css/form.css";
import { useNavigate } from "react-router-dom";
import ClassListingCard from "./ClassListingCard";
import { Card } from "primereact/card";
const API_URL = process.env.REACT_APP_API_URL;
import RemoveHtmlTags from "src/common/RemoveHtmlTags";
import postApiCall from "src/server/postApiCall";
import getApiCall from "src/server/getApiCall";
const ViewPage = () => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const backButtonRoute = window.location.href.split("?")[1];
  const CourseType = window.location.href.split("?")[2];
  const [trainingId, setTrainingId] = useState("");
  let trainingId1 = "";
  useEffect(() => {
    trainingId1 = localStorage.getItem("courseLibraryId1");
    setTrainingId(trainingId1);
  }, []);
  const assignid = window.location.href.split("?")[1];

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
  const navigate = useNavigate();
  const toast = useRef(null);

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
        certificateName: courseDetail.certificateName,
        trainingType: courseDetail.trainingType,
        description: courseDetail.description,
        trainingStatus: courseDetail.trainingStatus,
        imageId: courseDetail.imageId,
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

  const addAssignment = async (payload) => {
    try {
      const response = await postApiCall("addInProgressCourse", payload);
      catalogListAPI();
    } catch (error) {
      var errMsg = error?.response?.data?.error;
    }
  };

  const handleClick = (value) => {
    // if (value.contentType === "Video") {
    //   navigate(`/Player?${value.trainingMedia[0].mediaUrl}?video`);
    // } else if (value.contentType === "SCORM") {
    //   navigate(
    //     // `/superadmin/medialibrarylist/scormPlayer?${value.trainingMedia[0].mediaUrl}?${value.trainingMedia[0].scormId}?${value.trainingMedia[0].scormVersion}?${trainingId}?${value.trainingMedia[0].mediaId}`
    //     `/Player?${value.trainingMedia[0].mediaUrl}?${value.trainingMedia[0].scormId}?${value.trainingMedia[0].scormVersion}?${trainingId}?${value.trainingMedia[0].mediaId}`
    //   );
    // } else {
    //   setVisible(true);
    // }

    navigate(`/Player?${trainingId}?${backButtonRoute}`);
  };

  const courseDetailApi = (id) => {
    let url = "";

    url = `${API_URL}/getCourseCatalogById/${id}`;

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
      // setcourseDetail(response.data.data);
      setClasses(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getEnrollmentByCourseId = async (Id) => {
    try {
      const res = await getApiCall("getEnrollmentByCourseId", Id);
      setcourseDetail(res);
    } catch (err) {}
  };
  useEffect(() => {
    // dumy
    setClasses([{}, {}]);
    if (trainingId) {
      if (backButtonRoute === "enrollments") {
        getEnrollmentByCourseId(Number(trainingId));
      } else {
        courseDetailApi(Number(trainingId));
        if (CourseType != "eLearning") {
          getClassesById(Number(trainingId));
        }
      }
    }
  }, [trainingId]);

  const handlePreview = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };

  return (
    <div>
      <Toast ref={toast} />

      {courseDetail && (
        <CModal
          visible={visible}
          onClose={handleClose}
          alignment="center"
          size="lg"
          scrollable
        >
          <CModalHeader>
            <CModalTitle>Launch </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <Player
              extension={extension}
              mediaUrl={mediaUrl}
              mediaName={mediaName}
            />
          </CModalBody>
          <CModalFooter>
            <button
              type="button"
              className={`btn btn-primary saveButtonTheme${themes}`}
              onClick={handleClose}
            >
              Close
            </button>
          </CModalFooter>
        </CModal>
      )}

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>{/* <strong>Course Details</strong> */}</CCardHeader>
            <CCardBody className="card-body org border-top p-9">
              <CModal
                visible={quizVisible}
                onClose={() => {
                  setQuizVisible(false);
                }}
                size="lg"
              >
                <CModalHeader>
                  <strong>Quiz</strong>
                </CModalHeader>
                <CModalBody>
                  <div className="container">
                    {/* <h2 className="ml-5">Quiz</h2> */}
                    {currentQuiz &&
                      currentQuiz?.map((e, idx) => (
                        <div className="card">
                          {e?.questionType === "Text Answer" ||
                          e?.questionType === "Fill in the Blanks" ||
                          e?.questionType === "Numeric Response" ? (
                            <div className="card-body">
                              <h5 className="card-title">
                                Question {currentQuestion + 1}:
                              </h5>
                              <p className="card-text">{e?.questionText}</p>
                              {e?.answer &&
                                e?.answer.map((ans) => (
                                  <div class="form-group">
                                    <label for="exampleInputEmail1">
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
                              <p className="card-text">{e?.questionScore}</p>
                            </div>
                          ) : (
                            <div className="card-body">
                              <h5 className="card-title">
                                Question {currentQuestion + 1}:
                              </h5>
                              <p className="card-text">{e?.questionText}</p>
                              {e?.answer &&
                                e?.answer.map((ans) => (
                                  <div className="form-check">
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
                              <p className="card-text">{e?.questionScore}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    <button
                      type="button"
                      className="btn btn-primary me-2 mt-3"
                      id="nextButton"
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
                </CModalBody>
              </CModal>
              {/*Course Model*/}

              {/* <CModal visible={visible} onClose={handleClose} size="lg">
             <CModalHeader>
               <strong>Preview</strong>
             </CModalHeader>
             <CModalBody>
               <div id="divToPrint" className="ql-editor">
                 {courseDetail && courseDetail.trainingMedia?.length < 0 ? (
                   <h1 className="fw-bold">No Media</h1>
                 ) : (
                   <span className="fw-bold fs-6">
                     <Player
                       extension={extension}
                       mediaUrl={courseDetail && courseDetail.trainingMedia[0].mediaUrl}
                       mediaName={courseDetail && courseDetail.trainingMedia[0].mediaName}
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
           </CModal> */}

              <CForm
                className="row g-15 needs-validation ps-4"
                form={form}
                onFinish={courseDetailApi}
              >
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CRow className="mb-3">
                      <div className="col-sm-12 py-2">
                        {courseDetail?.imageUrl ? (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              gap: "1rem",
                            }}
                          >
                            <>
                              <img
                                style={{
                                  width: "8rem",
                                  height: "6rem",
                                  marginTop: "10px",
                                }}
                                src={courseDetail?.imageUrl}
                                alt="Course Image"
                              />

                              <span
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "24px",
                                  marginTop: "10px",
                                  alignItems: "flex-start",
                                }}
                                className="py-4 px-2"
                              >
                                {courseDetail?.courseTitle}
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
                  <CCol md={6} style={{ width: "500px", marginLeft: "auto" }}>
                    <Card
                      title="Target Audience"
                      className="text-center"
                      style={{
                        borderTop: "0.8px solid #ccc",
                        minHeight: "150px",
                      }}
                    >
                      <p className="m-0"></p>
                    </Card>
                  </CCol>
                </CRow>

                <CRow className="mb-3">
                  <RemoveHtmlTags htmlString={courseDetail?.description} />
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
                            <CTableHeaderCell scope="col">
                              Certificate Name
                            </CTableHeaderCell>
                            <CTableDataCell>
                              {courseDetail?.certificateName}
                            </CTableDataCell>
                          </CTableRow>
                          <CTableRow>
                            <CTableHeaderCell scope="col">
                              Credit Score
                            </CTableHeaderCell>
                            <CTableDataCell>
                              {courseDetail?.credits}
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
                              Ratings
                            </CTableHeaderCell>
                            <CTableDataCell>
                              <Skeleton></Skeleton>
                            </CTableDataCell>
                          </CTableRow>
                        </CTableBody>
                      </CTable>
                    )}
                  </CCol>
                  <CCol
                    md={6}
                    style={{
                      width: "500px",
                      marginLeft: "auto",
                      marginTop: "50px",
                    }}
                  >
                    <Card
                      title="Average rating"
                      className="text-center"
                      style={{ borderTop: "0.5px solid #ccc" }}
                    >
                      {/* <strong>Average rating</strong> */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        <Rating
                          id="rating"
                          value={courseDetail?.studentRating}
                          disabled
                          cancel={false}
                          stars={5}
                        />
                      </div>
                    </Card>
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    {courseDetail?.questionAnswer && (
                      <CRow className="mb-3">
                        <CFormLabel
                          htmlFor=""
                          className="col col-form-label fw-bolder fs-7 "
                        >
                          Questions Click to Preview:
                        </CFormLabel>
                        <div className="col-sm-7 py-2">
                          <CButton
                            className={`btn btn-light-info text-light saveButtonTheme${themes}`}
                            title="Preview"
                            color="primary"
                            onClick={() => {
                              setQuizVisible(true);
                            }}
                          >
                            Click to preview
                          </CButton>
                        </div>
                      </CRow>
                    )}

                    {/* {courseDetail.zoomLink && (
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
                    )} */}
                  </CCol>
                </CRow>

                {courseDetail?.contentType === "SCORM" ||
                courseDetail?.contentType === "Video" ? (
                  <>
                    <CButton
                      className="btn btn-light-info text-light"
                      style={{ width: "10rem" }}
                      title="Preview"
                      color="primary"
                      onClick={() => {
                        handleClick(courseDetail);
                      }}
                    >
                      Launch
                    </CButton>
                  </>
                ) : (
                  courseDetail?.trainingType != "Classroom" &&
                  backButtonRoute != "enrollments" && (
                    <>
                      <CButton
                        className="btn btn-light-info text-light"
                        style={{ width: "10rem" }}
                        title="Preview"
                        color="primary"
                        onClick={() => {
                          if (trainingId) {
                            addAssignment({
                              trainingCatalogId: trainingId,
                            });
                          }
                          navigate(`/Player?${trainingId}?${backButtonRoute}`);
                        }}
                      >
                        Launch
                      </CButton>
                    </>
                  )
                )}

                {/* <CRow className="mb-3">
                  <CCol md={6}>
                    {courseDetail.trainingType === "eLearning" && (
                      <CRow className="mb-3">
                        {courseDetail.trainingMedia &&
                        courseDetail.trainingMedia.length > 0 ? (
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
                                  <CTableHeaderCell>{idx + 1}</CTableHeaderCell>
                                  <CTableDataCell>
                                    {data?.mediaName}
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    {courseDetail.contentType === "SCORM" ||
                                    courseDetail.contentType === "Video" ? (
                                      <>
                                        <CButton
                                          className="btn btn-light-info text-light"
                                          title="Preview"
                                          color="primary"
                                          onClick={() => {
                                            handleClick(courseDetail);
                                          }}
                                        >
                                          Click to preview
                                        </CButton>
                                      </>
                                    ) : (
                                      <>
                                        <CButton
                                          className="btn btn-light-info text-light"
                                          title="Preview"
                                          color="primary"
                                          onClick={() => {
                                            setVisible(true);
                                            setExtension(
                                              courseDetail.trainingMedia[0]
                                                .mediaType
                                            );
                                            setMediaUrl(
                                              courseDetail.trainingMedia[0]
                                                .mediaUrl
                                            );
                                            setMediaName(
                                              courseDetail.trainingMedia[0]
                                                .mediaName
                                            );
                                          }}
                                        >
                                          Click to preview
                                        </CButton>
                                      </>
                                    )}
                                  </CTableDataCell>
                                </CTableRow>
                              ))}
                            </CTableBody>
                          </CTable>
                        ) : (
                          <>
                            {courseDetail.trainingMedia.length > 0 && (
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
                                        {courseDetail.contentType === "SCORM" &&
                                        courseDetail.contentType === "Video" ? (
                                          <CButton
                                            className="btn btn-light-info text-light"
                                            title="Preview"
                                            color="primary"
                                            onClick={() => {
                                              handleClick(courseDetail);
                                            }}
                                          >
                                            Click to preview
                                          </CButton>
                                        ) : (
                                          <CButton
                                            className="btn btn-light-info text-light"
                                            title="Preview"
                                            color="primary"
                                            onClick={() => {
                                              setVisible(true);
                                              setExtension(
                                                courseDetail.trainingMedia[0]
                                                  ?.mediaType
                                              );
                                              setMediaUrl(
                                                courseDetail.trainingMedia[0]
                                                  ?.mediaUrl
                                              );
                                              setMediaName(
                                                courseDetail.trainingMedia[0]
                                                  ?.mediaName
                                              );
                                            }}
                                          >
                                            Click to preview
                                          </CButton>
                                        )}
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
                </CRow> */}
                {courseDetail?.trainingType === "Classroom" &&
                  classes.length > 0 &&
                  classes.map((data, idx) => (
                    <div>
                      <ClassListingCard item={data} />
                    </div>
                  ))}
              </CForm>
            </CCardBody>
            <CCardFooter>
              <div className="d-flex justify-content-end">
                <Link
                  onClick={() => {
                    localStorage.removeItem("courseLibraryId1");
                  }}
                  to={`/student/${backButtonRoute}`}
                  className="btn btn-primary"
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
