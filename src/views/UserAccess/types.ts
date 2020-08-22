import { RouteComponentProps } from '@reach/router';
import { User } from '#store/users/types';
import {
  resendInvite,
  resendInviteSuccess,
  resendInviteError,
} from './actions';

export type UserAccessViewProps = RouteComponentProps;

export interface Properties {
  [key: string]: string | undefined;
}

export interface Job {
  id: number;
  name?: string;
  code: string;
  properties?: Properties;
  checklist: {
    id: number;
    name: string;
  };
  status: string;
  users: User[];
}

export enum UserAccessAction {
  RESEND_INVITE = '@@userAccess/ListView/RESEND_INVITE',
  RESEND_INVITE_SUCCESS = '@@userAccess/ListView/RESEND_INVITE_SUCCESS',
  RESEND_INVITE_ERROR = '@@userAccess/ListView/RESEND_INVITE_ERROR',
  ADD_USER = '@@userAccess/ListView/ADD_USER',
  ADD_USER_SUCCESS = '@@userAccess/ListView/ADD_USER_SUCCESS',
  ADD_USER_ERROR = '@@userAccess/ListView/ADD_USER_ERROR',
}

export type UserAccessActionType = ReturnType<
  typeof resendInvite | typeof resendInviteSuccess | typeof resendInviteError
>;
