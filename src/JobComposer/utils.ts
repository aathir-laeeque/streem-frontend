import { Error } from '#utils/globalTypes';
import {
  ParametersById,
  ParametersOrderInTaskInStage,
  ParameterErrors,
} from './ActivityList/types';
import { Checklist, Stage, Task, TaskExecutionState } from './checklist.types';
import { ErrorGroups } from './composer.types';
import { StageErrors, StagesById, StagesOrder } from './StageList/types';
import { TaskErrors, TasksById, TaskSignOffError, TasksOrderInStage } from './TaskList/types';

export const groupJobErrors = (errors: Error[]) =>
  errors.reduce<ErrorGroups>(
    (acc, error) => {
      if (error.code in ParameterErrors) {
        acc.parametersErrors.push(error);
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
      parametersErrors: [],
      signOffErrors: [],
    },
  );

type GetStageType = {
  checklist: Checklist;
  setActiveStage?: boolean;
};

export const getStages = ({ checklist, setActiveStage = false }: GetStageType) => {
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

type GetTasksType = {
  checklist: Checklist;
  setActiveTask?: boolean;
};

export const getTasks = ({ checklist, setActiveTask = false }: GetTasksType) => {
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
        (task.taskExecution.state === TaskExecutionState.NOT_STARTED ||
          task.taskExecution.state === TaskExecutionState.IN_PROGRESS) &&
        task.hasStop
      ) {
        taskIdWithStop = task.id;
        stageIdWithTaskStop = stage.id;
      }
    });
  });

  if (setActiveTask) {
    const firstStageId = Object.keys(tasksOrderInStage)[0];

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

type GetParametersType = {
  checklist: Checklist;
};

export const getParameters = ({ checklist }: GetParametersType) => {
  const parametersById: ParametersById = {},
    parametersOrderInTaskInStage: ParametersOrderInTaskInStage = {};

  checklist?.stages?.map((stage) => {
    parametersOrderInTaskInStage[stage.id] = {};

    stage?.tasks?.map((task) => {
      parametersOrderInTaskInStage[stage.id][task.id] = [];

      task?.parameters?.map((parameter) => {
        parametersOrderInTaskInStage[stage.id][task.id].push(parameter.id);

        parametersById[parameter.id] = { ...parameter, hasError: false };
      });
    });
  });

  return { parametersById, parametersOrderInTaskInStage };
};
