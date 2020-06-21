import { Stage } from '../StagesView/types';
import { Step } from './StepView/types';

export interface StepsViewProps {
  steps: Step[];
  activeStage: number;
  stage: Stage;
}
