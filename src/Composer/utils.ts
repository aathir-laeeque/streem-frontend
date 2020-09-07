import { Error } from '#utils/globalTypes';
import { omit } from 'lodash';

import { ActivityErrors } from './ActivityList/types';
import { Checklist } from './checklist.types';
import { StageErrors } from './StageList/types';
import { TaskErrors } from './TaskList/types';
import {
  ActivitiesById,
  ActivitiesOrderInTaskInStage,
  ErrorGroups,
  StagesById,
  StagesOrder,
  TasksById,
  TasksOrderInStage,
} from './types';

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

export const groupJobErrors = (errors: Error[]) =>
  errors.reduce<ErrorGroups>(
    (acc, error) => {
      if (error.code in ActivityErrors) {
        acc.activitiesErrors.push(error);
      } else if (error.code in TaskErrors) {
        acc.tasksErrors.push(error);
      } else if (error.code in StageErrors) {
        acc.stagesErrors.push(error);
      }

      return acc;
    },
    { stagesErrors: [], tasksErrors: [], activitiesErrors: [] },
  );
