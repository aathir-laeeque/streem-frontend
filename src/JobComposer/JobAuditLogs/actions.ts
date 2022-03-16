import { actionSpreader } from '#store/helpers';
import { ResponseObj } from '#utils/globalTypes';
import { JobActivityAction, JobAuditLogType } from './types';

export const fetchJobAuditLogs = (payload: {
  jobId: string;
  params: {
    size: number;
    filters: string;
    sort: string;
    page: number;
  };
}) => actionSpreader(JobActivityAction.FETCH_JOB_ACTIVITY, payload);

export const fetchJobAuditLogsOngoing = () =>
  actionSpreader(JobActivityAction.FETCH_JOB_ACTIVITY_ONGOING);

export const fetchJobAuditLogsSuccess = ({
  data,
  pageable,
}: Partial<ResponseObj<JobAuditLogType[]>>) =>
  actionSpreader(JobActivityAction.FETCH_JOB_ACTIVITY_SUCCESS, {
    data,
    pageable,
  });

export const fetchJobAuditLogsError = (error: any) =>
  actionSpreader(JobActivityAction.FETCH_JOB_ACTIVITY_ERROR, { error });
