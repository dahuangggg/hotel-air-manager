import axios from "axios";

export const setAxiosAuthToken = (token: string | null) => {
  if (typeof token !== "undefined" && token) {
    axios.defaults.headers.common["Authorization"] = "Token " + token;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};
