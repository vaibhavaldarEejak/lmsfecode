import { useEffect, useRef } from "react";
import axios from "axios";
import { Toast } from "primereact/toast";
import postApiCall from "src/server/postApiCall";
const API_URL = process.env.REACT_APP_API_URL;
function VideoPlayer() {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const searchParams = new URLSearchParams(window.location.search);
  const VideoUrl = searchParams.get("videoUrl");
  const courseId = window.location.href.split("?")[2];

  const toast = useRef(null);
  const setCompleteCourseApi = async () => {
    const payLoad = {
      courseId: parseInt(courseId),
      progress: 1,
    };
    try {
      const response = await postApiCall("studentCompletedCourse", payLoad);
      if (response) {
        getOrgActiveListing();
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Course Completed Successfully",
          life: 3000,
        });
        // setHideCompleteDialog(false);
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error Completing Course",
          life: 3000,
        });
      }
    } catch (error) {
  
    }
  };

  useEffect(() => {
    const video = document.getElementById("video");

    window.addEventListener("beforeunload", () => {
      localStorage.setItem("videoTime", video.currentTime);
      if (window.opener) {
        window.opener.location.replace("/student/enrollments");
      }
    });

    //video section

    // Check if there's a saved playback time in local storage
    if (localStorage.getItem("videoTime") && video) {
      video.currentTime = localStorage.getItem("videoTime");
    }

    // Save the current playback time to local storage when the video is paused or ended
    video &&
      video.addEventListener("pause", () => {
        localStorage.setItem("videoTime", video.currentTime);
      });

    video &&
      video.addEventListener("ended", () => {
        localStorage.setItem("videoTime", 0);
        setCompleteCourseApi();
      });

    video &&
      video.addEventListener("loadedmetadata", () => {
        if (localStorage.getItem("videoTime")) {
          video.currentTime = localStorage.getItem("videoTime");
        }
      });
  }, []);

  return (
    <>
      <Toast ref={toast} />
      <div
        className="d-flex justify-content-center"
        style={{
          width: "960px",
          height: "540px",
          display: "flex",
          margin: "75px auto",
        }}
      >
        <video controls id="video">
          <source src={VideoUrl} type="video/mp4" />
        </video>
      </div>
      {/* <source src={ScormCourseUrl} type="video/mp4" /> */}
    </>
  );
}

export default VideoPlayer;
