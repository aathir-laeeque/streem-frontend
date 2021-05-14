import { RouteComponentProps } from '@reach/router';

export type UserAccessViewProps = RouteComponentProps;

export enum UserAccessAction {
  ADD_USER = '@@userAccess/ListView/ADD_USER',
  ARCHIVE_USER = '@@userAccess/ListView/ARCHIVE_USER',
  CANCEL_INVITE = '@@userAccess/ListView/CANCEL_INVITE',
  RESEND_INVITE = '@@userAccess/ListView/RESEND_INVITE',
  UNARCHIVE_USER = '@@userAccess/ListView/UNARCHIVE_USER',
  UNLOCK_USER = '@@userAccess/ListView/UNLOCK_USER',
  VALIDATE_CREDENTIALS = '@@userAccess/MyProfile/VALIDATE_CREDENTIALS',
}

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

export enum ValidateCredentialsPurpose {
  ADDITIONAL_VERIFICATION = 'ADDITIONAL_VERIFICATION',
  CHALLENGE_QUESTION_UPDATE = 'CHALLENGE_QUESTION_UPDATE',
  PASSWORD_UPDATE = 'PASSWORD_UPDATE',
  REGISTRATION = 'REGISTRATION',
  SIGN_OFF = 'SIGN_OFF',
}
