import { apiInstance } from "config/axios";

const getUserByEmail = async (email: string) =>
  await apiInstance().get("/users/user-by-email", { params: { email } });

const getAuthenticity = async () => await apiInstance().get("/users/auth");

export { getUserByEmail, getAuthenticity };
