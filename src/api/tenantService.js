import apiClient from "./apiClient";

export const getTenants = async () => {
  const response = await apiClient.get("/tenants");
  return response.data;
};

export const createTenant = async (tenantData) => {
  const response = await apiClient.post("/tenants", tenantData);
  return response.data;
};

export const updateTenant = async (tenantId, tenantData) => {
  const response = await apiClient.patch(`/tenants/${tenantId}`, tenantData);
  return response.data;
};

export const deleteTenant = async (tenantId) => {
  const response = await apiClient.delete(`/tenants/${tenantId}`);
  return response.data;
};

export const getMyTenantRecord = async () => {
    const response = await apiClient.get("/tenants/me");
    return response.data;
};
