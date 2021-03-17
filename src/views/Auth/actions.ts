import { NotificationType } from '#components/Notification/types';
import { actionSpreader } from '#store';
import { User } from '#store/users/types';
import { PasswordRequestInputs } from '#views/Profile/AccountSecurity';
import { EditUserRequestInputs } from '#views/UserAccess/EditUser';

import {
  AuthAction,
  LoginResponse,
  RefreshTokenResponse,
  TokenTypes,
} from './types';

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

export const logOutSuccess = (payload?: {
  type?: NotificationType;
  msg?: string;
  delayTime?: number;
}) => actionSpreader(AuthAction.LOGOUT_SUCCESS, payload);

export const cleanUp = () => actionSpreader(AuthAction.CLEANUP);

// REGISTER ACTIONS

export const register = (payload: {
  username: string;
  password: string;
  token: string;
}) => actionSpreader(AuthAction.REGISTER, payload);

// FORGOT PASSWORD

export const forgotPassword = (payload: { email: string }) =>
  actionSpreader(AuthAction.FORGOT_PASSWORD, payload);

export const forgotPasswordSuccess = () =>
  actionSpreader(AuthAction.FORGOT_PASSWORD_SUCCESS);

// PROFILE ACTIONS

export const fetchProfile = (payload: { id: User['id'] }) =>
  actionSpreader(AuthAction.FETCH_PROFILE, payload);

export const fetchProfileSuccess = (data: User) =>
  actionSpreader(AuthAction.FETCH_PROFILE_SUCCESS, data);

export const updateProfile = (payload: {
  body: {
    firstName: string;
    lastName: string;
  };
  id: User['id'];
}) => actionSpreader(AuthAction.UPDATE_PROFILE, payload);

export const updateProfileSuccess = (data: User) =>
  actionSpreader(AuthAction.UPDATE_PROFILE_SUCCESS, data);

export const updateUserProfile = (payload: {
  body: Omit<EditUserRequestInputs, 'roles' | 'facilities'> & {
    roles: { id: string }[];
    facilities: { id: string }[];
  };
  id: User['id'];
}) => actionSpreader(AuthAction.UPDATE_USER_PROFILE, payload);

export const updatePassword = (payload: {
  body: PasswordRequestInputs;
  id: User['id'];
}) => actionSpreader(AuthAction.UPDATE_PASSWORD, payload);

// REFRESH TOKEN ACTIONS

export const refreshTokenSuccess = (data: RefreshTokenResponse) =>
  actionSpreader(AuthAction.REFRESH_TOKEN_SUCCESS, data);

export const checkTokenExpiry = (payload: {
  type: TokenTypes;
  token: string;
}) => actionSpreader(AuthAction.CHECK_TOKEN_EXPIRY, payload);

export const checkTokenExpirySuccess = (payload: { isTokenExpired: boolean }) =>
  actionSpreader(AuthAction.CHECK_TOKEN_EXPIRY_SUCCESS, payload);

// RESET PASSWORD

export const resetPassword = (payload: {
  newPassword: string;
  token: string;
}) => actionSpreader(AuthAction.RESET_PASSWORD, payload);

export const resetPasswordSuccess = () =>
  actionSpreader(AuthAction.RESET_PASSWORD_SUCCESS);

export const resetPasswordError = (error: string) =>
  actionSpreader(AuthAction.RESET_PASSWORD_ERROR, error);

export const resetError = () => actionSpreader(AuthAction.RESET_ERROR);
