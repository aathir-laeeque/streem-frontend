import { Error } from '#utils/globalTypes';
import { Stage as StageType } from '../checklist.types';

export type Stage = StageType & {
  errors: Error[];
};

export type StageCardProps = {
  index: number;
  isActive: boolean;
  isFirstItem: boolean;
  isLastItem: boolean;
  stage: Stage;
};

export type ReOrderType = {
  from: number;
  id: Stage['id'];
  to: number;
};

export enum StageErrors {
  E303 = 'STAGE_NAME_CANNOT_BE_EMPTY',
  E128 = 'STAGE_MUST_CONTAIN_ATLEAST_ONE_TASK'
}
