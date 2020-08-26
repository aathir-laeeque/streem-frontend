import { Task } from '../../checklist.types';

export interface TaskViewProps {
  task: Task;
}

export interface HeaderProps {
  task: Task;
  isEditingTemplate: boolean;
}

export interface FooterProps {
  isEditingtemplate: boolean;
}
