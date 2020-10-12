import {
  apiLogin,
  apiRefreshToken,
  apiGetUser,
  apiRegister,
  apiLogOut,
  apiForgotPassword,
  apiResetPassword,
} from '#utils/apiUrls';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { navigate } from '@reach/router';
import { User } from '#store/users/types';
import {
  login,
  logOutSuccess,
  logOutError,
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
  forgotPassword,
  forgotPasswordError,
  forgotPasswordSuccess,
  resetPassword,
  resetPasswordError,
  resetPasswordSuccess,
} from './actions';
import { persistor } from '../../App';

import { call, put, takeLatest, delay, select } from 'redux-saga/effects';
import { AuthAction, LoginResponse, RefreshTokenResponse } from './types';

const getRefreshToken = (state: any) => state.auth.refreshToken;
const getUserId = (state: any) => state.auth.userId;

function* refreshTokenPollSaga() {
  try {
    let userId = yield select(getUserId);
    while (userId) {
      userId = yield select(getUserId);
      const token = yield select(getRefreshToken);
      yield put(refreshToken({ token }));
      yield delay(295000);
    }
  } catch (error) {
    console.error(
      'error from refreshTokenPollSaga function in Auth :: ',
      error,
    );
  }
}

function* refreshTokenSaga({ payload }: ReturnType<typeof refreshToken>) {
  try {
    const {
      data,
      errors,
      error,
    }: ResponseObj<RefreshTokenResponse> = yield call(
      request,
      'POST',
      apiRefreshToken(),
      {
        data: payload,
      },
    );

    if (errors || error) {
      yield put(logOutSuccess());
      throw 'Token Expired';
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
      throw 'Provided credentials are incorrect. Please check and try again.';
    }

    yield put(loginSuccess(data));
    yield put(refreshTokenPoll());
    yield put(fetchProfile({ id: data.id }));
  } catch (error) {
    console.error('error from loginSaga function in Auth :: ', error);
    if (typeof error !== 'string') error = 'There seems to be an Issue. ';
    yield put(loginError(error));
  }
}

function* logOutSaga() {
  try {
    const { data, errors }: ResponseObj<LoginResponse> = yield call(
      request,
      'POST',
      apiLogOut(),
    );

    if (errors) {
      throw 'Logout Error';
    }

    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'Logged Out successfully',
      }),
    );
    yield put(logOutSuccess());
  } catch (error) {
    console.error('error from logOutSaga function in Auth :: ', error);
    yield put(logOutError(error));
  }
}

function* logOutSuccessSaga() {
  try {
    yield call(persistor.purge);
    navigate('/auth/login');
  } catch (error) {
    console.error('error from logOutSuccessSaga function in Auth :: ', error);
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
      yield put(
        showNotification({
          type: NotificationType.ERROR,
          msg: 'Token Expired',
        }),
      );
      return false;
    }

    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'Registration Successful',
      }),
    );
    yield put(registerSuccess());
    navigate('/auth/login');
  } catch (error) {
    console.error('error from registerSaga function in Auth :: ', error);
    yield put(registerError(error));
  }
}

function* forgotPasswordSaga({ payload }: ReturnType<typeof forgotPassword>) {
  try {
    const { data, errors }: ResponseObj<any> = yield call(
      request,
      'POST',
      apiForgotPassword(),
      {
        data: payload,
      },
    );

    if (errors) {
      throw 'This email ID doesn’t exist in our system. Please make sure it is entered correctly.';
    }

    yield put(forgotPasswordSuccess());
  } catch (error) {
    console.error('error from forgotPasswordSaga function in Auth :: ', error);
    yield put(forgotPasswordError(error));
  }
}

function* resetPasswordSaga({ payload }: ReturnType<typeof resetPassword>) {
  try {
    const { data, errors }: ResponseObj<User> = yield call(
      request,
      'PUT',
      apiResetPassword(),
      {
        data: payload,
      },
    );

    if (errors) {
      return false;
    }

    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'Password Changed successfully',
      }),
    );
    yield put(resetPasswordSuccess());
    navigate('/auth/login');
  } catch (error) {
    console.error('error from resetPasswordSaga function in Auth :: ', error);
    yield put(resetPasswordError(error));
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
      yield put(
        showNotification({
          type: NotificationType.ERROR,
          msg: 'Provided Current Password is incorrect',
        }),
      );
      return false;
    }

    yield put(updateProfileSuccess(data));

    if (payload.body.oldPassword) {
      yield put(
        showNotification({
          type: NotificationType.SUCCESS,
          msg: 'Password updated successfully',
        }),
      );
    } else {
      yield put(
        showNotification({
          type: NotificationType.SUCCESS,
          msg: 'Profile updated successfully',
        }),
      );
    }
  } catch (error) {
    console.error('error from updateProfileSaga function in Auth :: ', error);
    yield put(updateProfileError(error));
  }
}

export function* AuthSaga() {
  yield takeLatest(AuthAction.LOGIN, loginSaga);
  yield takeLatest(AuthAction.LOGOUT, logOutSaga);
  yield takeLatest(AuthAction.LOGOUT_SUCCESS, logOutSuccessSaga);
  yield takeLatest(AuthAction.REFRESH_TOKEN_POLL, refreshTokenPollSaga);
  yield takeLatest(AuthAction.REFRESH_TOKEN, refreshTokenSaga);
  yield takeLatest(AuthAction.FETCH_PROFILE, fetchProfileSaga);
  yield takeLatest(AuthAction.REGISTER, registerSaga);
  yield takeLatest(AuthAction.FORGOT_PASSWORD, forgotPasswordSaga);
  yield takeLatest(AuthAction.RESET_PASSWORD, resetPasswordSaga);
  yield takeLatest(AuthAction.UPDATE_PROFILE, updateProfileSaga);
}
