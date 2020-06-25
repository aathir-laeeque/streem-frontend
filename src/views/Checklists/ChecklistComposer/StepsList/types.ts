import { setActiveStep } from './actions';

export enum StepsListActions {
  SET_ACTIVE_STEP = '@@steps_list/SET_ACTIVE_STEP',
}

export type StepsListActionType = ReturnType<typeof setActiveStep>;
