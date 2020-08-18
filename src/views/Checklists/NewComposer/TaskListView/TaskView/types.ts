import { Task } from '../../checklist.types';

export interface TaskViewProps {
  isActive: boolean;
  task: Task;
}

export interface HeaderProps {
  task: Task;
}
