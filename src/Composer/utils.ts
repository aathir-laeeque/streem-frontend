import { Error } from '#utils/globalTypes';
import { omit } from 'lodash';

import { ActivityErrors } from './ActivityList/types';
import { Checklist, Stage } from './checklist.types';
import {
  ActivitiesById,
  ActivitiesOrderInTaskInStage,
  TasksById,
  TasksOrderInStage,
} from './composer.reducer.types';
import { ErrorGroups } from './composer.types';
import { StageErrors, StagesById, StagesOrder } from './StageList/types';
import { TaskErrors } from './TaskList/types';

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

type GetStageArgs = {
  checklist: Checklist;
  setActiveStage?: boolean;
};

export const getStages = ({
  checklist,
  setActiveStage = false,
}: GetStageArgs) => {
  const stagesById: StagesById = {},
    stagesOrder: StagesOrder = [];

  let activeStageId: Stage['id'] | undefined = undefined;

  checklist?.stages?.map((stage) => {
    stagesById[stage.id] = stage;

    stagesOrder.push(stage.id);
  });

  if (setActiveStage) {
    activeStageId = stagesOrder[0];
  }

  return {
    stagesById,
    stagesOrder,
    ...(setActiveStage ? { activeStageId } : {}),
  };
};
