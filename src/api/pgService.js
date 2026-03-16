import apiClient from "./apiClient";

export const getPG = async () => {
  const response = await apiClient.get("/pg");
  return response.data;
};

export const createPG = async (pgData) => {
  const response = await apiClient.post("/pg", pgData);
  return response.data;
};

export const updatePG = async (pgData) => {
  const response = await apiClient.patch("/pg", pgData);
  return response.data;
};

export const getPGUploadUrl = async (fileName, fileType) => {
  const response = await apiClient.post("/pg/upload-url", { fileName, fileType });
  return response.data;
};

export const getAllPGs = async () => {
  const response = await apiClient.get("/pg/all");
  return response.data;
};
