import { Step } from '../StepsView/types';

export interface Stage {
  id: number;
  name: string;
  code: string;
  steps: Step[];
}

export interface StagesViewProps {
  stages: Stage[];
  activeStage: number;
  setActiveStage: (index: number) => void;
}
