import { FileUploadData, Error } from '#utils/globalTypes';
import {
  Activity,
  Checklist,
  Stage,
  Task as TaskType,
} from '../checklist.types';

export type Task = TaskType & {
  errors: Error[];
};

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
  taskId?: Task['id'];
  activityId: Activity['id'];
  isActivity?: boolean;
};

export type AddNewTaskType = {
  checklistId: Checklist['id'];
  stageId: Stage['id'];
};

export type SetTaskTimerType = {
  maxPeriod: number;
  minPeriod?: number;
  taskId: Task['id'];
  timerOperator: string;
};

export type MediaDetails = FileUploadData & {
  name: string;
  description?: string;
  id: string;
};

export type AddMediaType = {
  mediaDetails: MediaDetails;
  taskId: Task['id'];
};

export type UpdateMediaType = {
  taskId: Task['id'];
  activityId: Activity['id'];
  mediaId: MediaDetails['mediaId'];
  mediaDetails: Pick<MediaDetails, 'name' | 'description'>;
};

export enum TaskErrors {
  E210 = 'TASK_NAME_CANNOT_BE_EMPTY',
  E211 = 'TASK_SHOULD_HAVE_ATLEAST_ONE_EXECUTABLE_ACTIVITY',
}

export enum TaskTimerErrorCodes {
  E217 = 'TIMED_TASK_LT_TIMER_CANNOT_BE_ZERO',
  E218 = 'TIMED_TASK_NLT_MIN_PERIOD_CANNOT_BE_ZERO',
  E219 = 'TIMED_TASK_NLT_MAX_PERIOD_SHOULD_BE_GT_MIN_PERIOD',
}
