import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://192.168.1.128:8080";
console.log('authApi: API_URL =', API_URL);

export const login = async (email, password) => {
  const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
  return res.data;
};

export const register = async (username, email, password) => {
  const res = await axios.post(`${API_URL}/api/auth/register`, { username, email, password });
  return res.data;
};

export const googleLogin = (credential) =>
  axios.post(`${API_URL}/api/auth/google`, { credential }).then(res => res.data);
