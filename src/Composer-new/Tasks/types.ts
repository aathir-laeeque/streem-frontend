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
