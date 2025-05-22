import axiosInstance from "./axios";

export const loginAdmin = (email, password) => {
  return axiosInstance.post("/api/admin/login", { email, password });
};