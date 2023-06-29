import { ParameterVerificationTypeEnum } from '#PrototypeComposer/checklist.types';
import { Error } from '#utils/globalTypes';
import { Verification } from '#views/Jobs/ListView/types';
import {
  ParameterErrors,
  ParametersById,
  ParametersOrderInTaskInStage,
  ParameterVerificationStatus,
} from './ActivityList/types';
import { Checklist, Stage, Task, TaskExecutionState } from './checklist.types';
import { ComposerState } from './composer.reducer.types';
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
  userId: string;
};

export const getParameters = ({ checklist, userId }: GetParametersType) => {
  const parametersById: ParametersById = {},
    parametersOrderInTaskInStage: ParametersOrderInTaskInStage = {};
  const hiddenIds: Record<string, boolean> = {};
  let showVerificationBanner = false;
  checklist?.stages?.map((stage) => {
    let hiddenTasksLength = 0;
    parametersOrderInTaskInStage[stage.id] = {};

    stage?.tasks?.map((task) => {
      let hiddenParametersLength = 0;
      parametersOrderInTaskInStage[stage.id][task.id] = [];

      task?.parameters?.map((parameter) => {
        parametersOrderInTaskInStage[stage.id][task.id].push(parameter.id);
        parametersById[parameter.id] = { ...parameter, hasError: false };
        if (parameter.response?.hidden || task.hidden) {
          hiddenParametersLength++;
          hiddenIds[parameter.id] = true;
        } else if (
          !showVerificationBanner &&
          parameter.verificationType !== ParameterVerificationTypeEnum.NONE
        ) {
          const dependantVerification = (parameter.response?.parameterVerifications || []).find(
            (verification: Verification) =>
              verification?.requestedTo?.id === userId &&
              verification?.verificationStatus === ParameterVerificationStatus.PENDING,
          );
          if (dependantVerification) {
            showVerificationBanner = true;
          }
        }
      });
      if (task.hidden || task?.parameters?.length === hiddenParametersLength) {
        hiddenTasksLength++;
        hiddenIds[task.id] = true;
      }
    });
    if (stage?.tasks?.length === hiddenTasksLength) {
      hiddenIds[stage.id] = true;
    }
  });

  return { parametersById, parametersOrderInTaskInStage, hiddenIds, showVerificationBanner };
};

export const updateHiddenIds = (composerState: ComposerState) => {
  const {
    parameters,
    stages: { stagesOrder, stagesById, activeStageId },
    tasks,
  } = composerState;
  const _hiddenIds: Record<string, boolean> = {};
  let _activeStageId: string | undefined = activeStageId;
  let tasksOrderList: any[] = [];

  stagesOrder.forEach((stageId) => {
    let hiddenTasksLength = 0;
    const stage = stagesById[stageId];
    tasks.tasksOrderInStage[stageId].forEach((taskId) => {
      let hiddenParametersLength = 0;
      const task = tasks.tasksById[taskId];
      parameters.parametersOrderInTaskInStage[stageId][taskId].forEach((parameterId) => {
        const parameter = parameters.parametersById[parameterId];
        if (parameter.response?.hidden || task.hidden) {
          hiddenParametersLength++;
          _hiddenIds[parameterId] = true;
        }
      });
      if (task.hidden || task?.parameters?.length === hiddenParametersLength) {
        hiddenTasksLength++;
        _hiddenIds[task.id] = true;
      } else {
        tasksOrderList.push({
          taskId: task.id,
          stageId: stage.id,
        });
      }
    });
    if (stage?.tasks?.length === hiddenTasksLength) {
      _hiddenIds[stage.id] = true;
      if (stageId === activeStageId) {
        _activeStageId = undefined;
      }
    }
    if (!_activeStageId && !_hiddenIds?.[stageId]) {
      _activeStageId = stageId;
    }
  });

  return { _hiddenIds, _activeStageId, tasksOrderList };
};
