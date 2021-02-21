import { RouteComponentProps } from '@reach/router';
import { resendInvite } from './actions';

export type UserAccessViewProps = RouteComponentProps;

export enum UserAccessAction {
  ADD_USER = '@@userAccess/ListView/ADD_USER',
  ARCHIVE_USER = '@@userAccess/ListView/ARCHIVE_USER',
  CANCEL_INVITE = '@@userAccess/ListView/CANCEL_INVITE',
  RESEND_INVITE = '@@userAccess/ListView/RESEND_INVITE',
  UNARCHIVE_USER = '@@userAccess/ListView/UNARCHIVE_USER',
  UNLOCK_USER = '@@userAccess/ListView/UNLOCK_USER',
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
