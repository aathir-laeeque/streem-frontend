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
          // TODO: ask backend to remove the name from task
          name: 'new task',
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

export function* TaskListSaga() {
  yield takeLatest(TaskListActions.ADD_NEW_TASK, addNewTaskSaga);
  yield takeLatest(TaskListActions.DELETE_TASK, deleteTaskSaga);
}
