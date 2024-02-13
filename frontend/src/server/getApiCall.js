import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

const getApiCall = async (ApiEndPoint, id) => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
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
      // console.log("res",resp,ApiEndPoint)
      const axiosRespHandle = resp.data.data;
      return axiosRespHandle;
    }
  } catch (error) {
    // console.log(error.response.data.code);
    throw error;
    // console.log("SSSS", axios.isAxiosError(error));

    // if (axios.isAxiosError(error)) {
    //   console.log("dsa22222222dasd");

    //   console.log("dsadasd", handleAxiosError(error));
    //   handleAxiosError(error);
    // } else {
    //   handleUnexpectedError(error);
    //   console.log("gggggggggg");
    // }
  }
};

export default getApiCall;
