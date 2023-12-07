import axios from "axios";
import * as localStorage from "./localStorage";
const headers = () => {
  const token = localStorage.get("iqb_token")
    ? atob(localStorage.get("iqb_token"))
    : null;
  const loggedInuid = localStorage.get("userdata")
    ? JSON.parse(localStorage.get("userdata")).id
    : null;
  let head = { "Content-Type": "multipart/form-data" };
  if (token) {
    head["Authorization"] = `bearer ${token}`;
    head["loggedInuid"] = `${loggedInuid}`;
  } else {
    head["Authorization"] = null;
    head["loggedInuid"] = 1;
  }
  return head;
};

export const get = (url) => axios.get(url, { headers: headers() });

export const post = (url, data) =>
  axios.post(url, data, { headers: headers() });

export const remove = (url) => axios.delete(url, { headers: headers() });

export const put = (url, data) => axios.put(url, data, { headers: headers() });
