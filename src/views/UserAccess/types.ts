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
  CANCEL_INVITE = '@@userAccess/ListView/CANCEL_INVITE',
  CANCEL_INVITE_SUCCESS = '@@userAccess/ListView/CANCEL_INVITE_SUCCESS',
  CANCEL_INVITE_ERROR = '@@userAccess/ListView/CANCEL_INVITE_ERROR',
  ARCHIVE_USER = '@@userAccess/ListView/ARCHIVE_USER',
  ARCHIVE_USER_SUCCESS = '@@userAccess/ListView/ARCHIVE_USER_SUCCESS',
  ARCHIVE_USER_ERROR = '@@userAccess/ListView/ARCHIVE_USER_ERROR',
  UNARCHIVE_USER = '@@userAccess/ListView/UNARCHIVE_USER',
  UNARCHIVE_USER_SUCCESS = '@@userAccess/ListView/UNARCHIVE_USER_SUCCESS',
  UNARCHIVE_USER_ERROR = '@@userAccess/ListView/UNARCHIVE_USER_ERROR',
  UNLOCK_USER = '@@userAccess/ListView/UNLOCK_USER',
  UNLOCK_USER_SUCCESS = '@@userAccess/ListView/UNLOCK_USER_SUCCESS',
  UNLOCK_USER_ERROR = '@@userAccess/ListView/UNLOCK_USER_ERROR',
  ADD_USER = '@@userAccess/ListView/ADD_USER',
  ADD_USER_SUCCESS = '@@userAccess/ListView/ADD_USER_SUCCESS',
  ADD_USER_ERROR = '@@userAccess/ListView/ADD_USER_ERROR',
}

export type UserAccessActionType = ReturnType<
  typeof resendInvite | typeof resendInviteSuccess | typeof resendInviteError
>;
