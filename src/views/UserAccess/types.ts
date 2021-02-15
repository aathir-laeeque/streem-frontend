import { RouteComponentProps } from '@reach/router';
import { User } from '#store/users/types';
import { resendInvite } from './actions';

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
  state: string;
  users: User[];
}

export enum UserAccessAction {
  RESEND_INVITE = '@@userAccess/ListView/RESEND_INVITE',
  CANCEL_INVITE = '@@userAccess/ListView/CANCEL_INVITE',
  ARCHIVE_USER = '@@userAccess/ListView/ARCHIVE_USER',
  UNARCHIVE_USER = '@@userAccess/ListView/UNARCHIVE_USER',
  UNLOCK_USER = '@@userAccess/ListView/UNLOCK_USER',
  ADD_USER = '@@userAccess/ListView/ADD_USER',
}

export type UserAccessActionType = ReturnType<typeof resendInvite>;

export type PermissionType = {
  id: number;
  name: string;
  permissions: string[];
};

export type RoleType = {
  id: string;
  name: string;
  permissions: Record<string, boolean>;
};
