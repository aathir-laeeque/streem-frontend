import { Media, Task as TaskType, Stage } from '../checklist.types';

type Task = TaskType & { hasError: boolean; errorMessage?: string };

export type TasksById = Record<Task['id'], Task>;
export type TasksOrderInStage = Record<Stage['id'], Task['id'][]>;

export type TaskViewProps = {
  isActive: boolean;
  task: Task;
  enableStopForTask: boolean;
  overviewOpen: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
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

export enum CompletedTaskErrors {
  E212 = 'TASK_NOT_IN_PROGRESS',
  E213 = 'TASK_ALREADY_COMPLETED',
  E214 = 'TASK_NOT_ENABLED_FOR_CORRECTION',
  E224 = 'TASK_ALREADY_IN_PROGRESS',
  E450 = 'PARAMETER_DATA_INCONSISTENT',
}

export enum TaskSignOffError {
  E215 = 'TASK_NOT_SIGNNED',
}
