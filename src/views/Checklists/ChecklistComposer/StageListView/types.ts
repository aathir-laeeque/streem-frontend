import { Step } from '../StepListView/StepView/types';
import { setActiveStage } from './actions';

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

export enum StageListViewAction {
  SET_ACTIVE_STAGE = '@@checklist/composer/stage_list/SET_ACTIVE_STAGE',
}

export type StageListViewActionType = ReturnType<typeof setActiveStage>;
