import React, { useState, useEffect } from "react";
import VideoPlayer from "../Enrollments/Player/VideoPlayer";

const Player = (props) => {
  const [data, setData] = useState([]);

  if (
    props.extension === "ppt" ||
    props.extension === "pptx" ||
    props.extension === "doc" ||
    props.extension === "docx" ||
    props.extension === "xlsx" ||
    props.extension === "xls"
  ) {
    return (
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${props.mediaUrl}`}
        style={{ height: "900px", width: "750px" }}
      />
    );
  } else if (
    props.extension === "mp4" ||
    props.extension === "m4v" ||
    props.extension === "mp4" ||
    props.extension === "flv" ||
    props.extension === "mov" ||
    props.extension === "wmv" ||
    props.extension === "swf"
  ) {
    return (

      <VideoPlayer mediaUrl={props.mediaUrl} />

      // <video controls="controls" width={"100%"} height={"100%"}>
      //   <source src={props.mediaUrl} type="video/mp4"></source>
      // </video>
    );
  } else if (
    props.extension === "mp3" ||
    props.extension === "wma" ||
    props.extension === "aac" ||
    props.extension === "m4a"
  ) {
    return (
      <audio controls="controls">
        <source src={props.mediaUrl} type="audio/mpeg"></source>
      </audio>
    );
  } else if (props.extension === "csv" || props.extension === "txt") {
    return (
      <iframe
        src={`https://docs.google.com/gview?url=${props.mediaUrl}&embedded=true`}
        style={{ height: "900px", width: "750px" }}
      />
    );
  } else if (props.extension === "Link(URL)" || props.extension === "pdf") {
    return (
      <iframe
        src={props.mediaUrl}
        style={{ height: "900px", width: "750px" }}
      />
    );
  } else {
    return <div dangerouslySetInnerHTML={{ __html: props.mediaUrl }} />;
  }
};

export default Player;
