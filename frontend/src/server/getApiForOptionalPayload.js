import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

const getApiForOptionalPayload = async (ApiEndPoint, id) => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  try {
    const resp = await axios.get(`${API_URL}${ApiEndPoint}`, {
      headers: { Authorization: token },
    });
    const axiosRespHandle = resp.data.data;
    return axiosRespHandle;
  } catch (error) {
    // if (axios.isAxiosError(error)) {
    //   handleAxiosError(error);
    // } else {
    //   handleUnexpectedError(error);
    // }
    throw error;
  }
};

export default getApiForOptionalPayload;
