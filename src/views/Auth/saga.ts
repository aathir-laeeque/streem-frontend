import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import {
  closeAllOverlayAction,
  openOverlayAction,
} from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { RootState } from '#store';
import { fetchSelectedUserSuccess } from '#store/users/actions';
import { User } from '#store/users/types';
import {
  apiAdditionalVerification,
  apiCheckTokenExpiry,
  apiGetUser,
  apiLogin,
  apiLogOut,
  apiNotifyAdmin,
  apiRegister,
  apiResetPassword,
  apiResetToken,
  apiUpdateChallengeQuestions,
  apiValidateChallengeQuestion,
  apiValidateIdentity,
} from '#utils/apiUrls';
import { removeAuthHeader, setAuthHeader } from '#utils/axiosClient';
import { LoginErrorCodes } from '#utils/constants';
import { ResponseObj } from '#utils/globalTypes';
import { getErrorMsg, handleCatch, request } from '#utils/request';
import { encrypt } from '#utils/stringUtils';
import { ValidateCredentialsPurpose } from '#views/UserAccess/types';
import { navigate } from '@reach/router';
import { call, put, select, takeLeading } from 'redux-saga/effects';
import { store } from '../../App';

import { persistor } from '../../App';
import {
  additionalVerification,
  authError,
  checkTokenExpiry,
  cleanUp,
  fetchProfile,
  fetchProfileSuccess,
  login,
  loginSuccess,
  logoutSuccess,
  notifyAdmin,
  register,
  resetPassword,
  resetToken,
  setChallengeQuestion,
  setChallengeQuestionSuccess,
  setIdentityToken,
  updateUserProfile,
  validateIdentity,
  validateQuestion,
} from './actions';
import { AuthAction, LoginResponse, TokenTypes } from './types';

const getUserId = (state: RootState) => state.auth.userId;
const getIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;

function* loginSaga({ payload }: ReturnType<typeof login>) {
  try {
    const { username, password } = payload;
    const isLoggedIn = (yield select(getIsLoggedIn)) as boolean;
    const { data, errors }: ResponseObj<LoginResponse> = yield call(
      request,
      'POST',
      apiLogin(),
      {
        data: { username, password: encrypt(password) },
      },
    );

    if (errors) {
      if (isLoggedIn) {
        if (errors?.[0]?.code !== LoginErrorCodes.INVALID_CREDENTIALS) {
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
        if (errors?.[0]?.code === LoginErrorCodes.PASSWORD_EXPIRED) {
          navigate('/auth/password-expired');
        } else {
          throw getErrorMsg(errors);
        }
      }
    } else {
      setAuthHeader(data.accessToken);
      yield put(loginSuccess(data));
      yield put(fetchProfile({ id: data.id }));
    }
  } catch (error) {
    error = yield* handleCatch('Auth', 'loginSaga', error);
    yield put(authError(error));
  }
}

function* logoutSaga() {
  try {
    const { errors }: ResponseObj<LoginResponse> = yield call(
      request,
      'POST',
      apiLogOut(),
    );

    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(logoutSuccess());
  } catch (error) {
    yield* handleCatch('Auth', 'logoutSaga', error);
    yield put(cleanUp());
  }
}

function* cleanUpSaga() {
  try {
    removeAuthHeader();
    yield put(closeAllOverlayAction());
    yield call(persistor.purge);
  } catch (error) {
    yield* handleCatch('Auth', 'cleanUpSaga', error);
  }
}

function* logoutSuccessSaga({ payload }: ReturnType<typeof logoutSuccess>) {
  try {
    const userId = (yield select(getUserId)) as string;
    if (userId) {
      yield put(cleanUp());
      yield put(
        showNotification({
          type: payload?.type || NotificationType.SUCCESS,
          msg: payload?.msg || 'Logged Out successfully',
          delayTime: payload?.delayTime,
        }),
      );
    }
  } catch (error) {
    yield* handleCatch('Auth', 'logoutSuccessSaga', error);
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
    const {
      data,
      errors,
    }: ResponseObj<LoginResponse & { token: string }> = yield call(
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

    setAuthHeader(data.accessToken);
    yield put(loginSuccess(data));
    yield put(fetchProfile({ id: data.id }));
  } catch (error) {
    error = yield* handleCatch('Auth', 'registerSaga', error);
    yield put(authError(error));
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

    navigate('/auth/forgot-password/updated');
  } catch (error) {
    error = yield* handleCatch('Auth', 'resetPasswordSaga', error);
    yield put(authError(error));
  }
}

function* updateUserProfileSaga({
  payload,
}: ReturnType<typeof updateUserProfile>) {
  try {
    const { body, id } = payload;
    const userId = (yield select(getUserId)) as string;
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
    if (id === userId) yield put(fetchProfileSuccess(data));

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

function* checkTokenExpirySaga({
  payload,
}: ReturnType<typeof checkTokenExpiry>) {
  try {
    const { data, errors, token } = yield call(
      request,
      'PATCH',
      apiCheckTokenExpiry(),
      {
        data: payload,
      },
    );

    if (errors) {
      if (errors?.[0].code === LoginErrorCodes.FORGOT_PASSWORD_TOKEN_EXPIRED) {
        yield put(setIdentityToken({ token }));
        navigate('/auth/forgot-password/key-expired');
      } else if (
        errors?.[0].code === LoginErrorCodes.REGISTRATION_TOKEN_EXPIRED
      ) {
        yield put(setIdentityToken({ token }));
        navigate('/auth/register/invite-expired');
      } else {
        throw getErrorMsg(errors);
      }
    } else {
      yield put(setIdentityToken(data));

      if (payload.type === TokenTypes.REGISTRATION) {
        navigate('/auth/register/employee-id');
      } else {
        navigate('/auth/forgot-password/new-password');
      }
    }
  } catch (error) {
    error = yield* handleCatch('Auth', 'checkTokenExpirySaga', error);
    yield put(authError(error));
  }
}

function* additionalVerificationSaga({
  payload,
}: ReturnType<typeof additionalVerification>) {
  try {
    const { data, errors } = yield call(
      request,
      'PATCH',
      apiAdditionalVerification(),
      {
        data: payload,
      },
    );

    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(setIdentityToken(data));
    navigate('/auth/register/credentials');
  } catch (error) {
    error = yield* handleCatch('Auth', 'additionalVerificationSaga', error);
    yield put(authError(error));
  }
}

function* setChallengeQuestionSaga({
  payload,
}: ReturnType<typeof setChallengeQuestion>) {
  try {
    const userId = (yield select(getUserId)) as string;
    const { errors } = yield call(
      request,
      'PATCH',
      apiUpdateChallengeQuestions(userId),
      {
        data: payload,
      },
    );

    if (errors) {
      if (errors[0].code === LoginErrorCodes.JWT_TOKEN_EXPIRED) {
        yield put(
          openOverlayAction({
            type: OverlayNames.VALIDATE_CREDENTIALS_MODAL,
            props: {
              purpose: ValidateCredentialsPurpose.CHALLENGE_QUESTION_UPDATE,
              onSuccess: (token: string) => {
                store.dispatch(setIdentityToken({ token }));
              },
            },
          }),
        );
      } else {
        throw getErrorMsg(errors);
      }
    } else {
      yield put(setChallengeQuestionSuccess());
    }
  } catch (error) {
    error = yield* handleCatch('Auth', 'setChallengeQuestionSaga', error);
    yield put(authError(error));
  }
}

function* validateIdentitySaga({
  payload,
}: ReturnType<typeof validateIdentity>) {
  try {
    const { data, errors } = yield call(
      request,
      'PATCH',
      apiValidateIdentity(),
      {
        data: payload,
      },
    );

    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(setIdentityToken(data));
    navigate('/auth/forgot-password/recovery');
  } catch (error) {
    error = yield* handleCatch('Auth', 'validateIdentitySaga', error);
    yield put(authError(error));
  }
}

function* validateQuestionSaga({
  payload,
}: ReturnType<typeof validateQuestion>) {
  try {
    const { data, errors, token } = yield call(
      request,
      'PATCH',
      apiValidateChallengeQuestion(),
      {
        data: payload,
      },
    );

    if (errors) {
      if (errors?.[0].code === LoginErrorCodes.USER_ACCOUNT_LOCKED) {
        yield put(setIdentityToken({ token }));
        navigate('/auth/account-locked');
      } else {
        throw getErrorMsg(errors);
      }
    } else {
      yield put(setIdentityToken(data));
      navigate('/auth/forgot-password/new-password');
    }
  } catch (error) {
    error = yield* handleCatch('Auth', 'validateQuestionSaga', error);
    yield put(authError(error));
  }
}

function* resetTokenSaga({ payload }: ReturnType<typeof resetToken>) {
  try {
    const { errors } = yield call(request, 'PATCH', apiResetToken(), {
      data: payload,
    });

    if (errors) {
      throw getErrorMsg(errors);
    }

    navigate('/auth/forgot-password/email-sent');
  } catch (error) {
    error = yield* handleCatch('Auth', 'resetTokenSaga', error);
    yield put(authError(error));
  }
}

function* notifyAdminSaga({ payload }: ReturnType<typeof notifyAdmin>) {
  try {
    const { errors } = yield call(request, 'PATCH', apiNotifyAdmin(), {
      data: payload,
    });

    if (errors) {
      throw getErrorMsg(errors);
    }

    navigate('/auth/notified');
  } catch (error) {
    error = yield* handleCatch('Auth', 'notifyAdminSaga', error);
    yield put(authError(error));
  }
}

export function* AuthSaga() {
  yield takeLeading(AuthAction.LOGIN, loginSaga);
  yield takeLeading(AuthAction.LOGOUT, logoutSaga);
  yield takeLeading(AuthAction.LOGOUT_SUCCESS, logoutSuccessSaga);
  yield takeLeading(AuthAction.CLEANUP, cleanUpSaga);
  yield takeLeading(AuthAction.FETCH_PROFILE, fetchProfileSaga);
  yield takeLeading(AuthAction.REGISTER, registerSaga);
  yield takeLeading(AuthAction.RESET_PASSWORD, resetPasswordSaga);
  yield takeLeading(AuthAction.UPDATE_USER_PROFILE, updateUserProfileSaga);
  yield takeLeading(AuthAction.CHECK_TOKEN_EXPIRY, checkTokenExpirySaga);
  yield takeLeading(
    AuthAction.ADDITIONAL_VERIFICATION,
    additionalVerificationSaga,
  );
  yield takeLeading(
    AuthAction.SET_CHALLENGE_QUESTION,
    setChallengeQuestionSaga,
  );
  yield takeLeading(AuthAction.VALIDATE_IDENTITY, validateIdentitySaga);
  yield takeLeading(AuthAction.VALIDATE_QUESTION, validateQuestionSaga);
  yield takeLeading(AuthAction.RESET_TOKEN, resetTokenSaga);
  yield takeLeading(AuthAction.NOTIFY_ADMIN, notifyAdminSaga);
}
