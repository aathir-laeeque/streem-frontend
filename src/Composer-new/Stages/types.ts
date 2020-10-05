import { Stage } from '../checklist.types';

export type StageCardProps = {
  index: number;
  isActive: boolean;
  isFirstItem: boolean;
  isLastItem: boolean;
  stage: Stage;
};

export type ReOrderArgs = {
  from: number;
  id: Stage['id'];
  to: number;
};
