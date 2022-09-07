import { Checklist } from '#PrototypeComposer/checklist.types';
import { actionSpreader } from '#store/helpers';

import { fetchJobsType, fetchJobsSuccessType, ListViewAction } from './types';

export const fetchJobs = (params: fetchJobsType) =>
  actionSpreader(ListViewAction.FETCH_JOBS, { params });

export const fetchJobsOngoing = () => actionSpreader(ListViewAction.FETCH_JOBS_ONGOING);

export const fetchJobsSuccess = ({ data, pageable }: fetchJobsSuccessType) =>
  actionSpreader(ListViewAction.FETCH_JOBS_SUCCESS, { data, pageable });

export const fetchJobsError = (error: any) =>
  actionSpreader(ListViewAction.FETCH_JOBS_ERROR, { error });

export const createJob = (params: {
  properties: { id: string; value: string }[];
  checklistId: Checklist['id'];
  selectedUseCaseId: string;
  relations?: any;
}) => actionSpreader(ListViewAction.CREATE_JOB, params);
