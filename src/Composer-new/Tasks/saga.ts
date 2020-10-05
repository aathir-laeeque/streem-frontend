import { RootState } from '#store';
import { apiCreateTask, apiDeleteTask } from '#utils/apiUrls';
import { request } from '#utils/request';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
  addNewTask,
  addNewTaskError,
  addNewTaskSuccess,
  deleteTask,
  deleteTaskError,
  deleteTaskSuccess,
} from './actions';
import { TaskListActions } from './reducer.types';
import { addStop, updateTask } from './actions';
import { apiAddStop, apiRemoveStop } from '../../utils/apiUrls';

function* addNewTaskSaga({ payload }: ReturnType<typeof addNewTask>) {
  try {
    console.log('came to add new task saga with payload :: ', payload);
    const { checklistId, stageId } = payload;

    const taskOrderInStage = yield select(
      (state: RootState) => state.prototypeComposer.tasks.tasksOrderInStage,
    );

    const activeStagsTasksOrder = taskOrderInStage[stageId];

    const { data, errors } = yield call(
      request,
      'POST',
      apiCreateTask({ checklistId, stageId }),
      {
        data: {
          name: '',
          orderTree: activeStagsTasksOrder.length + 1,
        },
      },
    );

    if (data) {
      yield put(addNewTaskSuccess(data, stageId));
    } else {
      yield put(addNewTaskError(errors));
    }
  } catch (error) {
    console.error('error came in addNewTaskSaga :: ', error);
  }
}

function* deleteTaskSaga({ payload }: ReturnType<typeof deleteTask>) {
  try {
    console.log('came to deleteTaskSaga with payload :: ', payload);

    const activeStageId = yield select(
      (state: RootState) => state.prototypeComposer.stages.activeStageId,
    );

    const { data, errors } = yield call(
      request,
      'PATCH',
      apiDeleteTask(payload.taskId),
    );

    if (data) {
      yield put(deleteTaskSuccess(payload.taskId, activeStageId));
    } else {
      yield put(deleteTaskError(errors));
    }
  } catch (error) {
    console.error('error came in deleteTaskSaga :: ', error);
  }
}

function* addStopSaga({ payload }: ReturnType<typeof addStop>) {
  try {
    const { taskId } = payload;

    const { data, errors } = yield call(request, 'PATCH', apiAddStop(taskId));
    if (data) {
      yield put(updateTask(data));
    } else {
    }
  } catch (error) {
    console.error('error came add stop saga :: ', error);
  }
}

function* removeStopSaga({ payload }: ReturnType<typeof addStop>) {
  try {
    const { taskId } = payload;

    const { data, errors } = yield call(
      request,
      'PATCH',
      apiRemoveStop(taskId),
    );
    if (data) {
      yield put(updateTask(data));
    } else {
    }
  } catch (error) {
    console.error('error came add stop saga :: ', error);
  }
}

export function* TaskListSaga() {
  yield takeLatest(TaskListActions.ADD_NEW_TASK, addNewTaskSaga);
  yield takeLatest(TaskListActions.DELETE_TASK, deleteTaskSaga);
  yield takeLatest(TaskListActions.ADD_STOP, addStopSaga);
  yield takeLatest(TaskListActions.REMOVE_STOP, removeStopSaga);
}
