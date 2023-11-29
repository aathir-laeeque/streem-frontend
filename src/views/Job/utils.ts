import { ParameterVerificationTypeEnum } from '#PrototypeComposer/checklist.types';
import { useTypedSelector } from '#store';
import {
  COMPLETED_TASK_STATES,
  JobStore,
  ParameterVerificationStatus,
  StoreParameter,
  StoreStage,
  StoreTask,
  IN_PROGRESS_TASK_STATES,
  StoreTaskExecution,
} from '#types';
import { Job, Verification } from '#views/Jobs/ListView/types';
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
  const taskExecutions: JobStore['taskExecutions'] = new Map();
  const parameters: JobStore['parameters'] = new Map();
  const parameterResponseById: JobStore['parameterResponseById'] = new Map();
  const pendingTasks: JobStore['pendingTasks'] = new Set();
  const taskNavState = {
    ...currentState.taskNavState,
  };
  let showVerificationBanner = false;

  const { checklist, parameterValues } = data;

  const cjfValues = [...parameterValues]
    .sort((a, b) => a.orderTree - b.orderTree)
    .map((p) => {
      parameters.set(p.id, p as StoreParameter);
      return p.id;
    });

  let prevVisibleTaskExecutionId: string = '';
  checklist?.stages?.forEach((stage, stageIndex) => {
    const _stage: StoreStage = {
      ...stage,
      visibleTasksCount: 0,
      tasks: [],
    };

    stage?.tasks?.forEach((task, taskIndex) => {
      const _task: StoreTask = {
        ...task,
        errors: [],
        canSkipTask: true,
        parameters: [],
        taskExecutions: [],
        visibleTaskExecutionsCount: 0,
        stageId: stage.id,
        parametersErrors: new Map(),
      };

      if (stageId && stageId === stage.id) {
        _task.parametersErrors = currentState.tasks.get(task.id)?.parametersErrors;
      }

      task?.parameters?.forEach((__parameter) => {
        let parameter = __parameter;
        if (stageId && stageId !== stage.id) {
          parameter = currentState.parameters.get(__parameter.id)!;
        }
        const _parameter: StoreParameter = {
          ...parameter,
          taskId: task.id,
          stageId: stage.id,
          responses: [],
        };

        parameter?.response?.forEach((__response: any) => {
          let response = __response;
          if (stageId && stageId !== stage.id) {
            response = currentState.parameterResponseById.get(__response.id)!;
          }
          const _response = {
            ...response,
            parameterId: parameter.id,
          };
          _parameter.responses.push(response.id);

          let taskExecution = taskExecutions.get(response.taskExecutionId) || {
            taskId: task.id,
            stageId: stage.id,
            isUserAssignedToTask: false,
            visibleParametersCount: 0,
            parameterResponses: [],
          };

          if (!response.hidden) {
            if (taskExecution) {
              taskExecution.visibleParametersCount++;
              _task.visibleTaskExecutionsCount++;
            }
          }

          taskExecutions.set(response.taskExecutionId, {
            ...taskExecution,
            parameterResponses: [...(taskExecution?.parameterResponses || []), response.id],
          } as StoreTaskExecution);

          if (
            !showVerificationBanner &&
            parameter.verificationType !== ParameterVerificationTypeEnum.NONE
          ) {
            const dependantVerification = (response?.parameterVerifications || []).some(
              (verification: Verification) =>
                verification?.requestedTo?.id === userId &&
                verification?.verificationStatus === ParameterVerificationStatus.PENDING,
            );
            if (dependantVerification) {
              showVerificationBanner = true;
            }
          }

          parameterResponseById.set(response.id, _response);
        });

        if (_task.canSkipTask) {
          _task.canSkipTask = !parameter.mandatory;
        }

        _task.parameters.push(parameter.id);
        parameters.set(parameter.id, _parameter);
      });

      task?.taskExecutions?.forEach((__taskExecution) => {
        let taskExecution = __taskExecution;
        if (stageId && stageId !== stage.id) {
          taskExecution = currentState.taskExecutions.get(__taskExecution.id)!;
        }

        const _taskExecution = {
          ...taskExecutions.get(taskExecution.id),
          ...taskExecution,
          // scheduleTaskSummary is getting set in scheduleTaskSummary in taskNavCard, we need to retain it.
          scheduleTaskSummary: currentState.taskExecutions.get(taskExecution.id)
            ?.scheduleTaskSummary,
        } as StoreTaskExecution;

        _taskExecution.isUserAssignedToTask = taskExecution.assignees.some(
          (user) => user.id === userId,
        );

        _task.taskExecutions.push(taskExecution.id);
        taskExecutions.set(taskExecution.id, _taskExecution);

        _taskExecution.previous = prevVisibleTaskExecutionId;

        if (_taskExecution.visibleParametersCount) {
          if (!(_taskExecution.state in COMPLETED_TASK_STATES)) {
            pendingTasks.add(_taskExecution.id);
          }

          if (!stageIndex && stage.tasks.length === 1) {
            if (!taskIndex && task.taskExecutions.length === 1) {
              prevVisibleTaskExecutionId = _taskExecution.id;
            }
          }

          if (prevVisibleTaskExecutionId) {
            const prevTaskExecution = taskExecutions.get(prevVisibleTaskExecutionId);
            if (prevTaskExecution && prevTaskExecution.id !== _taskExecution.id) {
              taskExecutions.set(prevVisibleTaskExecutionId, {
                ...prevTaskExecution,
                next: _taskExecution.id,
              });
            }

            if (!taskNavState.current) {
              taskNavState.current = prevVisibleTaskExecutionId;
            }
          }

          prevVisibleTaskExecutionId = _taskExecution.id;
        } else {
          if (!taskNavState.current) {
            taskNavState.current = prevVisibleTaskExecutionId;
          }
        }
      });

      if (_task.visibleTaskExecutionsCount) {
        _stage.visibleTasksCount++;
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
    taskExecutions,
    parameters,
    parameterResponseById,
    taskNavState,
    pendingTasks,
    showVerificationBanner,
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
  const activeTaskExecutionId = useTypedSelector((state) => state.job.taskNavState.current);
  const taskExecution = useTypedSelector((state) =>
    state.job.taskExecutions.get(activeTaskExecutionId!),
  );

  const taskState = taskExecution?.state;
  const reason = taskExecution?.reason;

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
    isTaskCompletedWithException?: boolean;
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
        isTaskCompletedWithException: taskState === 'COMPLETED_WITH_EXCEPTION',
      });
    }
  }, [jobState, taskState]);

  return state;
};
