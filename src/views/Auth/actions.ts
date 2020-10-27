import { actionSpreader } from '#store';
import { User } from '#store/users/types';
import { AuthAction, LoginResponse, RefreshTokenResponse } from './types';

// LOGIN ACTIONS

export const login = (payload: { username: string; password: string }) =>
  actionSpreader(AuthAction.LOGIN, payload);

export const loginSuccess = (data: LoginResponse) =>
  actionSpreader(AuthAction.LOGIN_SUCCESS, data);

export const loginError = (error: string) =>
  actionSpreader(AuthAction.LOGIN_ERROR, error);

export const setIdle = (data: boolean) =>
  actionSpreader(AuthAction.SET_IDLE, data);

// LOGOUT ACTIONS

export const logOut = () => actionSpreader(AuthAction.LOGOUT);

export const logOutSuccess = () => actionSpreader(AuthAction.LOGOUT_SUCCESS);

export const logOutError = (error: any) =>
  actionSpreader(AuthAction.LOGOUT_ERROR, error);

// REGISTER ACTIONS

export const register = (payload: {
  username: string;
  password: string;
  token: string;
}) => actionSpreader(AuthAction.REGISTER, payload);

export const registerSuccess = () =>
  actionSpreader(AuthAction.REGISTER_SUCCESS);

export const registerError = (error: any) =>
  actionSpreader(AuthAction.REGISTER_ERROR, error);

// FORGOT PASSWORD

export const forgotPassword = (payload: { email: string }) =>
  actionSpreader(AuthAction.FORGOT_PASSWORD, payload);

export const forgotPasswordSuccess = () =>
  actionSpreader(AuthAction.FORGOT_PASSWORD_SUCCESS);

export const forgotPasswordError = (error: any) =>
  actionSpreader(AuthAction.FORGOT_PASSWORD_ERROR, error);

// PROFILE ACTIONS

export const fetchProfile = (payload: { id: User['id'] }) =>
  actionSpreader(AuthAction.FETCH_PROFILE, payload);

export const fetchProfileSuccess = (data: User) =>
  actionSpreader(AuthAction.FETCH_PROFILE_SUCCESS, data);

export const fetchProfileError = (error: any) =>
  actionSpreader(AuthAction.FETCH_PROFILE_ERROR, error);

export const updateProfile = (payload: {
  body: Record<string, any>;
  id: User['id'];
}) => actionSpreader(AuthAction.UPDATE_PROFILE, payload);

export const updateProfileSuccess = (data: User) =>
  actionSpreader(AuthAction.UPDATE_PROFILE_SUCCESS, data);

export const updateProfileError = (error: any) =>
  actionSpreader(AuthAction.UPDATE_PROFILE_ERROR, error);

export const updateUserProfile = (payload: {
  body: Record<string, any>;
  id: User['id'];
}) => actionSpreader(AuthAction.UPDATE_USER_PROFILE, payload);

export const updateUserProfileSuccess = (data: User) =>
  actionSpreader(AuthAction.UPDATE_USER_PROFILE_SUCCESS, data);

export const updateUserProfileError = (error: any) =>
  actionSpreader(AuthAction.UPDATE_USER_PROFILE_ERROR, error);

export const updatePassword = (payload: {
  body: Record<string, any>;
  id: User['id'];
}) => actionSpreader(AuthAction.UPDATE_PASSWORD, payload);

export const updatePasswordSuccess = (data: User) =>
  actionSpreader(AuthAction.UPDATE_PASSWORD_SUCCESS, data);

export const updatePasswordError = (error: any) =>
  actionSpreader(AuthAction.UPDATE_PASSWORD_ERROR, error);

// REFRESH TOKEN ACTIONS

export const refreshTokenPoll = () =>
  actionSpreader(AuthAction.REFRESH_TOKEN_POLL);

export const refreshToken = (payload: { refreshToken: string }) =>
  actionSpreader(AuthAction.REFRESH_TOKEN, payload);

export const refreshTokenSuccess = (data: RefreshTokenResponse) =>
  actionSpreader(AuthAction.REFRESH_TOKEN_SUCCESS, data);

export const refreshTokenError = (error: any) =>
  actionSpreader(AuthAction.REFRESH_TOKEN_ERROR, error);

export const checkTokenExpiry = (payload: { type: string; token: string }) =>
  actionSpreader(AuthAction.CHECK_TOKEN_EXPIRY, payload);

export const checkTokenExpirySuccess = (payload: { isTokenExpired: boolean }) =>
  actionSpreader(AuthAction.CHECK_TOKEN_EXPIRY_SUCCESS, payload);

export const checkTokenExpiryError = (error: any) =>
  actionSpreader(AuthAction.CHECK_TOKEN_EXPIRY_ERROR, error);

// RESET PASSWORD

export const resetPassword = (payload: {
  newPassword: string;
  token: string;
}) => actionSpreader(AuthAction.RESET_PASSWORD, payload);

export const resetPasswordSuccess = () =>
  actionSpreader(AuthAction.RESET_PASSWORD_SUCCESS);

export const resetPasswordError = (error: any) =>
  actionSpreader(AuthAction.RESET_PASSWORD_ERROR, error);

export const resetError = () => actionSpreader(AuthAction.RESET_ERROR);
