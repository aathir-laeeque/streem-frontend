import { Stage, Task, TaskExecutionState } from '../checklist.types';
import { TasksById, TasksOrderInStage } from './types';

type ReEvaluateTaskWithStopArgs = {
  tasksById: TasksById;
  tasksOrderInStage: TasksOrderInStage;
};

export const reEvaluateTaskWithStop = ({
  tasksById,
  tasksOrderInStage,
}: ReEvaluateTaskWithStopArgs) => {
  const stageIds = Object.keys(tasksOrderInStage);
  console.log('came TO reevaluation');

  let stageIdWithTaskStop: Stage['id'] | undefined = undefined,
    taskIdWithStop: Task['id'] | undefined = undefined;

  stageIds.map((stageId) => {
    const taskIdsInStage = tasksOrderInStage[parseInt(stageId)];

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
        stageIdWithTaskStop = parseInt(stageId);
      }
    });
  });

  return { stageIdWithTaskStop, taskIdWithStop };
};
