import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

const downloadApi = async (ApiEndPoint, headerType) => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  try {
    const resp = await axios.get(`${API_URL}/${ApiEndPoint} `, {
      headers: { Authorization: token },
      responseType: `${headerType}`,
    });
    const axiosRespHandle = resp.data;
    return axiosRespHandle;
  } catch (error) {
    throw error;
    // if (axios.isAxiosError(error)) {
    //   handleAxiosError(error);
    // } else {
    //   handleUnexpectedError(error);
    // }
  }
};

export default downloadApi;
