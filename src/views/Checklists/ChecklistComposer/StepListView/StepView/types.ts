import { Media } from './StepMedia/types';
import { Interaction } from './InteractionsView/types';

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
  stageNumber: number;
  stepIndex: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  step: Step;
  active: boolean;
  onClick: () => void;
}
