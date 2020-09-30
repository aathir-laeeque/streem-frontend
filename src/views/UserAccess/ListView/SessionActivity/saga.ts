import { apiGetSessionActivitys } from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { call, put, takeLatest } from 'redux-saga/effects';
import moment from 'moment';
// import _ from 'lodash';
import { SessionActivity } from './types';
import {
  fetchSessionActivitysError,
  fetchSessionActivitysOngoing,
  fetchSessionActivitysSuccess,
  fetchSessionActivitys,
} from './actions';
import { SessionActivityAction } from './types';

function* fetchSessionActivitysSaga({
  payload,
}: ReturnType<typeof fetchSessionActivitys>) {
  try {
    const params = payload || {};
    let currentPage = parseInt(params.page.toString());
    delete params.page;
    if (currentPage === 0) {
      yield put(fetchSessionActivitysOngoing());
    } else {
      currentPage++;
    }

    const {
      data,
      pageable,
      errors,
    }: ResponseObj<SessionActivity> = yield call(
      request,
      'GET',
      apiGetSessionActivitys(),
      { params },
    );

    if (errors || !pageable) {
      throw new Error(errors[0].message);
    }

    // TODO :: After API starts working, Check if the code below works and put in store after parsing here and remove parsing from index.html.

    // const temp = _(data)
    //   .map((el) => ({
    //     ...el,
    //     triggeredOn: moment(el.triggeredAt).format('YYYY-MM-DD'),
    //   }))
    //   .groupBy('triggeredOn')
    //   .forEach((value, key) => ({ [key]: value, id: key }));

    // console.log('temp', temp);

    const newData = data.map((el) => ({
      ...el,
      triggeredOn: moment(el.triggeredAt).format('YYYY-MM-DD'),
    }));

    yield put(
      fetchSessionActivitysSuccess({
        data: newData,
        pageable: {
          ...pageable,
          page: currentPage,
          last: newData.length > 0 ? false : true,
        },
      }),
    );
  } catch (error) {
    console.error(
      'error from fetchSessionActivitysSaga function in SessionActivitySaga :: ',
      error,
    );
    yield put(fetchSessionActivitysError(error));
  }
}

export function* SessionActivitySaga() {
  yield takeLatest(
    SessionActivityAction.FETCH_SESSION_ACTIVITY,
    fetchSessionActivitysSaga,
  );
}
