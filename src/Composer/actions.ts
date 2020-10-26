import { actionSpreader } from '#store';
import { User } from '#store/users/types';

import { Job } from '../views/Jobs/types';
import { ComposerAction } from './composer.reducer.types';
import { Entity, FetchDataArgs } from './composer.types';
import { ExceptionValues } from './modals/CompleteJobWithException';

export const fetchData = ({ id, entity }: FetchDataArgs) =>
  actionSpreader(ComposerAction.FETCH_COMPOSER_DATA, { id, entity });

export const fetchDataError = (error: any) =>
  actionSpreader(ComposerAction.FETCH_COMPOSER_DATA_ERROR, { error });

export const fetchDataOngoing = () =>
  actionSpreader(ComposerAction.FETCH_COMPOSER_DATA_ONGOING);

// TODO: look into this any data type
export const fetchDataSuccess = (data: any, entity: Entity) =>
  actionSpreader(ComposerAction.FETCH_COMPOSER_DATA_SUCCESS, { data, entity });

// JOB ASSIGNMENT

export const fetchAssignedUsersForJob = (jobId: string) =>
  actionSpreader(ComposerAction.FETCH_ASSIGNED_USERS_FOR_JOB, { jobId });

export const fetchAssignedUsersForJobError = (error: any) =>
  actionSpreader(ComposerAction.FETCH_ASSIGNED_USERS_FOR_JOB_ERROR, { error });

export const fetchAssignedUsersForJobSuccess = (data: User[]) =>
  actionSpreader(ComposerAction.FETCH_ASSIGNED_USERS_FOR_JOB_SUCCESS, { data });

export const assignUserToJob = (user: User, completeltAssigned: boolean) =>
  actionSpreader(ComposerAction.ASSIGN_USER_TO_JOB, {
    user,
    completeltAssigned,
  });

export const unAssignUserFromJob = (user: User) =>
  actionSpreader(ComposerAction.UNASSIGN_USER_FROM_JOB, { user });

export const revertUsersForJob = (users: User[]) =>
  actionSpreader(ComposerAction.REVERT_USERS_FOR_JOB, { users });

export const assignUsersToJob = (payload: {
  jobId: Job['id'];
  assignIds: User['id'][];
  unassignIds: User['id'][];
  notify: boolean;
}) => actionSpreader(ComposerAction.ASSIGN_USERS_TO_JOB, payload);

export const assignUsersToJobSuccess = (payload: {
  unassignIds: User['id'][];
}) => actionSpreader(ComposerAction.ASSIGN_USERS_TO_JOB_SUCCESS, payload);

export const assignUsersToJobError = (error: any) =>
  actionSpreader(ComposerAction.ASSIGN_USERS_TO_JOB_ERROR, { error });

// END JOB ASSIGNMENT

export const resetComposer = () =>
  actionSpreader(ComposerAction.RESET_COMPOSER);

export const startJob = (jobId: Job['id']) =>
  actionSpreader(ComposerAction.START_JOB, { jobId });

export const startJobSuccess = () =>
  actionSpreader(ComposerAction.START_JOB_SUCCESS);

type CompleteJobArgs = {
  jobId: Job['id'];
  withException?: boolean;
  values?: ExceptionValues;
  details?: {
    code: Job['code'];
    name: Job['checklist']['name'];
  };
};

export const completeJob = ({
  jobId,
  withException = false,
  values,
  details,
}: CompleteJobArgs) =>
  actionSpreader(ComposerAction.COMPLETE_JOB, {
    jobId,
    withException,
    values,
    details,
  });

export const completeJobSuccess = (withException = false) =>
  actionSpreader(
    withException
      ? ComposerAction.COMPLETE_JOB_WITH_EXCEPTION_SUCCESS
      : ComposerAction.COMPLETE_JOB_SUCCESS,
  );

type GetSignOffStatusArgs = {
  jobId: Job['id'];
  allowSignOff?: boolean;
};

export const getSignOffStatus = ({
  jobId,
  allowSignOff = false,
}: GetSignOffStatusArgs) =>
  actionSpreader(ComposerAction.GET_SIGN_OFF_STATUS, { jobId, allowSignOff });

type signOffTasksArgs = {
  jobId: Job['id'];
  password: string;
};

export const signOffTasks = ({ jobId, password }: signOffTasksArgs) =>
  actionSpreader(ComposerAction.SIGN_OFF_TASKS, { jobId, password });
