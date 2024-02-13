import React, { useState } from "react";
import ScormProvider from "@alexisab/react-scorm-provider";

const Player = (props) => {
  if (
    props.extension == ".ppt" ||
    props.extension == ".pptx" ||
    props.extension == ".doc" ||
    props.extension == ".docx" ||
    props.extension == ".xlsx" ||
    props.extension == ".xls"
  ) {
    return (
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${props.mediaUrl}`}
        style={{ height: "900px", width: "750px" }}
      />
    );
  } else if (
    props.extension == ".mp4" ||
    props.extension == ".m4v" ||
    props.extension == ".mp4" ||
    props.extension == ".flv" ||
    props.extension == ".mov" ||
    props.extension == ".wmv" ||
    props.extension == ".swf"
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
  } else if (props.extension === "zip") {
    return (
      <React.StrictMode>
        <ScormProvider debug={true}>
          <div className="d-flex justify-content-center">
            <iframe
              type="text/html"
              id="scorm_object"
              allowFullScreen={true}
              style={{ height: "900px", width: "750px" }}
              src={`/media/${props.mediaName}/index_lms.html`}
            ></iframe>
          </div>
        </ScormProvider>
      </React.StrictMode>
    );
  } else if (props.extension == ".csv") {
    return (
      <iframe
        src={`https://docs.google.com/gview?url=${props.mediaUrl}&embedded=true`}
        style={{ height: "900px", width: "750px" }}
      />
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
