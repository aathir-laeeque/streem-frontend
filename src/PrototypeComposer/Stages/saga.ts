import { RootState } from '#store/types';
import { apiCreateStage, apiDeleteStage } from '#utils/apiUrls';
import { request } from '#utils/request';
import { call, put, select, takeEvery, takeLeading } from 'redux-saga/effects';

import { apiUpdateStage, apiReorderStages } from '../../utils/apiUrls';
import { Stage } from '../checklist.types';
import {
  addNewStageError,
  addNewStageSuccess,
  deleteStage,
  deleteStageError,
  deleteStageSuccess,
  reOrderStage,
  reOrderStageError,
  reOrderStageSuccess,
  updateStageName,
  updateStageNameError,
  updateStageNameSuccess,
} from './actions';
import { StageListActions } from './reducer.types';

function* addNewStageSaga() {
  try {
    const {
      stages: { listOrder, listById },
      data: { id: checklistId },
    } = yield select((state: RootState) => state.prototypeComposer);

    const newStage: Pick<Stage, 'name' | 'orderTree'> = {
      name: '',
      orderTree: listOrder.length ? listById[listOrder[listOrder.length - 1]].orderTree + 1 : 1,
    };

    const { data, errors } = yield call(request, 'POST', apiCreateStage(checklistId), {
      data: { ...newStage },
    });

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
      const { listById, listOrder }: RootState['prototypeComposer']['stages'] = yield select(
        (state: RootState) => state.prototypeComposer.stages,
      );

      const deletedStageIndex = listOrder.indexOf(id);
      const stagesToReorder = listOrder.slice(deletedStageIndex + 1);

      if (stagesToReorder.length) {
        const reOrderMap = stagesToReorder.reduce<Record<string, number>>((acc, stageId) => {
          acc[stageId] = listById[stageId].orderTree - 1;
          return acc;
        }, {});

        const { data: reorderData, errors: reorderErrors } = yield call(
          request,
          'PATCH',
          apiReorderStages(),
          { data: { stagesOrder: reOrderMap } },
        );

        if (reorderData) {
          yield put(deleteStageSuccess({ id, newOrderMap: reOrderMap }));
        } else {
          console.log('error came in reorder api :: ', reorderErrors);
          throw new Error(reorderErrors);
        }
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

function* reOrderStageSaga({ payload }: ReturnType<typeof reOrderStage>) {
  try {
    const listOrder: Stage['id'][] = yield select(
      (state: RootState) => state.prototypeComposer.stages.listOrder,
    );
    const toStageId = listOrder[payload.to];
    const { data: reorderData, errors: reorderErrors } = yield call(
      request,
      'PATCH',
      apiReorderStages(),
      {
        data: {
          stagesOrder: { [toStageId]: payload.from, [payload.id]: payload.to },
        },
      },
    );
    if (reorderData) {
      yield put(reOrderStageSuccess({ ...payload }));
    } else {
      console.error('error came in reorder api :: ', reorderErrors);
      yield put(reOrderStageError(reorderErrors));
    }
  } catch (error) {
    console.error('error came in updateStageNameSaga :: ', error);
  }
}

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
  yield takeEvery(StageListActions.DELETE_STAGE, deleteStageSaga);
  // yield takeLeading(StageListActions.DUPLICATE_STAGE, duplicateStageSaga);
  // TODO: when enabling this reorder saga, connect with BE to make sure the API works as per the need
  yield takeLeading(StageListActions.REORDER_STAGE, reOrderStageSaga);
  yield takeEvery(StageListActions.UPDATE_STAGE_NAME, updateStageNameSaga);
}
