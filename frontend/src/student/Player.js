import React, { useState, useEffect, useRef } from "react";
import ScormProvider from "@alexisab/react-scorm-provider";
import NewWindow from "react-new-window";
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";
import { useNavigate } from "react-router-dom";
import {
  CCol,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from "@coreui/react";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { Rating } from "primereact/rating";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./playerStyle.css";

const API_URL = process.env.REACT_APP_API_URL;

const Player = () => {
  const [courseDetail, setCourseDetail] = useState();
  const [mediaUrl, setMediaUrl] = useState();
  const [scormVersion, setScormVersion] = useState();
  const [scormId, setScormId] = useState();
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  const [extension, setExtension] = useState("");
  const [mediaName, setMediaName] = useState("");

  const [rating, setRating] = useState(null);
  const [comments, setComments] = useState("");
  const [courseId, setCourseId] = useState(null);
  const [courseImg, setCourseImg] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [storedPosition, setStoredPosition] = useState(null);
  const [functionCall, setFunctionCall] = useState(false);

  const courseDetailApi = (id) => {
    let url = "";
    url = `${API_URL}/getCourseCatalogById/${id}`;
    axios
      .get(url, {
        headers: { Authorization: token },
      })
      .then((response) => {
        if (routePath === "catalog" || routePath === "requirment") {
          const contentTypeIdsToCheck = [4, 5, 6, 7, 8, 9, 10];
          if (
            response.data.data.percentageProgress === null ||
            isNaN(response.data.data.percentageProgress) ||
            contentTypeIdsToCheck.includes(response.data.data.contentTypesId)
          ) {
            console.log("11");
            addInProgressCourse({
              trainingCatalogId: courseID,
              progressPercentage: 0,
            });
          }
        }
        if (response.data.data.percentageProgress === 0) {
          setStoredPosition(null);
        } else {
          setStoredPosition(response.data.data.percentageProgress);
          setFunctionCall(true);
        }
        setCourseDetail(response.data.data);
        setMediaUrl(response.data.data.trainingMedia[0]?.mediaUrl);
        setScormVersion(response.data.data.trainingMedia[0]?.scormVersion);
        setScormId(response.data.data.trainingMedia[0]?.scormId);
        setMediaName(response.data.data.trainingMedia[0]?.mediaName);
        setExtension(response.data.data.trainingMedia[0]?.mediaType);
        setCourseId(response.data.data.trainingId);
        setCourseImg(response.data.data.imageUrl);
        setCourseTitle(response.data.data.courseTitle);
        if (
          response.data.data?.contentTypesId === 7 ||
          response.data.data?.contentTypesId === 6
        ) {
          setVisible(true);
        }
        if (response.data.data?.contentTypesId === 5) {
          setVisible1(true);
        }
        if (
          response.data.data?.contentTypesId === 4 ||
          response.data.data?.contentTypesId === 8
        ) {
          setVisible2(true);
        }
        if (response.data.data?.contentTypesId === 10) {
          setVisible3(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const addInProgressCourse = async (payload) => {
    try {
      const response = await postApiCall("addInProgressCourse", payload);
    } catch (error) {
      var errMsg = error?.response?.data?.error;
    }
  };

  const navigate = useNavigate();
  const courseID = window.location.href.split("?")[1];
  const routePath = window.location.href.split("?")[2];
  var ScormCourseUrl;

  if (scormId === "") {
    ScormCourseUrl = mediaUrl?.split(".com/")[1];
  } else {
    ScormCourseUrl = `/elitelms/media/${mediaUrl}/${mediaName}/index_lms.html`;
  }

  const ScormVersion = window.location.href.split("?")[3];
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const [suspendData, setSuspendData] = useState("");
  const [completionStatus, setCompletionStatus] = useState("not attempted");
  const iframeRef = useRef(null);
  const [scormTrackData, setScormTrackData] = useState([]);

  useEffect(() => {
    courseDetailApi(courseID);
  }, []);

  const getSuspendData = async (Id) => {
    try {
      const res = await getApiCall("getScormTrackingById", Id);
      setScormTrackData(res);
      setSuspendData(res.suspendData);
      setCompletionStatus(res.completionStatus);
    } catch (err) {}
  };

  function getSuspend() {
    if (scormVersion === "1.3") {
      const API = window.API_1484_11;
      if (API) {
        let suspendData = API.GetValue("cmi.suspend_data");
        let completionStatus = API.GetValue("cmi.completion_status");
        localStorage.setItem("suspend", suspendData);
        localStorage.setItem("scormId", scormId);
        localStorage.setItem("element", "cmi.suspend_data");
        localStorage.setItem("completionStatus", completionStatus);
        API.Terminate();
      } else {
        console.error("SCORM API not found.");
      }
    } else if (scormVersion === "1.2") {
      const API = window.API;
      if (API) {
        let suspendData = API.LMSGetValue("cmi.suspend_data");
        let completionStatus = API.LMSGetValue("cmi.core.lesson_status");
        localStorage.setItem("suspend", suspendData);
        localStorage.setItem("scormId", scormId);
        localStorage.setItem("element", "cmi.suspend_data");
        localStorage.setItem("completionStatus", completionStatus);

        API.LMSFinish();
      } else {
        console.error("SCORM API not found.");
      }
    } else {
      const API = window.API;
      if (API) {
        let suspendData = API.LMSGetValue("cmi.suspend_data");
        let completionStatus = API.LMSGetValue("cmi.core.lesson_status");
        localStorage.setItem("suspend", suspendData);
        localStorage.setItem("scormId", scormId);
        localStorage.setItem("element", "cmi.suspend_data");
        localStorage.setItem("completionStatus", completionStatus);
        API.LMSFinish();
      } else {
        console.error("SCORM API not found.");
      }
    }
  }

  const handleIframeLoad = () => {
    // Get the suspend data using the GetValue function of the SCORM API
    handleResume();
  };

  useEffect(() => {
    if (scormId) {
      getSuspendData(scormId);
    }
  }, [scormId]);

  useEffect(() => {
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      getSuspend();
      navigate(`/superadmin/medialibrarylist/viewmedialibrary?399`);
    });
    if (scormVersion === "1.3") {
      window.API_1484_11 = (function () {
        var data = {
          "cmi.learner_id": "000100",
          "cmi.learner_name": "Mohit Kamat",
          "cmi.location": "",
          "cmi.completion_status": "not attempted",
          "cmi.suspend_data": "",
          "cmi.entry": "",
        };
        return {
          Initialize: function () {
            return "true";
          },
          Commit: function () {
            return "true";
          },
          Terminate: function () {
            return "true";
          },
          GetValue: function (model) {
            return data[model] || "";
          },
          SetValue: function (model, value) {
            data[model] = value;
            return "true";
          },
          GetLastError: function () {
            return "0";
          },
          GetErrorString: function (errorCode) {
            return "No error";
          },
          GetDiagnostic: function (errorCode) {
            return "No error";
          },
        };
      })();
    } else {
      window.API = (function () {
        var data = {
          "cmi.core.student_id": "000100",
          "cmi.core.student_name": "Student, Joe",
          "cmi.core.lesson_location": "",
          "cmi.core.lesson_status": "not attempted",
          "cmi.suspend_data": "",
        };
        return {
          LMSInitialize: function () {
            return "true";
          },
          LMSCommit: function () {
            return "true";
          },
          LMSFinish: function () {
            return "true";
          },
          LMSGetValue: function (model) {
            return data[model] || "";
          },
          LMSSetValue: function (model, value) {
            data[model] = value;
            return "true";
          },
          LMSGetLastError: function () {
            return "0";
          },
          LMSGetErrorString: function (errorCode) {
            return "No error";
          },
          LMSGetDiagnostic: function (errorCode) {
            return "No error";
          },
        };
      })();
    }
  }, []);

  const handleResume = () => {
    // Set the suspend data using the setSuspendData function
    if (scormVersion === "1.3" && suspendData) {
      window.API_1484_11.SetValue("cmi.suspend_data", suspendData);
      // setSuspendData("");
      // Call the Commit function to save the changes
      window.API_1484_11.Commit();
    }
    if (scormVersion === "1.2" && suspendData) {
      window.API.LMSSetValue("cmi.suspend_data", suspendData);
      // setSuspendData("");
      // Call the Commit function to save the changes
      window.API.LMSFinish();
    }
  };

  // VIDEO Functionality
  const videoRef = useRef(null);
  const [isPlaying, setPlaying] = useState(false);
  const [currentTime1, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // Pass Pause time
  const [isSeeking, setIsSeeking] = useState(false);

  useEffect(() => {
    const handleTimeUpdate = () => {
      setCurrentTime(videoRef.current.currentTime);
    };

    const handleLoadedData = () => {
      setDuration(videoRef.current.duration);
    };
    // Attach event listeners only if videoRef.current is defined
    if (videoRef.current) {
      videoRef.current?.addEventListener("timeupdate", handleTimeUpdate);
      videoRef.current?.addEventListener("loadeddata", handleLoadedData);

      // Clean up event listeners on component unmount
      return () => {
        videoRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
        videoRef.current?.removeEventListener("loadeddata", handleLoadedData);
      };
    }
  }, [videoRef.current]); // Add videoRef.current as a dependency

  const [resumeVideo, setResumeVideo] = useState(true);
  const handlePlayPause = () => {
    if (videoRef.current.paused) {
      // If there's a stored position, set it before playing
      if (storedPosition !== null) {
        videoRef.current.currentTime = storedPosition;
        setResumeVideo(false); // Reset stored position after using it
      }
      videoRef.current.play();
    } else {
      // Pause the video and store the current playback position
      videoRef.current.pause();
      setResumeVideo(false);
      // storePlaybackPosition();
    }
  };
  const handlePlayStart = () => {
    if (videoRef.current.paused) {
      // If there's a stored position, set it before playing
      // console.log("dddddddd", videoRef.current.currentTime);
      videoRef.current.currentTime = 0;
      setResumeVideo(false); // Reset stored position after using it
      videoRef.current.play();
    } else {
      // Pause the video and store the current playback position
      videoRef.current.pause();
      setResumeVideo(false);
      // storePlaybackPosition();
    }
  };
  const handleVideoEnded = () => {
    setPlaying(false);
    setHideCompleteDialog(true);
    // You can perform additional actions when the video ends
    // For example, addInProgressCourse, etc.
  };
  // CHECK THIS CONDITION

  // useEffect(() => {
  //   if (videoRef.current) {
  //     videoRef.current.currentTime = storedPosition;
  //   }
  //   if (storedPosition != null) {
  //     setResumeVideo(true);
  //   }
  // }, [storedPosition]);

  const video = videoRef.current;
  const pauseFnc = () => {
    if (isPlaying === false) {
      setCurrentTime(videoRef.current?.currentTime);
    }
  };
  useEffect(() => {
    pauseFnc();
  }, [isPlaying]);

  const clickPlayPause = () => {
    if (video) {
      addInProgressCourse({
        trainingCatalogId: courseID,
        progressPercentage: videoRef.current.currentTime,
      });
      if (isPlaying) {
        setResumeVideo(false);
        setFunctionCall(false);
        addInProgressCourse({
          trainingCatalogId: courseID,
          progressPercentage: videoRef.current.currentTime,
        });
        // video.pause();
      } else {
        setResumeVideo(false);
        video.play().catch((error) => {});
      }
      setPlaying(true);
    }
  };

  if (video?.paused) {
    if (videoRef.current.currentTime != 0 && functionCall === false) {
      // setPlaying(false);
      addInProgressCourse({
        trainingCatalogId: courseID,
        progressPercentage: videoRef.current.currentTime,
      });
    }
  }

  // SEEKING Video
  useEffect(() => {
    const handleTimeUpdate1 = () => {
      if (!isSeeking) {
        const currentTime = video.currentTime;
        addInProgressCourse({
          trainingCatalogId: courseID,
          progressPercentage: videoRef.current.currentTime,
          seekedTime: currentTime,
        });
      }
    };
    const handleSeekStart = () => {
      console.log("Seeking started");
      setIsSeeking(true);
    };

    const handleSeekEnd = () => {
      console.log("Seeking ended");
      setIsSeeking(false);
    };

    if (video) {
      video.addEventListener("seeking", handleSeekStart);
      video.addEventListener("seeked", handleSeekEnd);
      video.addEventListener("timeupdate", handleTimeUpdate1);

      return () => {
        video.removeEventListener("seeking", handleSeekStart);
        video.removeEventListener("seeked", handleSeekEnd);
        video.removeEventListener("timeupdate", handleTimeUpdate1);
      };
    }
  }, [isSeeking]);

  useEffect(() => {
    if (currentTime1 != 0 || duration != 0) {
      // console.log("current", currentTime1);
      if (currentTime1 === duration) {
        setPlaying(false);
        setHideCompleteDialog(true);
      }
    }
  }, [currentTime1, duration]);

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };
  const [previousTime, setPreviousTime] = useState(0);
  const handleSeeked = () => {
    const playingTime = videoRef.current.currentTime;
    const seekedTime = playingTime - previousTime;

    console.log(`Video seeked by ${seekedTime} seconds.`);
    // Do something with the seeked time

    // Update the previous time
    setPreviousTime(playingTime);
  };

  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);

  const handleClose = () => {
    setVisible(false);
  };
  const handleClose1 = () => {
    setVisible1(false);
  };
  const handleClose2 = () => {
    setVisible2(false);
  };
  const handleClose3 = () => {
    setVisible3(false);
  };
  const setCompleteCourseApi = async () => {
    const payLoad = {
      courseId: courseId,
      rating: rating,
      comment: comments,
      // progress: 1,
    };
    try {
      const response = await postApiCall("studentCompletedCourse", payLoad);
      if (response) {
        // getEnrollmentListing();
        // navigate(`/student/${routePath}`);
        navigate(-1);

        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Course Completed Successfully",
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error Completing Course",
          life: 3000,
        });
      }
    } catch (error) {}
  };
  const [hideCompleteDialog, setHideCompleteDialog] = useState(false);
  const [rateCourseVisible, setRateCourseVisible] = useState(false);
  const showCompleteDialog = () => {
    // setShowModalP(false);
    setVisible(false);
    setHideCompleteDialog(true);
  };
  const showRateCourseDialog = () => {
    setHideCompleteDialog(false);
    setRateCourseVisible(true);
  };
  const completeDialogFooter = () => (
    <>
      <button
        type="button"
        className={`btn btn-primary saveButtonTheme${themes}`}
        onClick={() => {
          showRateCourseDialog();
        }}
      >
        Yes
      </button>
      <button
        icon="pi pi-times"
        onClick={() => {
          setHideCompleteDialog(false);
          navigate(-1);
        }}
        type="button"
        className={`btn btn-primary saveButtonTheme${themes}`}
      >
        No
      </button>
    </>
  );
  const rateCourseDialogFooter = () => (
    <>
      <button
        icon="pi pi-check"
        className={`btn btn-primary saveButtonTheme${themes}`}
        onClick={() => {
          setRateCourseVisible(false);
          navigate(-1);
          setCompleteCourseApi();
        }}
      >
        Submit
      </button>
    </>
  );

  return (
    <>
      <Dialog
        visible={hideCompleteDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={completeDialogFooter}
        onHide={() => {
          navigate(-1);
          setHideCompleteDialog(false);
        }}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle me-3 mt-2"
            style={{ fontSize: "1.5rem" }}
          />
          <span>Mark Your Course as Completed?</span>
        </div>
      </Dialog>
      {/* Rate Course Dialog Start*/}
      <div>
        <Dialog
          visible={rateCourseVisible}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Rate Course"
          modal
          onHide={() => {
            setRateCourseVisible(false);
            navigate(-1);
          }}
          footer={rateCourseDialogFooter}
        >
          <div className="confirmation-content">
            <div className="p-field p-col-12 p-md-12">
              <CRow className="mb-3">
                <CCol md={12}>
                  <CRow className="mb-3">
                    <div className="col-sm-12 py-2">
                      {courseImg && (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <>
                            <img
                              style={{
                                objectFit: "contain",
                                width: "100px",
                                height: "100px",
                                marginTop: "10px",
                              }}
                              src={courseImg}
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
                              {courseTitle}
                            </span>
                          </>
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
                      className="col-sm-4 col-form-label fw-bolder fs-7 required"
                    >
                      Rate This Course:
                    </CFormLabel>
                    <div className="col-sm-7 py-2">
                      <Rating
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(e.value)}
                        cancel={false}
                        stars={5}
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
                      className="col-sm-4 col-form-label fw-bolder fs-7"
                    >
                      Comment (Optional):
                    </CFormLabel>
                    <div className="col-sm-7 py-2">
                      <textarea
                        className="form-control"
                        id="exampleFormControlTextarea1"
                        rows="4"
                        onChange={(e) => setComments(e.target.value)}
                      ></textarea>
                    </div>
                  </CRow>
                </CCol>
              </CRow>
            </div>
          </div>
        </Dialog>
      </div>

      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          alignContent: "center",
          marginTop: 20,
        }}
      >
        ************Course is playing in another window.************
      </div>
      {courseDetail?.trainingType === "eLearning" ? (
        <div>
          {courseDetail?.contentTypesId === 1 ? (
            <div className="custom-video-player">
              {/* {openWindow(courseDetail?.trainingMedia[0]?.mediaUrl)} */}
              {/* {openVideoWindow(courseDetail?.trainingMedia[0]?.mediaUrl)} */}
              <NewWindow
                center="screen"
                copyStyles={true}
                style={{ width: "1080px" }}
              >
                <div
                  style={{
                    width: "600px",
                    height: "360px",
                    position: "relative",
                  }}
                >
                  <video
                    ref={videoRef}
                    width="600"
                    className="custom-video-player"
                    height="360"
                    paused={isPlaying}
                    onClick={clickPlayPause}
                    onLoadedMetadata={handleLoadedMetadata}
                    controls
                    autoPlay
                    onSeeked={handleSeeked}
                    onEnded={handleVideoEnded}
                    id="videoId"
                  >
                    <source
                      src={courseDetail?.trainingMedia[0]?.mediaUrl}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                  {storedPosition != null && resumeVideo === true && (
                    <>
                      <div className="ResumeVideoClass"></div>
                      <div className="resumeButtonPosition">
                        <button onClick={handlePlayPause}>Resume</button>
                        <button onClick={handlePlayStart}>Start over</button>
                      </div>
                    </>
                  )}
                </div>
              </NewWindow>
            </div>
          ) : courseDetail?.contentTypesId === 2 ? (
            <div>
              {/* {audio(courseDetail?.trainingMedia[0]?.mediaUrl)} */}
              <NewWindow
                center="screen"
                copyStyles={true}
                style={{ width: "1080px" }}
              >
                <div
                  style={{
                    width: "600px",
                    height: "360px",
                    position: "relative",
                  }}
                >
                  <video
                    ref={videoRef}
                    width="600"
                    className="custom-video-player"
                    height="360"
                    paused={isPlaying}
                    onClick={clickPlayPause}
                    onLoadedMetadata={handleLoadedMetadata}
                    controls
                    autoPlay
                    muted
                    onSeeked={handleSeeked}
                  >
                    <source
                      src={courseDetail?.trainingMedia[0]?.mediaUrl}
                      type="video/mp4"
                    />
                    Your browser does not support the Audio tag.
                  </video>
                  {storedPosition != null && resumeVideo === true && (
                    <>
                      <div className="ResumeVideoClass"></div>
                      <div className="resumeButtonPosition">
                        <button onClick={handlePlayPause}>Resume</button>
                        <button onClick={handlePlayStart}>Start over</button>
                      </div>
                    </>
                  )}
                </div>
              </NewWindow>
            </div>
          ) : courseDetail?.contentTypesId === 3 ? (
            <div>
              <NewWindow
                url={`${ScormCourseUrl}`}
                center="screen"
                copyStyles={true}
              >
                <ScormProvider debug={true}>
                  <frameset
                    frameborder="0"
                    framespacing="0"
                    border="0"
                    rows="1,*"
                    cols="*"
                  >
                    <frame
                      ref={iframeRef}
                      onLoad={handleIframeLoad}
                      type="text/html"
                      id="scorm_object"
                      allowFullScreen={true}
                      height={"1000px"}
                      width={"1920px"}
                      src={`${ScormCourseUrl}`}
                    ></frame>
                  </frameset>
                </ScormProvider>
              </NewWindow>
            </div>
          ) : courseDetail?.contentTypesId === 7 ||
            courseDetail?.contentTypesId === 6 ? (
            <div>
              <CModal
                visible={visible}
                onClose={() => {
                  handleClose();
                  if (courseDetail.percentageProgress === 100) {
                    // call mark as complete course API
                    showCompleteDialog();
                  } else {
                    addInProgressCourse({
                      trainingCatalogId: courseID,
                      progressPercentage: courseDetail.percentageProgress + 5,
                    });
                    if (hideCompleteDialog === false && visible === true) {
                      navigate(-1);
                    }
                  }
                }}
                alignment="center"
                size="lg"
                scrollable
              >
                <CModalHeader>
                  <CModalTitle>Launch </CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${mediaUrl}`}
                    style={{ height: "calc(100vh - 14rem)", width: "766px" }}
                  />
                </CModalBody>
                <CModalFooter>
                  <button
                    type="button"
                    className={`btn btn-primary saveButtonTheme${themes}`}
                    onClick={() => {
                      handleClose();
                      showCompleteDialog();
                    }}
                  >
                    Mark as Complete
                  </button>
                </CModalFooter>
              </CModal>
            </div>
          ) : courseDetail?.contentTypesId === 5 ? (
            <div>
              <CModal
                visible={visible1}
                onClose={() => {
                  handleClose1();
                  if (courseDetail.percentageProgress === 100) {
                    // call mark as complete course
                    showCompleteDialog();
                  } else {
                    addInProgressCourse({
                      trainingCatalogId: courseID,
                      progressPercentage: courseDetail.percentageProgress + 5,
                    });
                    if (hideCompleteDialog === false && visible1 === true) {
                      navigate(-1);
                    }
                  }
                }}
                alignment="center"
                size="lg"
                scrollable
              >
                <CModalHeader>
                  <CModalTitle>Launch </CModalTitle>
                </CModalHeader>
                <CModalBody>
                  {
                    <div
                      style={{ display: "flex", justifyContent: "center" }}
                      dangerouslySetInnerHTML={{ __html: mediaUrl }}
                    />
                  }
                </CModalBody>
                <CModalFooter>
                  <button
                    type="button"
                    className={`btn btn-primary saveButtonTheme${themes}`}
                    onClick={handleClose1}
                  >
                    Mark as Complete
                  </button>
                </CModalFooter>
              </CModal>
            </div>
          ) : //PDf
          courseDetail?.contentTypesId === 4 ||
            courseDetail?.contentTypesId === 8 ? (
            <div>
              <CModal
                visible={visible2}
                onClose={() => {
                  handleClose2();
                  if (courseDetail.percentageProgress === 4) {
                    // call mark as complete course
                    showCompleteDialog();
                  } else {
                    addInProgressCourse({
                      trainingCatalogId: courseID,
                      progressPercentage: courseDetail.percentageProgress + 5,
                    });
                    if (hideCompleteDialog === false && visible2 === true) {
                      navigate(-1);
                    }
                  }
                }}
                alignment="center"
                size="lg"
                scrollable
              >
                <CModalHeader>
                  <CModalTitle>Launch </CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <iframe
                    src={mediaUrl}
                    style={{ height: "calc(100vh - 14rem)", width: "766px" }}
                  />
                </CModalBody>
                <CModalFooter>
                  <button
                    type="button"
                    className={`btn btn-primary saveButtonTheme${themes}`}
                    onClick={() => {
                      handleClose2();
                      showCompleteDialog();
                    }}
                  >
                    Mark as Complete
                  </button>
                </CModalFooter>
              </CModal>
            </div>
          ) : courseDetail.contentTypesId === 10 ? (
            <div>
              <CModal
                visible={visible3}
                onClose={() => {
                  handleClose3();

                  if (courseDetail.percentageProgress === 4) {
                    // call mark as complete course
                    showCompleteDialog();
                  } else {
                    addInProgressCourse({
                      trainingCatalogId: courseID,
                      progressPercentage: courseDetail.percentageProgress + 5,
                    });
                    if (hideCompleteDialog === false && visible3 === true) {
                      navigate(-1);
                    }
                  }
                }}
                alignment="center"
                size="lg"
                scrollable
              >
                <CModalHeader>
                  <CModalTitle>Launch </CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <iframe
                    src={`https://docs.google.com/gview?url=${mediaUrl}&embedded=true`}
                    style={{ height: "calc(100vh - 14rem)", width: "766px" }}
                  />
                </CModalBody>
                <CModalFooter>
                  <button
                    type="button"
                    className={`btn btn-primary saveButtonTheme${themes}`}
                    onClick={() => {
                      handleClose3();
                      showCompleteDialog();
                    }}
                  >
                    Mark as Complete
                  </button>
                </CModalFooter>
              </CModal>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      ) : (
        courseDetail?.trainingTyp === "assenment" && <div></div>
      )}
    </>
  );
};
export default Player;
