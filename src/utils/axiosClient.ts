import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import NoConnection from '#assets/svg/NoConnection';
import { closeAllOverlayAction } from '#components/OverlayContainer/actions';
import { logoutSuccess, refreshTokenSuccess } from '#views/Auth/actions';
import { RefreshTokenResponse } from '#views/Auth/types';
import axios from 'axios';
import { toast } from 'react-toastify';

import { store } from '../App';
import { apiRefreshToken } from './apiUrls';
import {
  EXCULDE_BY_REGEX_FOR_NO_INTERNET_TOAST,
  LoginErrorCodes,
} from './constants';
import { ResponseObj } from './globalTypes';
import { isMatchAny } from './stringUtils';

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
          Object.values(LoginErrorCodes).some((val) => val === code) &&
          code !== LoginErrorCodes.INCORRECT &&
          code !== LoginErrorCodes.JWT_EXPIRED
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

        const { data } = (await refreshTokenRequest(
          refreshToken,
        )) as ResponseObj<RefreshTokenResponse>;
        store.dispatch(refreshTokenSuccess(data));

        originalReq.isRetryAttempt = true;
        setAuthHeader(data.accessToken);
        originalReq.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return await axiosInstance.request(originalReq);
      } else {
        return response.data;
      }
    } catch (e) {
      toast.dismiss();

      const {
        extras: { connected },
      } = store.getState();
      const { config: originalReq } = error;

      if (!connected) {
        if (
          !isMatchAny(originalReq.url, EXCULDE_BY_REGEX_FOR_NO_INTERNET_TOAST)
        ) {
          store.dispatch(
            showNotification({
              type: NotificationType.ERROR,
              msg: 'No Internet Connection.',
              detail: 'Please check your internet and try again.',
              delayTime: 10,
              icon: NoConnection,
              iconProps: {
                height: '69px',
                width: '101px',
              },
            }),
          );
        }
      } else {
        store.dispatch(closeAllOverlayAction());
        store.dispatch(
          logoutSuccess({
            msg: typeof e !== 'string' ? 'Oops! Please Try Again.' : e,
            type: NotificationType.ERROR,
            delayTime: 10,
          }),
        );
      }
      throw e;
    }
  },
);

export const removeAuthHeader = () =>
  delete axiosInstance.defaults.headers.common['Authorization'];

export const setAuthHeader = (token: string) =>
  (axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`);

export default axiosInstance;
