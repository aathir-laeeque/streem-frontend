import { Media, Task as TaskType, Stage } from '../checklist.types';

type Task = TaskType & { hasError: boolean; errorMessage?: string };

export type TasksById = Record<Task['id'], Task>;
export type TasksOrderInStage = Record<Stage['id'], Task['id'][]>;

export type TaskViewProps = {
  isActive: boolean;
  task: Task;
  enableStopForTask: boolean;
};

export type TaskCardProps = TaskViewProps;

export type MediaCardProps = {
  medias: Media[];
  isTaskActive: boolean;
};

export enum TaskAction {
  START = 'start',
  COMPLETE = 'complete',
  SKIP = 'skip',
  COMPLETE_WITH_EXCEPTION = 'complete-with-exception',
}

export enum TaskErrors {
  E201 = 'TASK_INCOMPLETE',
  E202 = 'TASK_NOT_FOUND',
}

export enum TaskSignOffError {
  E215 = 'TASK_NOT_SIGNNED',
}
