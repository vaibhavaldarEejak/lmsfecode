import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

const generalUpdateApi = async (
  ApiEndPoint,
  updateData,
  id,
  headersContent
) => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
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
    // if (axios.isAxiosError(err)) {
    //   handleAxiosError(err);
    // } else {
    //   handleUnexpectedError(err);
    // }
    throw err;
  }
};
export default generalUpdateApi;
