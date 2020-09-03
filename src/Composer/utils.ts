import { Checklist } from './checklist.types';
import {
  StagesById,
  TasksById,
  ActivitiesById,
  StagesOrder,
  TasksOrderInStage,
  ActivitiesOrderInTaskInStage,
} from './types';
import { omit } from 'lodash';

export const transformChecklist = (checklist: Checklist) => {
  const stagesOrder: StagesOrder = [];
  const tasksOrderInStage: TasksOrderInStage = {};
  const activitiesOrderInTaskInStage: ActivitiesOrderInTaskInStage = {};

  const stagesById: StagesById = {},
    tasksById: TasksById = {},
    activitiesById: ActivitiesById = {};

  checklist?.stages?.map((stage) => {
    stagesOrder.push(stage.id);
    tasksOrderInStage[stage.id] = [];
    activitiesOrderInTaskInStage[stage.id] = {};

    stagesById[stage.id] = omit(stage, 'tasks');

    stage.tasks.map((task) => {
      tasksOrderInStage[stage.id].push(task.id);
      activitiesOrderInTaskInStage[stage.id][task.id] = [];

      tasksById[task.id] = omit(task, 'activities');

      task.activities.map((activity) => {
        activitiesOrderInTaskInStage[stage.id][task.id].push(activity.id);

        activitiesById[activity.id] = activity;
      });
    });
  });

  return {
    stagesOrder,
    tasksOrderInStage,
    activitiesOrderInTaskInStage,
    stagesById,
    tasksById,
    activitiesById,
  };
};
