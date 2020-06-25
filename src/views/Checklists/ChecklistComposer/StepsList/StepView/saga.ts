import { StepViewActions, StepViewActionType } from './types';
import { takeLatest } from 'redux-saga/effects';

function* updateStep(action: StepViewActionType) {
  console.log('action from stepViewSaga :: ', action);
}

export function* StepViewSaga() {
  yield takeLatest(StepViewActions.UPDATE_STEP, updateStep);
}
