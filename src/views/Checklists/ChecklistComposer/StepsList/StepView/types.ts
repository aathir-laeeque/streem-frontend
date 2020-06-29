import { setActiveStep } from './actions';
import { Interaction } from './InteractionsList/types';
import { Media } from './Media/types';

export interface Timer {
  id: number;
  operator: string;
  value: string;
  unit: string;
}

export interface Step {
  id: number;
  name: string;
  code: string;
  orderTree: number;
  hasStop: boolean;
  interactions: Interaction[];
  medias: Media[];
  timed: boolean;
  timer?: Timer;
}

export interface StepHeaderProps {
  step: Step;
}

export enum StepViewAction {
  SET_ACTIVE_STEP = '@@checklist/composer/step_view/SET_ACTIVE_STEP',
  UPDATE_STEP = '@@checklist/composer/step_view/UPDATE_STEP',
}

export type StepViewActionType = ReturnType<typeof setActiveStep>;
