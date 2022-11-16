import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { RootState } from '#store';
import {
  apiAddNewActivity,
  apiDeleteActivity,
  apiGetActivities,
  apiSingleActivity,
} from '#utils/apiUrls';
import { FilterOperators, ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { call, put, select, takeLatest, takeLeading } from 'redux-saga/effects';
import {
  addNewActivity,
  addNewActivityError,
  addNewActivitySuccess,
  deleteActivity,
  deleteActivityError,
  deleteActivitySuccess,
  fetchParameters,
  fetchParametersError,
  fetchParametersSuccess,
  toggleNewParameter,
  updateActivityApi,
  updateActivityError,
  updateStoreActivity,
} from './actions';
import { ActivityListActions } from './reducer.types';

function* updateActivitySaga({ payload }: ReturnType<typeof updateActivityApi>) {
  try {
    const { fromList, activity } = payload;
    const { data, errors } = yield call(request, 'PATCH', apiSingleActivity(activity.id), {
      data: { ...activity },
    });

    if (fromList && data) {
      yield put(updateStoreActivity(data, activity.id));
      yield put(toggleNewParameter());
      yield put(
        showNotification({
          type: NotificationType.SUCCESS,
          msg: 'Parameter Updated Successfully',
          detail: activity.label,
        }),
      );
    }

    if (errors) {
      yield put(updateActivityError(errors));
    }
  } catch (error) {
    console.error('error came in the updateActivitySaga :: ', error);
  }
}

function* addNewActivitySaga({ payload }: ReturnType<typeof addNewActivity>) {
  try {
    const { checklistId, stageId, taskId, ...activity } = payload;

    const { data, errors } = yield call(
      request,
      'POST',
      apiAddNewActivity({ checklistId, stageId, taskId }),
      { data: activity },
    );

    if (data) {
      if (stageId && taskId) {
        yield put(addNewActivitySuccess({ activity: data, stageId, taskId }));
      } else {
        const {
          activities: {
            parameters: { pageable },
          },
        } = yield select((state: RootState) => state.prototypeComposer);
        yield put(
          fetchParameters(checklistId, {
            page: pageable.page,
            size: pageable.size,
            filters: JSON.stringify({
              op: FilterOperators.AND,
              fields: [{ field: 'archived', op: FilterOperators.EQ, values: [false] }],
            }),
          }),
        );
      }
      yield put(toggleNewParameter());
      yield put(
        showNotification({
          type: NotificationType.SUCCESS,
          msg: 'New Parameter Created',
          detail: activity.label,
        }),
      );
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

function* fetchParametersSaga({ payload }: ReturnType<typeof fetchParameters>) {
  try {
    const { params, checklistId } = payload;
    const { data, pageable }: ResponseObj<any[]> = yield call(
      request,
      'GET',
      apiGetActivities(checklistId),
      {
        params,
      },
    );

    if (data) {
      yield put(fetchParametersSuccess({ data, pageable }));
    }
  } catch (error) {
    console.error('error from fetchObjectTypesSaga function in Ontology Saga :: ', error);
    yield put(fetchParametersError(error));
  }
}

export function* ActivitySaga() {
  yield takeLeading(ActivityListActions.ADD_NEW_ACTIVITY, addNewActivitySaga);
  yield takeLatest(ActivityListActions.UPDATE_ACTIVITY_API, updateActivitySaga);
  yield takeLeading(ActivityListActions.DELETE_ACTIVITY, deleteActivitySaga);
  yield takeLatest(ActivityListActions.FETCH_PARAMETERS, fetchParametersSaga);
}
