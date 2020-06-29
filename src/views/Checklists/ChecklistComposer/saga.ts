import { apiGetChecklist } from '#utils/apiUrls';
import { request } from '#utils/request';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';

import { fetchChecklistOngoing, fetchChecklistSuccess } from './actions';
import { StageListSaga } from './StageList/saga';
import { InteractionSaga } from './StepsList/StepView/InteractionsList/saga';
import { ComposerAction, ComposerActionType } from './types';

function* fetchChecklistSaga({ payload }: ComposerActionType) {
  try {
    console.log(
      'came to composer saga fetchChecklist with payload :: ',
      payload,
    );

    yield put(fetchChecklistOngoing());

    const { data: checklist } = yield call(
      request,
      'GET',
      apiGetChecklist(payload?.checklistId),
    );

    yield put(fetchChecklistSuccess(checklist));
  } catch (error) {
    console.error('error from fetchChecklist saga :: ', error);
  }
}

export function* ComposerSaga() {
  yield takeLatest(ComposerAction.FETCH_CHECKLIST, fetchChecklistSaga);

  yield all([
    fork(StageListSaga),
    // TODO: fork steps list saga
    fork(InteractionSaga),
  ]);
}
