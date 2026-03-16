import apiClient from "./apiClient";

export const getRooms = async () => {
  const response = await apiClient.get("/rooms");
  return response.data;
};

export const createRoom = async (roomData) => {
  const response = await apiClient.post("/rooms", roomData);
  return response.data;
};

export const updateRoom = async (roomId, roomData) => {
  const response = await apiClient.patch(`/rooms/${roomId}`, roomData);
  return response.data;
};

export const deleteRoom = async (roomId) => {
  const response = await apiClient.delete(`/rooms/${roomId}`);
  return response.data;
};

export const getRoomAvailability = async () => {
  const response = await apiClient.get("/rooms/availability/beds");
  return response.data;
};
export const getRoomUploadUrl = async (fileName, fileType) => {
  const response = await apiClient.post("/rooms/upload-url", { fileName, fileType });
  return response.data;
};
