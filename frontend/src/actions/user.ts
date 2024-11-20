import axios from "axios";

export type AuthParams = {
  email: string;
  password: string;
};

export const login = async ({ email, password }: AuthParams) => {

  const response = await axios.post("/api/login", {
    email,
    password
  });
  return response.data;
};

export const registration = async ({ email, password }: AuthParams) => {
  const response = await axios.post("/api/reg", {
    email,
    password
  });
  return response.data;
};

export const logout = async () => {
  // TODO: поменять на гет запрос
  const response = await axios.post("/api/logout");
  return response.data;
};
