import React, { useState, useEffect, useRef } from "react";
import ScormProvider from "@alexisab/react-scorm-provider";
import NewWindow from "react-new-window";
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";
import { useNavigate } from "react-router-dom";
import {
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import axios from "axios";
import { Dialog } from "primereact/dialog";
const API_URL = process.env.REACT_APP_API_URL;

const SuperadminPlayer = () => {
  const [courseDetail, setCourseDetail] = useState();
  const [mediaUrl, setMediaUrl] = useState();
  const [scormVersion, setScormVersion] = useState();
  const [scormId, setScormId] = useState();
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  const [extension, setExtension] = useState("");
  const [mediaName, setMediaName] = useState("");
  const [togglee, setTogglee] = useState(true);

  const courseDetailApi = (id) => {
    let url = "";
    url = `${API_URL}/getCourseLibraryById/${id}`;
    axios
      .get(url, {
        headers: { Authorization: token },
      })
      .then((response) => {
        // if (routePath === "catalog" || routePath === "requirment") {
        //   addInProgressCourse({ trainingCatalogId: courseID });
        // }
        setCourseDetail(response.data.data);
        setMediaUrl(response.data.data.trainingMedia[0]?.mediaUrl);
        setScormVersion(response.data.data.trainingMedia[0]?.scormVersion);
        setScormId(response.data.data.trainingMedia[0]?.scormId);
        setMediaName(response.data.data.trainingMedia[0]?.mediaName);
        setExtension(response.data.data.trainingMedia[0]?.mediaType);
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
  const medialibraryApi = async (id) => {
    try {
      const response = await getApiCall("getMediaById", id);
      setCourseDetail(response);
      setMediaUrl(response?.mediaUrl);
      setScormVersion(response?.scormVersion);
      setScormId(response?.scormId);
      setMediaName(response?.mediaName);
      if (response?.contentTypesId === 7 || response?.contentTypesId === 6) {
        setVisible(true);
        console.log({ response });
      }
      if (response?.contentTypesId === 5) {
        setVisible1(true);
      }
      if (response?.contentTypesId === 4 || response?.contentTypesId === 8) {
        setVisible2(true);
      }
      if (response?.contentTypesId === 10) {
        setVisible3(true);
      }
    } catch (error) {
      console.log(error);
    }
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
  const courseType = window.location.href.split("?")[3];
  var ScormCourseUrl;

  if (scormId === "") {
    ScormCourseUrl = `/elitelms/media/${mediaUrl}/index_lms.html`;
  } else {
    ScormCourseUrl = mediaUrl?.split(".com/")[1];
  }
  const ScormVersion = window.location.href.split("?")[3];
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const [suspendData, setSuspendData] = useState("");
  const [completionStatus, setCompletionStatus] = useState("not attempted");
  const iframeRef = useRef(null);
  const [scormTrackData, setScormTrackData] = useState([]);

  useEffect(() => {
    if (routePath === "media") {
      medialibraryApi(courseID);
    } else {
      courseDetailApi(courseID);
    }
  }, []);

  const getSuspendData = async (Id) => {
    try {
      const res = await getApiCall("getScormTrackingById", Id);
      setScormTrackData(response.data.data);
      setSuspendData(response.data.data.suspendData);
      setCompletionStatus(response.data.data.completionStatus);
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
  const openWindow = (url) => {
    window.open(`${url}`, "_blank", "width=1080,height=700");
  };
  const audio = (url) => {
    window.open(`${url}`, "_blank", "width=1080,height=700");
  };
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);

  const handleClose = () => {};
  const handleClose1 = () => {
    setVisible1(false);
  };
  const handleClose2 = () => {
    setVisible2(false);
  };
  const handleClose3 = () => {
    setVisible3(false);
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
          navigate(-1);
        }}
      >
        Yes
      </button>
      <button
        icon="pi pi-times"
        onClick={() => {
          setHideCompleteDialog(false);
        }}
        type="button"
        className={`btn btn-primary saveButtonTheme${themes}`}
      >
        No
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
        onHide={() => setHideCompleteDialog(false)}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle me-3 mt-2"
            style={{ fontSize: "1.5rem" }}
          />
          <span>Mark Your Course as Completed?</span>
        </div>
      </Dialog>

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
      {courseDetail?.trainingType === "eLearning" ||
      courseType === "eLearning" ? (
        <div>
          {courseDetail?.contentTypesId === 1 ? (
            <>
              {routePath === "media" ? (
                <>{openWindow(courseDetail?.mediaUrl)}</>
              ) : (
                <div>
                  {openWindow(courseDetail?.trainingMedia[0]?.mediaUrl)}
                </div>
              )}
            </>
          ) : // <div>{openWindow(courseDetail?.trainingMedia[0]?.mediaUrl)}</div>
          courseDetail?.contentTypesId === 2 ? (
            <>
              {routePath === "media" ? (
                <div>{audio(courseDetail?.mediaUrl)}</div>
              ) : (
                <div>{audio(courseDetail?.trainingMedia[0]?.mediaUrl)}</div>
              )}
            </>
          ) : courseDetail?.contentTypesId === 3 ? (
            <div>
              <NewWindow url={`/${mediaUrl}`} center="screen" copyStyles={true}>
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
                      src={`/${mediaUrl}`}
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
                  navigate(-1);
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
                    style={{ height: "900px", width: "750px" }}
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
                    Close
                  </button>
                </CModalFooter>
              </CModal>
            </div>
          ) : courseDetail?.contentTypesId === 5 ? (
            <div>
              <CModal
                visible={visible1}
                onClose={() => {
                  navigate(-1);
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
                    Close
                  </button>
                </CModalFooter>
              </CModal>
            </div>
          ) : courseDetail?.contentTypesId === 4 ||
            courseDetail?.contentTypesId === 8 ? (
            <div>
              <CModal
                visible={visible2}
                onClose={() => {
                  navigate(-1);
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
                    style={{ height: "900px", width: "750px" }}
                  />
                </CModalBody>
                <CModalFooter>
                  <button
                    type="button"
                    className={`btn btn-primary saveButtonTheme${themes}`}
                    onClick={handleClose2}
                  >
                    Close
                  </button>
                </CModalFooter>
              </CModal>
            </div>
          ) : courseDetail?.contentTypesId === 10 ? (
            <div>
              <CModal
                visible={visible3}
                onClose={() => {
                  navigate(-1);
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
                    style={{ height: "900px", width: "750px" }}
                  />
                </CModalBody>
                <CModalFooter>
                  <button
                    type="button"
                    className={`btn btn-primary saveButtonTheme${themes}`}
                    onClick={handleClose3}
                  >
                    Close
                  </button>
                </CModalFooter>
              </CModal>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      ) : (
        courseDetail?.trainingTyp === "assessnment" ||
        (courseType === "assessnment" && <div></div>)
      )}
    </>
  );
};
export default SuperadminPlayer;
