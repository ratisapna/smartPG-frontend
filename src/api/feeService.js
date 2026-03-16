import axios from "axios";

const API_URL = "http://localhost:5000/api/fees";

const getHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getFees = async () => {
  const response = await axios.get(`${API_URL}/`, getHeader());
  return response.data;
};

export const getTenantFees = async (tenantId) => {
  const response = await axios.get(`${API_URL}/tenant/${tenantId}`, getHeader());
  return response.data;
};

export const getMyFees = async () => {
  const response = await axios.get(`${API_URL}/my`, getHeader());
  return response.data;
};

export const markFeeAsPaid = async (paymentData) => {
  const response = await axios.post(`${API_URL}/mark-paid`, paymentData, getHeader());
  return response.data;
};
