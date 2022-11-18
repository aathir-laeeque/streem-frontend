import { actionSpreader } from '#store/helpers';
import { ResponseObj } from '#utils/globalTypes';
import { JobParameterAction, JobAuditLogType } from './types';

export const fetchJobAuditLogs = (payload: {
  jobId: string;
  params: {
    size: number;
    filters: string;
    sort: string;
    page: number;
  };
}) => actionSpreader(JobParameterAction.FETCH_JOB_PARAMETER, payload);

export const fetchJobAuditLogsOngoing = () =>
  actionSpreader(JobParameterAction.FETCH_JOB_PARAMETER_ONGOING);

export const fetchJobAuditLogsSuccess = ({
  data,
  pageable,
}: Partial<ResponseObj<JobAuditLogType[]>>) =>
  actionSpreader(JobParameterAction.FETCH_JOB_PARAMETER_SUCCESS, {
    data,
    pageable,
  });

export const fetchJobAuditLogsError = (error: any) =>
  actionSpreader(JobParameterAction.FETCH_JOB_PARAMETER_ERROR, { error });
