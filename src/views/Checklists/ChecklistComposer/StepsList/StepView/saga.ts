import { RootState } from '#store';
import { all, put, select, takeLatest } from 'redux-saga/effects';

import { executeInteraction } from './InteractionView/actions';
import { Interaction } from './InteractionView/types';
import { Step, StepViewActions, StepViewActionType } from './types';

function* updateStep(action: StepViewActionType) {
  console.log('action from stepViewSaga :: ', action);
}

function* completeStep({ payload }: StepViewActionType) {
  console.log('come to complete step with payload :: ', payload);

  try {
    console.log(
      'verify that all the interactions have values. If not show error on the UI',
    );

    // const { interactions } = yield select((state: RootState) =>
    //   (state?.checklistComposer.steps as Array<Step>).find(
    //     (el) => el.id === payload?.id,
    //   ),
    // );

    // console.log('interactions :: ', interactions);

    // yield all(
    //   (interactions as Array<Interaction>).map((interaction) =>
    //     put(executeInteraction(interaction)),
    //   ),
    // );
  } catch (error) {
    console.error('error while executing step :: ', error);
  }
}

export function* StepViewSaga() {
  yield takeLatest(StepViewActions.UPDATE_STEP, updateStep);
  yield takeLatest(StepViewActions.COMPLETE_STEP, completeStep);
}
