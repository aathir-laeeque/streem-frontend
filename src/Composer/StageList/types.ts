import { Stage } from '../checklist.types';

// removes tasks from stages
export type StagesById = Record<Stage['id'], Stage>;
export type StagesOrder = Stage['id'][];

export type StageCardProps = {
  isActive: boolean;
  stage: Stage;
};

export enum StageErrors {
  E301 = 'STAGE_INCOMPLETE',
}
