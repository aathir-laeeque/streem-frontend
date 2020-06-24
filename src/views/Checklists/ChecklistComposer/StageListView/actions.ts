import { actionSpreader } from '#store';
import { StageListViewAction } from './types';

export const setActiveStage = (index: number) =>
  actionSpreader(StageListViewAction.SET_ACTIVE_STAGE, { index });
