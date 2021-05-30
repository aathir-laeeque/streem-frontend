import { FormGroupProps } from '#components';
import {
  switchFacilityError,
  switchFacilitySuccess,
} from '#store/facilities/actions';
import { User } from '#store/users/types';
import { RouteComponentProps } from '@reach/router';

import {
  authError,
  cleanUp,
  fetchProfileSuccess,
  login,
  loginSuccess,
  logout,
  logoutSuccess,
  refreshTokenSuccess,
  resetError,
  resetPassword,
  setIdentityToken,
  setIdle,
  setChallengeQuestionSuccess,
} from './actions';

export type AuthViewProps = RouteComponentProps;

interface Settings {
  logoUrl: string;
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
  readonly accessToken: string;
  readonly email?: string;
  readonly employeeId?: string;
  readonly error?: string;
  readonly facilities: Facility[];
  readonly firstName?: string;
  readonly hasSetChallengeQuestion?: boolean;
  readonly isIdle: boolean;
  readonly isLoggedIn: boolean;
  readonly lastName?: string;
  readonly loading: boolean;
  readonly profile: User | null;
  readonly refreshToken: string;
  readonly roles?: string[];
  readonly selectedFacility?: Facility;
  readonly settings?: Settings;
  readonly token?: string;
  readonly userId: User['id'] | null;
}

export enum TokenTypes {
  PASSWORD_RESET = 'PASSWORD_RESET',
  REGISTRATION = 'REGISTRATION',
}

export enum AdditionalVerificationTypes {
  EMAIL = 'EMAIL',
  EMPLOYEE_ID = 'EMPLOYEE_ID',
}

export enum PAGE_NAMES {
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ADMIN_NOTIFIED = 'ADMIN_NOTIFIED',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  FACILITY_SELECTION = 'FACILITY_SELECTION',
  FORGOT_EMAIL_SENT = 'FORGOT_EMAIL_SENT',
  FORGOT_IDENTITY = 'FORGOT_IDENTITY',
  FORGOT_NEW_PASSWORD = 'FORGOT_NEW_PASSWORD',
  FORGOT_QUESTIONS = 'FORGOT_QUESTIONS',
  FORGOT_RECOVERY = 'FORGOT_RECOVERY',
  FORGOT_SECRET_KEY = 'FORGOT_SECRET_KEY',
  INVITATION_EXPIRED = 'INVITATION_EXPIRED',
  KEY_EXPIRED = 'KEY_EXPIRED',
  LOCKED = 'LOCKED',
  LOGIN = 'LOGIN',
  PASSWORD_EXPIRED = 'PASSWORD_EXPIRED',
  PASSWORD_UPDATED = 'PASSWORD_UPDATED',
  REGISTER_CREDENTIALS = 'REGISTER_CREDENTIALS',
  REGISTER_EMPLOYEE_ID = 'REGISTER_EMPLOYEE_ID',
  REGISTER_RECOVERY = 'REGISTER_RECOVERY',
  REGISTER_SECRET_KEY = 'REGISTER_SECRET_KEY',
}

export enum RecoveryOptions {
  CHALLENGE_QUESTION = 'CHALLENGE_QUESTION',
  EMAIL = 'EMAIL',
  CONTACT_ADMIN = 'CONTACT_ADMIN',
}

export enum ChallengeQuestionPurpose {
  PASSWORD_RECOVERY_CHALLENGE_QUESTION_NOT_SET = 'PASSWORD_RECOVERY_CHALLENGE_QUESTION_NOT_SET',
  INVITE_EXPIRED = 'INVITE_EXPIRED',
  PASSWORD_RECOVERY_ACCOUNT_LOCKED = 'PASSWORD_RECOVERY_ACCOUNT_LOCKED',
  PASSWORD_RECOVERY_KEY_EXPIRED = 'PASSWORD_RECOVERY_KEY_EXPIRED',
}

export enum CARD_POSITIONS {
  LEFT = 'flex-start',
  CENTER = 'center',
}

export type BaseViewConfigType = {
  wrapperStyle: React.CSSProperties;
  cardPosition: CARD_POSITIONS;
  cardStyle: React.CSSProperties;
  heading?: string;
  headingIcon?: JSX.Element;
  subHeading?: string;
  footerAction?: JSX.Element;
  formData?: {
    formInputs: FormGroupProps['inputs'];
    onSubmit: (data: any) => void;
    buttons: JSX.Element[];
  };
};

export type BaseViewProps = RouteComponentProps & {
  pageName: PAGE_NAMES;
};

export type RegisterProps = {
  name: string;
  email: string;
  token: string;
};

export type LoginInputs = {
  username: string;
  password: string;
};

export type SecretKeyInputs = {
  token: string;
};

export type EmployeeIdInputs = {
  identifier: string;
};

export type CredentialsInputs = {
  username: string;
  password: string;
  confirmPassword: string;
  token: string;
};

export type RecoveryInputs = {
  id: string;
  answer: string;
  token: string;
};

export type ForgotPasswordInputs = {
  identity: string;
};

export type ForgotPasswordRecoveryInputs = {
  recoveryOption: RecoveryOptions;
};

export type NewPasswordInputs = {
  password: string;
  confirmPassword: string;
  token: string;
};

export enum AuthAction {
  ADDITIONAL_VERIFICATION = '@@auth/Register/ADDITIONAL_VERIFICATION',
  AUTH_ERROR = '@@auth/AUTH_ERROR',
  CHECK_TOKEN_EXPIRY = '@@auth/CHECK_TOKEN_EXPIRY',
  CLEANUP = '@@auth/Logout/CLEANUP',
  FETCH_PROFILE = '@@auth/Login/FETCH_PROFILE',
  FETCH_PROFILE_SUCCESS = '@@auth/Login/FETCH_PROFILE_SUCCESS',
  RE_LOGIN = '@@auth/Login/RE_LOGIN',
  LOGIN = '@@auth/Login/LOGIN',
  LOGIN_SUCCESS = '@@auth/Login/LOGIN_SUCCESS',
  LOGOUT = '@@auth/Logout/LOGOUT',
  LOGOUT_SUCCESS = '@@auth/Logout/LOGOUT_SUCCESS',
  NOTIFY_ADMIN = '@@auth/Forgot/NOTIFY_ADMIN',
  REFRESH_TOKEN_SUCCESS = '@@auth/Login/REFRESH_TOKEN_SUCCESS',
  REGISTER = '@@auth/Register/REGISTER',
  RESET_ERROR = '@@auth/Login/RESET_ERROR',
  RESET_PASSWORD = '@@auth/Register/RESET_PASSWORD',
  RESET_TOKEN = '@@auth/Forgot/RESET_TOKEN',
  SET_CHALLENGE_QUESTION = '@@auth/Register/SET_CHALLENGE_QUESTION',
  SET_CHALLENGE_QUESTION_SUCCESS = '@@auth/Register/SET_CHALLENGE_QUESTION_SUCCESS',
  SET_IDENTITY_TOKEN = '@@auth/Register/SET_IDENTITY_TOKEN',
  SET_IDLE = '@@auth/MyProfile/SET_IDLE',
  UPDATE_USER_PROFILE = '@@auth/MyProfile/UPDATE_USER_PROFILE',
  VALIDATE_IDENTITY = '@@auth/Forgot/VALIDATE_IDENTITY',
  VALIDATE_QUESTION = '@@auth/Forgot/VALIDATE_QUESTION',
}

export type AuthActionType = ReturnType<
  | typeof authError
  | typeof cleanUp
  | typeof fetchProfileSuccess
  | typeof logoutSuccess
  | typeof login
  | typeof loginSuccess
  | typeof logout
  | typeof refreshTokenSuccess
  | typeof resetError
  | typeof resetPassword
  | typeof setIdentityToken
  | typeof setIdle
  | typeof switchFacilityError
  | typeof switchFacilitySuccess
  | typeof setChallengeQuestionSuccess
>;
