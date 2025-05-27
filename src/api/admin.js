import axiosInstance from "./axios";
export const loginAdmin = (email, password) => {
  return axiosInstance.post("/api/admin/login", { email, password });
};

export const registerAdmin = (full_name, email, password) => {
  return axiosInstance.post("/api/auth/register", { full_name, email, password }); 
};