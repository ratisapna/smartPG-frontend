import apiClient from "./apiClient";

export const getFees = async () => {
  const response = await apiClient.get("/fees/");
  return response.data;
};

export const getTenantFees = async (tenantId) => {
  const response = await apiClient.get(`/fees/tenant/${tenantId}`);
  return response.data;
};

export const getMyFees = async () => {
  const response = await apiClient.get("/fees/my");
  return response.data;
};

export const markFeeAsPaid = async (paymentData) => {
  const response = await apiClient.post("/fees/mark-paid", paymentData);
  return response.data;
};
