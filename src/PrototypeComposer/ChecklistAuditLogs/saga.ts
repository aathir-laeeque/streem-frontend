import { apiGetChecklistAuditLogs } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { getErrorMsg, handleCatch, request } from '#utils/request';
import moment from 'moment';
import { call, put, takeLeading } from 'redux-saga/effects';

import {
  fetchChecklistAuditLogs,
  fetchChecklistAuditLogsOngoing,
  fetchChecklistAuditLogsSuccess,
  fetchChecklistAuditLogsError,
} from './actions';
import { ChecklistAuditLogsType, ChecklistAuditLogActions } from './types';

function* fetchChecklistAuditLogsSaga({
  payload,
}: ReturnType<typeof fetchChecklistAuditLogs>) {
  try {
    const { checklistId, params } = payload;

    if (params.page === 0) {
      yield put(fetchChecklistAuditLogsOngoing());
    }

    const { data, pageable, errors }: ResponseObj<ChecklistAuditLogsType[]> =
      yield call(request, 'GET', apiGetChecklistAuditLogs(checklistId), {
        params,
      });

    if (errors) {
      throw getErrorMsg(errors);
    }

    const newData = data.map((el) => ({
      ...el,
      triggeredOn: moment.unix(el.triggeredAt).format('YYYY-MM-DD'),
    }));

    yield put(
      fetchChecklistAuditLogsSuccess({
        data: newData,
        pageable,
      }),
    );
  } catch (e) {
    const error = yield* handleCatch(
      'ChecklistActivity',
      'fetchChecklistActivitiesSaga',
      e,
    );
    yield put(fetchChecklistAuditLogsError(error));
  }
}

export function* ChecklistAuditLogsSaga() {
  yield takeLeading(
    ChecklistAuditLogActions.FETCH_CHECKLIST_AUDIT_LOGS,
    fetchChecklistAuditLogsSaga,
  );
}
