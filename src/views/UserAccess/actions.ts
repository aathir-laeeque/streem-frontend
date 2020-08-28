import { actionSpreader } from '#store';
import { UserAccessAction } from './types';

export const resendInvite = (payload: { id: string | number }) =>
  actionSpreader(UserAccessAction.RESEND_INVITE, payload);

export const resendInviteSuccess = () =>
  actionSpreader(UserAccessAction.RESEND_INVITE_SUCCESS);

export const resendInviteError = (error: any) =>
  actionSpreader(UserAccessAction.RESEND_INVITE_ERROR, error);

export const archiveUser = (payload: {
  id: string | number;
  fetchData: () => void;
}) => actionSpreader(UserAccessAction.ARCHIVE_USER, payload);

export const archiveUserSuccess = () =>
  actionSpreader(UserAccessAction.ARCHIVE_USER_SUCCESS);

export const archiveUserError = (error: any) =>
  actionSpreader(UserAccessAction.ARCHIVE_USER_ERROR, error);

export const unArchiveUser = (payload: {
  id: string | number;
  fetchData: () => void;
}) => actionSpreader(UserAccessAction.UNARCHIVE_USER, payload);

export const unArchiveUserSuccess = () =>
  actionSpreader(UserAccessAction.UNARCHIVE_USER_SUCCESS);

export const unArchiveUserError = (error: any) =>
  actionSpreader(UserAccessAction.UNARCHIVE_USER_ERROR, error);

export const addUser = (payload: {
  firstName: string;
  lastName: string;
  employeeId: string;
  email: string;
  department: string;
  facilities: { id: number }[];
  roles: { id: number }[];
}) => actionSpreader(UserAccessAction.ADD_USER, payload);

export const addUserSuccess = () =>
  actionSpreader(UserAccessAction.ADD_USER_SUCCESS);

export const addUserError = (error: any) =>
  actionSpreader(UserAccessAction.ADD_USER_ERROR, error);
