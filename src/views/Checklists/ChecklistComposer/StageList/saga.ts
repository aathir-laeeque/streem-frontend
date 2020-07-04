import { put, takeLatest } from 'redux-saga/effects';

import { fetchChecklistSuccess } from '../actions';
import { ComposerAction } from './../types';
import { setActiveStage, setStages, updateStage } from './actions';
import { StageListAction } from './types';

function* setStagesSaga({ payload }: ReturnType<typeof fetchChecklistSuccess>) {
  try {
    const {
      checklist: { stages },
    } = payload;

    yield put(setStages(stages));
    yield put(setActiveStage(stages[0].id));
  } catch (error) {
    console.error('error from setStage saga => StageListSaga :: ', error);
  }
}

function* updateStageSaga({ payload }: ReturnType<typeof updateStage>) {
  // TODO make api call on stage update action
  console.log(
    `payload from updateStageSaga ${StageListAction.UPDATE_STAGE}:: `,
    payload,
  );
}

export function* StageListSaga() {
  yield takeLatest(ComposerAction.FETCH_CHECKLIST_SUCCESS, setStagesSaga);

  yield takeLatest(StageListAction.UPDATE_STAGE, updateStageSaga);
}
