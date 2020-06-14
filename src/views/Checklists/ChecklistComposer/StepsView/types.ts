import { Stage } from '../StagesView/types';
import { Interaction } from './InteractionsView/types';
import { StepMedia } from './StepMedia/types';

export interface Step {
  id: number;
  name: string;
  code: string;
  hasStop: boolean;
  interactions: Interaction[];
  medias: StepMedia[];
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
