import apiClient from "./apiClient";

export const getOwnerDashboard = async () => {
  const response = await apiClient.get("/dashboard/owner");
  return response.data;
};

export const getTenantDashboard = async () => {
  const response = await apiClient.get(`/dashboard/tenant`);
  return response.data;
};

export const getActivityRecent = async () => {
  const response = await apiClient.get("/activity/recent");
  return response.data;
};
