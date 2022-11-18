import { apiGetJobAuditLogs } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { getErrorMsg, handleCatch, request } from '#utils/request';
import moment from 'moment';
import { call, put, takeLeading } from 'redux-saga/effects';

import {
  fetchJobAuditLogs,
  fetchJobAuditLogsError,
  fetchJobAuditLogsOngoing,
  fetchJobAuditLogsSuccess,
} from './actions';
import { JobAuditLogType, JobParameterAction } from './types';

function* fetchJobAuditLogsSaga({ payload }: ReturnType<typeof fetchJobAuditLogs>) {
  try {
    const { jobId, params } = payload;

    if (params.page === 0) {
      yield put(fetchJobAuditLogsOngoing());
    }

    const { data, pageable, errors }: ResponseObj<JobAuditLogType[]> = yield call(
      request,
      'GET',
      apiGetJobAuditLogs(jobId),
      { params },
    );

    if (errors) {
      throw getErrorMsg(errors);
    }

    const newData = data.map((el) => ({
      ...el,
      triggeredOn: moment.unix(el.triggeredAt).format('YYYY-MM-DD'),
    }));

    yield put(
      fetchJobAuditLogsSuccess({
        data: newData,
        pageable,
      }),
    );
  } catch (e) {
    const error = yield* handleCatch('JobParameter', 'fetchJobAuditLogsSaga', e);
    yield put(fetchJobAuditLogsError(error));
  }
}

export function* JobAuditLogsSaga() {
  yield takeLeading(JobParameterAction.FETCH_JOB_PARAMETER, fetchJobAuditLogsSaga);
}
