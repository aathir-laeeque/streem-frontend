import { RootState } from '#store/types';
import { apiCreateStage, apiDeleteStage } from '#utils/apiUrls';
import { request } from '#utils/request';
import { call, put, select, takeLeading } from 'redux-saga/effects';

import { apiUpdateStage, apiReorderStages } from '../../utils/apiUrls';
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
    const { id } = payload;

    const { data, errors } = yield call(request, 'PATCH', apiDeleteStage(id));

    if (data) {
      // make reoroder call here

      const {
        listById,
        listOrder,
      }: RootState['prototypeComposer']['stages'] = yield select(
        (state: RootState) => state.prototypeComposer.stages,
      );

      const deletedStageIndex = listOrder.indexOf(id);
      const stagesToReorder = listOrder.slice(deletedStageIndex + 1);

      if (stagesToReorder.length) {
        const reOrderMap = stagesToReorder.reduce<Record<string, number>>(
          (acc, stageId) => {
            acc[stageId] = listById[stageId].orderTree - 1;
            return acc;
          },
          {},
        );

        const { data: reorderData, errors: reorderErrors } = yield call(
          request,
          'PATCH',
          apiReorderStages(),
          { data: { stagesOrder: reOrderMap } },
        );

        console.log('reorderData from api :: ', reorderData);
        console.log('reorderErrors froom api :: ', reorderErrors);

        yield put(deleteStageSuccess({ id, newOrderMap: reOrderMap }));
      } else {
        yield put(deleteStageSuccess({ id }));
      }
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
    const { id, name, orderTree } = payload.stage;

    const { data, errors } = yield call(request, 'PATCH', apiUpdateStage(id), {
      data: { name, orderTree },
    });

    if (data) {
      yield put(updateStageNameSuccess(data));
    } else {
      yield put(updateStageNameError(errors));
    }
  } catch (error) {
    console.error('error came in updateStageNameSaga :: ', error);
  }
}

export function* StageListSaga() {
  yield takeLeading(StageListActions.ADD_NEW_STAGE, addNewStageSaga);
  yield takeLeading(StageListActions.DELETE_STAGE, deleteStageSaga);
  // yield takeLeading(StageListActions.DUPLICATE_STAGE, duplicateStageSaga);
  // yield takeLeading(StageListActions.REORDER_STAGE, reOrderStageSaga);
  yield takeLeading(StageListActions.UPDATE_STAGE_NAME, updateStageNameSaga);
}
