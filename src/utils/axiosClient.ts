import { store } from '../App';
import { apiRefreshToken } from './apiUrls';
import axios, { AxiosResponse } from 'axios';
import { closeAllOverlayAction } from '#components/OverlayContainer/actions';
import {
  logOutSuccess,
  logOut,
  refreshTokenSuccess,
} from '#views/Auth/actions';
import { NotificationType } from '#components/Notification/types';
import { LoginErrorCodes } from './constants';
import { RefreshTokenResponse } from '#views/Auth/types';

// REFRESH TOKEN LOGIC

const REFRESH_TOKEN_URL = apiRefreshToken();
let refreshPromise: Promise<AxiosResponse<RefreshTokenResponse>> | null = null;
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
      const errorCode = response?.data?.errors?.[0]?.code;

      if (errorCode && errorCode !== LoginErrorCodes.TOKEN_EXPIRED.toString()) {
        throw errorCode.toString();
      }

      if (
        originalReq.url !== REFRESH_TOKEN_URL &&
        !originalReq?.isRetryAttempt &&
        errorCode === LoginErrorCodes.TOKEN_EXPIRED.toString()
      ) {
        const {
          auth: { refreshToken },
        } = store.getState();

        removeAuthHeader();

        const { data } = await refreshTokenRequest(refreshToken);
        store.dispatch(refreshTokenSuccess(data));

        originalReq.isRetryAttempt = true;
        setAuthHeader(data.accessToken);
        originalReq.headers['Authorization'] = `Bearer ${data.accessToken}`;
        return await axiosInstance.request(originalReq);
      } else {
        return response.data;
      }
    } catch (e) {
      if (e in LoginErrorCodes) {
        store.dispatch(closeAllOverlayAction());
        store.dispatch(
          logOutSuccess({
            msg:
              LoginErrorCodes.TOKEN_REVOKED.toString() === e
                ? 'Token Revoked'
                : 'Token Expired',
            type: NotificationType.ERROR,
          }),
        );
      } else {
        store.dispatch(logOut());
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
