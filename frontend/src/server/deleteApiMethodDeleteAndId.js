import React from "react";
const token = "Bearer " + localStorage.getItem("ApiToken");
const API_URL = process.env.REACT_APP_API_URL;

const deleteApiMethodDeleteAndId = async (ApiEndPoint, id, userData) => {
  const resp = await axios.post(
    `${API_URL}/${ApiEndPoint}/${id}?_method=DELETE`,
    userData,
    {
      headers: { Authorization: token },
    }
  );
  const axiosRespHandle = resp.data;
  return axiosRespHandle;
};

export default deleteApiMethodDeleteAndId;
