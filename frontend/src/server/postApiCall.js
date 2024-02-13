import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

const postApiCall = async (ApiEndPoint, PayloadObject, headersContent) => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
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
  } else if (ApiEndPoint === "scormPreview") {
    try {
      const resp = await axios.post(
        `${API_URL}/${ApiEndPoint}`,
        PayloadObject,
        {
          headers: { Authorization: token, "Content-Type": headersContent },
        }
      );
      const axiosRespHandle = resp.api_token;
      console.log(axiosRespHandle);
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
      // if (axios.isAxiosError(error)) {
      //   handleAxiosError(error);
      // } else {
      //   handleUnexpectedError(error);
      // }
      // throw Promise.reject(error);
      throw error;
    }
  }
};

export default postApiCall;
