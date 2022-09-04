import { apiInstance } from "config/axios";

const getUserByEmail = async (email: string) =>
  await apiInstance().get("/users/user-by-email", { params: { email } });

export { getUserByEmail };
