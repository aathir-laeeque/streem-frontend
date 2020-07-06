import { put, takeLatest } from 'redux-saga/effects';

import { fetchChecklistSuccess } from '../actions';
import { ComposerAction } from './../types';
import { setActiveStage, setStages, updateStage } from './actions';
import { StageById, StageListAction } from './types';

function* setStagesSaga({ payload }: ReturnType<typeof fetchChecklistSuccess>) {
  try {
    const {
      checklist: { stages },
    } = payload;

    /**
     * * Grouping stages by ID for easy state access and update
     */
    yield put(
      setStages(
        stages.reduce<StageById>((acc, el) => {
          acc[el.id] = el;
          return acc;
        }, {}),
      ),
    );

    /**
     * * Setting the first stage id as active id by default
     */
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
