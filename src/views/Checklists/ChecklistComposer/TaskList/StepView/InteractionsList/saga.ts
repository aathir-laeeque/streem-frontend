import { RootState } from '#store';
import { put, select, takeLatest } from 'redux-saga/effects';

import { updateInteractionInRedux } from './actions';
import { Interaction, InteractionAction, InteractionActionType } from './types';

function* updateInteractionSaga({ payload }: InteractionActionType) {
  console.log('payload from updateInteractionSaga :: ', payload);

  try {
    const interaction = yield select(
      (state: RootState) =>
        state.checklist.composer.steps[state.checklist.composer.activeStepIndex]
          .interactions[payload?.index],
    );

    const updatedInteraction: Interaction = {
      ...interaction,
      ...payload?.data,
    };
    yield put(updateInteractionInRedux(updatedInteraction, payload?.index));
    // TODO make api call here to save the data in the BE
  } catch (error) {
    console.error('error in updateInteractionSaga :: ', error);
  }
}

export function* InteractionSaga() {
  yield takeLatest(InteractionAction.UPDATE_INTERACTION, updateInteractionSaga);
}
