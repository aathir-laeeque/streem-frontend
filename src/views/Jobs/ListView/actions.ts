import { actionSpreader } from '#store/helpers';
import { ResponseObj } from '#utils/globalTypes';
import { User } from '#store/users/types';

import { Job } from '#views/Jobs/types';
import { ListViewAction } from './types';
import { Checklist } from '#PrototypeComposer/checklist.types';

export const fetchJobs = (
  params: Record<string, string | number>,
  type: string,
) => actionSpreader(ListViewAction.FETCH_JOBS, { params, type });

export const fetchJobsOngoing = () =>
  actionSpreader(ListViewAction.FETCH_JOBS_ONGOING);

export const fetchJobsSuccess = (
  { data, pageable }: Partial<ResponseObj<Job>>,
  type: string,
) =>
  actionSpreader(ListViewAction.FETCH_JOBS_SUCCESS, { data, pageable, type });

export const fetchJobsError = (error: any) =>
  actionSpreader(ListViewAction.FETCH_JOBS_ERROR, { error });

export const createJob = (params: {
  properties: { id: number; value: string }[];
  checklistId: Checklist['id'];
}) => actionSpreader(ListViewAction.CREATE_JOB, params);

export const createJobOngoing = () =>
  actionSpreader(ListViewAction.CREATE_JOB_ONGOING);

export const createJobSuccess = ({ data }: Partial<ResponseObj<Job>>) =>
  actionSpreader(ListViewAction.CREATE_JOB_SUCCESS, { data });

export const createJobError = (error: any) =>
  actionSpreader(ListViewAction.CREATE_JOB_ERROR, { error });

export const setSelectedState = (state: string) =>
  actionSpreader(ListViewAction.SET_SELECTED_STATE, { state });

export const assignUser = (params: {
  selectedJobIndex: number;
  user: User;
}) => {
  return actionSpreader(ListViewAction.ASSIGN_USER, params);
};

export const assignUserError = (error: any) =>
  actionSpreader(ListViewAction.ASSIGN_USER_ERROR, { error });

export const unAssignUser = (params: {
  selectedJobIndex: number;
  user: User;
}) => {
  return actionSpreader(ListViewAction.UNASSIGN_USER, params);
};

export const unAssignUserError = (error: any) =>
  actionSpreader(ListViewAction.UNASSIGN_USER_ERROR, { error });
