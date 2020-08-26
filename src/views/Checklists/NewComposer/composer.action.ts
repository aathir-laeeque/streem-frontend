import { actionSpreader } from '#store';

import { Job } from '../../Jobs/types';
import { Checklist } from './checklist.types';
import { ComposerAction, ComposerState } from './composer.types';

export const fetchComposerData = (
  id: Checklist['id'] | Job['id'],
  type: string,
) => actionSpreader(ComposerAction.FETCH_COMPOSER_DATA, { id, type });

export const fetchComposerDataOngoing = () =>
  actionSpreader(ComposerAction.FETCH_COMPOSER_DATA_ONGOING);

export const fetchComposerDataSuccess = (checklist: Checklist) =>
  actionSpreader(ComposerAction.FETCH_COMPOSER_DATA_SUCCESS, { checklist });

export const fetchComposerDataError = (error: any) =>
  actionSpreader(ComposerAction.FETCH_COMPOSER_DATA_ERROR, { error });

export const setComposerState = (state: ComposerState) =>
  actionSpreader(ComposerAction.SET_COMPOSER_STATE, { state });

export const resetComposer = () =>
  actionSpreader(ComposerAction.RESET_COMPOSER);
