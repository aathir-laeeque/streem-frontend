import { apiAddNewActivity, apiDeleteActivity, apiUpdateActivity } from '#utils/apiUrls';
import { request } from '#utils/request';
import { call, put, takeLatest, takeLeading } from 'redux-saga/effects';
import {
  addNewActivity,
  addNewActivityError,
  addNewActivitySuccess,
  deleteActivity,
  deleteActivityError,
  deleteActivitySuccess,
  updateActivityApi,
  updateActivityError,
} from './actions';
import { ActivityListActions } from './reducer.types';
import { generateNewActivity } from './utils';

function* updateActivitySaga({ payload }: ReturnType<typeof updateActivityApi>) {
  try {
    const { activity } = payload;
    const { errors } = yield call(request, 'PATCH', apiUpdateActivity(activity.id), {
      data: { ...activity },
    });

    if (errors) {
      yield put(updateActivityError(errors));
    }
  } catch (error) {
    console.error('error came in the updateActivitySaga :: ', error);
  }
}

function* addNewActivitySaga({ payload }: ReturnType<typeof addNewActivity>) {
  try {
    const { activityType: type, checklistId, orderTree, stageId, taskId } = payload;

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
    const { data, errors } = yield call(request, 'PATCH', apiDeleteActivity(payload.activityId));

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
  yield takeLatest(ActivityListActions.UPDATE_ACTIVITY_API, updateActivitySaga);
  yield takeLeading(ActivityListActions.DELETE_ACTIVITY, deleteActivitySaga);
}
