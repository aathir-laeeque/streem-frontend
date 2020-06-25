import { updateStep } from './actions';
import { Interaction } from './InteractionView/types';
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

export interface StepViewProps {
  step: Step;
  stepIndex: number;
}

export enum StepViewActions {
  UPDATE_STEP = '@@step_view/UPDATE_STEP',
}

export type StepViewActionType = ReturnType<typeof updateStep>;
