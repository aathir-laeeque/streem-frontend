import { AutomationAction, AutomationActionActionTypeVisual, AutomationActionTriggerTypeVisual, Stage, Task, TaskExecutionState } from '../checklist.types';
import { TasksById, TasksOrderInStage } from './types';

type ReEvaluateTaskWithStopType = {
  tasksById: TasksById;
  tasksOrderInStage: TasksOrderInStage;
};

export const reEvaluateTaskWithStop = ({
  tasksById,
  tasksOrderInStage,
}: ReEvaluateTaskWithStopType) => {
  const stageIds = Object.keys(tasksOrderInStage);
  console.log('came TO reevaluation');

  let stageIdWithTaskStop: Stage['id'] | undefined = undefined,
    taskIdWithStop: Task['id'] | undefined = undefined;

  stageIds.map((stageId) => {
    const taskIdsInStage = tasksOrderInStage[stageId];

    taskIdsInStage.map((taskId) => {
      const task = tasksById[taskId];

      if (
        !taskIdWithStop &&
        (task.taskExecution.state === TaskExecutionState.NOT_STARTED ||
          task.taskExecution.state === TaskExecutionState.IN_PROGRESS) &&
        task.hasStop
      ) {
        console.log('came here to set value in  reevaluation');

        taskIdWithStop = taskId;
        stageIdWithTaskStop = stageId;
      }
    });
  });

  return { stageIdWithTaskStop, taskIdWithStop };
};

export const getAutomationActionTexts = (
  automation: AutomationAction,
  forNotify?: 'success' | 'error',
) => {
  if (forNotify === 'success') {
    return `Triggered "${AutomationActionActionTypeVisual[automation.actionType]} ${
      automation.actionDetails.propertyDisplayName || ''
    } of the selected ${automation.actionDetails.objectTypeDisplayName}"`;
  } else if (forNotify === 'error') {
    return `Not able to trigger "${AutomationActionActionTypeVisual[automation.actionType]} ${
      automation.actionDetails.propertyDisplayName || ''
    } of the selected ${automation.actionDetails.objectTypeDisplayName}"`;
  }

  return `${AutomationActionActionTypeVisual[automation.actionType]} ${
    automation.actionDetails.propertyDisplayName || ''
  } of the selected ${automation.actionDetails.objectTypeDisplayName} when the ${
    AutomationActionTriggerTypeVisual[automation.triggerType]
  }.`;
};
