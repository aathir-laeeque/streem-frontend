import { FileUploadData, Error } from '#utils/globalTypes';
import { Checklist, Stage, Task as TaskType } from '../checklist.types';

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
  mediaId: MediaDetails['id'];
  mediaDetails: Pick<MediaDetails, 'name' | 'description'>;
};

export enum TaskErrors {
  E209 = 'INVALID_TIMED_TASK_CONFIG',
  E210 = 'TASK_NAME_CANNOT_BE_EMPTY',
  E211 = 'TASK_SHOULD_HAVE_ATLEAST_ONE_EXECUTABLE_ACTIVITY',
}
