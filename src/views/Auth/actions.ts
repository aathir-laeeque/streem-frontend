import { actionSpreader } from '#store';
import { ResponseObj } from '#utils/globalTypes';

import { AuthAction } from './types';

// LOGIN ACTIONS

export const login = (payload: { username: string; password: string }) =>
  actionSpreader(AuthAction.LOGIN, payload);

export const loginSuccess = (data: ResponseObj<any>) =>
  actionSpreader(AuthAction.LOGIN_SUCCESS, data);

export const loginError = (error: any) =>
  actionSpreader(AuthAction.LOGIN_ERROR, error);

// REFRESH TOKEN ACTIONS

export const refreshToken = (payload: { token: string }) =>
  actionSpreader(AuthAction.REFRESH_TOKEN, payload);

export const refreshTokenSuccess = (data: ResponseObj<any>) =>
  actionSpreader(AuthAction.REFRESH_TOKEN_SUCCESS, data);

export const refreshTokenError = (error: any) =>
  actionSpreader(AuthAction.REFRESH_TOKEN_ERROR, error);
