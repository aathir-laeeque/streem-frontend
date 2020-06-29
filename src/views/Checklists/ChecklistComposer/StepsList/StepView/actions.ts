import { actionSpreader } from '#store';

import { StepViewAction, Step } from './types';

export const setActiveStep = (index: number) =>
  actionSpreader(StepViewAction.SET_ACTIVE_STEP, { index });

export const updateStep = (step: Partial<Step>) =>
  actionSpreader(StepViewAction.UPDATE_STEP, { ...step });
