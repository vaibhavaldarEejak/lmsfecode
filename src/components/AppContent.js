import React, {
  Suspense,
  useState,
  useEffect,
  lazy,
  createElement,
} from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CContainer, CSpinner } from "@coreui/react";
import axios from "axios";
//${route.controllerName}
import routes from "src/routes";
import getApiCall from "src/server/getApiCall";

const AppContent = ({ handleNotification }) => {
  const [routesFinal, setRoutesFinal] = useState([]);
  const parentFolder = window.location.href.split("/")[3];
  const API_URL = process.env.REACT_APP_API_URL;
  const token = "Bearer " + localStorage.getItem("ApiToken");
  const userRole = localStorage.getItem("RoleName");

  // console.log(parentFolder);

  // const toPascalCase = (str) =>
  //   (str.match(/[a-zA-Z0-9]+/g) || [])
  //     .map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`)
  //     .join("");

  const [loading, setLoading] = useState(false);
  const [terminateApi, setTerminateApi] = useState(false);
  const getRoutes = async () => {
    try {
      const res = await getApiCall("getModuleList");
      setTerminateApi(true);
      setLoading(true);
      setRoutesFinal(res);
    } catch (err) {
      setTerminateApi(false);
    }
  };

  // const getController = (path) => {
  //   const [sectionName, subSection, controllerName, controllerName2] =
  //     path.split("/");
  //   if (controllerName2) {
  //     return lazy(() =>
  //       import(
  //         `../${sectionName}/${subSection}/${controllerName}/${controllerName2}`
  //       ).then((module) => ({
  //         default: module[path.split("/").pop()],
  //       }))
  //     );
  //   } else {
  //     return lazy(() =>
  //       import(`../${sectionName}/${subSection}/${controllerName}`).then(
  //         (module) => ({
  //           default: module[path.split("/").pop()],
  //         })
  //       )
  //     );
  //   }
  // };

  const spinner = (
    <div className="pt-3 text-center">
      <div className="spinner-grow text-primary" role="status"></div>
      <div className="spinner-grow text-secondary" role="status">
        <span className="sr-only"></span>
      </div>
      <div className="spinner-grow text-success" role="status"></div>
      <div className="spinner-grow text-danger" role="status"></div>
      <div className="spinner-grow text-warning" role="status"></div>
      <div className="spinner-grow text-info" role="status"></div>
      <div className="spinner-grow text-light" role="status"></div>
      <div className="spinner-grow text-dark" role="status"></div>
    </div>
  );

  // const getElement = (path, methodName) => {
  //   return React.lazy(() =>
  //     import(`${path}`).then((module) => ({
  //       default: module[methodName],
  //     }))
  //   );
  // };
  const windLocation = window.location.href;
  const newLocation = windLocation.split("/");
  const arrayLength = newLocation.length - 1;
  const endPoint = windLocation.split("/")[arrayLength];

  useEffect(() => {
    if (!terminateApi) {
      if (endPoint !== "login") {
        if (token !== "Bearer null") {
          getRoutes();
        }
      }
    }
  }, [loading]);
  return (
    <CContainer lg>
      <Routes>
        {routesFinal &&
          routesFinal?.map((route, idx) => {
            const [sectionName, subSection, controllerName, controllerName2] =
              route.controllerName.split("/");

            return (
              route?.methodName && (
                <Route
                  key={idx}
                  path={"/" + parentFolder + "/" + route.routeUrl}
                  name={route.moduleName}
                  element={
                    <Suspense fallback={spinner}>
                      {createElement(
                        lazy(() =>
                          import(
                            `../${parentFolder}/${route.controllerName}/${route.methodName}`
                          )
                        ),
                        (handleNotification = { handleNotification })
                      )}
                    </Suspense>
                  }
                />
              )
            );
          })}

        {routes &&
          routes?.map((route, idx) => {
            return (
              route?.element && (
                <Route
                  key={idx}
                  path={route.path}
                  name={route.name}
                  element={
                    <route.element handleNotification={handleNotification} />
                  }
                />
              )
            );
          })}
        <Route path="/" element={<Navigate to="login" replace />} />
      </Routes>
    </CContainer>
  );
};

export default React.memo(AppContent);
