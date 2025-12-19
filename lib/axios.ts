import axios from "axios";

export const api = axios.create({
  baseURL: "/api", // optional
  withCredentials: true, // send cookies
});
