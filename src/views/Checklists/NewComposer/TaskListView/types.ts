import { Activity, Task } from '../checklist.types';
import { ComposerActionType } from '../composer.types';
import { setTaskActive, setTasks } from './actions';
import { ActivityListActionType } from './TaskView/ActivityListView/types';

export interface TaskListViewState {
  activeActivityId?: Activity['id'];
  activeTaskId?: Task['id'];

  list: Task[] | [];
  listById: Record<Task['id'], Task>;
}

export enum TaskListAction {
  SET_TASKS = '@@composer/task_list/SET_TASKS',
  SET_ACTIVE_TASK = '@@composer/task_list/SET_ACTIVE_TASK',
}

export type SetActiveTaskArguments = Task['id'];

export type TaskListViewActionType =
  | ReturnType<typeof setTasks>
  | ReturnType<typeof setTaskActive>
  | ActivityListActionType
  | ComposerActionType;
