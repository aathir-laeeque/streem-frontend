import { Error } from '#utils/globalTypes';

import {
  ActivitiesById,
  ActivitiesOrderInTaskInStage,
  ActivityErrors,
} from './ActivityList/types';
import { Checklist, Stage, Task, TaskExecutionStatus } from './checklist.types';
import { ErrorGroups } from './composer.types';
import { StageErrors, StagesById, StagesOrder } from './StageList/types';
import {
  TaskErrors,
  TasksById,
  TasksOrderInStage,
  TaskSignOffError,
} from './TaskList/types';

export const groupJobErrors = (errors: Error[]) =>
  errors.reduce<ErrorGroups>(
    (acc, error) => {
      if (error.code in ActivityErrors) {
        acc.activitiesErrors.push(error);
      } else if (error.code in TaskErrors) {
        acc.tasksErrors.push(error);
      } else if (error.code in StageErrors) {
        acc.stagesErrors.push(error);
      } else if (error.code in TaskSignOffError) {
        acc.signOffErrors.push(error);
      }

      return acc;
    },
    {
      stagesErrors: [],
      tasksErrors: [],
      activitiesErrors: [],
      signOffErrors: [],
    },
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

type GetTasksArgs = {
  checklist: Checklist;
  setActiveTask?: boolean;
};

export const getTasks = ({
  checklist,
  setActiveTask = false,
}: GetTasksArgs) => {
  const tasksById: TasksById = {},
    tasksOrderInStage: TasksOrderInStage = {};

  let activeTaskId: Task['id'] | undefined = undefined,
    taskIdWithStop: Task['id'] | undefined = undefined,
    stageIdWithTaskStop: Stage['id'] | undefined = undefined;

  checklist?.stages?.map((stage) => {
    tasksOrderInStage[stage.id] = [];

    stage?.tasks?.map((task) => {
      tasksById[task.id] = { ...task, hasError: false };

      tasksOrderInStage[stage.id].push(task.id);

      if (
        !taskIdWithStop &&
        (task.taskExecution.status === TaskExecutionStatus.NOT_STARTED ||
          task.taskExecution.status === TaskExecutionStatus.INPROGRESS) &&
        task.hasStop
      ) {
        taskIdWithStop = task.id;
        stageIdWithTaskStop = stage.id;
      }
    });
  });

  if (setActiveTask) {
    const firstStageId = parseInt(Object.keys(tasksOrderInStage)[0]);

    activeTaskId = tasksOrderInStage[firstStageId][0];
  }

  return {
    tasksById,
    taskIdWithStop,
    tasksOrderInStage,
    stageIdWithTaskStop,
    ...(setActiveTask ? { activeTaskId } : {}),
  };
};

type GetActivitiesArgs = {
  checklist: Checklist;
};

export const getActivities = ({ checklist }: GetActivitiesArgs) => {
  const activitiesById: ActivitiesById = {},
    activitiesOrderInTaskInStage: ActivitiesOrderInTaskInStage = {};

  checklist?.stages?.map((stage) => {
    activitiesOrderInTaskInStage[stage.id] = {};

    stage?.tasks?.map((task) => {
      activitiesOrderInTaskInStage[stage.id][task.id] = [];

      task?.activities?.map((activity) => {
        activitiesOrderInTaskInStage[stage.id][task.id].push(activity.id);

        activitiesById[activity.id] = { ...activity, hasError: false };
      });
    });
  });

  return { activitiesById, activitiesOrderInTaskInStage };
};
