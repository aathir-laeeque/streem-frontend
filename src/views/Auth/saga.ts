import {
  apiLogin,
  apiGetUser,
  apiRegister,
  apiLogOut,
  apiForgotPassword,
  apiResetPassword,
  apiUpdateUserBasic,
  apiUpdatePassword,
} from '#utils/apiUrls';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { User } from '#store/users/types';
import {
  login,
  logOutSuccess,
  loginSuccess,
  loginError,
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
  updatePassword,
  updatePasswordError,
  updateUserProfile,
  updateUserProfileError,
  updateUserProfileSuccess,
  checkTokenExpiry,
  checkTokenExpirySuccess,
  cleanUp,
} from './actions';
import { persistor } from '../../App';

import { call, put, select, takeLeading } from 'redux-saga/effects';
import { AuthAction, LoginResponse } from './types';
import { LoginErrorCodes } from '#utils/constants';
import { setAuthHeader, removeAuthHeader } from '#utils/axiosClient';
import { navigate } from '@reach/router';

const getUserId = (state: any) => state.auth.userId;

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
      switch (errors[0].code) {
        case LoginErrorCodes.BLOCKED:
          throw 'User has been blocked.';
          break;
        case LoginErrorCodes.INCORRECT:
          throw 'Provided credentials are incorrect. Please check and try again.';
          break;
        case LoginErrorCodes.EXPIRED:
          throw 'Password Expired. Use Forgot Password to set a new one.';
          break;
        default:
          throw 'Provided credentials are incorrect. Please check and try again.';
          break;
      }
    }

    setAuthHeader(data.accessToken);

    yield put(loginSuccess(data));
    yield put(fetchProfile({ id: data.id }));
  } catch (error) {
    console.error('error from loginSaga function in Auth :: ', error);
    if (typeof error !== 'string') error = 'There seems to be an Issue.';
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
      throw 'Logout Error';
    }

    yield put(logOutSuccess());
  } catch (error) {
    console.error('error from logOutSaga function in Auth :: ', error);
    yield put(cleanUp());
  }
}

function* cleanUpSaga() {
  try {
    removeAuthHeader();
    yield call(persistor.purge);
  } catch (error) {
    console.error('error from cleanUpSaga function in Auth :: ', error);
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
    const { errors }: ResponseObj<User> = yield call(
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
    const { errors }: ResponseObj<any> = yield call(
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
    const { errors }: ResponseObj<User> = yield call(
      request,
      'PUT',
      apiResetPassword(),
      {
        data: payload,
      },
    );

    if (errors) {
      throw errors[0].message;
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

function* updateUserProfileSaga({
  payload,
}: ReturnType<typeof updateUserProfile>) {
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
          msg: 'There Seems to be an Issue',
        }),
      );
      return false;
    }

    yield put(updateUserProfileSuccess(data));

    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'User updated successfully',
      }),
    );
  } catch (error) {
    console.error(
      'error from updateUserProfileSaga function in Auth :: ',
      error,
    );
    yield put(updateUserProfileError(error));
  }
}

function* updateProfileSaga({ payload }: ReturnType<typeof updateProfile>) {
  try {
    const { body, id } = payload;
    const { data, errors }: ResponseObj<User> = yield call(
      request,
      'PUT',
      apiUpdateUserBasic(id),
      {
        data: body,
      },
    );

    if (errors) {
      yield put(
        showNotification({
          type: NotificationType.ERROR,
          msg: 'There Seems to be an Issue',
        }),
      );
      return false;
    }

    yield put(updateProfileSuccess(data));

    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'Profile updated successfully',
      }),
    );
  } catch (error) {
    console.error('error from updateProfileSaga function in Auth :: ', error);
    yield put(updateProfileError(error));
  }
}

function* updatePasswordSaga({ payload }: ReturnType<typeof updatePassword>) {
  try {
    const { body, id } = payload;
    const { errors }: ResponseObj<User> = yield call(
      request,
      'PUT',
      apiUpdatePassword(id),
      {
        data: body,
      },
    );

    if (errors) {
      yield put(
        showNotification({
          type: NotificationType.ERROR,
          msg: errors[0].message,
        }),
      );
      return false;
    }

    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'Password updated successfully',
      }),
    );
  } catch (error) {
    console.error('error from updatePasswordSaga function in Auth :: ', error);
    yield put(updatePasswordError(error));
  }
}

function* checkTokenExpirySaga({
  payload,
}: ReturnType<typeof checkTokenExpiry>) {
  try {
    console.log('PAYLOAD TO CHECK TOKEN EXPIRY :: ', payload);
    // const { data, errors } = yield call(
    //   request,
    //   'PUT',
    //   apiCheckTokenExpiry(id),
    //   {
    //     data: payload,
    //   },
    // );

    // if (errors) {
    //   throw 'Some Issue';
    // }

    // yield delay(2000);

    yield put(checkTokenExpirySuccess({ isTokenExpired: false }));
  } catch (error) {
    console.error(
      'error from checkTokenExpirySaga function in Auth :: ',
      error,
    );
    yield put(checkTokenExpirySuccess({ isTokenExpired: true }));
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
