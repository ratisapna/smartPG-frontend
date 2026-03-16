import apiClient from "./apiClient";

export const getComplaints = () => apiClient.get("/complaints");
export const createComplaint = (data) => apiClient.post("/complaints", data);
export const updateComplaintStatus = (id, status) => apiClient.patch(`/complaints/${id}`, { status });
