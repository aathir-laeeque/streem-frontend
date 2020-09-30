import { RootState } from '#store/types';
import { apiCreateStage, apiDeleteStage } from '#utils/apiUrls';
import { request } from '#utils/request';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { apiUpdateStage } from '../../utils/apiUrls';
import { Stage } from '../checklist.types';
import {
  addNewStageError,
  addNewStageSuccess,
  deleteStage,
  deleteStageError,
  deleteStageSuccess,
  updateStageName,
  updateStageNameError,
  updateStageNameSuccess,
} from './actions';
import { StageListActions } from './reducer.types';

function* addNewStageSaga() {
  try {
    const {
      stages: { listOrder },
      data: { id: checklistId },
    } = yield select((state: RootState) => state.prototypeComposer);

    const newStage: Pick<Stage, 'name' | 'orderTree'> = {
      name: '',
      orderTree: listOrder.length + 1,
    };

    const { data, errors } = yield call(
      request,
      'POST',
      apiCreateStage(checklistId),
      { data: { ...newStage } },
    );

    if (data) {
      yield put(addNewStageSuccess(data));
    } else {
      yield put(addNewStageError(errors));
    }
  } catch (error) {
    console.error('error came in addNewStageSaga :: ', error);
  }
}

function* deleteStageSaga({ payload }: ReturnType<typeof deleteStage>) {
  try {
    const { data, errors } = yield call(
      request,
      'PATCH',
      apiDeleteStage(payload.stageId),
    );

    if (data) {
      yield put(deleteStageSuccess(payload.stageId));
    } else {
      yield put(deleteStageError(errors));
    }
  } catch (error) {
    console.error('error came in deleteStageSaga :: ', error);
  }
}

// function* duplicateStageSaga({ payload }: ReturnType<typeof duplicateStage>) {
//   try {
//     console.log('payload from duplicateStageSaga :: ', payload);
//   } catch (error) {
//     console.error('error came in duplicateStageSaga :: ', error);
//   }
// }

// function* reOrderStageSaga({ payload }: ReturnType<typeof reOrder>) {
//   try {
//     console.log('payload from reOrderStageSaga :: ', payload);
//   } catch (error) {
//     console.error('error came in reOrderStageSaga :: ', error);
//   }
// }

function* updateStageNameSaga({ payload }: ReturnType<typeof updateStageName>) {
  try {
    console.log('came to update stage name with payload :: ', payload);

    const { id, name } = payload.stage;

    const { data, errors } = yield call(request, 'PATCH', apiUpdateStage(id), {
      data: { name },
    });

    if (data) {
      console.log('success froem apiUpdateStage :: ', data);
      yield put(updateStageNameSuccess(data));
    } else {
      console.error('error came in apiUpdateStage :: ', errors);
      yield put(updateStageNameError(errors));
    }
  } catch (error) {
    console.error('error came in updateStageNameSaga :: ', error);
  }
}

export function* StageListSaga() {
  yield takeLatest(StageListActions.ADD_NEW_STAGE, addNewStageSaga);
  yield takeLatest(StageListActions.DELETE_STAGE, deleteStageSaga);
  // yield takeLatest(StageListActions.DUPLICATE_STAGE, duplicateStageSaga);
  // yield takeLatest(StageListActions.REORDER_STAGE, reOrderStageSaga);
  yield takeLatest(StageListActions.UPDATE_STAGE_NAME, updateStageNameSaga);
}
