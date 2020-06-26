import { apiGetTasks } from '#utils/apiUrls';
import { request } from '#utils/request';

import { put, takeLatest, call } from 'redux-saga/effects';

import { showNotification } from '../../../components/Notification/actions';
import { NotificationType } from '../../../components/Notification/types';
import {
  fetchTasksError,
  fetchTasksOngoing,
  fetchTasksSuccess,
  createTaskError,
  createTaskOngoing,
  createTaskSuccess,
} from './actions';
import { ListViewAction } from './types';

function* fetchTasks(action: any) {
  try {
    yield put(fetchTasksOngoing());

    const params = action.payload.params;
    const type = action.payload.type;
    const response = yield call(request, 'GET', apiGetTasks(), { params });
    yield put(fetchTasksSuccess(response, type));
  } catch (error) {
    console.error(
      'error from fetchTask function in TaskListView Saga :: ',
      error,
    );
    yield put(fetchTasksError(error));
  }
}

function* createTask(action: any) {
  try {
    yield put(createTaskOngoing());

    const params = action.payload;
    console.log('params', { params });
    const response = yield call(request, 'POST', apiGetTasks(), {
      data: params,
    });
    console.log('response', response);
    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'Task created successfully',
      }),
    );
    yield put(createTaskSuccess(response.data));
  } catch (error) {
    console.error(
      'error from createTask function in TaskListView Saga :: ',
      error,
    );
    yield put(
      showNotification({
        type: NotificationType.ERROR,
        msg: 'Something Went Wrong',
      }),
    );
    yield put(createTaskError(error));
  }
}

export function* TaskListViewSaga() {
  yield takeLatest(ListViewAction.FETCH_TASKS, fetchTasks);
  yield takeLatest(ListViewAction.CREATE_TASK, createTask);
}
