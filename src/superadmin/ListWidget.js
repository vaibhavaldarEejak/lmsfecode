import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { CAvatar, CImage } from "@coreui/react";
import axios from "axios";
import "../css/themes.css";
import getApiCall from "src/server/getApiCall";

const ListWidget = ({ className, icon, href, name, path }) => {
  const footer = (
    <Button label="View" className={`p-button-${className}`} href={href} />
  );
  const token = "Bearer " + localStorage.getItem("ApiToken");

  const [themes, setThemes] = useState();

  const getThemes = async () => {
    try {
      const res = await getApiCall("getThemeList");
      res?.map((item, i) => {
        if (item.isDeafult != 0) {
          setThemes(item.backgroundColor);
        }
      });
    } catch (err) {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getThemes();
  }, []);
  const handleMouseOver = (e) => {
    e.currentTarget.style.boxShadow = `${themes}`;
    e.currentTarget.style.backgroundColor = `${themes}`;
    e.currentTarget.querySelector("img").style.filter =
      "brightness(0) invert(1)";
    e.currentTarget.querySelector("div").style.color = "#fff";
  };

  const handleMouseOut = (e) => {
    e.currentTarget.style.backgroundColor = "rgb(213 245 255) ";
    e.currentTarget.style.boxShadow = "0 3px 5px 0 rgba(0,0,0,0.2)";
    e.currentTarget.querySelector("img").style.filter = "none";
    e.currentTarget.querySelector("div").style.color = "#000";
  };

  return (
    <div className={`p-col-12 p-md-4 ${className}`}>
      <Card
        footer={""}
        // className={classNames(`bg-light${className}`, className)}
        style={{
          // width: "190px",
          // height: "120px",
          boxShadow: "0 3px 5px 0 rgba(0,0,0,0.2)",
          backgroundColor: "rgb(213 245 255)",
        }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50%",
            marginTop: "1px",
          }}
        >
          <CAvatar
            src={path}
            className={`svg-icon-${className} svg-icon-2x`}
            style={{ filter: "none" }}
          />
        </div>
        <div style={{ textAlign: "center", marginTop: "3px" }}>{name}</div>
      </Card>
    </div>
  );
};

export default ListWidget;
