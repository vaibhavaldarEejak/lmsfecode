import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

const getApiWithTwoParameter = async (ApiEndPoint, orgsId, roleId) => {
  const token = "Bearer " + localStorage.getItem("ApiToken");
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
    // if (axios.isAxiosError(error)) {
    //   handleAxiosError(error);
    // } else {
    //   handleUnexpectedError(error);
    // }
    throw error;
  }
};

export default getApiWithTwoParameter;
