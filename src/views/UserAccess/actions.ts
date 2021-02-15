import { actionSpreader } from '#store';
import { User } from '#store/users/types';
import { UserAccessAction } from './types';

export const resendInvite = (payload: { id: User['id'] }) =>
  actionSpreader(UserAccessAction.RESEND_INVITE, payload);

export const cancelInvite = (payload: {
  id: User['id'];
  fetchData?: () => void;
}) => actionSpreader(UserAccessAction.CANCEL_INVITE, payload);

export const archiveUser = (payload: {
  id: User['id'];
  fetchData?: () => void;
}) => actionSpreader(UserAccessAction.ARCHIVE_USER, payload);

export const unArchiveUser = (payload: {
  id: User['id'];
  fetchData?: () => void;
}) => actionSpreader(UserAccessAction.UNARCHIVE_USER, payload);

export const unLockUser = (payload: {
  id: User['id'];
  fetchData?: () => void;
}) => actionSpreader(UserAccessAction.UNLOCK_USER, payload);

export const addUser = (payload: {
  firstName: string;
  lastName: string;
  employeeId: string;
  email: string;
  department: string;
  facilities: { id: string }[];
  roles: { id: string }[];
}) => actionSpreader(UserAccessAction.ADD_USER, payload);
