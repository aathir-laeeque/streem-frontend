import { actionSpreader } from '#store/helpers';
import { ResponseObj } from '#utils/globalTypes';

import { Job } from '../types';
import { ListViewAction } from './types';

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
  checklistId: number;
}) => actionSpreader(ListViewAction.CREATE_JOB, params);

export const createJobOngoing = () =>
  actionSpreader(ListViewAction.CREATE_JOB_ONGOING);

export const createJobSuccess = ({ data }: Partial<ResponseObj<Job>>) =>
  actionSpreader(ListViewAction.CREATE_JOB_SUCCESS, { data });

export const createJobError = (error: any) =>
  actionSpreader(ListViewAction.CREATE_JOB_ERROR, { error });

export const setSelectedStatus = (status: string) =>
  actionSpreader(ListViewAction.SET_SELECTED_STATUS, { status });
