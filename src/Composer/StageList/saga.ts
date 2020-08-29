import { takeLatest } from 'redux-saga/effects';

import { StageListAction } from './types';
import { addNewStage } from './actions';

function* addNewStageSaga({ payload }: ReturnType<typeof addNewStage>) {
  console.log('make api call to create a new stage in BE');
  console.log('payload for the api :: ', payload);
}

export function* StageListSaga() {
  yield takeLatest(StageListAction.ADD_NEW_STAGE, addNewStageSaga);
}
