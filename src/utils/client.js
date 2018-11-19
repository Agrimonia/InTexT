import axios from "axios";

const API_BASE = "127.0.0.1:5000/api";

const TOKEN_KEY = "AUTH_TOKEN";

export const APIClient = axios.create({
  baseURL: API_BASE,
  timeout: 5000
});
