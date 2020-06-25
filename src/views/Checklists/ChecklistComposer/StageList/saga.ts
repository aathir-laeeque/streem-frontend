import { takeLatest } from 'redux-saga/effects';

import { StageListActions, StageListActionType } from './types';

function* updateStage(action: StageListActionType) {
  console.log('action from updateStage saga :: ', action);
}

export function* StageListSaga() {
  yield takeLatest(StageListActions.UPDATE_STAGE_NAME, updateStage);
}
