import axios from "axios";

const API_BASE = "http://127.0.0.1:5000/api";

export const APIClient = axios.create({
  baseURL: API_BASE,
  timeout: 5000
});
