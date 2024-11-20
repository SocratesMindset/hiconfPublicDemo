import axios from 'axios';

const BASE_URL = 'http://localhost:5000/';

export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

authApi.defaults.headers.common['Content-Type'] = 'application/json';

export const signUpUserFn = async (user: any) => {
  const response = await authApi.post('auth/register', user);
  return response.data;
};

export const loginUserFn = async (user: any) => {
  const response = await authApi.post('auth/login', user);
  return response.data;
};

export const verifyEmailFn = async (verificationCode: any) => {
  const response = await authApi.get(
    `auth/verifyemail/${verificationCode}`
  );
  return response.data;
};

export const logoutUserFn = async () => {
  const response = await authApi.get('auth/logout');
  return response.data;
};

export const getMeFn = async () => {
  const response = await authApi.get('users/me');
  return response.data;
};
