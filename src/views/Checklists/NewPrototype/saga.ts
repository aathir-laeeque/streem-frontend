import { apiCreateNewPrototype } from '#utils/apiUrls';
import { request } from '#utils/request';
import { call, takeLatest } from 'redux-saga/effects';
import { navigate } from '@reach/router';

import { createNewPrototype } from './actions';
import { NewPrototypeActions } from './types';

function* createPrototypeSaga({
  payload,
}: ReturnType<typeof createNewPrototype>) {
  try {
    const { data } = payload;

    console.log('data from new prototype saga :: ', data);

    const { data: response, errors } = yield call(
      request,
      'POST',
      apiCreateNewPrototype(),
      { data: { ...data, facilityId: 1 } }, // TODO: change this facility Id to fetch from reducer
    );

    if (response) {
      console.log('response from the api :: ', response);
      navigate(`/checklists/${response.id}`);
    } else {
      console.error('error from the create checklist api  :: ', errors);
    }
  } catch (error) {
    console.error(
      'error came in createPrototypeSaga in NewPrototypeSaga :: ',
      error,
    );
  }
}

export function* NewPrototypeSaga() {
  yield takeLatest(
    NewPrototypeActions.CREATE_NEW_PROTOTYPE,
    createPrototypeSaga,
  );
}
