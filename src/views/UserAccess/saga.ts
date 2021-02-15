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
import { getErrorMsg, handleCatch, request } from '#utils/request';
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
      'PATCH',
      apiResendInvite(id),
    );

    if (errors) {
      throw getErrorMsg(errors);
    }

    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'Invite Resent Successfully.',
      }),
    );
  } catch (error) {
    yield* handleCatch('UserAccess', 'resendInviteSaga', error, true);
  }
}

function* cancelInviteSaga({ payload }: ReturnType<typeof cancelInvite>) {
  try {
    const { id, fetchData } = payload;
    const { data, errors }: ResponseObj<User> = yield call(
      request,
      'PATCH',
      apiCancelInvite(id),
    );

    if (errors) {
      throw getErrorMsg(errors);
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
    yield* handleCatch('UserAccess', 'cancelInviteSaga', error, true);
  }
}

function* archiveUserSaga({ payload }: ReturnType<typeof archiveUser>) {
  try {
    const { id, fetchData } = payload;
    const { data, errors }: ResponseObj<User> = yield call(
      request,
      'PATCH',
      apiArchiveUser(id),
    );

    if (errors) {
      throw getErrorMsg(errors);
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
    yield* handleCatch('UserAccess', 'archiveUserSaga', error, true);
  }
}

function* unArchiveUserSaga({ payload }: ReturnType<typeof unArchiveUser>) {
  try {
    const { id, fetchData } = payload;
    const { data, errors }: ResponseObj<User> = yield call(
      request,
      'PATCH',
      apiUnArchiveUser(id),
    );

    if (errors) {
      throw getErrorMsg(errors);
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
    yield* handleCatch('UserAccess', 'unArchiveUserSaga', error, true);
  }
}

function* unLockUserSaga({ payload }: ReturnType<typeof unLockUser>) {
  try {
    const { id, fetchData } = payload;
    const { data, errors }: ResponseObj<User> = yield call(
      request,
      'PATCH',
      apiUnLockUser(id),
    );

    if (errors) {
      throw getErrorMsg(errors);
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
    yield* handleCatch('UserAccess', 'unLockUserSaga', error, true);
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
      throw getErrorMsg(errors);
    }

    navigate(-1);
    yield put(
      showNotification({
        type: NotificationType.SUCCESS,
        msg: 'User Added Successfully.',
      }),
    );
  } catch (error) {
    yield* handleCatch('UserAccess', 'addUserSaga', error, true);
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
