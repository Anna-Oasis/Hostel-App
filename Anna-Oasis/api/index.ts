import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

console.log("API URL:", API_URL);
if (!API_URL) {
  throw new Error("API_URL is not defined. Please set the API_URL environment variable.");
}

const api = axios.create({
  baseURL: API_URL,
});

export default api;
