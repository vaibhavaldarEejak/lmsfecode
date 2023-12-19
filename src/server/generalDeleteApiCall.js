import axios from "axios";
import React from "react";
const API_URL = process.env.REACT_APP_API_URL;

const generalDeleteApiCall = async (ApiEndPoint, userData, id) => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  try {
    if (id) {
      const resp = await axios.delete(`${API_URL}/${ApiEndPoint}/${id}`, {
        headers: { Authorization: token },
      });
      const axiosRespHandle = resp.data;
      return axiosRespHandle;
    } else {
      const resp = await axios.post(
        `${API_URL}/${ApiEndPoint}/?_method=DELETE`,
        userData,
        {
          headers: { Authorization: token },
        }
      );
      const axiosRespHandle = resp.data;
      return axiosRespHandle;
    }
  } catch (err) {
    // if (axios.isAxiosError(err)) {
    //   handleAxiosError(err);
    // } else {
    //   handleUnexpectedError(err);
    // }
    throw err;
  }
};

export default generalDeleteApiCall;
