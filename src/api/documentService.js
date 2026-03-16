import apiClient from "./apiClient";

export const uploadDocument = async (docData) => {
  const response = await apiClient.post("/documents", docData);
  return response.data;
};

export const getMyDocuments = async (tenantId) => {
  const response = await apiClient.get(`/documents/tenant/${tenantId}`);
  return response.data;
};

export const verifyDoc = async (docId, statusData) => {
  const response = await apiClient.patch(`/documents/${docId}`, statusData);
  return response.data;
};
