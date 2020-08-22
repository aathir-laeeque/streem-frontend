import {
  apiLogin,
  apiRefreshToken,
  apiGetUser,
  apiRegister,
} from '#utils/apiUrls';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { navigate } from '@reach/router';
import { User } from '#store/users/types';
import {
  login,
  loginSuccess,
  loginError,
  refreshToken,
  refreshTokenPoll,
  refreshTokenSuccess,
  refreshTokenError,
  fetchProfile,
  fetchProfileSuccess,
  fetchProfileError,
  register,
  registerSuccess,
  registerError,
  updateProfile,
  updateProfileError,
  updateProfileSuccess,
} from './actions';

import { call, put, takeLatest, delay, select } from 'redux-saga/effects';
import { AuthAction, LoginResponse, RefreshTokenResponse } from './types';

const getRefreshToken = (state: any) => state.auth.refreshToken;

function* refreshTokenPollSaga() {
  try {
    while (true) {
      const token = yield select(getRefreshToken);
      yield put(refreshToken({ token }));
      yield delay(295000);
      // yield delay(5000);
    }
  } catch (error) {
    console.error(
      'error from refreshTokenPeriodically function in Auth :: ',
      error,
    );
  }
}

function* refreshTokenSaga({ payload }: ReturnType<typeof refreshToken>) {
  try {
    const { data, errors }: ResponseObj<RefreshTokenResponse> = yield call(
      request,
      'POST',
      apiRefreshToken(),
      {
        data: payload,
      },
    );

    if (errors) {
      return false;
    }

    yield put(refreshTokenSuccess(data));
  } catch (error) {
    console.error('error from refreshTokenSaga function in Auth :: ', error);
    yield put(refreshTokenError(error));
  }
}

function* loginSaga({ payload }: ReturnType<typeof login>) {
  try {
    const { data, errors }: ResponseObj<LoginResponse> = yield call(
      request,
      'POST',
      apiLogin(),
      {
        data: payload,
      },
    );

    if (errors) {
      return false;
    }

    yield put(loginSuccess(data));
    yield put(fetchProfile({ id: data.id }));
    yield put(refreshTokenPoll());
  } catch (error) {
    console.error('error from loginSaga function in Auth :: ', error);
    yield put(loginError(error));
  }
}

function* fetchProfileSaga({ payload }: ReturnType<typeof fetchProfile>) {
  try {
    const { id } = payload;
    const { data, errors }: ResponseObj<User> = yield call(
      request,
      'GET',
      apiGetUser(id),
    );

    if (errors) {
      return false;
    }

    yield put(fetchProfileSuccess(data));
  } catch (error) {
    console.error('error from fetchProfileSaga function in Auth :: ', error);
    yield put(fetchProfileError(error));
  }
}

function* registerSaga({ payload }: ReturnType<typeof register>) {
  try {
    const { data, errors }: ResponseObj<User> = yield call(
      request,
      'PUT',
      apiRegister(),
      {
        data: payload,
      },
    );

    if (errors) {
      return false;
    }

    yield put(registerSuccess());
    navigate('/auth/login');
  } catch (error) {
    console.error('error from registerSaga function in Auth :: ', error);
    yield put(registerError(error));
  }
}

function* updateProfileSaga({ payload }: ReturnType<typeof updateProfile>) {
  try {
    const { body, id } = payload;
    const { data, errors }: ResponseObj<User> = yield call(
      request,
      'PUT',
      apiGetUser(id),
      {
        data: body,
      },
    );

    if (errors) {
      return false;
    }

    yield put(updateProfileSuccess(data));
    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'Profile successfully',
      }),
    );
  } catch (error) {
    console.error('error from updateProfileSaga function in Auth :: ', error);
    yield put(updateProfileError(error));
  }
}

export function* AuthSaga() {
  yield takeLatest(AuthAction.LOGIN, loginSaga);
  yield takeLatest(AuthAction.REFRESH_TOKEN_POLL, refreshTokenPollSaga);
  yield takeLatest(AuthAction.REFRESH_TOKEN, refreshTokenSaga);
  yield takeLatest(AuthAction.FETCH_PROFILE, fetchProfileSaga);
  yield takeLatest(AuthAction.REGISTER, registerSaga);
  yield takeLatest(AuthAction.UPDATE_PROFILE, updateProfileSaga);
}
