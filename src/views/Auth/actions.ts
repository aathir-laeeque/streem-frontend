import { NotificationType } from '#components/Notification/types';
import { actionSpreader } from '#store';
import { User } from '#store/users/types';
import { ChallengeQuestionPurpose, CredentialsInputs } from '#views/Auth/types';
import { EditUserRequestInputs } from '#views/UserAccess/ManageUser/types';

import {
  AdditionalVerificationTypes,
  AuthAction,
  LoginResponse,
  RefreshTokenResponse,
  TokenTypes,
} from './types';

export const login = (payload: { username: string; password: string }) =>
  actionSpreader(AuthAction.LOGIN, payload);

export const loginSuccess = (data: LoginResponse) =>
  actionSpreader(AuthAction.LOGIN_SUCCESS, data);

export const authError = (error: string) =>
  actionSpreader(AuthAction.AUTH_ERROR, error);

export const setIdle = (data: boolean) =>
  actionSpreader(AuthAction.SET_IDLE, data);

export const logout = () => actionSpreader(AuthAction.LOGOUT);

export const logoutSuccess = (payload?: {
  type?: NotificationType;
  msg?: string;
  delayTime?: number;
}) => actionSpreader(AuthAction.LOGOUT_SUCCESS, payload);

export const cleanUp = () => actionSpreader(AuthAction.CLEANUP);

export const register = (payload: CredentialsInputs) =>
  actionSpreader(AuthAction.REGISTER, payload);

export const fetchProfile = (payload: { id: User['id'] }) =>
  actionSpreader(AuthAction.FETCH_PROFILE, payload);

export const fetchProfileSuccess = (data: User) =>
  actionSpreader(AuthAction.FETCH_PROFILE_SUCCESS, data);

export const updateUserProfile = (payload: {
  body: Omit<EditUserRequestInputs, 'roles'> & {
    roles: { id: string }[];
  };
  id: User['id'];
}) => actionSpreader(AuthAction.UPDATE_USER_PROFILE, payload);

export const refreshTokenSuccess = (data: RefreshTokenResponse) =>
  actionSpreader(AuthAction.REFRESH_TOKEN_SUCCESS, data);

export const checkTokenExpiry = (payload: {
  type: TokenTypes;
  token: string;
}) => actionSpreader(AuthAction.CHECK_TOKEN_EXPIRY, payload);

export const resetPassword = (payload: {
  password: string;
  confirmPassword: string;
  token: string;
}) => actionSpreader(AuthAction.RESET_PASSWORD, payload);

export const resetError = () => actionSpreader(AuthAction.RESET_ERROR);

export const setIdentityToken = (payload: {
  token?: string;
  fullName?: string;
  employeeId?: string;
}) => actionSpreader(AuthAction.SET_IDENTITY_TOKEN, payload);

export const additionalVerification = (payload: {
  identifier: string;
  token: string;
  type: AdditionalVerificationTypes;
}) => actionSpreader(AuthAction.ADDITIONAL_VERIFICATION, payload);

export const setChallengeQuestion = (payload: {
  id: string;
  answer: string;
  token: string;
}) => actionSpreader(AuthAction.SET_CHALLENGE_QUESTION, payload);

export const validateIdentity = (payload: { identity: string }) =>
  actionSpreader(AuthAction.VALIDATE_IDENTITY, payload);

export const resetToken = (payload: { token: string }) =>
  actionSpreader(AuthAction.RESET_TOKEN, payload);

export const notifyAdmin = (payload: {
  token: string;
  purpose: ChallengeQuestionPurpose;
}) => actionSpreader(AuthAction.NOTIFY_ADMIN, payload);

export const validateQuestion = (payload: {
  id: string;
  answer: string;
  token: string;
}) => actionSpreader(AuthAction.VALIDATE_QUESTION, payload);
