import {
  apiResendInvite,
  apiGetUsers,
  apiArchiveUser,
  apiUnArchiveUser,
  apiUnLockUser,
  apiCancelInvite,
} from '#utils/apiUrls';
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
  archiveUser,
  archiveUserSuccess,
  archiveUserError,
  unArchiveUser,
  unArchiveUserSuccess,
  unArchiveUserError,
  addUser,
  addUserSuccess,
  addUserError,
  unLockUser,
  unLockUserError,
  unLockUserSuccess,
  cancelInvite,
  cancelInviteError,
  cancelInviteSuccess,
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

function* cancelInviteSaga({ payload }: ReturnType<typeof cancelInvite>) {
  try {
    const { id, fetchData } = payload;
    const { data, errors }: ResponseObj<Partial<User>> = yield call(
      request,
      'PUT',
      apiCancelInvite(id),
    );

    if (errors) {
      return false;
    }

    yield put(cancelInviteSuccess());
    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'Invite Canceled Successfully.',
      }),
    );
    yield call(fetchData);
  } catch (error) {
    console.error(
      'error from cancelInviteSaga function in UserAccessSaga :: ',
      error,
    );
    yield put(cancelInviteError(error));
  }
}

function* archiveUserSaga({ payload }: ReturnType<typeof archiveUser>) {
  try {
    const { id, fetchData } = payload;
    const { data, errors }: ResponseObj<Partial<User>> = yield call(
      request,
      'PUT',
      apiArchiveUser(id),
    );

    if (errors) {
      return false;
    }

    yield put(archiveUserSuccess());
    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'User Archived!',
      }),
    );
    yield call(fetchData);
  } catch (error) {
    console.error(
      'error from resendInviteSaga function in UserAccessSaga :: ',
      error,
    );
    yield put(archiveUserError(error));
  }
}

function* unArchiveUserSaga({ payload }: ReturnType<typeof unArchiveUser>) {
  try {
    const { id, fetchData } = payload;
    const { data, errors }: ResponseObj<Partial<User>> = yield call(
      request,
      'PUT',
      apiUnArchiveUser(id),
    );

    if (errors) {
      return false;
    }

    yield put(unArchiveUserSuccess());
    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'User Unarchived !!',
      }),
    );
    yield call(fetchData);
  } catch (error) {
    console.error(
      'error from unArchiveUserSaga function in UserAccessSaga :: ',
      error,
    );
    yield put(unArchiveUserError(error));
  }
}

function* unLockUserSaga({ payload }: ReturnType<typeof unLockUser>) {
  try {
    const { id, fetchData } = payload;
    const { data, errors }: ResponseObj<Partial<User>> = yield call(
      request,
      'PUT',
      apiUnLockUser(id),
    );

    if (errors) {
      return false;
    }

    yield put(unLockUserSuccess());
    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'User Unblocked !!',
      }),
    );
    yield call(fetchData);
  } catch (error) {
    console.error(
      'error from unLockUserSaga function in UserAccessSaga :: ',
      error,
    );
    yield put(unLockUserError(error));
  }
}

function* addUserSaga({ payload }: ReturnType<typeof addUser>) {
  try {
    const { data, errors }: ResponseObj<Partial<User>> = yield call(
      request,
      'POST',
      apiGetUsers(),
      {
        data: payload,
      },
    );

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
  yield takeLatest(UserAccessAction.CANCEL_INVITE, cancelInviteSaga);
  yield takeLatest(UserAccessAction.ARCHIVE_USER, archiveUserSaga);
  yield takeLatest(UserAccessAction.UNARCHIVE_USER, unArchiveUserSaga);
  yield takeLatest(UserAccessAction.UNLOCK_USER, unLockUserSaga);
  yield takeLatest(UserAccessAction.ADD_USER, addUserSaga);
}
