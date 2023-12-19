import React from "react";

const API_URL = process.env.REACT_APP_API_URL;
const token = "Bearer " + localStorage.getItem("ApiToken");

const getApiForOptionalPayload = async (ApiEndPoint, id) => {
  try {
    const resp = await axios.get(`${API_URL}${ApiEndPoint}`, {
      headers: { Authorization: token },
    });
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

const getApiCall = async (ApiEndPoint, id) => {
  try {
    if (id) {
      const resp = await axios.get(`${API_URL}/${ApiEndPoint}/${id}`, {
        headers: { Authorization: token },
      });
      const axiosRespHandle = resp.data.data;
      return axiosRespHandle;
    } else {
      const resp = await axios.get(`${API_URL}/${ApiEndPoint}`, {
        headers: { Authorization: token },
      });
      const axiosRespHandle = resp.data.data;
      return axiosRespHandle;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      handleAxiosError(error);
    } else {
      handleUnexpectedError(error);
    }
  }
};

const getApiWithTwoParameter = async (ApiEndPoint, orgsId, roleId) => {
  try {
    const resp = await axios.get(
      `${API_URL}/${ApiEndPoint}/?organization=${orgsId}&role=${roleId}`,
      {
        headers: { Authorization: token },
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
const generalUpdateApi = async (
  ApiEndPoint,
  updateData,
  id,
  headersContent
) => {
  try {
    if (id) {
      const resp = await axios.put(
        `${API_URL}/${ApiEndPoint}/${id}`,
        updateData,
        {
          headers: { Authorization: token, "Content-Type": headersContent },
        }
      );
      const axiosRespHandle = resp.data.data;
      return axiosRespHandle;
    } else {
      const resp = await axios.post(
        `${API_URL}/${ApiEndPoint}/?_method=PUT`,
        updateData,
        {
          headers: { Authorization: token, "Content-Type": headersContent },
        }
      );

      const axiosRespHandle = resp.data.data;
      return axiosRespHandle;
    }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      handleAxiosError(err);
    } else {
      handleUnexpectedError(err);
    }
  }
};

const generalDeleteApiCall = async (ApiEndPoint, userData, id) => {
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
    if (axios.isAxiosError(err)) {
      handleAxiosError(err);
    } else {
      handleUnexpectedError(err);
    }
  }
};

const downloadApi = async (ApiEndPoint, headerType) => {
  try {
    const resp = await axios.get(`${API_URL}/${ApiEndPoint} `, {
      headers: { Authorization: token },
      responseType: `${headerType}`,
    });
    const axiosRespHandle = resp.data;
    return axiosRespHandle;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      handleAxiosError(error);
    } else {
      handleUnexpectedError(error);
    }
  }
};

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
const SettingTokenService = async (ApiEndPoint, token) => {
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
const postApiCall = async (ApiEndPoint, PayloadObject, headersContent) => {
  if (ApiEndPoint === "previewOrganization") {
    try {
      const resp = await axios.post(
        `${API_URL}/${ApiEndPoint}`,
        PayloadObject,
        {
          headers: { Authorization: token, "Content-Type": headersContent },
        }
      );
      const axiosRespHandle = resp.data;
      return axiosRespHandle;
    } catch (error) {
      throw Promise.reject(error);
    }
  } else {
    try {
      const resp = await axios.post(
        `${API_URL}/${ApiEndPoint}`,
        PayloadObject,
        {
          headers: { Authorization: token, "Content-Type": headersContent },
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
      throw Promise.reject(error);
    }
  }
};
const loginService = async (ApiEndPoint, PayloadObject) => {
  try {
    const resp = await axios.post(`${API_URL}/${ApiEndPoint}`, PayloadObject);
    const axiosRespHandle = resp.data;
    return axiosRespHandle;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      handleAxiosError(error);
    } else {
      handleUnexpectedError(error);
    }
  }
};

export default {
  getApiForOptionalPayload,
  getApiCall,
  loginService,
  postApiCall,
  getApiWithTwoParameter,
  generalDeleteApiCall,
  downloadApi,
  deleteApiMethodDeleteAndId,
  generalUpdateApi,
  SettingTokenService,
};
