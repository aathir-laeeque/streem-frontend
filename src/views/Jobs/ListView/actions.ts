import { Checklist } from '#PrototypeComposer/checklist.types';
import { actionSpreader } from '#store/helpers';
import { ListViewAction, fetchJobsSuccessType, fetchJobsType } from './types';

export const fetchJobs = (params: fetchJobsType) =>
  actionSpreader(ListViewAction.FETCH_JOBS, { params });

export const fetchJobsOngoing = () => actionSpreader(ListViewAction.FETCH_JOBS_ONGOING);

export const fetchJobsSuccess = ({ data, pageable }: fetchJobsSuccessType) =>
  actionSpreader(ListViewAction.FETCH_JOBS_SUCCESS, { data, pageable });

export const fetchJobsError = (error: any) =>
  actionSpreader(ListViewAction.FETCH_JOBS_ERROR, { error });

export const createJob = (params: {
  parameterValues: Record<string, any>;
  checklistId: Checklist['id'];
  selectedUseCaseId: string;
}) => actionSpreader(ListViewAction.CREATE_JOB, params);

export const createJobSuccess = (data: any, shouldReRender = true) =>
  actionSpreader(ListViewAction.CREATE_JOB_SUCCESS, { data, shouldReRender });

export const createJobError = () => actionSpreader(ListViewAction.CREATE_JOB_ERROR);
