import { apiGetUsers } from '#utils/apiUrls';
import { request } from '#utils/request';
import { call, put, takeEvery } from 'redux-saga/effects';

import { fetchUsersError, fetchUsersSuccess } from './actions';
import { UsersAction } from './types';

function* fetchUsers(action: any) {
  try {
    const params = action.payload;
    const response = yield call(request, 'GET', apiGetUsers(), { params });
    yield put(fetchUsersSuccess(response.data, response.pageable));
  } catch (error) {
    console.error(
      'error from fetchUsers function in UsersUsersSaga :: ',
      error,
    );
    yield put(fetchUsersError(error));
  }
}

export function* UsersSaga() {
  yield takeEvery(UsersAction.FETCH_USERS, fetchUsers);
}
