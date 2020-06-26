import { RootState } from '#store';
import { takeLatest, select, call } from 'redux-saga/effects';
import { apiExecuteIntearction } from '../../../../../../utils/apiUrls';
import { request } from '#utils/request';

import {
  InteractionActions,
  InteractionActionType,
  InteractionType,
} from './types';

function* updateInteraction({ payload }: InteractionActionType) {
  console.log('action frmo interactionViewSaga :: ', payload);
}

export function* executeInteraction({ payload }: InteractionActionType) {
  try {
    console.log('execute Interaction saga with payload :: ', payload);

    switch (payload?.interaction.type) {
      case InteractionType.MATERIAL:
      case InteractionType.INSTRUCTION:
        // const result = yield call(
        //   request,
        //   'POST',
        //   apiExecuteIntearction(interaction.id),
        // );

        // console.log('result :: ', result);
        console.log('make api call for material/instruction interaction');

        break;

      case InteractionType.YESNO:
      case InteractionType.CHECKLIST:
        console.log('make api call for checklist/yes-no interaction');

        const values = payload?.interaction.data.reduce((acc, el) => {
          acc.push(el.value);
          return acc;
        }, []);

        yield call(
          request,
          'POST',
          apiExecuteIntearction(payload?.interaction?.id),
          { data: { values } },
        );
        break;

      case InteractionType.SHOULDBE:
        console.log('make api call for shouldbe interaction');
        break;

      case InteractionType.TEXTBOX:
        console.log('make api call for textbox interaction');

        yield call(
          request,
          'POST',
          apiExecuteIntearction(payload?.interaction?.id),
          { data: { values: [payload?.interaction?.data?.text] } },
        );
        break;

      case InteractionType.SIGNATURE:
        console.log('make api call for sugnature interaction');
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
