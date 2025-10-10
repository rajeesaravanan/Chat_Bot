// src/api/chatApi.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const sendMessageApi = async (query, conversationId, token) => {
  const res = await axios.post(
    `${API_URL}/api/messages/chat`,
    { query, conversationId: conversationId || null },
    { headers: { Authorization: token ? `Bearer ${token}` : "" } }
  );
  return res.data;
};
