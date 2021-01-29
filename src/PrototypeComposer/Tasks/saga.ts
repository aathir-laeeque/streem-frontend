import { closeOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { RootState } from '#store';
import {
  apiAddMediaToTask,
  apiAddStop,
  apiCreateTask,
  apiDeleteTask,
  apiRemoveStop,
  apiRemoveTaskTimer,
  apiSetTaskTimer,
  apiUpdateTask,
} from '#utils/apiUrls';
import { request } from '#utils/request';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
  addNewTask,
  addNewTaskSuccess,
  addStop,
  addTaskMedia,
  deleteTask,
  deleteTaskSuccess,
  removeTaskTimer,
  setTaskError,
  setTaskTimer,
  updateTask,
  updateTaskName,
} from './actions';
import { TaskListActions } from './reducer.types';
import { removeTaskMedia } from './actions';
import { apiRemoveTaskMedia, apiReorderTasks } from '../../utils/apiUrls';

function* addNewTaskSaga({ payload }: ReturnType<typeof addNewTask>) {
  try {
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
      yield put(setTaskError(errors));
    }
  } catch (error) {
    console.error('error came in addNewTaskSaga :: ', error);
  }
}

function* deleteTaskSaga({ payload }: ReturnType<typeof deleteTask>) {
  try {
    const activeStageId = yield select(
      (state: RootState) => state.prototypeComposer.stages.activeStageId,
    );

    const { data, errors } = yield call(
      request,
      'PATCH',
      apiDeleteTask(payload.taskId),
    );

    if (data) {
      const {
        listById,
        tasksOrderInStage,
      }: RootState['prototypeComposer']['tasks'] = yield select(
        (state: RootState) => state.prototypeComposer.tasks,
      );

      const deletedTaskIndex = tasksOrderInStage[activeStageId].indexOf(
        payload.taskId,
      );
      const tasksToReorder = tasksOrderInStage[activeStageId].slice(
        deletedTaskIndex + 1,
      );

      if (tasksToReorder.length) {
        const reOrderMap = tasksToReorder.reduce<Record<string, number>>(
          (acc, taskId) => {
            acc[taskId] = listById[taskId].orderTree - 1;
            return acc;
          },
          {},
        );

        const { data: reorderData, errors: reorderErrors } = yield call(
          request,
          'PATCH',
          apiReorderTasks(),
          { data: { tasksOrder: reOrderMap } },
        );

        if (reorderData) {
          yield put(
            deleteTaskSuccess(payload.taskId, activeStageId, reOrderMap),
          );
        } else {
          console.log('error came in reorder api  :: ', reorderErrors);
          throw new Error(reorderErrors);
        }
      } else {
        yield put(deleteTaskSuccess(payload.taskId, activeStageId));
      }
    } else {
      yield put(setTaskError(errors));
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
      yield put(setTaskError(errors));
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
      yield put(setTaskError(errors));
    }
  } catch (error) {
    console.error('error came add stop saga :: ', error);
  }
}

function* updateTaskSaga({ payload }: ReturnType<typeof updateTaskName>) {
  try {
    const { task } = payload;

    const { data, errors } = yield call(
      request,
      'PATCH',
      apiUpdateTask(task.id),
      { data: { ...task } },
    );

    if (data) {
      yield put(updateTask(data));
    } else {
      yield put(setTaskError(errors));
    }
  } catch (error) {
    console.error('error came in updateTaskSaga :: ', error);
  }
}

function* setTaskTimerSaga({ payload }: ReturnType<typeof setTaskTimer>) {
  try {
    const { maxPeriod, minPeriod, taskId, timerOperator } = payload;

    const { data, errors } = yield call(
      request,
      'PATCH',
      apiSetTaskTimer(taskId),
      { data: { maxPeriod, minPeriod, timerOperator } },
    );

    if (data) {
      yield put(updateTask(data));
    } else {
      yield put(setTaskError(errors));
    }
  } catch (error) {
    console.error('Error came in setTaskTimerSaga :: ', error);
  }
}

function* removeTaskTimerSaga({ payload }: ReturnType<typeof removeTaskTimer>) {
  try {
    const { taskId } = payload;

    const { data, errors } = yield call(
      request,
      'PATCH',
      apiRemoveTaskTimer(taskId),
    );

    if (data) {
      yield put(closeOverlayAction(OverlayNames.TIMED_TASK_CONFIG));
      yield put(updateTask(data));
    } else {
      yield put(setTaskError(errors));
    }
  } catch (error) {
    console.error('error came in removeTaskTimerSaga :: ', error);
  }
}

function* addTaskMediaSaga({ payload }: ReturnType<typeof addTaskMedia>) {
  try {
    const { mediaDetails, taskId } = payload;

    const { data, errors } = yield call(
      request,
      'POST',
      apiAddMediaToTask(taskId),
      { data: { ...mediaDetails } },
    );

    if (data) {
      yield put(updateTask(data));
      yield put(closeOverlayAction(OverlayNames.TASK_MEDIA));
    } else {
      console.error('error from add media to task api :: ', errors);
    }
  } catch (error) {
    console.error('error came in addTaskMediaSaga :: ', error);
  }
}

function* removeTaskMediaSaga({ payload }: ReturnType<typeof removeTaskMedia>) {
  try {
    const { taskId, mediaId } = payload;

    const { data, errors } = yield call(
      request,
      'DELETE',
      apiRemoveTaskMedia({ taskId, mediaId }),
    );

    if (data) {
      yield put(updateTask(data));
      yield put(closeOverlayAction(OverlayNames.TASK_MEDIA));
    } else {
      console.error('error from remove media to task api :: ', errors);
    }
  } catch (error) {
    console.error('error came in removeTaskMediaSaga :: ', error);
  }
}

export function* TaskListSaga() {
  yield takeLatest(TaskListActions.ADD_NEW_TASK, addNewTaskSaga);
  yield takeLatest(TaskListActions.DELETE_TASK, deleteTaskSaga);
  yield takeLatest(TaskListActions.ADD_STOP, addStopSaga);
  yield takeLatest(TaskListActions.REMOVE_STOP, removeStopSaga);
  yield takeLatest(TaskListActions.UPDATE_TASK_NAME, updateTaskSaga);
  yield takeLatest(TaskListActions.SET_TASK_TIMER, setTaskTimerSaga);
  yield takeLatest(TaskListActions.REMOVE_TASK_TIMER, removeTaskTimerSaga);
  yield takeLatest(TaskListActions.ADD_TASK_MEDIA, addTaskMediaSaga);
  yield takeLatest(TaskListActions.REMOVE_TASK_MEDIA, removeTaskMediaSaga);
}
