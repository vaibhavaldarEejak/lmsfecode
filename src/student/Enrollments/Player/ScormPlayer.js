import React, { useState, useEffect, useRef } from "react";
import ScormProvider from "@alexisab/react-scorm-provider";
import axios from "axios";
import getApiCall from "src/server/getApiCall";
const API_URL = process.env.REACT_APP_API_URL;

function Player() {
  const ScormCourseUrl = window.location.href.split("?")[1];
  const ScormId = window.location.href.split("?")[2];
  const ScormVersion = window.location.href.split("?")[3];
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const [suspendData, setSuspendData] = useState("");
  const [completionStatus, setCompletionStatus] = useState("not attempted");
  const iframeRef = useRef(null);

  const [scormVersion, setScormVersion] = useState(ScormVersion);

  const [scormTrackData, setScormTrackData] = useState([]);

  const getSuspendData = async (Id) => {
    try {
      const res = await getApiCall("getScormTrackingById", Id);
      setScormTrackData(response.data.data);
      setSuspendData(response.data.data.suspendData);
      setCompletionStatus(response.data.data.completionStatus);
    } catch (err) {}
  };

  function getSuspend() {
    if (ScormVersion === "1.3") {
      const API = window.API_1484_11;
      if (API) {
        let suspendData = API.GetValue("cmi.suspend_data");
        let completionStatus = API.GetValue("cmi.completion_status");
        localStorage.setItem("suspend", suspendData);
        localStorage.setItem("scormId", ScormId);
        localStorage.setItem("element", "cmi.suspend_data");
        localStorage.setItem("completionStatus", completionStatus);

        //localStorage.setItem("suspend", suspendData.trim(""));
        API.Terminate();
      } else {
        console.error("SCORM API not found.");
      }
    } else if (ScormVersion === "1.2") {
      const API = window.API;
      if (API) {
        let suspendData = API.LMSGetValue("cmi.suspend_data");
        let completionStatus = API.LMSGetValue("cmi.core.lesson_status");
        localStorage.setItem("suspend", suspendData);
        localStorage.setItem("scormId", ScormId);
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
        localStorage.setItem("scormId", ScormId);
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

    console.log("Course Loaded");
  };

  useEffect(() => {
    if (ScormId) {
      getSuspendData(ScormId);
    }
  }, [ScormId]);

  useEffect(() => {
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      getSuspend();
      if (window.opener) {
        window.opener.location.replace("/student/inprogress");
      }
    });

    //close this window on reload

    // In the parent page
    // const frame = document.getElementById("scorm_object");
    // frame.contentWindow.postMessage(
    //   "Hello from parent page!",
    //   "https://saferhub.com"
    // );
    // // In the frame content
    // window.addEventListener("message", (event) => {
    //   if (event.origin === "https://example.com") {
    //     console.log("Received message from parent page:", event.data);
    //   }
    // });

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
  }, []);

  const handleResume = () => {
    // Set the suspend data using the setSuspendData function

    if (ScormVersion === "1.3" && suspendData) {
      window.API_1484_11.SetValue("cmi.suspend_data", suspendData);
      // setSuspendData("");
      // Call the Commit function to save the changes
      window.API_1484_11.Commit();
    }
    if (ScormVersion === "1.2" && suspendData) {
      window.API.LMSSetValue("cmi.suspend_data", suspendData);
      // setSuspendData("");
      // Call the Commit function to save the changes
      window.API.LMSFinish();
    }
  };

  return (
    <>
      <React.StrictMode>
        <ScormProvider debug={true}>
          <div className="d-flex justify-content-center">
            <iframe
              ref={iframeRef}
              onLoad={handleIframeLoad}
              type="text/html"
              id="scorm_object"
              allowFullScreen={true}
              height={"1000px"}
              width={"1920px"}
              src={`/media/${ScormCourseUrl}/index_lms.html`}
            ></iframe>
          </div>
        </ScormProvider>
      </React.StrictMode>
    </>
  );
}
export default Player;
