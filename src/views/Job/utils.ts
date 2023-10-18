import { ParameterVerificationTypeEnum } from '#PrototypeComposer/checklist.types';
import { useTypedSelector } from '#store';
import {
  COMPLETED_TASK_STATES,
  IN_PROGRESS_TASK_STATES,
  JobStore,
  ParameterVerificationStatus,
  StoreParameter,
  StoreStage,
  StoreTask,
  TASK_EXECUTION_STATES,
} from '#types';
import { Job, Verification } from '#views/Jobs/ListView/types';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { initialState } from './jobStore';

export function parseJobData(
  data: Job,
  userId: string,
  currentState = initialState,
  // for polling stageId is available.
  stageId?: string,
): Omit<JobStore, 'loading' | 'isInboxView' | 'assignments'> {
  const stages: JobStore['stages'] = new Map();
  const tasks: JobStore['tasks'] = new Map();
  const parameters: JobStore['parameters'] = new Map();
  const pendingTasks: JobStore['pendingTasks'] = new Set();
  const taskNavState = {
    ...currentState.taskNavState,
  };
  let showVerificationBanner = false;
  const taskIdsWithStop: string[] = [];
  let taskIdsWithStopActiveIndex = -1;

  const { checklist, parameterValues } = data;

  const process = cloneDeep(checklist);

  const cjfValues = [...parameterValues]
    .sort((a, b) => a.orderTree - b.orderTree)
    .map((p) => {
      parameters.set(p.id, p as StoreParameter);
      return p.id;
    });

  checklist?.stages?.forEach((stage, stageIndex) => {
    const _stage: StoreStage = {
      ...stage,
      visibleTasksCount: 0,
      tasks: [],
    };
    stage?.tasks?.forEach((task, taskIndex, _tasks) => {
      const _task: StoreTask = {
        ...task,
        errors: [],
        isUserAssignedToTask: false,
        canSkipTask: true,
        parameters: [],
        visibleParametersCount: 0,
        stageId: stage.id,
        parametersErrors: new Map(),
      };

      if (
        task.hasStop &&
        [TASK_EXECUTION_STATES.NOT_STARTED, TASK_EXECUTION_STATES.IN_PROGRESS].includes(
          task.taskExecution.state,
        )
      ) {
        taskIdsWithStop.push(task.id);
        if (taskIdsWithStopActiveIndex === -1) {
          taskIdsWithStopActiveIndex = 0;
        }
      }

      task?.parameters?.forEach((__parameter) => {
        let parameter = __parameter;
        if (stageId && stageId !== stage.id) {
          parameter = currentState.parameters.get(__parameter.id)!;
        }
        const _parameter: StoreParameter = {
          ...parameter,
          isHidden: false,
          taskId: task.id,
          stageId: stage.id,
        };

        if (parameter.response?.hidden || task.hidden) {
          _parameter.isHidden = true;
        } else {
          _task.visibleParametersCount++;

          if (
            !showVerificationBanner &&
            parameter.verificationType !== ParameterVerificationTypeEnum.NONE
          ) {
            const dependantVerification = (parameter.response?.parameterVerifications || []).some(
              (verification: Verification) =>
                verification?.requestedTo?.id === userId &&
                verification?.verificationStatus === ParameterVerificationStatus.PENDING,
            );
            if (dependantVerification) {
              showVerificationBanner = true;
            }
          }

          if (_task.canSkipTask) {
            _task.canSkipTask = !parameter.mandatory;
          }
        }

        _task.parameters.push(parameter.id);
        parameters.set(parameter.id, _parameter);
      });

      // CALCULATE PREVIOUS AND NEXT TASKS
      let prevStageIndex = stageIndex;
      let nextStageIndex = stageIndex;

      let prevTaskIndex = taskIndex - 1;
      let nextTaskIndex = taskIndex + 1;

      if (taskIndex === 0 || taskIndex === _tasks.length - 1) {
        if (_tasks.length === 1) {
          prevStageIndex = stageIndex - 1;
          nextStageIndex = stageIndex + 1;

          prevTaskIndex = process.stages![prevStageIndex]?.tasks?.length - 1;
          nextTaskIndex = 0;
        } else {
          if (taskIndex === 0) {
            prevStageIndex = stageIndex - 1;
            nextStageIndex = stageIndex;
            prevTaskIndex = process.stages![prevStageIndex]?.tasks?.length - 1;
          } else {
            prevStageIndex = stageIndex;
            nextStageIndex = stageIndex + 1;
            nextTaskIndex = 0;
          }
        }
      }

      _task.previous = process.stages?.[prevStageIndex]?.tasks?.[prevTaskIndex]?.id;
      _task.next = process.stages?.[nextStageIndex]?.tasks[nextTaskIndex]?.id;

      // SET TASK NAV STATE & TASK VISIBILITY

      if (task.hidden || !_task.visibleParametersCount) {
        // hiddenTasksLength++;
      } else {
        _stage.visibleTasksCount++;
        if (!(task.taskExecution.state in COMPLETED_TASK_STATES)) {
          pendingTasks.add(task.id);
        }

        if (!taskNavState.current) {
          taskNavState.current = _task.id;
          taskNavState.previous = _task.previous;
          taskNavState.next = _task.next;
        }

        // SET USER ASSIGNED TO TASK
        _task.isUserAssignedToTask = task.taskExecution.assignees.some(
          (user) => user.id === userId,
        );
      }

      _stage.tasks.push(_task.id);
      tasks.set(_task.id, _task);
    });

    stages.set(stage.id, _stage);
  });

  return {
    cjfValues,
    stages,
    tasks,
    parameters,
    taskNavState,
    pendingTasks,
    showVerificationBanner,
    taskIdsWithStop,
    taskIdsWithStopActiveIndex,
    state: data.state,
    totalTasks: data.totalTasks,
    expectedEndDate: data.expectedEndDate,
    expectedStartDate: data.expectedStartDate,
    completedTasks: data.completedTasks,
    code: data.code,
    processId: data.checklist.id,
    processName: data.checklist.name,
    processCode: data.checklist.code,
    id: data.id,
  };
}

export const useJobStateToFlags = () => {
  const jobState = useTypedSelector((state) => state.job.state);
  const activeTaskId = useTypedSelector((state) => state.job.taskNavState.current);
  const task = useTypedSelector((state) => state.job.tasks.get(activeTaskId!));

  const taskState = task?.taskExecution?.state;
  const reason = task?.taskExecution?.reason;

  const [state, setState] = useState<{
    isBlocked?: boolean;
    isInProgress?: boolean;
    isCompleted?: boolean;
    isCompletedWithException?: boolean;
    isAssigned?: boolean;
    isJobStarted?: boolean;
    isJobCompleted?: boolean;

    isTaskStarted?: boolean;
    isTaskDelayed?: boolean;
    isTaskCompleted?: boolean;
    isTaskPaused?: boolean;
  }>({});

  useEffect(() => {
    if (jobState && taskState) {
      setState({
        isBlocked: jobState === 'BLOCKED',
        isInProgress: jobState === 'IN_PROGRESS',
        isCompleted: jobState === 'COMPLETED',
        isCompletedWithException: jobState === 'COMPLETED_WITH_EXCEPTION',
        isAssigned: jobState !== 'UNASSIGNED',
        isJobStarted: jobState === 'IN_PROGRESS' || jobState === 'BLOCKED',
        isJobCompleted: jobState === 'COMPLETED' || jobState === 'COMPLETED_WITH_EXCEPTION',

        isTaskStarted: taskState in IN_PROGRESS_TASK_STATES || taskState in COMPLETED_TASK_STATES,
        isTaskCompleted: taskState in COMPLETED_TASK_STATES,
        isTaskDelayed: taskState === 'COMPLETED' && !!reason,
        isTaskPaused: taskState === 'PAUSED',
      });
    }
  }, [jobState, taskState]);

  return state;
};
