import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const generateText = async (triples) => {
  const response = await api.post('/generate', { triples });
  return response.data;
};

export const saveGeneration = async (data) => {
  const response = await api.post('/generations/save', data);
  return response.data;
};

export const getMyGenerations = async () => {
  const response = await api.get('/generations/my');
  return response.data;
};

export const deleteGeneration = async (id) => {
  const response = await api.delete(`/generations/${id}`);
  return response.data;
};

export const exportGenerations = async () => {
  const response = await api.get('/generations/export');
  return response.data;
};

export const downloadGenerationFile = async (payload) => {
  const response = await api.post('/generations/download', payload, {
    responseType: 'blob'
  });
  return response;
};

export const downloadSavedGenerationFile = async (generationId, format) => {
  const response = await api.get(`/generations/${generationId}/download?format=${format}`, {
    responseType: 'blob'
  });
  return response;
};

export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getRecentGenerations = async (limit = 10) => {
  const response = await api.get(`/admin/recent-generations?limit=${limit}`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const getHealthStatus = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;