import { apiGetUsers } from '#utils/apiUrls';
import { request } from '#utils/request';
import { ResponseObj } from '#utils/globalTypes';
import { call, put, takeLeading } from 'redux-saga/effects';

import {
  fetchUsers,
  fetchUsersError,
  fetchUsersSuccess,
  fetchUsersOngoing,
} from './actions';
import { UsersAction, User } from './types';

function* fetchUsersSaga({ payload }: ReturnType<typeof fetchUsers>) {
  try {
    const { params, type } = payload;

    if (params.page === 0) {
      yield put(fetchUsersOngoing());
    }

    const { data, pageable }: ResponseObj<User> = yield call(
      request,
      'GET',
      apiGetUsers(),
      { params },
    );
    yield put(fetchUsersSuccess({ data, pageable }, type));
  } catch (error) {
    console.error(
      'error from fetchUsers function in UsersUsersSaga :: ',
      error,
    );
    yield put(fetchUsersError(error));
  }
}

export function* UsersSaga() {
  yield takeLeading(UsersAction.FETCH_USERS, fetchUsersSaga);
}
