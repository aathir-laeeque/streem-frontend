import { User } from '#store/users/types';
import { RouteComponentProps } from '@reach/router';

import {
  checkTokenExpirySuccess,
  cleanUp,
  fetchProfileSuccess,
  forgotPasswordError,
  forgotPasswordSuccess,
  login,
  resetError,
  loginSuccess,
  loginError,
  refreshTokenSuccess,
  registerError,
  resetPasswordError,
  updateProfileSuccess,
  setIdle,
  logOutSuccess,
  logOut,
} from './actions';

export type AuthViewProps = RouteComponentProps;

interface Settings {
  logoUrl: string;
  accessTokenExpirationInMinutes: number;
  refreshTokenExpirationInMinutes: number;
  sessionIdleTimeoutInMinutes: number;
}

export interface LoginResponse {
  id: User['id'];
  firstName: string;
  message: string;
  accessToken: string;
  refreshToken: string;
  roles: string[];
  facilities: Facility[];
  settings: Settings;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

type Facility = {
  id: string;
  name: string;
};
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
  readonly loading: boolean;
  readonly resetRequested: boolean;
  readonly error: any;
  readonly roles?: string[];
  readonly isTokenExpired?: boolean;
  readonly facilities: Facility[];
  readonly selectedFacility?: Facility;
  readonly settings?: Settings;
}

export enum AuthAction {
  RESET_ERROR = '@@auth/Login/RESET_ERROR',
  LOGOUT = '@@auth/Logout/LOGOUT',
  LOGOUT_SUCCESS = '@@auth/Logout/LOGOUT_SUCCESS',
  CLEANUP = '@@auth/Logout/CLEANUP',
  LOGOUT_ERROR = '@@auth/Logout/LOGOUT_ERROR',
  LOGIN = '@@auth/Login/LOGIN',
  LOGIN_ERROR = '@@auth/Login/LOGIN_ERROR',
  LOGIN_SUCCESS = '@@auth/Login/LOGIN_SUCCESS',
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
  UPDATE_USER_PROFILE = '@@auth/MyProfile/UPDATE_USER_PROFILE',
  UPDATE_USER_PROFILE_ERROR = '@@auth/MyProfile/UPDATE_USER_PROFILE_ERROR',
  UPDATE_USER_PROFILE_SUCCESS = '@@auth/MyProfile/UPDATE_USER_PROFILE_SUCCESS',
  UPDATE_PASSWORD = '@@auth/MyProfile/UPDATE_PASSWORD',
  UPDATE_PASSWORD_ERROR = '@@auth/MyProfile/UPDATE_PASSWORD_ERROR',
  UPDATE_PASSWORD_SUCCESS = '@@auth/MyProfile/UPDATE_PASSWORD_SUCCESS',
  CHECK_TOKEN_EXPIRY = '@@auth/CHECK_TOKEN_EXPIRY',
  CHECK_TOKEN_EXPIRY_ERROR = '@@auth/CHECK_TOKEN_EXPIRY_ERROR',
  CHECK_TOKEN_EXPIRY_SUCCESS = '@@auth/CHECK_TOKEN_EXPIRY_SUCCESS',
  SET_IDLE = '@@auth/MyProfile/SET_IDLE',
}

export type AuthActionType = ReturnType<
  | typeof resetError
  | typeof login
  | typeof loginSuccess
  | typeof logOut
  | typeof logOutSuccess
  | typeof loginError
  | typeof registerError
  | typeof refreshTokenSuccess
  | typeof fetchProfileSuccess
  | typeof updateProfileSuccess
  | typeof forgotPasswordSuccess
  | typeof forgotPasswordError
  | typeof resetPasswordError
  | typeof setIdle
  | typeof checkTokenExpirySuccess
  | typeof cleanUp
>;
