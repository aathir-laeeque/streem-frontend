import { actionSpreader } from '#store/helpers';
import { ResponseObj } from '#utils/globalTypes';
import { JobActivityAction, JobActivity } from './types';

export const fetchJobActivities = (payload: {
  jobId: string;
  params: {
    size: number;
    filters: string;
    sort: string;
    page?: number;
  };
}) => actionSpreader(JobActivityAction.FETCH_JOB_ACTIVITY, payload);

export const fetchJobActivitiesOngoing = () =>
  actionSpreader(JobActivityAction.FETCH_JOB_ACTIVITY_ONGOING);

export const fetchJobActivitiesSuccess = ({
  data,
  pageable,
}: Partial<ResponseObj<JobActivity>>) =>
  actionSpreader(JobActivityAction.FETCH_JOB_ACTIVITY_SUCCESS, {
    data,
    pageable,
  });

export const fetchJobActivitiesError = (error: any) =>
  actionSpreader(JobActivityAction.FETCH_JOB_ACTIVITY_ERROR, { error });
