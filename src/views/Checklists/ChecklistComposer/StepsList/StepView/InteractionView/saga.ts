import { takeLatest } from 'redux-saga/effects';

import { InteractionActions, InteractionActionType } from './types';

function* updateInteraction({ payload }: InteractionActionType) {
  console.log('action frmo interactionViewSaga :: ', payload);
}

export function* IntearctionViewSaga() {
  yield takeLatest(InteractionActions.UPDATE_INTERACTIONS, updateInteraction);
}
