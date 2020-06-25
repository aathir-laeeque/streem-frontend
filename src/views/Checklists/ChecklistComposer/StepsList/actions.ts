import { actionSpreader } from '#store';
import { StepsListActions } from './types';

export const setActiveStep = (index: number) =>
  actionSpreader(StepsListActions.SET_ACTIVE_STEP, { index });
