import React from "react";

function AxiosError({ error }) {
  if (axios.isAxiosError(error)) {
    console.log({ error });
    handleAxiosError(error);
  } else {
    console.log("else", error);
    handleUnexpectedError(error);
  }
  return;
}
export default AxiosError;
