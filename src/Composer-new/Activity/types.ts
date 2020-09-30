import {
  Activity,
  ActivityType,
  Checklist,
  Stage,
  Task,
} from '../checklist.types';

export type ActivityProps = {
  activity: Activity;
  taskId: Task['id'];
};

export type AddNewActivityArgs = {
  activityType: ActivityType;
  checklistId: Checklist['id'];
  orderTree: Activity['orderTree'];
  stageId: Stage['id'];
  taskId: Task['id'];
};

export type DeleteActivityArgs = {
  activityId: Activity['id'];
  taskId: Task['id'];
  stageId: Stage['id'];
};
