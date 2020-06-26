import { actionSpreader } from '#store';

import { Step, StepViewActions } from './types';

export const updateStep = (step: Partial<Step>) =>
  actionSpreader(StepViewActions.UPDATE_STEP, {
    ...(step.hasOwnProperty('hasStop') && { hasStop: step.hasStop }),
    ...(step.hasOwnProperty('timed') && { timed: step.timed }),
    ...(step.hasOwnProperty('name') && { name: step.name }),
  });

export const completeStep = (step: Partial<Step>) =>
  actionSpreader(StepViewActions.COMPLETE_STEP, { id: step.id });
