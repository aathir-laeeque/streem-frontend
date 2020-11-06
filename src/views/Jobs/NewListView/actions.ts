import { actionSpreader } from '#store/helpers';

import { fetchJobsArgs, fetchJobsSuccessArgs, ListViewAction } from './types';

export const fetchJobs = (params: fetchJobsArgs) =>
  actionSpreader(ListViewAction.FETCH_JOBS, { params });

export const fetchJobsOngoing = () =>
  actionSpreader(ListViewAction.FETCH_JOBS_ONGOING);

export const fetchJobsSuccess = ({ data, pageable }: fetchJobsSuccessArgs) =>
  actionSpreader(ListViewAction.FETCH_JOBS_SUCCESS, { data, pageable });

export const fetchJobsError = (error: any) =>
  actionSpreader(ListViewAction.FETCH_JOBS_ERROR, { error });
