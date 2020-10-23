import { RouteComponentProps } from '@reach/router';
import { User } from '#store/users/types';
import {
  login,
  logOut,
  resetError,
  logOutSuccess,
  logOutError,
  loginSuccess,
  loginError,
  refreshToken,
  refreshTokenPoll,
  refreshTokenSuccess,
  refreshTokenError,
  fetchProfile,
  fetchProfileSuccess,
  fetchProfileError,
  register,
  registerSuccess,
  registerError,
  resetPassword,
  resetPasswordSuccess,
  resetPasswordError,
  updateProfile,
  updateProfileSuccess,
  updateProfileError,
  forgotPassword,
  forgotPasswordSuccess,
  forgotPasswordError,
  setIdle,
} from './actions';

export type AuthViewProps = RouteComponentProps;

export interface LoginResponse {
  id: User['id'];
  firstName: string;
  message: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpirationInMinutes: number;
  refreshTokenExpirationInMinutes: number;
  sessionIdleTimeoutInMinutes: number;
  roles: string[];
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
export interface AuthState {
  readonly userId: User['id'] | null;
  readonly isIdle: boolean;
  readonly isLoggedIn: boolean;
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly accessTokenExpirationInMinutes?: number;
  readonly refreshTokenExpirationInMinutes?: number;
  readonly sessionIdleTimeoutInMinutes?: number;
  readonly profile: User | null;
  readonly isRefreshing: boolean;
  readonly loading: boolean;
  readonly resetRequested: boolean;
  readonly error: any;
  readonly roles?: string[];
}

export enum AuthAction {
  RESET_ERROR = '@@auth/Login/RESET_ERROR',
  LOGOUT = '@@auth/Login/LOGOUT',
  LOGOUT_SUCCESS = '@@auth/Login/LOGOUT_SUCCESS',
  LOGOUT_ERROR = '@@auth/Login/LOGOUT_ERROR',
  LOGIN = '@@auth/Login/LOGIN',
  LOGIN_ERROR = '@@auth/Login/LOGIN_ERROR',
  LOGIN_SUCCESS = '@@auth/Login/LOGIN_SUCCESS',
  REFRESH_TOKEN_POLL = '@@auth/Login/REFRESH_TOKEN_POLL',
  REFRESH_TOKEN = '@@auth/Login/REFRESH_TOKEN',
  REFRESH_TOKEN_ERROR = '@@auth/Login/REFRESH_TOKEN_ERROR',
  REFRESH_TOKEN_SUCCESS = '@@auth/Login/REFRESH_TOKEN_SUCCESS',
  FETCH_PROFILE = '@@auth/Login/FETCH_PROFILE',
  FETCH_PROFILE_ERROR = '@@auth/Login/FETCH_PROFILE_ERROR',
  FETCH_PROFILE_SUCCESS = '@@auth/Login/FETCH_PROFILE_SUCCESS',
  REGISTER = '@@auth/Register/REGISTER',
  REGISTER_ERROR = '@@auth/Register/REGISTER_ERROR',
  REGISTER_SUCCESS = '@@auth/Register/REGISTER_SUCCESS',
  FORGOT_PASSWORD = '@@auth/Register/FORGOT_PASSWORD',
  FORGOT_PASSWORD_ERROR = '@@auth/Register/FORGOT_PASSWORD_ERROR',
  FORGOT_PASSWORD_SUCCESS = '@@auth/Register/FORGOT_PASSWORD_SUCCESS',
  RESET_PASSWORD = '@@auth/Register/RESET_PASSWORD',
  RESET_PASSWORD_ERROR = '@@auth/Register/RESET_PASSWORD_ERROR',
  RESET_PASSWORD_SUCCESS = '@@auth/Register/RESET_PASSWORD_SUCCESS',
  UPDATE_PROFILE = '@@auth/MyProfile/UPDATE_PROFILE',
  UPDATE_PROFILE_ERROR = '@@auth/MyProfile/UPDATE_PROFILE_ERROR',
  UPDATE_PROFILE_SUCCESS = '@@auth/MyProfile/UPDATE_PROFILE_SUCCESS',
  SET_IDLE = '@@auth/MyProfile/SET_IDLE',
}

export type AuthActionType = ReturnType<
  | typeof resetError
  | typeof logOut
  | typeof logOutSuccess
  | typeof logOutError
  | typeof login
  | typeof loginSuccess
  | typeof loginError
  | typeof register
  | typeof registerSuccess
  | typeof registerError
  | typeof refreshToken
  | typeof refreshTokenPoll
  | typeof refreshTokenSuccess
  | typeof refreshTokenError
  | typeof fetchProfile
  | typeof fetchProfileSuccess
  | typeof fetchProfileError
  | typeof updateProfile
  | typeof updateProfileSuccess
  | typeof updateProfileError
  | typeof forgotPassword
  | typeof forgotPasswordSuccess
  | typeof forgotPasswordError
  | typeof resetPassword
  | typeof resetPasswordSuccess
  | typeof resetPasswordError
  | typeof setIdle
>;
