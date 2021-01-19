import { apiForgotPassword, apiLogin, apiRefreshToken } from './apiUrls';
import { AxiosRequestConfig } from 'axios';
import axiosInstance, { removeAuthHeader } from './axiosClient';

interface RequestOptions {
  data?: Record<string | number, any>;
  formData?: FormData;
  params?: Record<string | number, any>;
  headers?: Record<string, string>;
}

export const request = async (
  method: AxiosRequestConfig['method'],
  url: string,
  options?: RequestOptions,
) => {
  if ([apiForgotPassword(), apiLogin(), apiRefreshToken()].includes(url))
    removeAuthHeader();

  return axiosInstance({
    method,
    url,
    headers: {
      ...options?.headers,
      ...(options?.formData && { 'Content-Type': 'multipart/form-data' }),
    },
    params: options?.params,
    data: options?.data || options?.formData,
  })
    .then(function (response) {
      return response;
    })
    .catch((error) => {
      console.error('Error in axios Request :', error);
    });
};
