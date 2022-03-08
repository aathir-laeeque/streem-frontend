import { apiGetChecklistActivity } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { getErrorMsg, handleCatch, request } from '#utils/request';
import moment from 'moment';
import { call, put, takeLeading } from 'redux-saga/effects';

import {
  fetchChecklistActivities,
  fetchChecklistActivitiesOngoing,
  fetchChecklistActivitiesSuccess,
  fetchChecklistActivitiesError,
} from './actions';
import { ChecklistActivity, ChecklistActivityAction } from './types';

function* fetchChecklistActivitiesSaga({
  payload,
}: ReturnType<typeof fetchChecklistActivities>) {
  try {
    const { checklistId, params } = payload;

    if (params.page === 0) {
      yield put(fetchChecklistActivitiesOngoing());
    }

    const { data, pageable, errors }: ResponseObj<ChecklistActivity[]> =
      yield call(request, 'GET', apiGetChecklistActivity(checklistId), {
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
      fetchChecklistActivitiesSuccess({
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
    yield put(fetchChecklistActivitiesError(error));
  }
}

export function* ChecklistActivitySaga() {
  yield takeLeading(
    ChecklistActivityAction.FETCH_CHECKLIST_ACTIVITY,
    fetchChecklistActivitiesSaga,
  );
}
