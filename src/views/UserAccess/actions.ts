import { actionSpreader } from '#store';
import { User } from '#store/users/types';
import { UserAccessAction } from './types';

export const resendInvite = (payload: { id: User['id'] }) =>
  actionSpreader(UserAccessAction.RESEND_INVITE, payload);

export const resendInviteSuccess = () =>
  actionSpreader(UserAccessAction.RESEND_INVITE_SUCCESS);

export const resendInviteError = (error: any) =>
  actionSpreader(UserAccessAction.RESEND_INVITE_ERROR, error);

export const cancelInvite = (payload: {
  id: User['id'];
  fetchData: () => void;
}) => actionSpreader(UserAccessAction.CANCEL_INVITE, payload);

export const cancelInviteSuccess = () =>
  actionSpreader(UserAccessAction.CANCEL_INVITE_SUCCESS);

export const cancelInviteError = (error: any) =>
  actionSpreader(UserAccessAction.CANCEL_INVITE_ERROR, error);

export const archiveUser = (payload: {
  id: User['id'];
  fetchData: () => void;
}) => actionSpreader(UserAccessAction.ARCHIVE_USER, payload);

export const archiveUserSuccess = () =>
  actionSpreader(UserAccessAction.ARCHIVE_USER_SUCCESS);

export const archiveUserError = (error: any) =>
  actionSpreader(UserAccessAction.ARCHIVE_USER_ERROR, error);

export const unArchiveUser = (payload: {
  id: User['id'];
  fetchData: () => void;
}) => actionSpreader(UserAccessAction.UNARCHIVE_USER, payload);

export const unArchiveUserSuccess = () =>
  actionSpreader(UserAccessAction.UNARCHIVE_USER_SUCCESS);

export const unArchiveUserError = (error: any) =>
  actionSpreader(UserAccessAction.UNARCHIVE_USER_ERROR, error);

export const unLockUser = (payload: {
  id: User['id'];
  fetchData: () => void;
}) => actionSpreader(UserAccessAction.UNLOCK_USER, payload);

export const unLockUserSuccess = () =>
  actionSpreader(UserAccessAction.UNLOCK_USER_SUCCESS);

export const unLockUserError = (error: any) =>
  actionSpreader(UserAccessAction.UNLOCK_USER_ERROR, error);

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
