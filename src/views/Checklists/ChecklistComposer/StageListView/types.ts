import { Step } from '../StepListView/StepView/types';

export interface Stage {
  id: number;
  name: string;
  code: string;
  orderTree: number;
  steps: Step[];
}

export interface StageListViewProps {
  stages: Stage[] | [];
  activeStage: number;
  setActiveStage: (index: number) => void;
}
