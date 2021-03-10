import { NotificationType } from '#components/Notification/types';
import { closeAllOverlayAction } from '#components/OverlayContainer/actions';
import { logOutSuccess, refreshTokenSuccess } from '#views/Auth/actions';
import { RefreshTokenResponse } from '#views/Auth/types';
import axios from 'axios';

import { store } from '../App';
import { apiRefreshToken } from './apiUrls';
import { LoginErrorCodes } from './constants';
import { ResponseObj } from './globalTypes';
import { getErrorMsg } from './request';

// REFRESH TOKEN LOGIC

const REFRESH_TOKEN_URL = apiRefreshToken();
let refreshPromise: Promise<ResponseObj<RefreshTokenResponse>> | null = null;
async function refreshTokenRequest(refreshToken: string) {
  refreshPromise =
    refreshPromise ||
    axiosInstance.request({
      method: 'POST',
      url: apiRefreshToken(),
      data: {
        refreshToken,
      },
    });

  try {
    if (refreshPromise) {
      const data = await refreshPromise;
      return data;
    }
  } finally {
    refreshPromise = null;
  }
}

// AXIOS SETUP

const axiosInstance = axios.create();

axiosInstance.defaults.headers.post['Content-Type'] = 'application/json';
axiosInstance.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

axiosInstance.interceptors.response.use(
  (resp) => resp.data,

  async (error) => {
    try {
      const { config: originalReq, response } = error;
      const { code, message } = response?.data?.errors?.[0];

      if (
        code !== LoginErrorCodes.ACCESS_TOKEN_EXPIRED &&
        code !== LoginErrorCodes.JWT_TOKEN_REVOKED
      ) {
        const {
          auth: { isLoggedIn },
        } = store.getState();
        if (
          isLoggedIn &&
          code in LoginErrorCodes &&
          code !== LoginErrorCodes.INCORRECT
        ) {
          throw message || 'Oops! Please Try Again.';
        } else {
          return response?.data;
        }
      } else if (
        originalReq.url !== REFRESH_TOKEN_URL &&
        !originalReq?.isRetryAttempt
      ) {
        const {
          auth: { refreshToken },
        } = store.getState();

        removeAuthHeader();

        const { data, errors } = (await refreshTokenRequest(
          refreshToken,
        )) as ResponseObj<RefreshTokenResponse>;

        if (errors) {
          throw getErrorMsg(errors);
        }

        store.dispatch(refreshTokenSuccess(data));

        originalReq.isRetryAttempt = true;
        setAuthHeader(data.accessToken);
        originalReq.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return await axiosInstance.request(originalReq);
      } else {
        return response.data;
      }
    } catch (e) {
      store.dispatch(closeAllOverlayAction());
      store.dispatch(
        logOutSuccess({
          msg: typeof e !== 'string' ? 'Oops! Please Try Again.' : e,
          type: NotificationType.ERROR,
        }),
      );
      throw e;
    }
  },
);

export const removeAuthHeader = () =>
  delete axiosInstance.defaults.headers.common['Authorization'];

export const setAuthHeader = (token: string) =>
  (axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`);

export default axiosInstance;
