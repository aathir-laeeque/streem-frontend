import { FileUploadData, Error } from '#utils/globalTypes';
import { Parameter, Checklist, Stage, Task as TaskType } from '../checklist.types';
import { ScheduledTaskCondition, ScheduledTaskType } from '#types';

export type Task = TaskType & {
  stageId: Stage['id'];
  errors: Error[];
};

export type TaskCardProps = {
  index: number;
  task: Task;
  isActive: boolean;
};

export type TaskCardWrapperProps = {
  hasMedias: boolean;
  hasStop: boolean;
  isTimed: boolean;
  isActive: boolean;
  isReadOnly: boolean;
  enableScheduling: boolean;
  enableRecurrence: boolean;
  taskConditions: number;
};

export type TaskMediasProps = {
  medias: Task['medias'];
  taskId?: Task['id'];
  parameterId?: Parameter['id'];
  isParameter?: boolean;
  isTaskCompleted?: boolean;
  isCorrectingError?: boolean;
  execute?: (data: MediaDetails, isDeleting?: boolean) => void;
};

export type AddNewTaskType = {
  checklistId: Checklist['id'];
  stageId: Stage['id'];
  orderTree?: number;
  type?: string;
  data?: Record<string, string>;
  name?: string;
};

export type SetTaskTimerType = {
  maxPeriod: number;
  minPeriod?: number;
  taskId: Task['id'];
  timerOperator: string;
};

export type SetTaskRecurrenceType = {
  taskId: Task['id'];
  startDateDuration: Record<string, number>;
  startDateInterval: number;
  dueDateDuration: Record<string, number>;
  dueDateInterval: number;
};

export type SetTaskScheduleType = {
  taskId: Task['id'];
  type: ScheduledTaskType;
  condition: ScheduledTaskCondition;
  referencedTaskId: string | null;
  scheduledTaskId: string;
  startDateDuration: Record<string, number>;
  startDateInterval: number;
  dueDateDuration: Record<string, number>;
  dueDateInterval: number;
};

export type MediaDetails = FileUploadData & {
  name: string;
  description?: string;
  id?: string;
};

export type AddMediaType = {
  mediaDetails: MediaDetails;
  taskId: Task['id'];
};

export type UpdateMediaType = {
  taskId: Task['id'];
  parameterId: Parameter['id'];
  mediaId: MediaDetails['mediaId'];
  mediaDetails: Pick<MediaDetails, 'name' | 'description'>;
};

export type AddActionType = {
  action: any;
  taskId: Task['id'];
};

export type UpdateActionType = {
  taskId: Task['id'];
  action: any;
  actionId: string;
};

export type ArchiveActionType = {
  taskId: Task['id'];
  actionId: string;
  setFormErrors: (errors?: Error[]) => void;
};

export enum TaskErrors {
  E210 = 'TASK_NAME_CANNOT_BE_EMPTY',
  E211 = 'TASK_SHOULD_HAVE_ATLEAST_ONE_EXECUTABLE_PARAMETER',
  E225 = 'TASK_AUTOMATION_INVALID_MAPPED_PARAMETERS',
}

export enum TaskTimerErrorCodes {
  E217 = 'TIMED_TASK_LT_TIMER_CANNOT_BE_ZERO',
  E218 = 'TIMED_TASK_NLT_MIN_PERIOD_CANNOT_BE_ZERO',
  E219 = 'TIMED_TASK_NLT_MAX_PERIOD_SHOULD_BE_GT_MIN_PERIOD',
}

export enum TaskTypeEnum {
  DYNAMIC = 'DYNAMIC',
  SUBPROCESS = 'SUBPROCESS',
  STATIC = 'STATIC',
}
