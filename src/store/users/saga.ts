import { apiGetUsers } from '#utils/apiUrls';
import { request } from '#utils/request';
import { ResponseObj } from '#utils/globalTypes';
import { call, put, takeEvery } from 'redux-saga/effects';

import { fetchUsersError, fetchUsersSuccess } from './actions';
import { UsersAction, User } from './types';

function* fetchUsers(action: any) {
  try {
    const params = action.payload;
    const { data, pageable }: ResponseObj<User> = yield call(
      request,
      'GET',
      apiGetUsers(),
      { params },
    );
    yield put(fetchUsersSuccess({ data, pageable }));
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
