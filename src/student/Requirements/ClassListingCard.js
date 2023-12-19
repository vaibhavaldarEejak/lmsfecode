import React, { useEffect, useState, useRef } from "react";

import { CButton } from "@coreui/react";

function ClassListingCard({ cardData }) {
  const [enrolled, setEnrolled] = useState(false);
  const [loader, setLoader] = useState(false);
  const [responseData, setResponseData] = useState([]);
  const token = "Bearer " + localStorage.getItem("ApiToken");

  console.log({ cardData });
  useEffect(() => {
    if (token !== "Bearer null") {
      learningPlanListAPI();
    }
  }, []);

  const learningPlanListAPI = async () => {
    try {
      const res = await getApiCall("getUserLearningPlanList");
      setResponseData(res);
      console.log(res);
      setLoader(true);
    } catch (err) {}
  };
  return (
    <div>
      {cardData.map((item) => (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1rem",
            marginBottom: "1.5rem",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "0.5fr 1fr ",
              border: " 1px solid #dee2e6",
              borderRadius: "0.5rem",
              alignItems: "center",
              minHeight: "10rem",
              padding: " 0.1rem 1rem",
              position: "relative",
              background: "#f8f8fa",
              boxShadow:
                " rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
            }}
          >
            <div
              style={{
                fontSize: "30px",
                fontWeight: "900",
                color: "#0000ff94",
                marginLeft: "1rem",
              }}
            >
              {item.learningPlanName}
            </div>
            {/* map */}
            {item.learningPlanRequirements.map((plan) => (
              <div
              style={{
                display: "grid",
                gridTemplateRows: "0.5fr 0.5fr ",
                gap: "0.5rem",
                padding: "0.5rem ",
              }}
            >
              <div
                style={{
                  fontSize: "23px",
                  display: "flex",
                  flexDirection: "row",
                  gap: " 7rem",
                  
                }}
              >
                <div style={{ fontSize: "20px" , alignSelf: "center"}}>{plan.trainingName}</div>
                <div>
                  <ul
                    style={{
                      margin: "0",
                      fontSize: "12px",
                      fontWeight: "normal",
                    }}
                  >
                    <div>Due Date: {plan.dueDateType}</div>
                    <div>Assign Date: {plan.dueDateValue}</div>
                    <div>Completion Date: {plan.expirationDateType}</div>
                    <div>Expiration Date: {plan.expirationDateValue}</div>
                   
                  </ul>
                </div>
              </div>
              <div
                style={{
                  fontSize: "23px",
                  display: "flex",
                  flexDirection: "row",
                  gap: " 7rem",
                  
                }}
              >
                
              </div>
            </div>
            ))}
           

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
          <div></div>
        </div>
      ))}
    </div>
  );
}

export default ClassListingCard;