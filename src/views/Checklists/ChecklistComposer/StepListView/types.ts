import { Stage } from '../StageListView/types';
import { Step } from './StepView/types';

export interface StepsViewProps {
  steps: Step[];
  activeStage: number;
  stage: Stage;
}

export interface StepListViewProps {
  steps: Step[];
  activeStage: number;
  stageName: string;
}
