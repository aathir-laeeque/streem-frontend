import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { AxiosRequestConfig } from 'axios';
import { put } from 'redux-saga/effects';

import {
  apiCheckTokenExpiry,
  apiLogin,
  apiRefreshToken,
  apiReLogin,
  apiSsoRedirect,
} from './apiUrls';
import axiosInstance, { removeAuthHeader } from './axiosClient';
import { ResponseError, ResponseObj } from './globalTypes';
import { navigate } from '@reach/router';

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
  if ([apiLogin(), apiRefreshToken(), apiCheckTokenExpiry(), apiReLogin()].includes(url))
    removeAuthHeader();
  const { headers, formData, params, data, ...rest } = options || {};

  return axiosInstance({
    method,
    url,
    headers: {
      ...headers,
      ...(formData && { 'Content-Type': 'multipart/form-data' }),
    },
    params: params,
    data: data || formData,
    ...rest,
  })
    .then(function (response) {
      return response;
    })
    .catch((error) => {
      console.error('Error in axios Request :', error);
      // TODO Make request return given type and remove this any.
    }) as any;
};

// TODO Migrate All Sgag's to Use this and Handle Multiple Errors.

export const getErrorMsg = (errors: ResponseError[]) =>
  errors?.[0]?.message || 'Oops... Please try again.';

export function* handleCatch(origin: string, sagaName: string, error: unknown, notify = false) {
  console.error(`error from ${origin} function in ${sagaName} :: `, error);
  if (typeof error !== 'string') error = 'Oops! Please Try Again.';
  if (notify)
    yield put(
      showNotification({
        type: NotificationType.ERROR,
        msg: error as string,
      }),
    );
  return error;
}

export const ssoSigningRedirect = async (data: any) => {
  try {
    const {
      auth: { accessToken },
    } = window.store.getState();
    const { data: responseData, errors }: ResponseObj<any> = await request(
      'POST',
      apiSsoRedirect(),
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        data: { data: data },
      },
    );
    if (responseData?.redirectUrl) {
      navigate(responseData.redirectUrl);
    }
    if (errors) {
      handleCatch('Sso Signing', 'ssoSigningRedirect', getErrorMsg(errors), true);
    }
  } catch (error) {
    console.error('error came in ssoSigningRedirect :: ', error);
  }
};
