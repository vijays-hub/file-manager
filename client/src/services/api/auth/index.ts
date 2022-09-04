import { apiInstance } from "config/axios";

const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => apiInstance().post("/auth/login", { email, password });

const register = async ({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) => apiInstance().post("/auth/register", { username, email, password });

export { login, register };
