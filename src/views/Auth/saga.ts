import { apiGetChecklists } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { login, refreshToken, loginSuccess, loginError } from './actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { AuthAction } from './types';

function* loginSaga({ payload }: ReturnType<typeof login>) {
  try {
    console.log('payload in saga', payload);
    // const { data, pageable }: ResponseObj<Checklist> = yield call(
    //   request,
    //   'GET',
    //   apiGetChecklists(),
    //   { params },
    // );

    // yield put(loginSuccess({ data, pageable }));
  } catch (error) {
    console.error('error from loginSaga function in Auth :: ', error);
    yield put(loginError(error));
  }
}

export function* AuthSaga() {
  yield takeLatest(AuthAction.LOGIN, loginSaga);
}
