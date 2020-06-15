import { Stage } from '../StagesView/types';
import { Interaction } from './InteractionsView/types';
import { StepMedia } from './StepMedia/types';

export interface Timed {
  id: number;
  operator: string;
  value: string;
  unit: string;
}

export interface Step {
  id: number;
  name: string;
  code: string;
  hasStop: boolean;
  hasTimed: boolean;
  interactions: Interaction[];
  medias: StepMedia[];
  timed: Timed;
}

export interface StepsViewProps {
  steps: Step[];
  activeStage: number;
  stage: Stage;
}

export interface StepViewProps {
  stepNumber: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  step: Step;
  active: boolean;
  onClick: () => void;
}
