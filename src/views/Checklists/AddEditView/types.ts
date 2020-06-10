import { RouteComponentProps } from '@reach/router';

import { Stage } from '../types';

export interface AddEditViewProps extends RouteComponentProps {
  checklistId?: string | number;
}

export interface StepsViewProps {
  stageNumber: number;
}

export interface StageListView {
  stages: Stage[];
  activeStage: number;
  setActiveStage: (stageNumber: number) => void;
}
