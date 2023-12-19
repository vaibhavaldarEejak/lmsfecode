import React from "react";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;
const SettingTokenService = async (ApiEndPoint, token) => {
  // const token = "Bearer " + localStorage.getItem("ApiToken");

  try {
    const resp = await axios.post(
      `${API_URL}/${ApiEndPoint}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const axiosRespHandle = resp.data.data;
    return axiosRespHandle;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      handleAxiosError(error);
    } else {
      handleUnexpectedError(error);
    }
  }
};

export default SettingTokenService;
