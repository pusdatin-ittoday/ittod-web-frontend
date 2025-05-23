import instance from "./axios";

export const getUserData = () => {
  return instance.get("/api/user");
};

export const updateUserData = (newData) => {
  return instance.patch("/api/user", newData);
};
