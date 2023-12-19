import React, { useState } from "react";
import { CButton } from "@coreui/react";

const ClassListingCard = ({ item }) => {
  const [enrolled, setEnrolled] = useState(false);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "0.95fr 5rem",
        gap: "1rem",
        marginRight: "3rem",
        marginBottom: "1.5rem",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "1fr 1fr 1fr",
          border: " 1px solid #dee2e6",
          borderRadius: "0.5rem",
          alignItems: "center",
          height: "8rem",
          padding: " 0.1rem 1rem",
          position: "relative",
          background: "#f8f8fa",
          //   boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
          boxShadow:
            " rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
        }}
      >
        <div
          style={{ fontSize: " 34px", fontWeight: "900", color: "#0000ff94" }}
        >
          {item?.className}
        </div>
        <div
          style={{
            fontSize: "23px",
            display: "flex",
            flexDirection: "column",
            gap: " 0.1rem",
            fontWeight: "900",
          }}
        >
          <div>{`${item.maxSeats} seat left`}</div>
          <div>{`${20} hour course`}</div>
        </div>
        <div>
          <div
            style={{
              paddingLeft: "0.9rem",
              fontWeight: "600",
              fontSize: " 1.1rem",
            }}
          >
            This course includes:
          </div>
          <ul style={{ margin: "0" }}>
            <li>Basics of PHP introduction</li>
            <li>Syntax of PHP</li>
            <li>Const and variables</li>
            <li>Functions and classes</li>
          </ul>
        </div>
        {enrolled && (
          <div
            style={{
              background: "#ffbe00f0",
              transform: "rotateZ(-40deg)",
              position: "absolute",
              width: " 6rem",
              top: " 0.65rem",
              left: "-1.28rem",
              borderRadius: " 2rem 2.5rem 0px 0px",
              paddingLeft: "1rem",
            }}
          >
            Enrolled
          </div>
        )}
      </div>
      <div>
        {enrolled === false ? (
          <CButton
            className={`btn btn-light-info text-light`}
            title="Enroll in course"
            color="primary"
            style={{
              width: "9rem", //   boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
              boxShadow:
                " rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
              height: "5rem",
            }}
            onClick={() => {
              setEnrolled(true);
            }}
          >
            Enroll
          </CButton>
        ) : (
          <CButton
            className={`btn btn-light-info text-light`}
            title="Enroll in course"
            color="danger"
            style={{
              width: "9rem",
              height: "5rem", //   boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
              boxShadow:
                " rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
            }}
            onClick={() => {}}
          >
            Drop
          </CButton>
        )}
      </div>
    </div>
  );
};

export default ClassListingCard;
