import { FileUploadData } from '#utils/globalTypes';
import { Checklist, Stage, Task } from '../checklist.types';

export type TaskCardProps = {
  index: number;
  task: Task;
};

export type TaskCardWrapperProps = {
  hasMedias: boolean;
  hasStop: boolean;
  isTimed: boolean;
};

export type TaskMediasProps = {
  medias: Task['medias'];
  taskId: Task['id'];
};

export type AddNewTaskArgs = {
  checklistId: Checklist['id'];
  stageId: Stage['id'];
};

export type SetTaskTimerArgs = {
  maxPeriod: number;
  minPeriod?: number;
  taskId: Task['id'];
  timerOperator: string;
};

export type MediaDetails = FileUploadData & {
  name: string;
  description?: string;
};

export type AddMediaArgs = {
  mediaDetails: MediaDetails;
  taskId: Task['id'];
};

export enum TaskErrors {
  E210 = 'TASK_NAME_CANNOT_BE_EMPTY',
  E211 = 'TASK_SHOULD_HAVE_ATLEAST_ONE_EXECUTABLE_ACTIVITY',
}
