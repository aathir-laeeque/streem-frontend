import {
  apiAddNewActivity,
  apiDeleteActivity,
  apiUpdateActivity,
} from '#utils/apiUrls';
import { request } from '#utils/request';
import { call, put, takeLeading } from 'redux-saga/effects';

import {
  addNewActivity,
  addNewActivityError,
  addNewActivitySuccess,
  deleteActivity,
  deleteActivityError,
  deleteActivitySuccess,
  updateActivity,
  updateActivityError,
  updateActivitySuccess,
} from './actions';
import { ActivityListActions } from './reducer.types';
import { generateNewActivity } from './utils';

function* updateActivitySaga({ payload }: ReturnType<typeof updateActivity>) {
  try {
    const { activity } = payload;

    const { data, errors } = yield call(
      request,
      'PATCH',
      apiUpdateActivity(activity.id),
      { data: { ...activity } },
    );

    if (data) {
      yield put(updateActivitySuccess(data));
    } else {
      yield put(updateActivityError(errors));
    }
  } catch (error) {
    console.error('error came in the updateActivitySaga :: ', error);
  }
}

function* addNewActivitySaga({ payload }: ReturnType<typeof addNewActivity>) {
  try {
    const {
      activityType: type,
      checklistId,
      orderTree,
      stageId,
      taskId,
    } = payload;

    const { data, errors } = yield call(
      request,
      'POST',
      apiAddNewActivity({ checklistId, stageId, taskId }),
      { data: { ...generateNewActivity({ type, orderTree }) } },
    );

    if (data) {
      yield put(addNewActivitySuccess({ activity: data, stageId, taskId }));
    } else {
      yield put(addNewActivityError(errors));
    }
  } catch (error) {
    console.error('error came in addNewActivitySaga :: ', error);
  }
}

function* deleteActivitySaga({ payload }: ReturnType<typeof deleteActivity>) {
  try {
    const { data, errors } = yield call(
      request,
      'PATCH',
      apiDeleteActivity(payload.activityId),
    );

    if (data) {
      yield put(deleteActivitySuccess(payload));
    } else {
      yield put(deleteActivityError(errors));
    }
  } catch (error) {
    console.error('error came in deleteACtivitySaga :: ', error);
  }
}

export function* ActivitySaga() {
  yield takeLeading(ActivityListActions.ADD_NEW_ACTIVITY, addNewActivitySaga);
  yield takeLeading(ActivityListActions.UPDATE_ACTIVITY, updateActivitySaga);
  yield takeLeading(ActivityListActions.DELETE_ACTIVITY, deleteActivitySaga);
}
