import { Stage } from '../StageListView/types';

export interface StepListViewProps {
  formStages: Stage[];
  activeStageIndex: number;
  stages: Stage[];
}
