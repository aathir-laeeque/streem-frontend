import { actionSpreader } from '#store';
import { User } from '#store/users/types';
import { AuthAction, LoginResponse, RefreshTokenResponse } from './types';

// LOGIN ACTIONS

export const login = (payload: { username: string; password: string }) =>
  actionSpreader(AuthAction.LOGIN, payload);

export const loginSuccess = (data: LoginResponse) =>
  actionSpreader(AuthAction.LOGIN_SUCCESS, data);

export const loginError = (error: any) =>
  actionSpreader(AuthAction.LOGIN_ERROR, error);

// REGISTER ACTIONS

export const register = (payload: {
  email: string;
  newPassword: string;
  token: string;
}) => actionSpreader(AuthAction.REGISTER, payload);

export const registerSuccess = () =>
  actionSpreader(AuthAction.REGISTER_SUCCESS);

export const registerError = (error: any) =>
  actionSpreader(AuthAction.REGISTER_ERROR, error);

// PROFILE ACTIONS

export const fetchProfile = (payload: { id: string | number }) =>
  actionSpreader(AuthAction.FETCH_PROFILE, payload);

export const fetchProfileSuccess = (data: User) =>
  actionSpreader(AuthAction.FETCH_PROFILE_SUCCESS, data);

export const fetchProfileError = (error: any) =>
  actionSpreader(AuthAction.FETCH_PROFILE_ERROR, error);

export const updateProfile = (payload: {
  body: Record<string, any>;
  id: number;
}) => actionSpreader(AuthAction.UPDATE_PROFILE, payload);

export const updateProfileSuccess = (data: User) =>
  actionSpreader(AuthAction.UPDATE_PROFILE_SUCCESS, data);

export const updateProfileError = (error: any) =>
  actionSpreader(AuthAction.UPDATE_PROFILE_ERROR, error);

// REFRESH TOKEN ACTIONS

export const refreshTokenPoll = () =>
  actionSpreader(AuthAction.REFRESH_TOKEN_POLL);

export const refreshToken = (payload: { token: string }) =>
  actionSpreader(AuthAction.REFRESH_TOKEN, payload);

export const refreshTokenSuccess = (data: RefreshTokenResponse) =>
  actionSpreader(AuthAction.REFRESH_TOKEN_SUCCESS, data);

export const refreshTokenError = (error: any) =>
  actionSpreader(AuthAction.REFRESH_TOKEN_ERROR, error);
