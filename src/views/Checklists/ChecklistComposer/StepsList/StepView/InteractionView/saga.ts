import { RootState } from '#store';
import { takeLatest, select, call, put } from 'redux-saga/effects';
import { apiExecuteIntearction } from '#utils/apiUrls';
import { request } from '#utils/request';

import {
  InteractionActions,
  InteractionActionType,
  InteractionType,
} from './types';

import { executeInteraction as executeInteractionAction } from './actions';

function* updateInteraction({ payload }: InteractionActionType) {
  try {
    const interaction = yield select(
      (state: RootState) =>
        state.checklistComposer.steps[state.checklistComposer.activeStepIndex]
          .interactions[payload?.interactionIndex],
    );

    switch (interaction.type) {
      case InteractionType.CHECKLIST:
      case InteractionType.SHOULDBE:
      case InteractionType.TEXTBOX:
      case InteractionType.SIGNATURE:
        yield put(executeInteractionAction(interaction, payload?.interaction));
        break;

      default:
        return null;
    }
  } catch (error) {
    console.error('error in the updateInteraction saaga :: ', error);
  }
}

export function* executeInteraction({ payload }: InteractionActionType) {
  try {
    switch (payload?.interaction.type) {
      // No need to execute the interaction
      // case InteractionType.MATERIAL:
      // case InteractionType.INSTRUCTION:
      //   console.log('make api call for material/instruction interaction');
      //   console.log('make body from this payload :: ', payload);
      //   console.log('+++++++++++++++++++++++++++++++');
      //   break;

      // This is interaction is directly executed
      case InteractionType.YESNO:
        console.log('make api call for yes-no interaction');
        console.log('make body from this payload :: ', payload);
        console.log('+++++++++++++++++++++++++++++++');
        break;

      case InteractionType.CHECKLIST:
        console.log('make api call for checklist/yes-no interaction');
        console.log('make body from this payload :: ', payload);
        console.log('+++++++++++++++++++++++++++++++');
        break;

      case InteractionType.SHOULDBE:
        console.log('make api call for shouldbe interaction');
        console.log('make body from this payload :: ', payload);
        console.log('+++++++++++++++++++++++++++++++');
        break;

      case InteractionType.TEXTBOX:
        console.log('make api call for textbox interaction');
        console.log('make body from this payload :: ', payload);
        console.log('+++++++++++++++++++++++++++++++');
        break;

      case InteractionType.SIGNATURE:
        console.log('make api call for signature interaction');
        console.log('make body from this payload :: ', payload);
        console.log('+++++++++++++++++++++++++++++++');
        break;

      default:
        return null;
    }
  } catch (error) {
    console.error('error in executeInteraction saga :: ', error);
  }
}

export function* IntearctionViewSaga() {
  yield takeLatest(InteractionActions.UPDATE_INTERACTIONS, updateInteraction);
  yield takeLatest(InteractionActions.EXECUTE_INTERACTION, executeInteraction);
}
