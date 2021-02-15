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
  archiveUser,
  unArchiveUser,
  addUser,
  unLockUser,
  cancelInvite,
} from './actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { UserAccessAction } from './types';
import { fetchSelectedUserSuccess } from '#store/users/actions';

function* resendInviteSaga({ payload }: ReturnType<typeof resendInvite>) {
  try {
    const { id } = payload;
    const { errors }: ResponseObj<Partial<User>> = yield call(
      request,
      'PUT',
      apiResendInvite(id),
    );

    if (errors) {
      throw errors?.[0]?.message || '';
    }

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
    yield put(
      showNotification({
        type: NotificationType.ERROR,
        msg: error || 'Please try again later.',
      }),
    );
  }
}

function* cancelInviteSaga({ payload }: ReturnType<typeof cancelInvite>) {
  try {
    const { id, fetchData } = payload;
    const { data, errors }: ResponseObj<User> = yield call(
      request,
      'PUT',
      apiCancelInvite(id),
    );

    if (errors) {
      throw errors?.[0]?.message || '';
    }

    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'Invite Canceled Successfully.',
      }),
    );
    if (fetchData) {
      yield call(fetchData);
    } else {
      yield put(fetchSelectedUserSuccess({ data }));
    }
  } catch (error) {
    console.error(
      'error from cancelInviteSaga function in UserAccessSaga :: ',
      error,
    );
    yield put(
      showNotification({
        type: NotificationType.ERROR,
        msg: error || 'Please try again later.',
      }),
    );
  }
}

function* archiveUserSaga({ payload }: ReturnType<typeof archiveUser>) {
  try {
    const { id, fetchData } = payload;
    const { data, errors }: ResponseObj<User> = yield call(
      request,
      'PUT',
      apiArchiveUser(id),
    );

    if (errors) {
      throw errors?.[0]?.message || '';
    }

    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'User Archived!',
      }),
    );
    if (fetchData) {
      yield call(fetchData);
    } else {
      yield put(fetchSelectedUserSuccess({ data }));
    }
  } catch (error) {
    console.error(
      'error from archiveUserSaga function in UserAccessSaga :: ',
      error,
    );
    yield put(
      showNotification({
        type: NotificationType.ERROR,
        msg: error || 'Please try again later.',
      }),
    );
  }
}

function* unArchiveUserSaga({ payload }: ReturnType<typeof unArchiveUser>) {
  try {
    const { id, fetchData } = payload;
    const { data, errors }: ResponseObj<User> = yield call(
      request,
      'PUT',
      apiUnArchiveUser(id),
    );

    if (errors) {
      throw errors?.[0]?.message || '';
    }

    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'User Unarchived !!',
      }),
    );
    if (fetchData) {
      yield call(fetchData);
    } else {
      yield put(fetchSelectedUserSuccess({ data }));
    }
  } catch (error) {
    console.error(
      'error from unArchiveUserSaga function in UserAccessSaga :: ',
      error,
    );
    yield put(
      showNotification({
        type: NotificationType.ERROR,
        msg: error || 'Please try again later.',
      }),
    );
  }
}

function* unLockUserSaga({ payload }: ReturnType<typeof unLockUser>) {
  try {
    const { id, fetchData } = payload;
    const { data, errors }: ResponseObj<User> = yield call(
      request,
      'PUT',
      apiUnLockUser(id),
    );

    if (errors) {
      throw errors?.[0]?.message || '';
    }

    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'User Unblocked !!',
      }),
    );
    if (fetchData) {
      yield call(fetchData);
    } else {
      yield put(fetchSelectedUserSuccess({ data }));
    }
  } catch (error) {
    console.error(
      'error from unLockUserSaga function in UserAccessSaga :: ',
      error,
    );
    yield put(
      showNotification({
        type: NotificationType.ERROR,
        msg: error || 'Please try again later.',
      }),
    );
  }
}

function* addUserSaga({ payload }: ReturnType<typeof addUser>) {
  try {
    const { errors }: ResponseObj<Partial<User>> = yield call(
      request,
      'POST',
      apiGetUsers(),
      {
        data: payload,
      },
    );

    if (errors) {
      throw errors?.[0]?.message || '';
    }

    navigate(-1);
    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'User Added Successfully.',
      }),
    );
  } catch (error) {
    console.error(
      'error from addUserSaga function in UserAccessSaga :: ',
      error,
    );
    yield put(
      showNotification({
        type: NotificationType.ERROR,
        msg: error || 'Please try again later.',
      }),
    );
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
