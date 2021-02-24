import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { closeAllOverlayAction } from '#components/OverlayContainer/actions';
import { RootState } from '#store';
import { fetchSelectedUserSuccess } from '#store/users/actions';
import { User } from '#store/users/types';
import {
  apiCheckTokenExpiry,
  apiForgotPassword,
  apiGetUser,
  apiLogin,
  apiLogOut,
  apiRegister,
  apiResetPassword,
  apiUpdatePassword,
  apiUpdateUserBasic,
} from '#utils/apiUrls';
import { removeAuthHeader, setAuthHeader } from '#utils/axiosClient';
import { LoginErrorCodes } from '#utils/constants';
import { ResponseObj } from '#utils/globalTypes';
import { getErrorMsg, handleCatch, request } from '#utils/request';
import { navigate } from '@reach/router';
import { call, put, select, takeLeading } from 'redux-saga/effects';

import { persistor } from '../../App';
import {
  checkTokenExpiry,
  checkTokenExpirySuccess,
  cleanUp,
  fetchProfile,
  fetchProfileSuccess,
  forgotPassword,
  forgotPasswordSuccess,
  login,
  loginError,
  loginSuccess,
  logOutSuccess,
  register,
  resetPassword,
  resetPasswordError,
  resetPasswordSuccess,
  updatePassword,
  updateProfile,
  updateProfileSuccess,
  updateUserProfile,
} from './actions';
import { AuthAction, LoginResponse } from './types';

const getUserId = (state: RootState) => state.auth.userId;
const getIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;

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
      const isLoggedIn = yield select(getIsLoggedIn);
      if (isLoggedIn) {
        if (errors?.[0]?.code !== LoginErrorCodes.INCORRECT) {
          yield put(closeAllOverlayAction());
          yield put(cleanUp());
        }
        yield put(
          showNotification({
            type: NotificationType.ERROR,
            msg: errors[0]?.message || 'Oops! Please Try Again.',
          }),
        );
      } else {
        throw getErrorMsg(errors);
      }
    } else {
      setAuthHeader(data.accessToken);

      yield put(loginSuccess(data));
      yield put(fetchProfile({ id: data.id }));
    }
  } catch (error) {
    error = yield* handleCatch('Auth', 'loginSaga', error);
    yield put(loginError(error));
  }
}

function* logOutSaga() {
  try {
    const { errors }: ResponseObj<LoginResponse> = yield call(
      request,
      'POST',
      apiLogOut(),
    );

    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(logOutSuccess());
  } catch (error) {
    yield* handleCatch('Auth', 'logOutSaga', error);
    yield put(cleanUp());
  }
}

function* cleanUpSaga() {
  try {
    removeAuthHeader();
    yield call(persistor.purge);
  } catch (error) {
    yield* handleCatch('Auth', 'cleanUpSaga', error);
  }
}

function* logOutSuccessSaga({ payload }: ReturnType<typeof logOutSuccess>) {
  try {
    const userId = yield select(getUserId);
    if (userId) {
      yield put(cleanUp());
      yield put(
        showNotification({
          type: payload?.type || NotificationType.SUCCESS,
          msg: payload?.msg || 'Logged Out successfully',
        }),
      );
    }
  } catch (error) {
    yield* handleCatch('Auth', 'logOutSuccessSaga', error);
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
      throw getErrorMsg(errors);
    }

    yield put(fetchProfileSuccess(data));
  } catch (error) {
    yield* handleCatch('Auth', 'fetchProfileSaga', error);
  }
}

function* registerSaga({ payload }: ReturnType<typeof register>) {
  try {
    const { errors }: ResponseObj<User> = yield call(
      request,
      'PATCH',
      apiRegister(),
      {
        data: payload,
      },
    );

    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'Registration Successful',
      }),
    );
    navigate('/auth/login');
  } catch (error) {
    yield* handleCatch('Auth', 'registerSaga', error, true);
  }
}

function* forgotPasswordSaga({ payload }: ReturnType<typeof forgotPassword>) {
  try {
    const { errors }: ResponseObj<unknown> = yield call(
      request,
      'POST',
      apiForgotPassword(),
      {
        data: payload,
      },
    );
    yield put(forgotPasswordSuccess());
    if (errors) {
      throw getErrorMsg(errors);
    }
  } catch (error) {
    yield* handleCatch('Auth', 'forgotPasswordSaga', error);
  }
}

function* resetPasswordSaga({ payload }: ReturnType<typeof resetPassword>) {
  try {
    const { errors }: ResponseObj<User> = yield call(
      request,
      'PATCH',
      apiResetPassword(),
      {
        data: payload,
      },
    );

    if (errors) {
      throw getErrorMsg(errors);
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
    error = yield* handleCatch('Auth', 'resetPasswordSaga', error);
    yield put(resetPasswordError(error));
  }
}

function* updateUserProfileSaga({
  payload,
}: ReturnType<typeof updateUserProfile>) {
  try {
    const { body, id } = payload;
    const { data, errors }: ResponseObj<User> = yield call(
      request,
      'PATCH',
      apiGetUser(id),
      {
        data: body,
      },
    );

    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(fetchSelectedUserSuccess({ data }));

    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'User updated successfully',
      }),
    );
  } catch (error) {
    yield* handleCatch('Auth', 'updateUserProfileSaga', error, true);
  }
}

function* updateProfileSaga({ payload }: ReturnType<typeof updateProfile>) {
  try {
    const { body, id } = payload;
    const { data, errors }: ResponseObj<User> = yield call(
      request,
      'PATCH',
      apiUpdateUserBasic(id),
      {
        data: body,
      },
    );

    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(updateProfileSuccess(data));

    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'Profile updated successfully',
      }),
    );
  } catch (error) {
    yield* handleCatch('Auth', 'updateProfileSaga', error, true);
  }
}

function* updatePasswordSaga({ payload }: ReturnType<typeof updatePassword>) {
  try {
    const { body, id } = payload;
    const { errors }: ResponseObj<User> = yield call(
      request,
      'PATCH',
      apiUpdatePassword(id),
      {
        data: body,
      },
    );

    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'Password updated successfully',
      }),
    );
  } catch (error) {
    yield* handleCatch('Auth', 'updatePasswordSaga', error, true);
  }
}

function* checkTokenExpirySaga({
  payload,
}: ReturnType<typeof checkTokenExpiry>) {
  try {
    const { errors } = yield call(request, 'POST', apiCheckTokenExpiry(), {
      data: payload,
    });

    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(checkTokenExpirySuccess({ isTokenExpired: false }));
  } catch (error) {
    yield put(checkTokenExpirySuccess({ isTokenExpired: true }));
    yield* handleCatch('Auth', 'checkTokenExpirySaga', error, true);
  }
}

export function* AuthSaga() {
  yield takeLeading(AuthAction.LOGIN, loginSaga);
  yield takeLeading(AuthAction.LOGOUT, logOutSaga);
  yield takeLeading(AuthAction.LOGOUT_SUCCESS, logOutSuccessSaga);
  yield takeLeading(AuthAction.CLEANUP, cleanUpSaga);
  yield takeLeading(AuthAction.FETCH_PROFILE, fetchProfileSaga);
  yield takeLeading(AuthAction.REGISTER, registerSaga);
  yield takeLeading(AuthAction.FORGOT_PASSWORD, forgotPasswordSaga);
  yield takeLeading(AuthAction.RESET_PASSWORD, resetPasswordSaga);
  yield takeLeading(AuthAction.UPDATE_PROFILE, updateProfileSaga);
  yield takeLeading(AuthAction.UPDATE_USER_PROFILE, updateUserProfileSaga);
  yield takeLeading(AuthAction.UPDATE_PASSWORD, updatePasswordSaga);
  yield takeLeading(AuthAction.CHECK_TOKEN_EXPIRY, checkTokenExpirySaga);
}
