import React, { useState, useEffect } from "react";
import ScormProvider from "@alexisab/react-scorm-provider";
const Player = (props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    window.API_1484_11 = (function () {
      var data = {
        "cmi.learner_id": "000100",
        "cmi.learner_name": "Student, Joe",
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

  if (
    props.extension === ".ppt" ||
    props.extension === ".pptx" ||
    props.extension === ".doc" ||
    props.extension === ".docx" ||
    props.extension === ".xlsx" ||
    props.extension === ".xls"
  ) {
    return (
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${props.mediaUrl}`}
        style={{ height: "900px", width: "750px" }}
      />
    );
  } else if (
    props.extension === ".mp4" ||
    props.extension === ".m4v" ||
    props.extension === ".mp4" ||
    props.extension === ".flv" ||
    props.extension === ".mov" ||
    props.extension === ".wmv" ||
    props.extension === ".swf"
  ) {
    return (
      <video controls="controls" width={"100%"} height={"100%"}>
        <source src={props.mediaUrl} type="video/mp4"></source>
      </video>
    );
  } else if (
    props.extension === ".mp3" ||
    props.extension === ".wma" ||
    props.extension === ".aac" ||
    props.extension === ".flac" ||
    props.extension === ".wav" ||
    props.extension === ".m4a"
  ) {
    return (
      <audio controls="controls">
        <source src={props.mediaUrl} type="audio/mpeg"></source>
      </audio>
    );
  } else if (props.extension === ".csv" || props.extension === ".txt") {
    return (
      <iframe
        src={`https://docs.google.com/gview?url=${props.mediaUrl}&embedded=true`}
        style={{ height: "900px", width: "750px" }}
      />
    );
  } else if (props.extension === "zip") {
    return (
      <React.StrictMode>
        <ScormProvider debug={true}>
          <div
            className="d-flex justify-content-center"
            style={{ marginTop: "-130px" }}
          >
            <iframe
              type="text/html"
              id="scorm_object"
              allowFullScreen={true}
              style={{ height: "900px", width: "750px" }}
              src={props.mediaUrl}
            ></iframe>
          </div>
        </ScormProvider>
      </React.StrictMode>
    );
  } else {
    return (
      <iframe
        src={props.mediaUrl}
        style={{ height: "900px", width: "750px" }}
      />
    );
  }
};

export default Player;
