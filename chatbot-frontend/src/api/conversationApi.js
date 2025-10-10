// src/api/conversationApi.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const getConversations = async (token) => {
  const res = await axios.get(`${API_URL}/api/conversations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.conversations || [];
};

export const newConversationApi = async (token) => {
  const res = await axios.post(
    `${API_URL}/api/conversations/newChat`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.conversation;
};

export const getConversationById = async (conversationId, token) => {
  const res = await axios.get(`${API_URL}/api/conversations/${conversationId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.conversation;
};
