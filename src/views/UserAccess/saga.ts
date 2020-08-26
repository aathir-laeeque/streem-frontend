import { apiResendInvite, apiGetUsers } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { navigate } from '@reach/router';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { request } from '#utils/request';
import { User } from '#store/users/types';
import {
  resendInvite,
  resendInviteSuccess,
  resendInviteError,
  addUser,
  addUserSuccess,
  addUserError,
} from './actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { UserAccessAction } from './types';

function* resendInviteSaga({ payload }: ReturnType<typeof resendInvite>) {
  try {
    const { id } = payload;
    const { data, errors }: ResponseObj<Partial<User>> = yield call(
      request,
      'PUT',
      apiResendInvite(id),
    );

    if (errors) {
      return false;
    }

    yield put(resendInviteSuccess());
    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'Invite Resent Successfully.',
      }),
    );
  } catch (error) {
    console.error(
      'error from resendInviteSaga function in UserAccessSaga :: ',
      error,
    );
    yield put(resendInviteError(error));
  }
}

function* addUserSaga({ payload }: ReturnType<typeof addUser>) {
  console.log('payload', payload);
  try {
    const { data, errors }: ResponseObj<Partial<User>> = yield call(
      request,
      'POST',
      apiGetUsers(),
      {
        data: payload,
      },
    );

    console.log('data', data);
    console.log('errors', errors);

    if (errors) {
      return false;
    }

    yield put(addUserSuccess());
    navigate(-1);
    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'User Added Successfully.',
      }),
    );
  } catch (error) {
    console.error(
      'error from addUserError function in UserAccessSaga :: ',
      error,
    );
    yield put(addUserError(error));
  }
}

export function* UserAccessSaga() {
  yield takeLatest(UserAccessAction.RESEND_INVITE, resendInviteSaga);
  yield takeLatest(UserAccessAction.ADD_USER, addUserSaga);
}
