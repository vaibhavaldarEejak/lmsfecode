import React, { Component, Suspense, useEffect, useRef, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./scss/style.scss";
import "./scss/sidebar.scss";
import "./ResponsiveCSS/responsive.css";
import "bootstrap/scss/bootstrap.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./App.css";
import postApiCall from "./server/postApiCall";
import { Toast } from "primereact/toast";
import AdminPlayer from "./admin/AdminPlayer";
import SuperadminPlayer from "./superadmin/SuperadminPlayer";

const loading = (
  <div
    className="pt-3 text-center"
    style={{
      height: "90vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div className="spinner-border" role="status">
      <span className="sr-only"></span>
    </div>
  </div>
);

// Containers
const DefaultLayout = React.lazy(() => import("./common/layout/DefaultLayout"));

// Pages
const Login = React.lazy(() => import("./common/login/Login"));
const ScormPlayer = React.lazy(() =>
  import("./student/Enrollments/Player/ScormPlayer")
);

const PreviewScorm = React.lazy(() =>
  import("./superadmin/MediaLibrary/scormPlayer")
);

const PreviewScormAdmin = React.lazy(() =>
  import("./admin/TrainingMediaLibrary/scormPlayer")
);

const PreviewScormStudent = React.lazy(() =>
  import("./student/Catalog/scormPlayer")
);
const Player = React.lazy(() => import("./student/Player"));

const BlankPage = React.lazy(() =>
  import("./student/Requirements/ScormPlayer")
);
const VideoPlayer = React.lazy(() =>
  import("./student/Enrollments/Player/VideoPlayer")
);

const API_URL = process.env.REACT_APP_API_URL;
const App = () => {
  const tokenExpirationTime = useRef(null);
  const token = localStorage.getItem("ApiToken");
  const navigate = useNavigate();
  const toast = useRef(null);
  const [isLogout, setIsLogout] = useState(false);

  const handleLogOut = async () => {
    try {
      const res = await postApiCall("logout");
      localStorage.removeItem("ApiToken");
      setIsLogout(true);
      window.location.reload();
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "You have been logout",
        life: 3000,
      });

      return Promise.reject({
        message: "You've recieved an error!",
      });
    }
  };
  const windLocation = window.location.href;
  const newLocation = windLocation.split("/");
  const arrayLength = newLocation.length - 1;
  const endPoint = windLocation.split("/")[arrayLength];
  let timer = 0;
  const handleTabSuspension = () => {
    // Clear the existing token expiration timeout
    clearTimeout(tokenExpirationTime.current);

    // Set a new timeout for 5 minutes
    tokenExpirationTime.current = setTimeout(() => {
      // Perform any token expiration logic here
      if (endPoint !== "login") {
        if (token !== "Bearer null") {
          // handleLogOut();
          localStorage.removeItem("ApiToken");
          window.location.reload();
        }
      }
    }, [30 * 60 * 1000]); // 30 minutes in milliseconds
  };

  const handleTabActivation = () => {
    // Clear the existing token expiration timeout
    clearTimeout(tokenExpirationTime.current);
    clearTimeout(timer);
  };

  useEffect(() => {
    // Add event listeners for tab suspension and activation
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        handleTabSuspension();
      } else {
        handleTabActivation();
      }
    });
    // Clean up event listeners on component unmount
    // return () => {
    //   clearTimeout(tokenExpirationTime.current);
    //   document.removeEventListener("visibilitychange", handleTabSuspension);
    // };
  }, [isLogout]);

  const startTimer = () => {
    if (endPoint !== "login") {
      if (token !== "Bearer null") {
        if (isLogout === false) {
          // handleLogOut();
          localStorage.removeItem("ApiToken");
          window.location.reload();
        }
      }
    }

    clearTimeout(timer);
  };

  function resetTimer() {
    /* Clear the previous interval */
    clearTimeout(timer);
    /* Set a new interval */
    timer = setTimeout(() => {
      startTimer();
    }, [30 * 60 * 1000]);
  }

  // Define the events that
  // would reset the timer
  window.onload = resetTimer;
  window.onmousemove = resetTimer;
  window.onmousedown = resetTimer;
  window.ontouchstart = resetTimer;
  window.onclick = resetTimer;
  window.onkeydown = resetTimer;
  window.onkeyup = resetTimer;

  window.addEventListener("scroll", resetTimer, true);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Toast ref={toast}></Toast>
      <Suspense fallback={loading}>
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route path="*" name="Home" element={<DefaultLayout />} />
          <Route exact path="/" name="Login Page" element={<Login />} />
          <Route
            exact
            path="/student/playerssssss"
            name="Scorm Player"
            element={<ScormPlayer />}
          />
          <Route
            exact
            path="/student/video-player"
            name="Video Player"
            element={<VideoPlayer />}
          />
          <Route
            exact
            path="/student/blank-page"
            name="Blank Page"
            element={<BlankPage />}
          />
          <Route
            exact
            path="/superadmin/medialibrarylist/scormPlayer"
            name="Scorm Preview"
            element={<PreviewScorm />}
          />
          <Route
            exact
            path="/admin/trainingmedialibrarylist/scormPlayer"
            name="Scorm Preview"
            element={<PreviewScormAdmin />}
          />
          <Route
            exact
            path="/student/catalog/scormPlayer"
            name="Scorm Preview"
            element={<PreviewScormStudent />}
          />
          <Route exact path="/Player" name="player" element={<Player />} />
          <Route
            exact
            path="/admin/player"
            name="adminplayer"
            element={<AdminPlayer />}
          />
          <Route
            exact
            path="/subadmin/player"
            name="adminplayer"
            element={<SuperadminPlayer />}
          />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
