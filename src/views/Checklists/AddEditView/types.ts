import { RouteComponentProps } from '@reach/router';

import { Stage } from '../types';

export interface AddEditViewProps extends RouteComponentProps {
  checklistId?: string | number;
}

export interface StepsViewProps {
  stageNumber?: number;
  stage: Stage | null;
}

export interface StageListViewProps {
  stages: Stage[];
  activeStage: Stage | null;
  setActiveStage: (stage: Stage) => void;
}
