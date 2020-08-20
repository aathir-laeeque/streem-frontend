import { RouteComponentProps } from '@reach/router';
import {
  login,
  loginSuccess,
  loginError,
  refreshToken,
  refreshTokenSuccess,
  refreshTokenError,
} from './actions';

export type AuthViewProps = RouteComponentProps;

// export interface Profile {
//   id: number;
//   name: string;
//   code: string;
//   orderTree: number;
// }

export interface AuthState {
  readonly isLoggedIn: boolean;
  readonly loading: boolean;
  readonly error: any;
  readonly profile: any;
}

export enum AuthAction {
  LOGIN = '@@auth/Login/LOGIN',
  LOGIN_ERROR = '@@auth/Login/LOGIN_ERROR',
  LOGIN_SUCCESS = '@@auth/Login/LOGIN_SUCCESS',
  REFRESH_TOKEN = '@@auth/Login/REFRESH_TOKEN',
  REFRESH_TOKEN_ERROR = '@@auth/Login/REFRESH_TOKEN_ERROR',
  REFRESH_TOKEN_SUCCESS = '@@auth/Login/REFRESH_TOKEN_SUCCESS',
  REGISTER = '@@auth/Register/REGISTER',
  REGISTER_ERROR = '@@auth/Register/REGISTER_ERROR',
  REGISTER_SUCCESS = '@@auth/Register/REGISTER_SUCCESS',
  FORGOT_PASSWORD = '@@auth/Register/FORGOT_PASSWORD',
  FORGOT_PASSWORD_ERROR = '@@auth/Register/FORGOT_PASSWORD_ERROR',
  FORGOT_PASSWORD_SUCCESS = '@@auth/Register/FORGOT_PASSWORD_SUCCESS',
}

export type AuthActionType = ReturnType<
  | typeof login
  | typeof loginSuccess
  | typeof loginError
  | typeof refreshToken
  | typeof refreshTokenSuccess
  | typeof refreshTokenError
>;
