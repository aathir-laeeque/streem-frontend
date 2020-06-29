import { ComposerActionType } from './../types';
import { takeLatest } from 'redux-saga/effects';
import { StageListAction } from './types';

function* updateStageSaga({ payload }: ComposerActionType) {
  console.log('payload frmo updateStageSaga :: ', payload);
}

export function* StageListSaga() {
  yield takeLatest(StageListAction.UPDATE_STAGE, updateStageSaga);
}
