import { put, takeLatest, delay } from 'redux-saga/effects';
// import { apiGetTasks } from '../../../utils/apiUrls';
// import { request } from './../../../utils/request';
import { tasks } from '../mockData';
import {
  fetchTasksError,
  fetchTasksOngoing,
  fetchTasksSuccess,
} from './action';
import { ListViewAction, ListViewActionType } from './types';

function* fetchTasks(action: ListViewActionType) {
  try {
    yield put(fetchTasksOngoing());

    const params = action.payload;
    console.log('params', params);
    // const response = yield call(request, 'GET', apiGetTasks(), { params });
    yield delay(500);
    const response = tasks;

    yield put(fetchTasksSuccess(response));
  } catch (error) {
    console.error(
      'error from fetchTask function in TaskListView Saga :: ',
      error,
    );
    yield put(fetchTasksError(error));
  }
}

export function* TaskListViewSaga() {
  yield takeLatest(ListViewAction.FETCH_TASKS, fetchTasks);
}
