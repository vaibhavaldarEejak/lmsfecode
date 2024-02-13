import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

const loginService = async (ApiEndPoint, PayloadObject) => {
  try {
    const resp = await axios.post(`${API_URL}/${ApiEndPoint}`, PayloadObject);
    const axiosRespHandle = resp.data;
    return axiosRespHandle;
  } catch (error) {
    throw error;
  }
};

export default loginService;
